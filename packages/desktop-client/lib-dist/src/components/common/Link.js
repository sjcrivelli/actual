import { jsx as _jsx } from "react/jsx-runtime";
import { NavLink, useMatch } from 'react-router';
import { Button } from '@actual-app/components/button';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { css } from '@emotion/css';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
const externalLinkColors = {
    purple: theme.pageTextPositive,
    blue: theme.pageTextLink,
    muted: 'inherit',
};
const ExternalLink = ({ children, to, linkColor = 'blue', }) => {
    return (
    // we can’t use <ExternalLink /> here for obvious reasons
    // eslint-disable-next-line no-restricted-syntax
    _jsx("a", { href: to ?? '', target: "_blank", rel: "noopener noreferrer", style: { color: externalLinkColors[linkColor] }, children: children }));
};
const TextLink = ({ style, onClick, children, ...props }) => {
    return (_jsx(Text, { style: {
            backgroundColor: 'transparent',
            display: 'inline',
            border: 0,
            cursor: 'pointer',
            textDecoration: 'underline',
            ':hover': {
                boxShadow: 'none',
            },
            ...style,
        }, ...props, onClick: onClick, children: children }));
};
const ButtonLink = ({ to, style, activeStyle, ...props }) => {
    const navigate = useNavigate();
    const path = to ?? '';
    const match = useMatch({ path });
    return (_jsx(Button, { className: () => String(css({
            ...style,
            '&[data-pressed]': activeStyle,
            ...(match ? activeStyle : {}),
        })), ...props, variant: props.buttonVariant, onPress: e => {
            props.onPress?.(e);
            navigate(path);
        } }));
};
const InternalLink = ({ to, style, activeStyle, children, isDisabled, }) => {
    const path = to ?? '';
    const match = useMatch({ path });
    return (_jsx(NavLink, { to: path, className: css([styles.smallText, style, match ? activeStyle : null]), onClick: e => {
            if (isDisabled) {
                e.preventDefault();
            }
        }, children: children }));
};
export function Link(props) {
    switch (props.variant) {
        case 'internal': {
            const { variant: _, ...internalProps } = props;
            return _jsx(InternalLink, { ...internalProps });
        }
        case 'external': {
            const { variant: _, ...externalProps } = props;
            return _jsx(ExternalLink, { ...externalProps });
        }
        case 'button': {
            const { variant: _, ...buttonProps } = props;
            return _jsx(ButtonLink, { ...buttonProps });
        }
        case 'text': {
            const { variant: _, ...textProps } = props;
            return _jsx(TextLink, { ...textProps });
        }
        default:
            throw new Error(`Unrecognised Link variant.`);
    }
}
