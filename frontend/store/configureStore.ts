import { applyMiddleware, combineReducers, createStore } from 'redux';
import darkReducer from '../reducers/dark.reducers';
import modalReducer from '../reducers/modal.reducers';
import loadingReducer from '../reducers/loading.reducers';
import currentUserReducer from '../reducers/currentUser.reducers';
import chainIdReducer from '../reducers/chainId.reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

export type RootState = {
  darkMode: boolean;
  modal: {
    isOpen: boolean;
    id: string;
  };
  loading: false;
  chainId: string;
  currentUser: string;
};

/**
 * This function saves the app state to localStorage
 * @param state
 */
const saveState = (state: any) => {
  try {
    const serealised = JSON.stringify(state);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_state', serealised);
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * This function loads the old app state from localStorage
 * @returns
 */
const loadState = () => {
  try {
    if (typeof window !== 'undefined') {
      const serialised = localStorage.getItem('app_state');
      if (!serialised) {
        return undefined;
      }
      return JSON.parse(serialised);
    }
  } catch (error) {
    return undefined;
  }
};

const configureStore = () => {
  const oldState = loadState();

  const store = createStore(
    combineReducers({
      darkMode: darkReducer,
      modal: modalReducer,
      loading: loadingReducer,
      currentUser: currentUserReducer,
      chainId: chainIdReducer,
    }),
    oldState,
    process.env.NODE_ENV !== 'production'
      ? composeWithDevTools(applyMiddleware())
      : applyMiddleware(),
  );

  // listner to store the state
  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};

export default configureStore;
