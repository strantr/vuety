import { expect } from "chai";
import { Component, On, Data } from "../../src";
import Vue from "vue";

export default function() {
	describe("On", () => {
		it("Can handle events by naming convention", () => {
			let result = 0;
			@Component({
				created(this: Vue) {
					this.$emit("eventName");
				},
			})
			class A extends Vue {
				@On
				protected eventName() {
					result++;
				}
			}
			new A();
			expect(result).to.eq(1);
		});
		it("Can handle events by name", () => {
			let result = 0;
			@Component({
				created(this: Vue) {
					this.$emit("eventName");
				},
			})
			class A extends Vue {
				@On("eventName")
				protected test() {
					result++;
				}
			}
			new A();
			expect(result).to.eq(1);
		});
		it("Can handle events on target component by naming convention", async () => {
			let result = 0;

			@Component({
				created(this: Vue) {
					this.$root.$emit("eventName");
				},
				template: "<div/>",
			})
			class A extends Vue {
				@On(v => v.$root)
				protected eventName() {
					result++;
				}
			}

			@Component({
				components: {
					child: A,
				},
				template: "<child/>",
			})
			class Root extends Vue {}
			await new Root().$mount(document.createElement("div")).$nextTick();
			expect(result).to.eq(1);
		});
		it("Can handle events on target component by name", async () => {
			let result = 0;

			@Component({
				created(this: Vue) {
					this.$root.$emit("eventName");
				},
				template: "<div/>",
			})
			class A extends Vue {
				@On(v => v.$root, "eventName")
				protected test() {
					result++;
				}
				@On("eventName", v => v.$root)
				protected test2() {
					result++;
				}
			}

			@Component({
				components: {
					child: A,
				},
				template: "<child/>",
			})
			class Root extends Vue {}
			await new Root().$mount(document.createElement("div")).$nextTick();
			expect(result).to.eq(2);
		});
		it("Handlers are bound to the instance", () => {
			let result = 0;
			@Component({
				created(this: Vue) {
					this.$emit("eventName");
				},
				props: {
					test: {
						default: 123,
					},
				},
			})
			class A extends Vue {
				@On
				protected eventName() {
					result = this["test"];
				}
			}
			new A();
			expect(result).to.eq(123);
		});
		it("Can be passed arguments", () => {
			let result = "";
			@Component({
				created(this: Vue) {
					this.$emit("eventName", "hello", { complex: "world" });
				},
			})
			class A extends Vue {
				@On()
				protected eventName(arg1: string, arg2: {}) {
					result = arg1 + " " + arg2["complex"];
				}
			}
			new A();
			expect(result).to.eq("hello world");
		});
		it("Removes handlers added to other components", async () => {
			let result = 0;

			@Component({
				template: "<div/>",
			})
			class B extends Vue {
				@On(v => v.$parent)
				protected test() {
					result++;
				}
			}

			@Component({
				components: {
					test: B,
				},
				template: "<div><test/><test/></div>",
			})
			class A extends Vue {}

			@Component({
				components: {
					test: A,
				},
				template: "<div><test ref='test' v-if='show'/></div>",
			})
			class Root extends Vue {
				@Data public show: boolean = true;
			}

			const root = new Root();
			await root.$mount(document.createElement("div")).$nextTick();
			const test = root.$refs["test"] as A;
			expect(test["_events"].test.length).to.eq(2);
			test.$emit("test");
			expect(result).to.eq(2);
			root.show = false;
			await root.$nextTick();
			expect(Object.keys(test["_events"]).length).to.eq(0);
		});
	});
}
