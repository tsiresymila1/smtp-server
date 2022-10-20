import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Email, User } from "../@types/data";

export interface EmailState {
  received: Email[];
  sent: Email[];
  draft: Email[];
  archived: Email[];
}

const initialState: EmailState = {
  received: [],
  sent: [],
  draft: [],
  archived: [],
};

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    setEmailReceived: (state, action: PayloadAction<Email[]>) => {
      state.received = action.payload;
      return state;
    },
    setEmailSent: (state, action: PayloadAction<Email[]>) => {
      state.sent = action.payload;
      return state;
    },
    setEmailDeleted: (state, action: PayloadAction<Email[]>) => {
      state.archived = action.payload;
      return state;
    },
    readEmailReceived: (
      state,
      action: PayloadAction<{ id: number; user: User }>
    ) => {
      const email = state.received.find((e) => (e.id = action.payload.id));
      if (
        email.read.map((u) => u.address).includes(action.payload.user.address)
      ) {
        email.read.push(action.payload.user);
        const newEmail = state.received.filter(
          (e) => e.id != action.payload.id
        );
        newEmail.unshift(email);
        state.received = newEmail;
      }
      return state;
    },
    addEmailReceivedItem: (state, action: PayloadAction<Email>) => {
      const email = action.payload;
      const emailExist = state.received.find((e) => e.id === email.id);
      if (!emailExist) {
        state.received.unshift(email);
      }
      return state;
    },
    addEmailSentItem: (state, action: PayloadAction<Email>) => {
      const email = action.payload;
      const emailExist = state.sent.find((e) => e.id === email.id);
      if (!emailExist) {
        state.sent.unshift(email);
      }
      return state;
    },
    removeEmailReceivedItem: (state, action: PayloadAction<number>) => {
      state.received = state.received.filter((e) => e.id != action.payload);
      state.sent = state.received.filter((e) => e.id != action.payload);
      let found = state.received.find((e) => e.id == action.payload);
      if (!found) {
        found = state.received.find((e) => e.id == action.payload);
      }
      state.archived.push(found);
      return state;
    },
    setEmailSSent: (state, action: PayloadAction<Email[]>) => {
      state.sent = action.payload;
      return state;
    },
  },
});
export const {
  addEmailReceivedItem,
  removeEmailReceivedItem,
  setEmailReceived,
  setEmailSSent,
  readEmailReceived,
  setEmailDeleted,
  setEmailSent,
  addEmailSentItem,
} = emailSlice.actions;
export default emailSlice.reducer;
