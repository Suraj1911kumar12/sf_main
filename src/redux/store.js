import { configureStore } from "@reduxjs/toolkit";
import UserInfoReducer from "./slices/UserInfoSlice";

const Store = configureStore({
  reducer: {
    userInfo: UserInfoReducer,
  },
});

export default Store;
