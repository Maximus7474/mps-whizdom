import { DeviceType, GuessAttempt, LetterItem } from '@/types';
import './LetterGrid.css';

interface ILetterGrid {
    length: number;
    guesses: number;
    attempts: GuessAttempt;
    device: DeviceType;
}

const LetterGrid = ({
    length, guesses, attempts, device
}: ILetterGrid) => {
    console.log(Array(guesses).fill(null));

    return <div className={`letter-grid ${device}`}>
        {Array(guesses).fill(null).map((_, i) => {
            const currentAttempt = attempts[i] ?? [];
            
            console.log('Showing attempt', i + 1, 'attempt info:', currentAttempt);

            return <div key={i} className={`letter-row ${device}`}>
                {currentAttempt.map((item, letterIndex) => (
                    <p key={letterIndex} className={`tile state-${item.state} ${device}`}>
                        {item.letter}
                    </p>
                ))}
                
                {Array(length - currentAttempt.length).fill(null).map((_, emptyIndex) => (
                    <p key={`empty-${emptyIndex}`} className={`tile state-0 ${device}`}></p>
                ))}
            </div>
        })}
    </div>;
}

export default LetterGrid;
