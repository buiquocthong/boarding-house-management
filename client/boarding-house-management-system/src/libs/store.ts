import { EnhancedStore, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { setupListeners } from '@reduxjs/toolkit/query';
import persistedReducer from './reducer';
//
export const store: EnhancedStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
//
setupListeners(store.dispatch);
//
export const persistor = persistStore(store);
//
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
