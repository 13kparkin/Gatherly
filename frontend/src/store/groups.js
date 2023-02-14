import { csrfFetch } from "./csrf";

const SET_ALL_GROUPS = "groups/setAllGroups";
const SET_SINGLE_GROUP = "groups/setSingleGroup";
const REMOVE_GROUP = "groups/removeGroup";

const setAllGroups = (group) => {
  return {
    type: SET_ALL_GROUPS,
    payload: group,
  };
};
const setSingleGroup = (group) => {
  return {
    type: SET_SINGLE_GROUP,
    payload: group,
  };
};
const removeGroup = () => {
  return {
    type: REMOVE_GROUP,
  };
};

export const getGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");
  const data = await response.json();
  dispatch(setAllGroups(data));
  return data;
};

export const getGroupsDetails = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setSingleGroup(data));
    return data;
  }
};

export const createGroup = (group, currentUser) => async (dispatch) => {
  const { name, about, type, isPrivate, city, state, imageUrl } = group;
  const groupResponse = await csrfFetch("/api/groups", {
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

  const data = await groupResponse.json();

  const imageResponse = await csrfFetch(`/api/groups/${data.id}/images`, {
    method: "POST",
    body: JSON.stringify({
      url: imageUrl,
      preview: true,
    }),
  });
  const images = await imageResponse.json();
  data.GroupImages = [images];
  data.Orgainzer = currentUser;

  dispatch(setSingleGroup(data));
  return data;
};

export const updateGroup = (group) => async (dispatch) => {
  const { id, name, about, type, isPrivate, city, state } = group;
  console.log('group', group)
  const groupResponse = await csrfFetch(`/api/groups/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      id,
      name,
      about,
      type,
      isPrivate,
      city,
      state,
    }),
  });

  const data = await groupResponse.json();
  console.log(data)
  dispatch(setSingleGroup(data));
  return data;
};


export const deleteGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE"
  })
  
  dispatch(removeGroup());
  return response;
}

const initialState = {
  allGroups: {},
  singleGroup: {},
};

const groupsReducer = (state = initialState, action) => {

  switch (action.type) {
    case SET_ALL_GROUPS:
      return { ...state, allGroups: action.payload };
    case SET_SINGLE_GROUP:
      return { ...state, singleGroup: action.payload };
    case REMOVE_GROUP:
      return { ...state, singleGroup: {} };

    default:
      return state;
  }
};

export default groupsReducer;
