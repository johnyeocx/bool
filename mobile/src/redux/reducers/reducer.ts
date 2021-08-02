// import { ActionSheetIOS } from "react-native";
import { combineReducers } from "redux";
import currentEventReducer from "./currentEventSlice";
import eventsReducer from "./eventsSlice";

export function appReducer(
  state = { events: [], currentEvent: undefined },
  action: any
): any {
  return {
    events: eventsReducer(state.events, action),
    currentEvent: currentEventReducer(state.currentEvent, action),
  };
}

const rootReducer = combineReducers({
  events: eventsReducer,
  currentEvent: currentEventReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
