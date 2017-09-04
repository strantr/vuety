import Vue from "vue";
import { IVuety } from "./core";
import { TargetOrEventName, processEventArgs } from "./util";

export function Emit(target: Vue, propertyKey: string): any
export function Emit(eventName?: string, target?: (v: Vue) => Vue): any;
export function Emit(target: (v: Vue) => Vue, eventName?: string): any;
export function Emit(this: Vue): any | undefined {
    function emit(arg1: TargetOrEventName, arg2: TargetOrEventName, target: IVuety, propertyKey: string, descriptor: PropertyDescriptor) {
        let r = processEventArgs(arg1, arg2);
        const orig = descriptor.value;
        descriptor.value = function (this: Vue) {
            let target: Vue;
            if (r.targetFn) {
                target = r.targetFn(this);
            } else {
                target = this;
            }
            // Call original function first
            let res = orig.apply(this, arguments);
            // Then raise the event
            target.$emit.apply(target, [r.evtName || propertyKey, ...Array.from(arguments)]);
            // Then if the original function supplied a callback, invoke that
            if (typeof res === "function") {
                res.apply(this, arguments);
            }
        };
    }

    let args = Array.from(arguments);
    if (args.length === 3) {
        if ("value" in args[2] && args[2]["value"] instanceof Function) {
            emit.apply(this, [...Array(2), ...args]);
            return;
        }
    }
    args.length = 2;
    return function (this: IVuety) {
        emit.apply(this, [...args, ...Array.from(arguments)]);
    }
}