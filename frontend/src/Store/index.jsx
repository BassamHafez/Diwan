import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./userInfo-slice";
import profileSlice from "./profileInfo-slice";
import accountSlice from "./accountInfo-slice";

const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
    profileInfo: profileSlice.reducer,
    accountInfo: accountSlice.reducer,
  },
});

export default store;
