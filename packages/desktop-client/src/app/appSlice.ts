// @ts-strict
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { send } from '../../../loot-core/src/platform/client/fetch';
import { type RootState } from '@desktop-client/redux';
import { type AccountEntity, type CategoryEntity } from '@loot-core/types/models';

// ---------------------------------------------------------
// Async actions
// ---------------------------------------------------------

export const loadAppState = createAsyncThunk(
  'app/loadState',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await send('api/load-app-state');
      if (error) {
        return rejectWithValue(error);
      }
      return data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const saveAppState = createAsyncThunk(
  'app/saveState',
  async (newState: Partial<AppState>, { rejectWithValue }) => {
    try {
      const { error } = await send('api/save-app-state', newState);
      if (error) {
        return rejectWithValue(error);
      }
      return newState;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const resetApp = createAsyncThunk('app/reset', async () => {
  try {
    await send('api/reset-app');
    return true;
  } catch (err) {
    console.error('Error resetting app:', err);
    throw err;
  }
});

// ---------------------------------------------------------
// Types
// ---------------------------------------------------------

export interface AppState {
  status: 'idle' | 'loading' | 'failed';
  accounts: AccountEntity[];
  categories: CategoryEntity[];
  error?: string;
}

const initialState: AppState = {
  status: 'idle',
  accounts: [],
  categories: [],
};

// ---------------------------------------------------------
// Slice
// ---------------------------------------------------------

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppState: (state, action: PayloadAction<Partial<AppState>>) => {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppState.pending, state => {
        state.status = 'loading';
      })
      .addCase(loadAppState.fulfilled, (state, action) => {
        state.status = 'idle';
        if (action.payload) {
          Object.assign(state, action.payload);
        }
      })
      .addCase(loadAppState.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(saveAppState.pending, state => {
        state.status = 'loading';
      })
      .addCase(saveAppState.fulfilled, (state, action) => {
        state.status = 'idle';
        if (action.payload) {
          Object.assign(state, action.payload);
        }
      })
      .addCase(saveAppState.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(resetApp.fulfilled, () => initialState);
  },
});

// ---------------------------------------------------------
// Exports
// ---------------------------------------------------------

export const { setAppState } = appSlice.actions;
export const selectAppState = (state: RootState) => state.app;
export default appSlice.reducer;
