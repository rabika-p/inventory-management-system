import { configureStore } from "@reduxjs/toolkit";
import UsernameSlice from "../features/UsernameSlice";
import NotificationSlice from "../features/NotificationSlice";

//craete a redux store, associate slice reducer with key in the store's state
export const store = configureStore({
    reducer: {
        username: UsernameSlice,
        notification: NotificationSlice
    }
})