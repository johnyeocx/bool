import { Event, User } from "../../types/types";

const initialState: Event = {
  date: "",
  description: "",
  eventDP: "",
  id: "",
  name: "",
  photos: [],
  members: [],
};

export default function currentEventReducer(
  state = initialState,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case "SET_CURRENT_EVENT": {
      if (action.payload) return action.payload;
      else return undefined;
    }
    case "ADD_MEMBERS": {
      return { ...state, members: state.members.concat(action.payload) };
    }
    case "CHANGE_DISPLAY": {
      return { ...state, eventDP: action.payload };
    }
    case "CHANGE_DETAILS": {
      return {
        ...state,
        name: action.payload.name,
        description: action.payload.description,
      };
    }
    default:
      return state;
  }
}
