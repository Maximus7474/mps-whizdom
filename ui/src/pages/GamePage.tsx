import LetterGrid from "@/components/LetterGrid"
import useKeyHook from "@/hooks/keyPress";
import { DeviceType, Gamestate, GuessAttempt, IPageProps, LetterItem, LetterState } from "@/types"
import { DEBUG_WORD, MAX_ATTEMPTS, WORD_LENGTH } from "@/utils/data";
import { fetchNui } from "@/utils/fetchNui";
import { DEV_MODE } from "@/utils/misc";
import { useEffect, useState } from "react";

interface SessionAttempt {
    attempts: GuessAttempt;
    finished: boolean;
}

const DEBUG_ATTEMPTS = [
    [
        { letter: 'A', state: LetterState.Invalid }, 
        { letter: 'B', state: LetterState.Invalid }, 
        { letter: 'C', state: LetterState.Invalid }, 
        { letter: 'D', state: LetterState.Invalid }, 
        { letter: 'E', state: LetterState.Missplaced },
    ],
    [
        { letter: 'E', state: LetterState.Missplaced }, 
        { letter: 'F', state: LetterState.Invalid },
        { letter: 'G', state: LetterState.Invalid },
        { letter: 'H', state: LetterState.Missplaced },
        { letter: 'I', state: LetterState.Invalid },
    ],
];

const GamePage = ({ device }: IPageProps) => {
    const [attempts, setAttempts] = useState<GuessAttempt>(DEV_MODE ? DEBUG_ATTEMPTS : []);
    const [guess, setGuess] = useState<string>('');
    const [gameState, setGamestate] = useState<Gamestate>(Gamestate.Loading);
    const [message, setMessage] = useState<{message: string, isError?: boolean } | null>(null);

    const submitAttempt = async () => {
        if (guess.length !== WORD_LENGTH) return;

        setGamestate(Gamestate.Loading);

        if (DEV_MODE) {
            const response: LetterItem[] = [];

            for (let i = 0; i < WORD_LENGTH; i++) {
                const correctLetter = DEBUG_WORD[i],
                    guessLetter = guess[i];

                if (correctLetter === guessLetter) {
                    response.push({ letter: guessLetter, state: LetterState.Correct });
                } else {
                    const state = DEBUG_WORD.includes(guessLetter)
                        ? LetterState.Missplaced
                        : LetterState.Invalid;

                    response.push({ letter: guessLetter, state });
                }
            }

            if (attempts.length + 1 >= MAX_ATTEMPTS) setGamestate(Gamestate.Finished);
            else setGamestate(Gamestate.Started);

            setAttempts(prev => [...prev, response]);
            setGuess('');

        } else {
            try {
                const response = await fetchNui<{correction: LetterItem[]; finished: boolean }>('game', { action: 'newGuess', data: { guess } });

                setAttempts(prev => [...prev, response.correction]);
                setGuess('');

                if (response.finished) setGamestate(Gamestate.Finished);
                else setGamestate(Gamestate.Started);
            } catch (err) {
                console.error('Unable to correct attempt:', err);
                setGamestate(Gamestate.Finished);
            }
        }
    }

    useKeyHook((key) => {
        if (gameState !== Gamestate.Started) return;

        const isLetter = /^[a-z]$/i.test(key);

        if (isLetter) {
            setGuess(prev => {
                if (prev.length >= WORD_LENGTH) return prev;
                return `${prev}${key.toLowerCase()}`;
            });
        } else if (key === 'Backspace') {
            setGuess(prev => {
                if (prev.length < 1) return prev;
                return prev.slice(0, -1);
            });
        } else if (key === 'Enter') {
            submitAttempt();
        }
    });

    useEffect(() => {
        const initSession = async () => {
            try {
                const response = await fetchNui<SessionAttempt>(
                    'game',
                    { action:'init' },
                    {
                        attempts: DEBUG_ATTEMPTS,
                        finished: DEBUG_ATTEMPTS.length >= WORD_LENGTH
                    }
                );

                if (response.finished) {
                    setMessage({ message: `You've already finished today's attempt, please come back tomorrow` });
                    setAttempts(response.attempts);
                    setGamestate(Gamestate.Finished);
                } else {
                    setAttempts(response.attempts);
                    setGamestate(Gamestate.Started);
                }
            } catch (err) {
                console.error('An error occured while fetching the sessions word', err);
                setMessage({ message: 'An error occured, please try again later.', isError: true });
                setGamestate(Gamestate.Finished);
            }
            
        }

        initSession();
    }, []);

    const currentGuessRow: LetterItem[] = Array(WORD_LENGTH).fill(null).map((_, i) => {
        const char = guess[i];
        const letter = char ? char.toUpperCase() : '';
        
        let state: LetterState = LetterState.Pending;
        if (!char) {
             state = (i === guess.length) 
                ? LetterState.Selected
                : LetterState.Pending;
        }

        return { letter, state };
    });

    const filledRows: GuessAttempt = [ ...attempts, currentGuessRow ];

    const remainingRows = MAX_ATTEMPTS - filledRows.length;

    const paddingRows: GuessAttempt = remainingRows >= 0
        ? Array(remainingRows).fill(
            Array(WORD_LENGTH).fill({ letter: '', state: LetterState.Pending })
        )
        : [];

    const finalAttempts: GuessAttempt = [...filledRows, ...paddingRows];

    return <div>
        <LetterGrid
            device={device}
            length={5}
            guesses={6}
            attempts={finalAttempts}
        />
        { message && <p style={{ color: message.isError ? 'red' : undefined, textAlign: 'center' }}>{message.message}</p>}
    </div>
};

export default GamePage;
