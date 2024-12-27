import { createSlice } from "@reduxjs/toolkit";

const configsSlice = createSlice({
  name: "configs",
  initialState: {
    mainColor: "#b62026",
    subColor: "#2D3A58",
    instagramLink: "5",
    twitterLink: "5",
    whatsappNumber:"0",
    email:"",
    messageCodeReminder:"",
    whatsappMessage:""
  },
  reducers: {
    setMainColor(state, action) {
      state.mainColor = action.payload;
    },
    setSubColor(state, action) {
      state.subColor = action.payload;
    },
    setInstagramLink(state, action) {
      state.instagramLink = action.payload;
    },
    setTwitterLink(state, action) {
      state.twitterLink = action.payload;
    },
    setWhatsappNumber(state, action) {
      state.whatsappNumber = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
  },
});

export default configsSlice;
export const configActions = configsSlice.actions;
