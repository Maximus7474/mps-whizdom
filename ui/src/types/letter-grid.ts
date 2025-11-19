export enum LetterState {
    Pending,
    Invalid,
    Missplaced,
    Correct,
    Selected,
}

export interface LetterItem {
    letter: string;
    state: LetterState;
};
