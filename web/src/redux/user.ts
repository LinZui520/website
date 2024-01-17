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
    updateAvatar: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        avatar: action.payload,
      };
    },
  },
});

export const { setUser, updateAvatar } = userSlice.actions;
export default userSlice.reducer;
