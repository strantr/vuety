import Vue from "vue";
import { IVuety, Vuety } from "./core";

export function Data(target: Vue, propertyKey: string): any
export function Data(factory?: () => any): any;
export function Data(this: Vue): any | undefined {
    function data(factory: () => any | undefined, target: IVuety, propertyKey: string) {
        Vuety("Data", target)(v => {
            if (!factory) {
                const val = v.getDefault(propertyKey);
                factory = () => val;
            }
            v.storeData(propertyKey, factory);
        });
    }

    if (arguments.length < 3) {
        const args = arguments;
        return function (this: IVuety) {
            data.apply(this, [args[0], ...Array.from(arguments)]);
        }
    } else {
        data.apply(this, [undefined, ...Array.from(arguments)]);
    }
    return;
}