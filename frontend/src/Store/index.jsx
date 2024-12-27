import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./userInfo-slice";
import profileSlice from "./profileInfo-slice";
import accountSlice from "./accountInfo-slice";
import configsSlice from "./configs-slice";

const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
    profileInfo: profileSlice.reducer,
    accountInfo: accountSlice.reducer,
    configs: configsSlice.reducer,
  },
});

export default store;
