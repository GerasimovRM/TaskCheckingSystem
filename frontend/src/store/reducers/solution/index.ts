import {SolutionAction, SolutionActionEnum, SolutionState} from "./types";
import {ISolution} from "../../../models/ISolution";

const initialState: SolutionState = {
    isLoading: false,
    isChanged: false
}

export default function solutionReducer(state: SolutionState = initialState, action: SolutionAction): SolutionState {
    switch (action.type) {
        case SolutionActionEnum.CLEAR_SOLUTION:
            return {...initialState}
        case SolutionActionEnum.SET_SOLUTION:
            return {...state, current_solution: action.payload, isLoading: false, isChanged: false}
        case SolutionActionEnum.SET_SOLUTION_ERROR:
            return {...state, error: action.payload, isLoading: false, isChanged: false}
        case SolutionActionEnum.SET_SOLUTION_IS_LOADING:
            return {...state, isLoading: action.payload}
        case SolutionActionEnum.SET_SOLUTION_CODE:
            return {...state, current_solution: {...state.current_solution, code: action.payload} as ISolution}
        case SolutionActionEnum.SET_SOLUTION_SCORE:
            return {...state, current_solution: {...state.current_solution, score: action.payload} as ISolution}
        case SolutionActionEnum.SET_SOLUTION_IS_CHANGED:
            return {...state, isChanged: action.payload}
        default:
            return state;
    }
}