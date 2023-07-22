import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../types/userType";

interface IInitialState {
  user: IUser;
}

const initialState: IInitialState = {
  user: {
    avatar: "",
    email: "",
    gang: "",
    id: "",
    lastLoginAt: "",
    login: "",
    name: "",
    nickname: "",
    pdaId: 0,
    registration: "",
    role: "",
    xp: 0,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
