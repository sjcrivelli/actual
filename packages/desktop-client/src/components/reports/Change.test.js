"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var theme_1 = require("@actual-app/components/theme");
var react_2 = require("@testing-library/react");
var Change_1 = require("./Change");
var store_1 = require("@desktop-client/redux/store");
describe('Change', function () {
    it('renders a positive amount with a plus sign and green color', function () {
        (0, react_2.render)(<react_redux_1.Provider store={store_1.store}>
        <Change_1.Change amount={12345}/>
      </react_redux_1.Provider>);
        var el = react_2.screen.getByText('+123.45');
        expect(el).toBeInTheDocument();
        expect(el).toHaveStyle("color: ".concat(theme_1.theme.noticeTextLight));
    });
    it('renders zero with a plus sign and green color', function () {
        (0, react_2.render)(<react_redux_1.Provider store={store_1.store}>
        <Change_1.Change amount={0}/>
      </react_redux_1.Provider>);
        var el = react_2.screen.getByText('+0.00');
        expect(el).toBeInTheDocument();
        expect(el).toHaveStyle("color: ".concat(theme_1.theme.noticeTextLight));
    });
    it('renders a negative amount with a minus sign and red color', function () {
        (0, react_2.render)(<react_redux_1.Provider store={store_1.store}>
        <Change_1.Change amount={-9876}/>
      </react_redux_1.Provider>);
        var el = react_2.screen.getByText('-98.76');
        expect(el).toBeInTheDocument();
        expect(el).toHaveStyle("color: ".concat(theme_1.theme.errorText));
    });
    it('merges custom style prop', function () {
        (0, react_2.render)(<react_redux_1.Provider store={store_1.store}>
        <Change_1.Change amount={1000} style={{ fontWeight: 'bold' }}/>
      </react_redux_1.Provider>);
        var el = react_2.screen.getByText('+10.00');
        expect(el).toHaveStyle('font-weight: bold');
        expect(el).toHaveStyle("color: ".concat(theme_1.theme.noticeTextLight));
    });
});
