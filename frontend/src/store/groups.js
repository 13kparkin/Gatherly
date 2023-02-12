import { csrfFetch } from './csrf';


const SET_GROUPS = "groups/setGroups";


const setGroups = (group) => {
  return {
    type: SET_GROUPS,
    payload: group,
  };
};

export const getGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");
  const data = await response.json();
  dispatch(setGroups(data));
  return response;
};




const initialState = {Groups: null};



const groupsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_GROUPS:
      newState = Object.assign({}, state);
      newState = action.payload;
      console.log(newState);
      return newState;
    default:
      return state;
  }
};

export default groupsReducer;
