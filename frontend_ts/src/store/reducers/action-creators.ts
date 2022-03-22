import {AuthActionCreators} from "./auth/action-creators";
import {SolutionActionCreators} from "./solution/action-creators";

export const allActionCreators = {
    ...AuthActionCreators,
    ...SolutionActionCreators
}