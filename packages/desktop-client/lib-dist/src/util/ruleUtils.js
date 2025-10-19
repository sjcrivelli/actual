import { v4 as uuid } from 'uuid';
export function groupActionsBySplitIndex(actions) {
    return actions.reduce((acc, action) => {
        const splitIndex = 'options' in action ? (action.options?.splitIndex ?? 0) : 0;
        acc[splitIndex] = acc[splitIndex] ?? { id: uuid(), actions: [] };
        acc[splitIndex].actions.push(action);
        return acc;
    }, []);
}
