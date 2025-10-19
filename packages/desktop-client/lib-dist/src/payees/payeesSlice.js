import { createSlice } from '@reduxjs/toolkit';
import { t } from 'i18next';
import memoizeOne from 'memoize-one';
import { send } from '../../../loot-core/src/platform/client/fetch';
import { groupById } from '../../../loot-core/src/shared/util';
import { getAccountsById } from '@desktop-client/accounts/accountsSlice';
import { resetApp } from '@desktop-client/app/appSlice';
import { createAppAsyncThunk } from '../redux';
const sliceName = 'payees';
const initialState = {
    commonPayees: [],
    isCommonPayeesLoading: false,
    isCommonPayeesLoaded: false,
    isCommonPayeesDirty: false,
    payees: [],
    isPayeesLoading: false,
    isPayeesLoaded: false,
    isPayeesDirty: false,
};
const payeesSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        markPayeesDirty(state) {
            _markPayeesDirty(state);
        },
    },
    extraReducers: builder => {
        builder.addCase(resetApp, () => initialState);
        builder.addCase(createPayee.fulfilled, _markPayeesDirty);
        builder.addCase(reloadCommonPayees.fulfilled, (state, action) => {
            _loadCommonPayees(state, action.payload);
        });
        builder.addCase(reloadCommonPayees.rejected, state => {
            state.isCommonPayeesLoading = false;
        });
        builder.addCase(reloadCommonPayees.pending, state => {
            state.isCommonPayeesLoading = true;
        });
        builder.addCase(getCommonPayees.fulfilled, (state, action) => {
            _loadCommonPayees(state, action.payload);
        });
        builder.addCase(getCommonPayees.rejected, state => {
            state.isCommonPayeesLoading = false;
        });
        builder.addCase(getCommonPayees.pending, state => {
            state.isCommonPayeesLoading = true;
        });
        builder.addCase(reloadPayees.fulfilled, (state, action) => {
            _loadPayees(state, action.payload);
        });
        builder.addCase(reloadPayees.rejected, state => {
            state.isPayeesLoading = false;
        });
        builder.addCase(reloadPayees.pending, state => {
            state.isPayeesLoading = true;
        });
        builder.addCase(getPayees.fulfilled, (state, action) => {
            _loadPayees(state, action.payload);
        });
        builder.addCase(getPayees.rejected, state => {
            state.isPayeesLoading = false;
        });
        builder.addCase(getPayees.pending, state => {
            state.isPayeesLoading = true;
        });
    },
});
function translatePayees(payees) {
    return (payees?.map(payee => payee.name === 'Starting Balance'
        ? { ...payee, name: t('Starting Balance') }
        : payee) ?? payees);
}
export const createPayee = createAppAsyncThunk(`${sliceName}/createPayee`, async ({ name }) => {
    const id = await send('payee-create', {
        name: name.trim(),
    });
    return id;
});
export const getCommonPayees = createAppAsyncThunk(`${sliceName}/getCommonPayees`, async () => {
    const payees = await send('common-payees-get');
    return translatePayees(payees);
}, {
    condition: (_, { getState }) => {
        const { payees } = getState();
        return (!payees.isCommonPayeesLoading &&
            (payees.isCommonPayeesDirty || !payees.isCommonPayeesLoaded));
    },
});
export const reloadCommonPayees = createAppAsyncThunk(`${sliceName}/reloadCommonPayees`, async () => {
    const payees = await send('common-payees-get');
    return translatePayees(payees);
});
export const getPayees = createAppAsyncThunk(`${sliceName}/getPayees`, async () => {
    const payees = await send('payees-get');
    return translatePayees(payees);
}, {
    condition: (_, { getState }) => {
        const { payees } = getState();
        return (!payees.isPayeesLoading &&
            (payees.isPayeesDirty || !payees.isPayeesLoaded));
    },
});
export const reloadPayees = createAppAsyncThunk(`${sliceName}/reloadPayees`, async () => {
    const payees = await send('payees-get');
    return translatePayees(payees);
});
export const getActivePayees = memoizeOne((payees, accounts) => {
    const accountsById = getAccountsById(accounts);
    return translatePayees(payees.filter(payee => {
        if (payee.transfer_acct) {
            const account = accountsById[payee.transfer_acct];
            return account != null && !account.closed;
        }
        return true;
    }));
});
export const getPayeesById = memoizeOne((payees) => groupById(translatePayees(payees)));
export const { name, reducer, getInitialState } = payeesSlice;
export const actions = {
    ...payeesSlice.actions,
    createPayee,
    getCommonPayees,
    reloadCommonPayees,
    getPayees,
    reloadPayees,
};
export const { markPayeesDirty } = payeesSlice.actions;
function _loadCommonPayees(state, commonPayees) {
    state.commonPayees = translatePayees(commonPayees);
    state.isCommonPayeesLoading = false;
    state.isCommonPayeesLoaded = true;
    state.isCommonPayeesDirty = false;
}
function _loadPayees(state, payees) {
    state.payees = translatePayees(payees);
    state.isPayeesLoading = false;
    state.isPayeesLoaded = true;
    state.isPayeesDirty = false;
}
function _markPayeesDirty(state) {
    state.isCommonPayeesDirty = true;
    state.isPayeesDirty = true;
}
