import Vue from "vue";
import { IVuety, Vuety, DecoratorFactory } from "./core";


export function Prop(target: Vue, propertyKey: string): any
export function Prop(options?: Vue.PropOptions): DecoratorFactory<string>;
export function Prop(this: Vue): DecoratorFactory<string> | undefined {
    function prop(options: Vue.PropOptions, target: IVuety, propertyKey: string) {
        Vuety("Prop", target)(v => {
            if (!options) {
                options = {};
            }
            if (!options.default) {
                options.default = v.getDefault(propertyKey);
            }
            if (!options.type && options.default) {
                if (options.default.constructor !== Function) {
                    options.type = options.default.constructor;
                }
            }
            const props = {};
            props[propertyKey] = options;
            v.options.props = Object.assign({}, v.options.props, props);
        });
    }

    if (arguments.length < 3) {
        const args = arguments;
        return function (this: IVuety) {
            prop.apply(this, [args[0], ...Array.from(arguments)]);
        }
    } else {
        prop.apply(this, [undefined, ...Array.from(arguments)]);
    }
    return;
}

export namespace Prop {
    export let warn: boolean = true;
}