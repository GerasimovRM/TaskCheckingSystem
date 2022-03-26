import {SolutionActionEnum, SetSolutionAction, SetErrorSolutionAction, SetIsLoadingSolutionAction, ClearSolutionAction} from "./types";
import {ISolution} from "../../../models/ISolution";
import {AppDispatch} from "../../index";
import SolutionService from "../../../services/SolutionService";

export const SolutionActionCreators = {
    clearSolution: (): ClearSolutionAction => ({type: SolutionActionEnum.CLEAR_SOLUTION}),
    setSolution: (solution: ISolution): SetSolutionAction => ({type: SolutionActionEnum.SET_SOLUTION, payload: solution}),
    setIsLoadingSolution: (payload: boolean): SetIsLoadingSolutionAction => ({type: SolutionActionEnum.SET_SOLUTION_IS_LOADING, payload}),
    setErrorSolution: (payload: string): SetErrorSolutionAction => ({type: SolutionActionEnum.SET_SOLUTION_ERROR, payload}),
    fetchBestSolution: (groupId: number | string,
                        courseId: number | string,
                        taskId: number | string,
                        user_id?: number | string) => async (dispatch: AppDispatch) => {
        dispatch(SolutionActionCreators.setIsLoadingSolution(true))
        if (user_id) {
            const response = await SolutionService.getBestSolution(groupId, courseId, taskId, user_id)
            if (response) {
                dispatch(SolutionActionCreators.setSolution(response))
            }
        } else {
            const response = await SolutionService.getBestSolution(groupId, courseId, taskId)
            if (response) {
                dispatch(SolutionActionCreators.setSolution(response))
            }
        }
    }
}
