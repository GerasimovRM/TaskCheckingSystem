import {AuthActionCreators} from "./auth/action-creators";
import {SolutionActionCreators} from "./solution/action-creators";
import {SelectedUserActionCreators} from "./selectedUser/action-creators";

export const allActionCreators = {
    ...AuthActionCreators,
    ...SolutionActionCreators,
    ...SelectedUserActionCreators
}