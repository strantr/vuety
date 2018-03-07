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
			let target: Vue;
			const handler = function(this: Vue) {
				if (r.targetFn) {
					target = r.targetFn(this);
				} else {
					target = this;
				}
				target.$on(r.evtName || propertyKey, descriptor.value.bind(this));
			};
			merge("beforeCreate", v.options as any, handler);
			merge("destroyed", v.options as any, function(this: Vue) {
				target.$off(r.evtName || propertyKey, descriptor.value.bind(this));
			});
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
