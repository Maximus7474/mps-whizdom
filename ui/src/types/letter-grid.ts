export enum LetterState {
    Pending,
    Invalid,
    Missplaced,
    Correct,
    Selected,
}

export enum Gamestate {
    Loading,
    Started,
    Finished,
}

export interface LetterItem {
    letter: string;
    state: LetterState;
};

export type GuessAttempt = LetterItem[][];
