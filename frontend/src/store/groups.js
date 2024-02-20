import { csrfFetch } from "./csrf";

//Action Type Creators//
export const LOAD_GROUPS = "groups/loadGroups";
export const SINGLE_GROUP = "groups/singleGroup";
export const LOAD_GROUP_EVENTS = "groups/loadGroupEvents";
export const CREATE_GROUP = "groups/createGroup";

//Action Creators//
export const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});
export const loadGroupEvents = (groupEvents) => ({
  type: LOAD_GROUP_EVENTS,
  groupEvents,
});
export const singleGroup = (group) => ({
  type: SINGLE_GROUP,
  group,
});
export const createGroup = (group) => ({
  type: CREATE_GROUP,
  group,
});

//Thunk Action Creator//
export const fetchGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");
  const groups = await response.json();
  if (response.status !== 200) return console.log(response);
  console.log(response);
  console.log(groups);
  dispatch(loadGroups(groups));
};

export const fetchGroupEvents = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`);
  const groupEvents = await response.json();
  if (response.status !== 200) return console.log(response);
  console.log(response);
  console.log(groupEvents);
  dispatch(loadGroupEvents(groupEvents));
};

export const fetchGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`);
  const group = await response.json();
  if (response.status !== 200) return console.log(response);
  console.log(response);
  console.log(group);
  dispatch(singleGroup(group));
};

export const makeGroup = (payload) => async (dispatch) => {
  console.log("PAYLOAD =================", payload);
  const response = await csrfFetch("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const group = await response.json();
  if (response.status !== 201) return console.log(response);
  console.log(response);
  console.log(group);
  dispatch(makeGroup(group));
  return group;
};

//Selectors

//Reducer

const groupsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_GROUPS: {
      const groupsState = {};
      action.groups.Groups.forEach((group) => {
        groupsState[group.id] = group;
      });
      return groupsState;
    }
    case LOAD_GROUP_EVENTS: {
      const groupEventsState = {};
      action.groupEvents.Events.forEach((event) => {
        groupEventsState[event.id] = event;
      });
      return groupEventsState;
    }
    case SINGLE_GROUP:
      return { ...state, [action.group.id]: action.group };
    case CREATE_GROUP:
      return { ...state, [action.group.id]: action.group };
    default:
      return state;
  }
};

export { groupsReducer };
