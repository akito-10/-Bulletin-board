import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export const talkSlice = createSlice({
  name: "talk",
  initialState: {
    talk: { tid: "" },
  },
  reducers: {
    setTalk: (state, action) => {
      state.talk = action.payload;
    },
    clearTalk: (state) => {
      state.talk = { tid: "" };
    },
  },
});

export const { setTalk, clearTalk } = talkSlice.actions;

export const selectTalk = (state: RootState) => state.talk.talk;

export default talkSlice.reducer;
