import {createSlice} from "@reduxjs/toolkit"

const initialState = {name : ""}

export const NotificationSlice = createSlice({
    // set name of slice to notification and specify initial state
    name: "notification",
    initialState,
    reducers:{
        setNotificationData: (state,action) => {
            state.name = action.payload;
            return state;
        }
    }
})

export const {setNotificationData} = NotificationSlice.actions;
//reducer handles dispatched actions and updates state
export default NotificationSlice.reducer;