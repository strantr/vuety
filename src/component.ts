import Vue from "vue";
import { IVuety, VuetyDoneCallbackData } from "./core";

export type Newable<T> = { new (): T };

const defaultStore = new Map<Newable<Vue>, { [k: string]: any }>();

export function Component(options?: Vue.ComponentOptions<Vue>) {
    const opts = options || {};
    return function (target: Newable<Vue>) {
        const proto = target.prototype as IVuety;
        let instance: Vue | undefined;
        let vuety = proto.$vuety;
        if (vuety) {
            const getDefault = (key: string) => {
                let store = defaultStore.get(target);
                if (store == null) {
                    store = {};
                    defaultStore.set(target, store);
                }
                if (key in store) {
                    return store[key];
                }
                if (!instance) {
                    instance = new target();
                }
                store[key] = instance[key];

                return store[key];
            };

            const keys = Object.keys(vuety);
            const doneCallbacks: { [k: string]: (data: VuetyDoneCallbackData) => void } = {};
            let data: { [k: string]: any } | undefined = undefined;
            for (let i = 0; i < keys.length; i++) {
                const callbacks = vuety[keys[i]];
                for (let j = 0; j < callbacks.length; j++) {
                    callbacks[j]({
                        options: opts,
                        getDefault,
                        storeData(key, factory) {
                            if (!data) data = {};
                            data[key] = factory;
                        },
                        proto,
                        done(cb) {
                            if (!(keys[i] in doneCallbacks)) {
                                doneCallbacks[keys[i]] = cb;
                            }
                        }
                    });
                }
            }

            if (data) {
                const _data = data;
                opts.data = function () {
                    const r = {};
                    Object.keys(_data).forEach(k => {
                        r[k] = _data[k]();
                    });
                    return r;
                };
            }

            Object.keys(doneCallbacks).forEach(decoratorId => {
                doneCallbacks[decoratorId]({
                    proto,
                    options: opts
                });
            });

            delete proto.$vuety;
        }

        // Loop over each method in the class and see if it needs to be set as a method or computed property
        Object.getOwnPropertyNames(target.prototype).filter(p => p !== "constructor").forEach(prop => {
            const descriptor = Object.getOwnPropertyDescriptor(target.prototype, prop);
            if (descriptor.get || descriptor.set) {
                delete target.prototype[prop];
                if (!opts.computed) {
                    opts.computed = {};
                }
                if (descriptor.get === undefined) {
                    throw new Error("Computed properties must have a getter: " + target.prototype.constructor.name + "." + prop);
                }
                opts.computed[prop] = {
                    get: descriptor.get,
                    set: descriptor.set
                };
            } else {
                if (!opts.methods) {
                    opts.methods = {};
                }
                opts.methods[prop] = descriptor.value;
            }
        });

        return (target as any).extend(opts);
    };
}