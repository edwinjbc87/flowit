import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import programReducer from './slices/programSlice';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

export const makeStore = () => configureStore({
  reducer: {
    program: programReducer,
  },
});

type Store = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<Store['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = Store['dispatch']
export const useAppDispatch = () => useDispatch<Store['dispatch']>()
export const wrapper = createWrapper(makeStore, { debug: true })