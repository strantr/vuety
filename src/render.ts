import Vue, { CreateElement, VNode } from "vue";
import { IVuety, Vuety } from "./core";

export declare type RenderFunction = (createElement: CreateElement) => VNode;

export function Render(
	target: Vue,
	propertyKey: "render",
	descriptor: TypedPropertyDescriptor<RenderFunction>
): TypedPropertyDescriptor<RenderFunction>;
export function Render(): TypedPropertyDescriptor<RenderFunction>;
export function Render(this: Vue): TypedPropertyDescriptor<RenderFunction> {
	function render(target: IVuety, propertyKey: "render", descriptor: PropertyDescriptor) {
		Vuety("Render", target)(v => {
			v.options.render = descriptor.value;
			delete v.proto.render;
		});
	}
	if (arguments.length === 0) {
		return function(this: IVuety) {
			render.apply(this, arguments);
		} as any;
	} else {
		return render.apply(this, arguments) as any;
	}
}
