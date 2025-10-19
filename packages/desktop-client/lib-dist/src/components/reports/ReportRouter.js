import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from 'react-router';
import { Overview } from './Overview';
import { Calendar } from './reports/Calendar';
import { CashFlow } from './reports/CashFlow';
import { CustomReport } from './reports/CustomReport';
import { NetWorth } from './reports/NetWorth';
import { Spending } from './reports/Spending';
import { Summary } from './reports/Summary';
export function ReportRouter() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Overview, {}) }), _jsx(Route, { path: "/net-worth", element: _jsx(NetWorth, {}) }), _jsx(Route, { path: "/net-worth/:id", element: _jsx(NetWorth, {}) }), _jsx(Route, { path: "/cash-flow", element: _jsx(CashFlow, {}) }), _jsx(Route, { path: "/cash-flow/:id", element: _jsx(CashFlow, {}) }), _jsx(Route, { path: "/custom", element: _jsx(CustomReport, {}) }), _jsx(Route, { path: "/custom/:id", element: _jsx(CustomReport, {}) }), _jsx(Route, { path: "/spending", element: _jsx(Spending, {}) }), _jsx(Route, { path: "/spending/:id", element: _jsx(Spending, {}) }), _jsx(Route, { path: "/summary", element: _jsx(Summary, {}) }), _jsx(Route, { path: "/summary/:id", element: _jsx(Summary, {}) }), _jsx(Route, { path: "/calendar", element: _jsx(Calendar, {}) }), _jsx(Route, { path: "/calendar/:id", element: _jsx(Calendar, {}) })] }));
}
