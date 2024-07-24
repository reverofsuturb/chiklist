import { csrfFetch } from "./csrf";

export const LOAD_MEMBERS = "memberships/loadMembers";
export const JOIN_GROUP = "memberships/joinGroup";

export const loadMembers = (members) => ({
  type: LOAD_MEMBERS,
  members,
});
export const joinGroup = (member) => ({
  type: JOIN_GROUP,
  member,
});

export const fetchMembers = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/members`);
  const members = await response.json();
  if (response.status !== 200) return console.log(response);
  dispatch(loadMembers(members));
};

export const requestMembership = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
    method: "POST",
  });
  const member = await response.json();
  if (response.status !== 200) return console.log(member);
  const newMember = await dispatch(joinGroup(member));
  console.log(newMember);
  return newMember;
};

export const membershipsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_MEMBERS: {
      const membersState = {};
      action.members.Members.forEach((member) => {
        membersState[member.id] = member;
      });
      return membersState;
    }
    case JOIN_GROUP: {
      return { ...state, [action.member.id]: action.member };
    }
    default:
      return state;
  }
};
