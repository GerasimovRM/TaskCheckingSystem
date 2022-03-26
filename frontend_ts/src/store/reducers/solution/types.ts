import {ISolution} from "../../../models/ISolution";

export interface SolutionState {
    current_solution?: ISolution | undefined;
    isLoading: boolean;
    error?: string;
}

export enum SolutionActionEnum {
    CLEAR_SOLUTION = "CLEAR_SOLUTION",
    SET_SOLUTION = "SET_SOLUTION",
    SET_SOLUTION_ERROR = "SET_SOLUTION_ERROR",
    SET_SOLUTION_IS_LOADING = "SET_SOLUTION_IS_LOADING",
}

export interface ClearSolutionAction {
    type: SolutionActionEnum.CLEAR_SOLUTION
}

export interface SetSolutionAction {
    type: SolutionActionEnum.SET_SOLUTION;
    payload: ISolution;
}
export interface SetErrorSolutionAction {
    type: SolutionActionEnum.SET_SOLUTION_ERROR;
    payload: string;
}
export interface SetIsLoadingSolutionAction {
    type: SolutionActionEnum.SET_SOLUTION_IS_LOADING;
    payload: boolean;
}

export type SolutionAction = SetSolutionAction | SetErrorSolutionAction | SetIsLoadingSolutionAction | ClearSolutionAction