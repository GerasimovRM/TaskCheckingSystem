import {SolutionActionEnum, SetSolutionAction, SetErrorAction, SetIsLoadingAction, ClearSolutionAction} from "./types";
import {ISolution} from "../../../models/ISolution";
import {AppDispatch} from "../../index";
import SolutionService from "../../../services/SolutionService";

export const SolutionActionCreators = {
    clearSolution: (): ClearSolutionAction => ({type: SolutionActionEnum.CLEAR_SOLUTION}),
    setSolution: (solution: ISolution): SetSolutionAction => ({type: SolutionActionEnum.SET_SOLUTION, payload: solution}),
    setIsLoading: (payload: boolean): SetIsLoadingAction => ({type: SolutionActionEnum.SET_IS_LOADING, payload}),
    setError: (payload: string): SetErrorAction => ({type: SolutionActionEnum.SET_ERROR, payload}),
    fetchBestSolution: (groupId: number | string,
                        courseId: number | string,
                        taskId: number | string,
                        user_id?: number | string) => async (dispatch: AppDispatch) => {
        dispatch(SolutionActionCreators.setIsLoading(true))
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
