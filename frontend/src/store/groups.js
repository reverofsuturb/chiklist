import { csrfFetch } from "./csrf";

//Action Type Creators//
export const LOAD_GROUPS = "groups/loadGroups";
export const SINGLE_GROUP = "groups/singleGroup";
export const LOAD_USER_GROUPS = "groups/loadUserGroups";
export const LOAD_GROUP_EVENTS = "groups/loadGroupEvents";
export const CREATE_GROUP = "groups/createGroup";
export const CREATE_GROUP_IMAGE = "groups/createGroupImage";
export const EDIT_GROUP = "groups/editGroup";
export const DELETE_GROUP = "groups/deleteGroup";

//Action Creators//
export const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});
export const singleGroup = (group) => ({
  type: SINGLE_GROUP,
  group,
});
export const loadUserGroups = (groups) => ({
  type: LOAD_USER_GROUPS,
  groups,
});
export const loadGroupEvents = (groupEvents) => ({
  type: LOAD_GROUP_EVENTS,
  groupEvents,
});
export const createGroup = (group) => ({
  type: CREATE_GROUP,
  group,
});
export const createGroupImage = (groupImage) => ({
  type: CREATE_GROUP_IMAGE,
  groupImage,
});
export const editGroup = (group) => ({
  type: EDIT_GROUP,
  group,
});
export const deleteGroup = (groupId) => ({
  type: DELETE_GROUP,
  groupId,
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

export const fetchUserGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups/current");
  const groups = await response.json();
  if (response.status !== 200) return console.log(response);
  console.log(response);
  console.log(groups);
  dispatch(loadGroups(groups));
};

export const fetchGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`);
  const group = await response.json();
  if (response.status !== 200) return console.log(response);
  console.log(response);
  console.log(group);
  dispatch(singleGroup(group));
};

export const fetchGroupEvents = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`);
  const groupEvents = await response.json();
  if (response.status !== 200) return console.log(response);
  console.log(response);
  console.log(groupEvents);
  dispatch(loadGroupEvents(groupEvents));
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
  dispatch(createGroup(group));
  return group;
};

export const makeGroupImage = (payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${payload.groupId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const groupImage = await response.json();
  if (response.status !== 200) return console.log(response);
  console.log(response);
  console.log(groupImage);
  dispatch(createGroupImage(groupImage));
};

export const putGroup = (payload) => async (dispatch) => {
  console.log("PAYLOAD =================", payload);
  const response = await csrfFetch(`/api/groups/${payload.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const group = await response.json();
  if (response.status !== 200) return console.log(response);
  console.log(response);
  console.log(group);
  dispatch(editGroup(group));
  return group;
};

export const removeGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });
  const deletedGroup = await response.json();
  if (response.status !== 200) return console.log(response);
  console.log(response);
  console.log(deletedGroup);
  dispatch(deleteGroup(groupId));
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
    case SINGLE_GROUP:
      return { ...state, [action.group.id]: action.group };
    case LOAD_USER_GROUPS: {
      const userGroupsState = {};
      action.groups.Groups.forEach((group) => {
        userGroupsState[group.id] = group;
      });
      return userGroupsState;
    }
    case LOAD_GROUP_EVENTS: {
      const groupEventsState = {};
      action.groupEvents.Events.forEach((event) => {
        groupEventsState[event.id] = event;
      });
      return groupEventsState;
    }
    case CREATE_GROUP:
      return { ...state, [action.group.id]: action.group };
    case CREATE_GROUP_IMAGE:
      return { ...state, [action.groupImage.id]: action.groupImage };
    case EDIT_GROUP:
      return { ...state, [action.group.id]: action.group };
    case DELETE_GROUP: {
      const groupsState = { ...state };
      delete groupsState[action.groupId];
      return groupsState;
    }
    default:
      return state;
  }
};

export { groupsReducer };
