import { jsx as _jsx } from "react/jsx-runtime";
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { LoadComponent } from '@desktop-client/components/util/LoadComponent';
const loadNarrow = () => import(/* webpackChunkName: "narrow-components" */ './narrow');
const loadWide = () => import(/* webpackChunkName: "wide-components" */ './wide');
export function WideComponent({ name }) {
    return _jsx(LoadComponent, { name: name, importer: loadWide });
}
export function NarrowAlternate({ name, }) {
    const { isNarrowWidth } = useResponsive();
    return (_jsx(LoadComponent, { name: name, importer: isNarrowWidth ? loadNarrow : loadWide }));
}
