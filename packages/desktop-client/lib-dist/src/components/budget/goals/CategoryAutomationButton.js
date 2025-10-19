import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgChartPie } from '@actual-app/components/icons/v1';
import { theme } from '@actual-app/components/theme';
import { cx, css } from '@emotion/css';
import { useFeatureFlag } from '@desktop-client/hooks/useFeatureFlag';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
export function CategoryAutomationButton({ category, width = 12, height = 12, defaultColor = theme.buttonNormalText, style, showPlaceholder = false, }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const goalTemplatesEnabled = useFeatureFlag('goalTemplatesEnabled');
    const goalTemplatesUIEnabled = useFeatureFlag('goalTemplatesUIEnabled');
    const hasAutomations = !!category.goal_def?.length;
    if (!goalTemplatesEnabled || !goalTemplatesUIEnabled) {
        return null;
    }
    return (_jsx(Button, { variant: "bare", "aria-label": t('Change category automations'), className: cx(!hasAutomations && !showPlaceholder ? 'hover-visible' : '', css({
            color: defaultColor,
            opacity: hasAutomations || !showPlaceholder ? 1 : 0.3,
            '&:hover': {
                opacity: 1,
            },
            ...style,
        })), onPress: () => {
            dispatch(pushModal({
                modal: {
                    name: 'category-automations-edit',
                    options: { categoryId: category.id },
                },
            }));
        }, children: _jsx(SvgChartPie, { style: { width, height, flexShrink: 0 } }) }));
}
