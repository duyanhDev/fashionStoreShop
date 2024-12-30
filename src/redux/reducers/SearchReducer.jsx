import { SEARCH } from "../actions/Auth";

const initialState = {
  data: null,
};

const searchReducer = (state = initialState, action) => {
  console.log(action.payload);

  switch (action.type) {
    case SEARCH:
      return {
        ...state,
        data: action.payload.data,
        totalpage: action.payload.totalpage,
      };
    default:
      return state;
  }
};

export default searchReducer;
