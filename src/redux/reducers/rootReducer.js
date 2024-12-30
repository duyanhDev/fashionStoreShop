import { combineReducers } from "redux";
import authReducer from "./authReducer";
import searchReducer from "./SearchReducer";
const rootReducer = combineReducers({
  auth: authReducer,
  search: searchReducer,
});

export default rootReducer;
