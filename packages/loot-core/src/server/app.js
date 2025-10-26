// @ts-strict-ignore
import mitt from 'mitt';
import { captureException } from '../platform/exceptions';
class App {
    events;
    handlers;
    services;
    unlistenServices;
    constructor() {
        this.handlers = {};
        this.services = [];
        this.events = mitt();
        this.unlistenServices = [];
    }
    method(name, func) {
        if (this.handlers[name] != null) {
            throw new Error('Conflicting method name, names must be globally unique: ' + name);
        }
        this.handlers[name] = func;
    }
    service(func) {
        this.services.push(func);
    }
    combine(...apps) {
        for (const app of apps) {
            Object.keys(app.handlers).forEach(name => {
                this.method(name, app.handlers[name]);
            });
            app.services.forEach(service => {
                this.service(service);
            });
            for (const [name, listeners] of app.events.all.entries()) {
                for (const listener of listeners) {
                    this.events.on(name, listener);
                }
            }
        }
    }
    startServices() {
        if (this.unlistenServices.length > 0) {
            captureException(new Error('App: startServices called while services are already running'));
        }
        this.unlistenServices = this.services.map(service => service());
    }
    stopServices() {
        this.unlistenServices.forEach(unlisten => {
            if (unlisten) {
                unlisten();
            }
        });
        this.unlistenServices = [];
    }
}
export function createApp() {
    return new App();
}
