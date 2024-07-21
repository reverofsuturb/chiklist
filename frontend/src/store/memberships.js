import { csrfFetch } from "./csrf";

export const JOIN_GROUP = "memberships/joinGroup";

export const joinGroup = (member) => ({
  type: JOIN_GROUP,
  member,
});

export const requestMembership = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/${groupId}/membership`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.status !== 200) return console.log(response);
  dispatch(joinGroup);
};

export const membershipsReducer = (state = {}, action) => {
  switch (action.type) {
    case JOIN_GROUP: {
      return { ...state, [action.member.id]: action.member };
    }
    default:
      return state;
  }
};
