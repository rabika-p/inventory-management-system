import {createSlice} from "@reduxjs/toolkit"

const initialState = {name : ""}

export const UsernameSlice = createSlice({
    name: "username",
    initialState,
    reducers:{
        setUsername: (state,action) => {
            state.name = action.payload;
            return state;

        }
    }
})

export const {setUsername} = UsernameSlice.actions;
export default UsernameSlice.reducer;