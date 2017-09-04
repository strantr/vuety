import Vue from "vue";
import { IVuety, Vuety } from "./core";
import { TargetOrEventName, processEventArgs } from "./util";

export function On(target: Vue, propertyKey: string): any
export function On(eventName?: string, target?: (v: Vue) => Vue, ): any;
export function On(target: (v: Vue) => Vue, eventName?: string): any;
export function On(this: Vue): any | undefined {
    function on(arg1: TargetOrEventName, arg2: TargetOrEventName, target: IVuety, propertyKey: string, descriptor: PropertyDescriptor) {
        Vuety("On", target)(v => {
            let r = processEventArgs(arg1, arg2);
            const handler = function (this: Vue) {
                let target: Vue;
                if (r.targetFn) {
                    target = r.targetFn(this);
                } else {
                    target = this;
                }
                target.$on(r.evtName || propertyKey, descriptor.value.bind(this));
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