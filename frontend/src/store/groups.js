import { csrfFetch } from "./csrf";

const SET_ALL_GROUPS = "groups/setAllGroups";
const SET_SINGLE_GROUP = "groups/setSingleGroup";

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


export const getGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");
  const data = await response.json();
  dispatch(setAllGroups(data));
  return response;
};

export const getGroupsDetails = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(setSingleGroup(data));
    return response;
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
      "url": imageUrl,
      "preview": true
    }),
  });
  const images = await imageResponse.json()
  console.log("images in thunk", images)
  data.GroupImages = [
    images
  ]
  data.Orgainzer = currentUser



  dispatch(setSingleGroup(data));
  return data;
};

const initialState = {
  allGroups: {},
  singleGroup: {},
};

const groupsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_ALL_GROUPS:
      return  { ...state, allGroups: action.payload }
    case SET_SINGLE_GROUP:
      return { ...state, singleGroup: action.payload };
    default:
      return state;
  }
};

export default groupsReducer;
