import { useDispatch } from "react-redux";
import { csrfFetch } from "./csrf";

//Action Type Creators//
export const LOAD_GROUPS = "groups/loadGroups";
export const CREATE_GROUP = "groups/createGroup";

//Action Creators//
export const fetchGroups = () => {
  type: LOAD_GROUPS, groups
}
export const makeGroup = (group) => {
  type: CREATE_GROUP, group;
};


//Thunk Action Creator//
export const loadGroups = () => async(dispatch) => {
  const response = await fetch("/api/groups")
  const groups = await response.json();

}
export const createGroup = (payload) => async (dispatch) => {
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
    case CREATE_GROUP:
      return { ...state, [action.group.id]: action.group };
    default:
      return state;
  }
};

export { groupsReducer };
