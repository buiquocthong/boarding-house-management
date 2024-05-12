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
import { roomApi } from './services/roomApi';
import { thunk } from 'redux-thunk';
import { tenantApi } from './services/tenantApi';
import { locationApi } from './services/locationApi';
//

export const store: EnhancedStore = configureStore({
  reducer: persistedReducer,
  // @ts-ignore
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(thunk)
      .concat(roomApi.middleware)
      .concat(tenantApi.middleware)
      .concat(locationApi.middleware),
});
//
setupListeners(store.dispatch);
//
export const persistor = persistStore(store);
//
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
