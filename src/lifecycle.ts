import * as Vue from "vue";
import { IVuety, Vuety, DecoratorFactory } from "./core";

export type LifecycleName =
    "beforeCreate" | "created" |
    "beforeDestroy" | "destroyed" |
    "beforeMount" | "mounted" |
    "beforeUpdate" | "updated" |
    "activated" | "deactivated";

export function Lifecycle(target: Vue, propertyKey: LifecycleName, descriptor: PropertyDescriptor): DecoratorFactory<LifecycleName>
export function Lifecycle(): DecoratorFactory<LifecycleName>
export function Lifecycle(this: Vue): DecoratorFactory<LifecycleName> | undefined {
    function lifecycle(target: IVuety, propertyKey: LifecycleName, descriptor: PropertyDescriptor) {
        Vuety("Lifecycle", target)(v => {
            v.options[propertyKey] = descriptor.value;
        });
    }
    if (arguments.length === 0) {
        return function (this: IVuety) {
            lifecycle.apply(this, arguments);
        };
    } else {
        lifecycle.apply(this, arguments);
    }
    return;
}