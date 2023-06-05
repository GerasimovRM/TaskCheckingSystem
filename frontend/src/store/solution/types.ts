import {ISolution} from "../../models/ISolution";

export interface SolutionState {
    current_solution?: ISolution | null;
    isLoading: boolean;
    error?: string;
    isChanged: boolean
}

export enum SolutionActionEnum {
    CLEAR_SOLUTION = "CLEAR_SOLUTION",
    SET_SOLUTION = "SET_SOLUTION",
    SET_SOLUTION_ERROR = "SET_SOLUTION_ERROR",
    SET_SOLUTION_IS_LOADING = "SET_SOLUTION_IS_LOADING",
    SET_SOLUTION_CODE = "SET_SOLUTION_CODE",
    SET_SOLUTION_SCORE = "SET_SOLUTION_SCORE",
    SET_SOLUTION_IS_CHANGED = "SET_SOLUTION_IS_CHANGED"
}

export interface ClearSolutionAction {
    type: SolutionActionEnum.CLEAR_SOLUTION
}

export interface SetSolutionAction {
    type: SolutionActionEnum.SET_SOLUTION;
    payload: ISolution | null;
}
export interface SetErrorSolutionAction {
    type: SolutionActionEnum.SET_SOLUTION_ERROR;
    payload: string;
}
export interface SetIsLoadingSolutionAction {
    type: SolutionActionEnum.SET_SOLUTION_IS_LOADING;
    payload: boolean;
}

export interface SetCodeSolutionAction {
    type: SolutionActionEnum.SET_SOLUTION_CODE;
    payload: string
}

export interface SetScoreSolutionAction {
    type: SolutionActionEnum.SET_SOLUTION_SCORE;
    payload: number;
}

export interface SetIsChangedAction {
    type: SolutionActionEnum.SET_SOLUTION_IS_CHANGED;
    payload: boolean;
}

export type SolutionAction = SetSolutionAction | SetErrorSolutionAction | SetIsLoadingSolutionAction | ClearSolutionAction | SetCodeSolutionAction | SetScoreSolutionAction | SetIsChangedAction