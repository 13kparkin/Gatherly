import { csrfFetch } from "./csrf";

const SET_GROUPS = "groups/setGroups";
const SET_GROUPS_DETAIL = "groups/setGroupsDetails";

const setGroups = (group) => {
  return {
    type: SET_GROUPS,
    payload: group,
  };
};
const setGroupsDetails = (group) => {
  return {
    type: SET_GROUPS_DETAIL,
    payload: group,
  };
};

export const getGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");
  const data = await response.json();
  dispatch(setGroups(data));
  return response;
};

export const getGroupsDetails = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setGroupsDetails(data));
    return response;
  }
};

const initialState = {
  Groups: {},
  GroupDetail: {},
};

const groupsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_GROUPS:
      newState = Object.assign({}, state);
      newState = action.payload;
      return newState;
    case SET_GROUPS_DETAIL:
      return { ...state, GroupDetail: action.payload };
    default:
      return state;
  }
};

export default groupsReducer;
