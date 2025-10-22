"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Background = Background;
var react_1 = require("react");
var theme_1 = require("@actual-app/components/theme");
var LoadComponent_1 = require("./util/LoadComponent");
function Background() {
    return (<div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme_1.theme.pageBackground,
        }}>
      <svg viewBox="0 0 642 535" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
        }}>
        <path fill="url(#paint0_linear)" d="M0 0h642v535H0z"/>
        <defs>
          <linearGradient id="paint0_linear" x1="162" y1="23.261" x2="468.904" y2="520.44" gradientUnits="userSpaceOnUse">
            <stop stopColor={theme_1.theme.pageBackgroundTopLeft}/>
            <stop offset="1" stopColor={theme_1.theme.pageBackgroundBottomRight} stopOpacity="0.5"/>
          </linearGradient>
        </defs>
        <LoadComponent_1.LoadComponent importer={function () { return Promise.resolve().then(function () { return require('./BackgroundImage'); }); }} name="BackgroundImage"/>
      </svg>
    </div>);
}
