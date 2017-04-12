import Vue from "vue";
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
            if (!v.options[propertyKey]) {
                v.options[propertyKey] = [descriptor.value] as any;
            } else if (v.options[propertyKey] instanceof Array) {
                (v.options[propertyKey] as any).push(descriptor.value);
            } else {
                v.options[propertyKey] = [v.options[propertyKey], descriptor.value] as any;
            }
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