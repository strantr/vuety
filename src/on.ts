import Vue from "vue";
import { IVuety, Vuety, DecoratorFactory } from "./core";
import { TargetOrEventName, processEventArgs, merge } from "./util";

export function On(target: Vue, propertyKey: string): undefined;
export function On(eventName?: string, target?: (v: Vue) => Vue): DecoratorFactory<string>;
export function On(target: (v: Vue) => Vue, eventName?: string): DecoratorFactory<string>;
export function On(this: Vue, ...a: any[]): DecoratorFactory<string> | undefined {
	function on(
		arg1: TargetOrEventName,
		arg2: TargetOrEventName,
		target: IVuety,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		Vuety("On", target)(v => {
			let r = processEventArgs(arg1, arg2);
			const handler = function(this: Vue) {
				const target: Vue = r.targetFn ? r.targetFn(this) : this;
				const listener = descriptor.value.bind(this);
				target.$on(r.evtName || propertyKey, listener);
				this.$on("hook:destroyed", () => {
					target.$off(r.evtName || propertyKey, listener);
				});
			};
			merge("beforeCreate", v.options as any, handler);
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
	return function(this: IVuety) {
		on.apply(this, [...args, ...Array.from(arguments)]);
	};
}
