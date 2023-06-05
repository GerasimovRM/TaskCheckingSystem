import AuthStore from "./auth/AuthStore"
import SelectedUserStore from "./selectedUser/SelectedUserStore"
import SolutionStore from "./solution/SolutionStore"
import UsersDataStore from "./usersData"

export class RootStore {
    authStore: AuthStore;
    selectedUserStore: SelectedUserStore;
    solutionStore: SolutionStore;
    usersDataStore: UsersDataStore;
  
    constructor() {
        this.authStore = new AuthStore();
        this.selectedUserStore = new SelectedUserStore();
        this.solutionStore = new SolutionStore();
        this.usersDataStore = new UsersDataStore();
    }
  }