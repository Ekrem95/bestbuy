import { createStore, combineReducers } from 'redux';
import { AUTH, UNAUTH } from './actions';

const auth = (state={}, action) => {
  switch (action.type) {
    case AUTH:
      state = { ...state, auth: AUTH };
      break;
    case UNAUTH:
      state = { ...state, auth: UNAUTH };
  }

  return state;
};

const reducers = combineReducers({
  auth,
});

export const store = createStore(reducers);
