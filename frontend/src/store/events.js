import { csrfFetch } from "./csrf";

//Action Type Creators//
export const LOAD_EVENTS = "events/loadEvents";
export const SINGLE_EVENT = "events/singleEvent";
export const LOAD_USER_EVENTS = "events/loadUserEvents";
export const CREATE_EVENT = "events/createEvent";
export const CREATE_EVENT_IMAGE = "events/createEventImage";
export const EDIT_EVENT = "events/editEvent";
export const DELETE_EVENT = "events/deleteEvent";

//Action Creators//
export const loadEvents = (events) => ({
  type: LOAD_EVENTS,
  events,
});
export const singleEvent = (event) => ({
  type: SINGLE_EVENT,
  event,
});
export const loadUserEvents = (events) => ({
  type: LOAD_USER_EVENTS,
  events,
});
export const createEvent = (event) => ({
  type: CREATE_EVENT,
  event,
});
export const createEventImage = (eventImage) => ({
  type: CREATE_EVENT_IMAGE,
  eventImage,
});
export const editEvent = (event) => ({
  type: EDIT_EVENT,
  event,
});
export const deleteEvent = (eventId) => ({
  type: DELETE_EVENT,
  eventId,
});

//Thunk Action Creators//
export const fetchEvents = () => async (dispatch) => {
  const response = await csrfFetch("/api/events");
  const events = await response.json();
  if (response.status !== 200) return console.log(response);
  // console.log(response);
  // console.log(events);
  dispatch(loadEvents(events));
};

export const fetchEvent = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`);
  const event = await response.json();
  if (response.status !== 200) return console.log(response);
  // console.log(response);
  // console.log(event);
  dispatch(singleEvent(event));
};

export const fetchUserEvents = () => async (dispatch) => {
  const response = await csrfFetch("/api/events/current");
  const events = await response.json();
  if (response.status !== 200) return console.log(response);
  // console.log(response);
  // console.log(events);
  dispatch(loadUserEvents(events));
};

export const makeEvent = (payload) => async (dispatch) => {
  console.log("PAYLOAD =================", payload);
  const response = await csrfFetch(`/api/groups/${payload.groupId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const event = await response.json();
  if (response.status !== 200) {
    console.log(event);
    return event;
  }
  console.log(response);
  console.log(event);
  dispatch(createEvent(event));
  return event;
};

export const makeEventImage = (payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${payload.eventId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const eventImage = await response.json();
  if (response.status !== 200) return console.log(response);
  console.log(response);
  console.log(eventImage);
  dispatch(createEventImage(eventImage));
};

export const updateEvent = (payload) => async (dispatch) => {
  console.log(payload);
  const response = await csrfFetch(`/api/events/${payload.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const updatedEvent = await response.json();
  if (response.status !== 200) {
    console.log(updatedEvent);
    return updatedEvent;
  }
  console.log(response);
  console.log("UPDATED ==================", updatedEvent);
  dispatch(editEvent(updatedEvent));
  return updatedEvent
};

export const removeEvent = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });
  const deletedEvent = await response.json();
  if (response.status !== 200) return console.log(response);
  console.log(response);
  console.log(deletedEvent);
  dispatch(deleteEvent(eventId));
};

//Selectors

//Reducer

const eventsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_EVENTS: {
      const eventsState = {};
      action.events.Events.forEach((event) => {
        eventsState[event.id] = event;
      });
      return eventsState;
    }
    case LOAD_USER_EVENTS: {
      const userEventsState = {};
      action.events.forEach((event) => {
        userEventsState[event.id] = event;
      });
      return userEventsState;
    }
    case SINGLE_EVENT:
      return { ...state, [action.event.id]: action.event };
    case CREATE_EVENT:
      return { ...state, [action.event.id]: action.event };
    case CREATE_EVENT_IMAGE:
      return { ...state, [action.eventImage.id]: action.eventImage };
    case EDIT_EVENT:
      return { ...state, [action.event.id]: action.event };
    case DELETE_EVENT: {
      const eventsState = { ...state };
      delete eventsState[action.eventId];
      return eventsState;
    }
    default:
      return state;
  }
};

export { eventsReducer };
