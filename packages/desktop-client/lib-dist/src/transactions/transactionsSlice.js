import { createSlice } from '@reduxjs/toolkit';
import { resetApp } from '@desktop-client/app/appSlice';
const sliceName = 'transactions';
const initialState = {
    newTransactions: [],
    matchedTransactions: [],
    lastTransaction: null,
};
const transactionsSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        setNewTransactions(state, action) {
            state.newTransactions = action.payload.newTransactions
                ? [...state.newTransactions, ...action.payload.newTransactions]
                : state.newTransactions;
            state.matchedTransactions = action.payload.matchedTransactions
                ? [...state.matchedTransactions, ...action.payload.matchedTransactions]
                : state.matchedTransactions;
        },
        updateNewTransactions(state, action) {
            state.newTransactions = state.newTransactions.filter(id => id !== action.payload.id);
            state.matchedTransactions = state.matchedTransactions.filter(id => id !== action.payload.id);
        },
        setLastTransaction(state, action) {
            state.lastTransaction = action.payload.transaction;
        },
    },
    extraReducers: builder => {
        builder.addCase(resetApp, () => initialState);
    },
});
export const { name, reducer, getInitialState } = transactionsSlice;
export const actions = {
    ...transactionsSlice.actions,
};
export const { setNewTransactions, updateNewTransactions, setLastTransaction } = transactionsSlice.actions;
