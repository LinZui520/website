import { configureStore } from '@reduxjs/toolkit';
import userReducer, { UserState } from './user';

export interface RootState {
  user: UserState;
}


const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store