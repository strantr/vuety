import Vue from "vue";
import { IVuety, Vuety, DecoratorFactory } from "./core";

export function Provide(target: Vue, propertyKey: string): any;
export function Provide(dependencyName?: string): DecoratorFactory<string>;
export function Provide(this: Vue): DecoratorFactory<string> | undefined {
	function provide(
		dependencyName: string | undefined,
		target: IVuety,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		Vuety("Provide", target)(v => {
			const provided: { [k: string]: string } = (v.proto["$vuety-provide"] = v.proto["$vuety-provide"] || {});
			provided[dependencyName || propertyKey] = propertyKey;

			v.done(data => {
				delete v.proto["$vuety-provide"];
				data.options.provide = function(this: Vue) {
					let provide = {};
					Object.keys(provided).forEach(k => (provide[k] = this[provided[k]]));
					return provide;
				};
			});
		});
	}

	let args = Array.from(arguments);
	if (args[0] instanceof Vue) {
		provide.apply(this, [undefined, ...args]);
		return;
	} else {
		args.length = 1;
		return function(this: IVuety) {
			provide.apply(this, [...args, ...Array.from(arguments)]);
		};
	}
}
