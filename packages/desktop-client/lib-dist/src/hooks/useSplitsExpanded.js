import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useMemo, useEffect, useContext, useReducer, useRef, } from 'react';
const SplitsExpandedContext = createContext({
    state: {
        mode: 'collapse',
        ids: new Set(),
        transitionId: null,
    },
    dispatch: () => {
        throw new Error('Unitialised context method called: dispatch');
    },
});
export function useSplitsExpanded() {
    const data = useContext(SplitsExpandedContext);
    return useMemo(() => ({
        ...data,
        isExpanded: (id) => {
            return data.state.mode === 'collapse'
                ? !data.state.ids.has(id)
                : data.state.ids.has(id);
        },
    }), [data]);
}
export function SplitsExpandedProvider({ children, initialMode = 'expand', }) {
    const previousState = useRef(null);
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'toggle-split': {
                const ids = new Set([...state.ids]);
                const { id } = action;
                if (ids.has(id)) {
                    ids.delete(id);
                }
                else {
                    ids.add(id);
                }
                return { ...state, ids };
            }
            case 'open-split': {
                const ids = new Set([...state.ids]);
                const { id } = action;
                if (state.mode === 'collapse') {
                    ids.delete(id);
                }
                else {
                    ids.add(id);
                }
                return { ...state, ids };
            }
            case 'close-splits': {
                const ids = new Set([...state.ids]);
                action.ids.forEach(id => {
                    if (state.mode === 'collapse') {
                        ids.add(id);
                    }
                    else {
                        ids.delete(id);
                    }
                });
                return { ...state, ids };
            }
            case 'set-mode': {
                return {
                    ...state,
                    mode: action.mode,
                    ids: new Set(),
                    transitionId: null,
                };
            }
            case 'switch-mode':
                if (state.transitionId != null) {
                    // You can only transition once at a time
                    return state;
                }
                return {
                    ...state,
                    mode: state.mode === 'expand' ? 'collapse' : 'expand',
                    transitionId: action.id,
                    ids: new Set(),
                };
            case 'finish-switch-mode':
                return { ...state, transitionId: null };
        }
    }, previousState.current || {
        ids: new Set(),
        mode: initialMode,
        transitionId: null,
    });
    useEffect(() => {
        if (state.transitionId != null) {
            // This timeout allows animations to finish
            setTimeout(() => {
                dispatch({ type: 'finish-switch-mode' });
            }, 250);
        }
    }, [state.transitionId]);
    useEffect(() => {
        // In a finished state, cache the state
        if (state.transitionId == null) {
            previousState.current = state;
        }
    }, [state]);
    const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
    return (_jsx(SplitsExpandedContext.Provider, { value: value, children: children }));
}
