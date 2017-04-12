import Vue from "vue";
import { IVuety, Vuety, DecoratorFactory } from "./core";

export declare type RenderFunction = (createElement: Vue.CreateElement) => Vue.VNode;

export function Render(target: Vue, propertyKey: "render", descriptor: TypedPropertyDescriptor<RenderFunction>): DecoratorFactory<"render">
export function Render(): DecoratorFactory<"render">
export function Render(this: Vue): DecoratorFactory<"render"> | undefined {
    function render(target: IVuety, propertyKey: "render", descriptor: PropertyDescriptor) {
        Vuety("Render", target)(v => {
            v.options.render = descriptor.value;
            delete v.proto.render;
        });
    }
    if (arguments.length === 0) {
        return function (this: IVuety) {
            render.apply(this, arguments);
        };
    } else {
        render.apply(this, arguments);
    }
    return;
}