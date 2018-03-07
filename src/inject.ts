import * as Vue from "vue";
import { IVuety, Vuety, DecoratorFactory } from "./core";

export type InjectOptions = { from?: string; default?: any };

export function Inject(target: Vue, propertyKey: string): any;
export function Inject(dependencyName?: string): DecoratorFactory<string>;
export function Inject(options: InjectOptions): any;
export function Inject(this: Vue): DecoratorFactory<string> | undefined {
	function inject(
		dependencyNameOrOptions: string | InjectOptions | undefined,
		target: IVuety,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		Vuety("Inject", target)(v => {
			if (!v.options.inject) {
				v.options.inject = {};
			}
			(v.options.inject as {})[propertyKey] = dependencyNameOrOptions || propertyKey;
			delete v.proto[propertyKey];
		});
	}

	let args = Array.from(arguments);
	if (args[0] instanceof Vue) {
		inject.apply(this, [undefined, ...args]);
		return;
	} else {
		args.length = 1;
		return function(this: IVuety) {
			inject.apply(this, [...args, ...Array.from(arguments)]);
		};
	}
}
