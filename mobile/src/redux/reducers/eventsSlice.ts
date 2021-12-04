import { OperationVariables } from "@apollo/client/core/types";
import { FetchResult } from "@apollo/client/link/core/types";
import { MutationFunctionOptions } from "@apollo/client/react/types/types";
import { Dispatch } from "@reduxjs/toolkit";
import { Event, User } from "../../types/types";

const initialState: Array<Event> = [];

export default function eventsReducer(
  state = initialState,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case "GET_EVENTS": {
      if (action.payload) return action.payload;
      else return [];
    }
    default:
      return state;
  }
}

export function fetchEvents(
  myself: User | undefined,
  getEvents: (
    options?: MutationFunctionOptions<any, OperationVariables> | undefined
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>
) {
  return async function fetchEventsThunk(dispatch: Dispatch<any>) {
    if (myself) {
      const { data } = await getEvents({
        variables: {
          eventIds: myself.events,
        },
      });
      dispatch({ type: "GET_EVENTS", payload: data.eventsFromIds });
    }
  };
}
// const selectEvents = (state) => state.events;
// const selectEvens = createSelector(sele, (news) =>
//   news.filter(({ id }) => id % 2 === 0)
// );
// const selectFilteredNews = createSelector(
//   selectNews,
//   selectEvens,
//   selectOdds,
//   (news, even, odd) => ({ news, even, odd })
// );

// export const eventMembers = createSelector(selectEvents, (events) => {
//   events.filer(({ id }) => id == "")
// }
// );
