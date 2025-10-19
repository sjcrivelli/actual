import { jsx as _jsx } from "react/jsx-runtime";
import BasePullToRefresh from 'react-simple-pull-to-refresh';
import { css } from '@emotion/css';
export function PullToRefresh(props) {
    return (_jsx("div", { style: { overflow: 'auto', flex: 1 }, children: _jsx(BasePullToRefresh, { pullDownThreshold: 80, resistance: 2, className: css({
                '& .ptr__pull-down': {
                    textAlign: 'center',
                },
                '& .ptr__children': {
                    overflow: 'hidden auto',
                },
            }), ...props, 
            // Force async because the library errors out when a sync onRefresh method is provided.
            onRefresh: async () => {
                await props.onRefresh?.();
            } }) }));
}
