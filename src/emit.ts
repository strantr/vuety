import * as Vue from "vue";
import { IVuety, DecoratorFactory } from "./core";

export function Emit(target: Vue, propertyKey: string): any
export function Emit(eventName?: string): DecoratorFactory<string>;
export function Emit(target: (v: Vue) => Vue, eventName?: string): DecoratorFactory<string>;
export function Emit(this: Vue): DecoratorFactory<string> | undefined {
    function emit(targetOrEventName: string | ((v: Vue) => Vue) | undefined, eventName: string, target: IVuety, propertyKey: string, descriptor: PropertyDescriptor) {
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

        const orig = descriptor.value;
        descriptor.value = function (this: Vue) {
            let target: Vue;
            if (targetFn) {
                target = targetFn(this);
            } else {
                target = this;
            }
            // Call original function first
            let res = orig.apply(this, arguments);
            // Then raise the event
            target.$emit.apply(target, [eventName, ...Array.from(arguments)]);
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