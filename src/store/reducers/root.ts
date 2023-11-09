import { combineReducers } from "redux";
import ContactReducer from "./contact";

const rootReducer = combineReducers({
    ContactReducer,
})

export type RootState = {
    user: any
}

export default rootReducer