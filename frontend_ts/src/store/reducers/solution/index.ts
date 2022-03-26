import {SolutionState, SolutionAction, SolutionActionEnum} from "./types";

const initialState: SolutionState = {
    isLoading: false
}

export default function solutionReducer(state: SolutionState = initialState, action: SolutionAction): SolutionState {
    switch (action.type) {
        case SolutionActionEnum.CLEAR_SOLUTION:
            return {...initialState}
        case SolutionActionEnum.SET_SOLUTION:
            return {...state, current_solution: action.payload, isLoading: false}
        case SolutionActionEnum.SET_SOLUTION_ERROR:
            return {...state, error: action.payload, isLoading: false}
        case SolutionActionEnum.SET_SOLUTION_IS_LOADING:
            return {...state, isLoading: action.payload}
        default:
            return state;
    }
}