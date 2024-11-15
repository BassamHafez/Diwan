import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./userInfo-slice";
import profileSlice from "./profileInfo-slice";

const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
    profileInfo: profileSlice.reducer,
  },
});

export default store;
