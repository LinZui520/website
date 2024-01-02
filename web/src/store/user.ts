import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  id: number;
  avatar: string;
  username: string;
  email: string;
  password: string;
  power: number;
  token: string;
}

export const userSlice = createSlice({
  name: 'user',

  initialState: {
    id: 0,
    avatar: '',
    username: '',
    email: '',
    password: '',
    power: 0,
    token: '',
  },
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
