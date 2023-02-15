import { csrfFetch } from "./csrf";

const SET_ALL_EVENTS = "events/setAllEvents";
const SET_SINGLE_EVENT = "events/setSingleEvent";
const REMOVE_EVENT = "events/removeEvent";

const setAllEvents = (event) => {
  return {
    type: SET_ALL_EVENTS,
    payload: event,
  };
};
const setSingleEvent = (event) => {
  return {
    type: SET_SINGLE_EVENT,
    payload: event,
  };
};
const removeEvent = () => {
  return {
    type: REMOVE_EVENT,
  };
};

export const getEvents = () => async (dispatch) => {
  const response = await csrfFetch("/api/events");
  const data = await response.json();
  dispatch(setAllEvents(data));
  return data;
};

export const getEventsDetails = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setSingleEvent(data));
    return data;
  }
};

export const createEvent = (event, currentUser) => async (dispatch) => {
  const { name, about, type, isPrivate, city, state, imageUrl } = event;
  const eventResponse = await csrfFetch("/api/events", {
    method: "POST",
    body: JSON.stringify({
      name,
      about,
      type,
      isPrivate,
      city,
      state,
    }),
  });

  const data = await eventResponse.json();

  const imageResponse = await csrfFetch(`/api/events/${data.id}/images`, {
    method: "POST",
    body: JSON.stringify({
      url: imageUrl,
      preview: true,
    }),
  });
  const images = await imageResponse.json();
  data.eventImages = [images];
  data.Orgainzer = currentUser;

  dispatch(setSingleEvent(data));
  return data;
};



export const deleteEvent = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE"
  })
  
  dispatch(removeEvent());
  return response;
}

const initialState = {
  allEvents: {},
  singleEvent: {},
};

const eventsReducer = (state = initialState, action) => {

  switch (action.type) {
    case SET_ALL_EVENTS:
      return { ...state, allEvents: action.payload };
    case SET_SINGLE_EVENT:
      return { ...state, singleEvent: action.payload };
    case REMOVE_EVENT:
      return { ...state, singleEvent: {} };

    default:
      return state;
  }
};

export default eventsReducer;
