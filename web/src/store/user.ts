import { createSlice } from '@reduxjs/toolkit';

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
    setUser: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
