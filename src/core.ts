import Vue from "vue";

export type DecoratorFactory<TKey extends string> = (target: Vue, propertyKey: TKey) => any;
export type VuetyCallback = (v: VuetyCallbackData) => void;

export interface IVuety extends Vue {
	$vuety?: {
		[k: string]: VuetyCallback[];
	};
}

export interface VuetyCallbackData {
	options: Vue.ComponentOptions<Vue>;
	getDefault: (key: string) => any;
	storeData: (key: string, factory: () => any) => void;
	proto: any;
	done: (cb: (data: VuetyDoneCallbackData) => void) => void;
}

export interface VuetyDoneCallbackData {
	options: Vue.ComponentOptions<Vue>;
	proto: any;
}

export function Vuety(id: string, target: IVuety): (callback: VuetyCallback) => void {
	return function(callback: VuetyCallback) {
		if (!target.$vuety) {
			target.$vuety = {};
		}
		if (!target.$vuety[id]) {
			target.$vuety[id] = [callback];
		} else {
			target.$vuety[id].push(callback);
		}
	};
}
