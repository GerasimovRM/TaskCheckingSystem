import { action, observable } from 'mobx';

import User from '../models/User';

class UserStore {
  @observable public user: User | null = null;
}
