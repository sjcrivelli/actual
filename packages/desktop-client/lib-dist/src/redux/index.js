/* eslint-disable no-restricted-imports */
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector, useStore as useReduxStore, } from 'react-redux';
import { createAsyncThunk } from '@reduxjs/toolkit';
export const createAppAsyncThunk = createAsyncThunk.withTypes();
export const useStore = useReduxStore.withTypes();
export const useDispatch = useReduxDispatch.withTypes();
export const useSelector = useReduxSelector.withTypes();
