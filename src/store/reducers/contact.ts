import { CONTACT } from "../actions/actionType";

const initialState = {
    contact: [],
}

type Contact = {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    photo: string;
};

export interface ContactState {
    ContactReducer: {
        contact: Contact[],
    };
}


function ContactReducer(state = initialState, action: any) {
    switch (action.type) {
        case CONTACT:
            return {
                ...state,
                contact: action.payload.data,
            }
        default:
            return state;
    }
}

export default ContactReducer