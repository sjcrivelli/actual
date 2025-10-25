
/* eslint-disable no-restricted-imports */
import { useStore as _useStore, useDispatch as _useDispatch, useSelector as _useSelector } from "react-redux";
import { createAsyncThunk as _createAsyncThunk } from "@reduxjs/toolkit";

export const createAppAsyncThunk = _createAsyncThunk.withTypes();
export const useStore = _useStore.withTypes();
export const useDispatch = _useDispatch.withTypes();
export const useSelector = _useSelector.withTypes();

const defaultExport = {
	createAppAsyncThunk,
	useStore,
	useDispatch,
	useSelector,
};
export default defaultExport;
