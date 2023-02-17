import { csrfFetch } from "./csrf";

const SET_ALL_EVENTS = "events/setAllEvents";
const SET_SINGLE_EVENT = "events/setSingleEvent";
const REMOVE_EVENT = "events/removeEvent";
const SET_ALL_EVENTS_BY_GROUP = "events/setAllEventsByGroup";

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

const setAllEventsByGroup = (event) => {
  return {
    type: SET_ALL_EVENTS_BY_GROUP,
    payload: event,
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

export const getEventsDetailsByGroupId = (groupId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}/events`);
    const data = await response.json();
    dispatch(setAllEventsByGroup(data));
    return data;
  }
  catch (e) {
    return ''
  }
};

export const createEvent = (event,groupId) => async (dispatch) => {
  const { venueId, name, type, capacity, price, description, startDate, endDate, imageUrl } = event;
  const eventResponse = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    body: JSON.stringify({
      venueId,
      name,
      description,
      type,
      capacity,
      price,
      startDate,
      endDate
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
  data.EventImages = [images];

  
  const groupResponse = await csrfFetch(`/api/groups/${groupId}`);
  const group = await groupResponse.json();
  data.GroupOrganizer = group.Organizer;

  dispatch(setSingleEvent(data));
  return data;
};



export const deleteEvent = (eventId) => async (dispatch) => {
  console.log(eventId)
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE"
  })
  
  
  dispatch(removeEvent());
  return response;
}

const initialState = {
  allEvents: {},
  singleEvent: {},
  allEventsByGroup: {},
};

const eventsReducer = (state = initialState, action) => {

  switch (action.type) {
    case SET_ALL_EVENTS:
      return { ...state, allEvents: action.payload };
    case SET_SINGLE_EVENT:
      return { ...state, singleEvent: action.payload };
    case REMOVE_EVENT:
      return { ...state, singleEvent: {} };
    case SET_ALL_EVENTS_BY_GROUP:
      return { ...state, allEventsByGroup: action.payload };
    default:
      return state;
  }
};

export default eventsReducer;
