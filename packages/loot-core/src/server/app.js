"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
// @ts-strict-ignore
var mitt_1 = require("mitt");
var exceptions_1 = require("../platform/exceptions");
var App = /** @class */ (function () {
    function App() {
        this.handlers = {};
        this.services = [];
        this.events = (0, mitt_1.default)();
        this.unlistenServices = [];
    }
    App.prototype.method = function (name, func) {
        if (this.handlers[name] != null) {
            throw new Error('Conflicting method name, names must be globally unique: ' + name);
        }
        this.handlers[name] = func;
    };
    App.prototype.service = function (func) {
        this.services.push(func);
    };
    App.prototype.combine = function () {
        var _this = this;
        var apps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            apps[_i] = arguments[_i];
        }
        var _loop_1 = function (app) {
            Object.keys(app.handlers).forEach(function (name) {
                _this.method(name, app.handlers[name]);
            });
            app.services.forEach(function (service) {
                _this.service(service);
            });
            for (var _b = 0, _c = app.events.all.entries(); _b < _c.length; _b++) {
                var _d = _c[_b], name_1 = _d[0], listeners = _d[1];
                for (var _e = 0, listeners_1 = listeners; _e < listeners_1.length; _e++) {
                    var listener = listeners_1[_e];
                    this_1.events.on(name_1, listener);
                }
            }
        };
        var this_1 = this;
        for (var _a = 0, apps_1 = apps; _a < apps_1.length; _a++) {
            var app = apps_1[_a];
            _loop_1(app);
        }
    };
    App.prototype.startServices = function () {
        if (this.unlistenServices.length > 0) {
            (0, exceptions_1.captureException)(new Error('App: startServices called while services are already running'));
        }
        this.unlistenServices = this.services.map(function (service) { return service(); });
    };
    App.prototype.stopServices = function () {
        this.unlistenServices.forEach(function (unlisten) {
            if (unlisten) {
                unlisten();
            }
        });
        this.unlistenServices = [];
    };
    return App;
}());
function createApp() {
    return new App();
}
