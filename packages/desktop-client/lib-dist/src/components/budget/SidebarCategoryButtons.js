import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { CategoryAutomationButton } from './goals/CategoryAutomationButton';
import { NotesButton } from '@desktop-client/components/NotesButton';
import { useFeatureFlag } from '@desktop-client/hooks/useFeatureFlag';
import { useNotes } from '@desktop-client/hooks/useNotes';
export const SidebarCategoryButtons = ({ category, dragging, goalsShown, }) => {
    const isGoalTemplatesUIEnabled = useFeatureFlag('goalTemplatesUIEnabled');
    const notes = useNotes(category.id) || '';
    return (_jsxs(_Fragment, { children: [_jsx(View, { style: { flex: 1 } }), !goalsShown && isGoalTemplatesUIEnabled && (_jsx(View, { style: { flexShrink: 0 }, children: _jsx(CategoryAutomationButton, { category: category, style: dragging ? { color: 'currentColor' } : undefined, defaultColor: theme.pageTextLight, showPlaceholder: !!notes }) })), _jsx(View, { style: { flexShrink: 0 }, children: _jsx(NotesButton, { id: category.id, style: dragging ? { color: 'currentColor' } : undefined, defaultColor: theme.pageTextLight, showPlaceholder: !goalsShown &&
                        isGoalTemplatesUIEnabled &&
                        !!category.goal_def?.length }) })] }));
};
