import * as Vue from "vue";
import { IVuety } from "./core";

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
                        proto
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

            delete proto.$vuety;
        }

        return (target as any).extend(opts);
    };
}