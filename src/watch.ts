import * as Vue from "vue";
import { Vuety } from "./core";

export type WatchHandler<T> = (newValue: T, oldValue: T, propertyKey: string) => void
export type WatchDecorator<TKey extends string> = <T>(target: {[k in TKey]: T}, propertyKey: string, descriptor: TypedPropertyDescriptor<WatchHandler<T>>) => void;

export function Watch<TKey extends string>(prop: TKey, options?: Vue.WatchOptions): WatchDecorator<TKey> {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Vuety("Watch", target)(v => {
            if (!options) {
                options = {};
            }

            const original = descriptor.value;

            descriptor.value = function (this: Vue) {
                original.apply(this, [...Array.from(arguments), prop]);
            }

            options["handler"] = descriptor.value;
            const watches = {};
            watches[prop as string] = options;
            v.options.watch = Object.assign({}, v.options.watch, watches);
        });
    }
}