import {AuthActionCreators} from "./auth/action-creators";
import {SolutionActionCreators} from "./solution/action-creators";
import {SelectedUserActionCreators} from "./selectedUser/action-creators";
import {ChatMessagesActionCreators} from "./chatMesaages/action-creators";
import {UsersDataActionCreators} from "./usersData/action-creators";

export const allActionCreators = {
    ...AuthActionCreators,
    ...SolutionActionCreators,
    ...SelectedUserActionCreators,
    ...ChatMessagesActionCreators,
    ...UsersDataActionCreators
}