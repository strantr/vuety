import * as Vue from "vue";
import { IVuety, Vuety, DecoratorFactory } from "./core";

export function On(target: Vue, propertyKey: string): any
export function On(eventName: string): DecoratorFactory<string>;
export function On(target: (v: Vue) => Vue, eventName?: string): DecoratorFactory<string>;
export function On(this: Vue): DecoratorFactory<string> | undefined {
    function on(targetOrEventName: string | ((v: Vue) => Vue) | undefined, eventName: string, target: IVuety, propertyKey: string, descriptor: PropertyDescriptor) {
        let targetFn: (v: Vue) => Vue;
        if (typeof targetOrEventName === "string") {
            eventName = targetOrEventName;
        } else {
            if (targetOrEventName) {
                targetFn = targetOrEventName;
            }
            if (!eventName) {
                eventName = propertyKey;
            }
        }
        Vuety("On", target)(v => {
            const handler = function (this: Vue) {
                let target: Vue;
                if (targetFn) {
                    target = targetFn(this);
                } else {
                    target = this;
                }
                target.$on(eventName, descriptor.value.bind(this));
            };

            if (!v.options["beforeCreate"]) {
                v.options["beforeCreate"] = [handler] as any;
            } else if (v.options["beforeCreate"] instanceof Array) {
                (v.options["beforeCreate"] as any).push(handler);
            } else {
                v.options["beforeCreate"] = [v.options["beforeCreate"], handler] as any;
            }
        });
    }

    let args = Array.from(arguments);
    if (args.length === 3) {
        if ("value" in args[2] && args[2]["value"] instanceof Function) {
            on.apply(this, [...Array(2), ...args]);
            return;
        }
    }
    args.length = 2;
    return function (this: IVuety) {
        on.apply(this, [...args, ...Array.from(arguments)]);
    }
}