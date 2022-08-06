import {
    ClearSolutionAction,
    SetCodeSolutionAction,
    SetErrorSolutionAction,
    SetIsChangedAction,
    SetIsLoadingSolutionAction,
    SetScoreSolutionAction,
    SetSolutionAction,
    SolutionActionEnum
} from "./types";
import {ISolution} from "../../../models/ISolution";
import {AppDispatch} from "../../index";
import SolutionService from "../../../services/SolutionService";

export const SolutionActionCreators = {
    clearSolution: (): ClearSolutionAction => ({type: SolutionActionEnum.CLEAR_SOLUTION}),
    setSolution: (solution: ISolution | null): SetSolutionAction => ({type: SolutionActionEnum.SET_SOLUTION, payload: solution}),
    setIsLoadingSolution: (payload: boolean): SetIsLoadingSolutionAction => ({type: SolutionActionEnum.SET_SOLUTION_IS_LOADING, payload}),
    setIsChangedSolution: (payload: boolean): SetIsChangedAction => ({type: SolutionActionEnum.SET_SOLUTION_IS_CHANGED, payload}),
    setErrorSolution: (payload: string): SetErrorSolutionAction => ({type: SolutionActionEnum.SET_SOLUTION_ERROR, payload}),
    setCodeSolution: (payload: string): SetCodeSolutionAction => ({type: SolutionActionEnum.SET_SOLUTION_CODE, payload}),
    setScoreSolution: (payload: number): SetScoreSolutionAction => ({type: SolutionActionEnum.SET_SOLUTION_SCORE, payload}),
    fetchBestSolution: (groupId: number | string,
                        courseId: number | string,
                        taskId: number | string,
                        user_id?: number | string) => async (dispatch: AppDispatch) => {
        dispatch(SolutionActionCreators.setIsLoadingSolution(true))
        if (user_id) {
            const response = await SolutionService.getBestSolution(groupId, courseId, taskId, user_id)
            dispatch(SolutionActionCreators.setSolution(response))
        } else {
            const response = await SolutionService.getBestSolution(groupId, courseId, taskId)
            dispatch(SolutionActionCreators.setSolution(response))
        }
    }
}
