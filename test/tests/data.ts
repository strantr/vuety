import { expect } from "chai";
import { Component, Data } from "../../src";
import Vue from "vue";

export default function() {
	describe("Data", () => {
		it("Should be empty by default", () => {
			@Component()
			class A extends Vue {}
			expect(new A()["$data"]).to.eql({});
		});

		it("Populates options", () => {
			@Component()
			class A extends Vue {
				@Data public test: string;
			}
			expect(new A()["$data"]).to.eql({
				test: undefined,
			});
		});

		it("Populates options via empty factory", () => {
			@Component()
			class A extends Vue {
				@Data() public test: string;
			}
			expect(new A()["$data"]).to.eql({
				test: undefined,
			});
		});

		it("Allows default value via factory", () => {
			@Component()
			class A extends Vue {
				@Data(() => "a")
				public test: string;
			}
			expect(new A()["$data"]).to.eql({
				test: "a",
			});
		});

		it("Allows default value via field value", () => {
			@Component()
			class A extends Vue {
				@Data public test: string = "b";
			}
			expect(new A()["$data"]).to.eql({
				test: "b",
			});
		});

		it("Factory default overrides field default", () => {
			@Component()
			class A extends Vue {
				@Data(() => "d")
				public test: string = "c";
			}
			expect(new A()["$data"]).to.eql({
				test: "d",
			});
		});

		it("Can be assigned to", () => {
			@Component()
			class A extends Vue {
				@Data public test: string = "c";
			}
			const a = new A();
			a.test = "e";
			expect(a.test).to.eql("e");
		});

		it("Can be used for binding", async () => {
			@Component({
				template: "<div>{{test}}</div>",
			})
			class A extends Vue {
				@Data public test: string = "c";
			}
			const a = new A().$mount(document.createElement("div"));
			expect(a.$el.outerHTML).to.eql("<div>c</div>");
			a.test = "d";
			await a.$nextTick();
			expect(a.$el.outerHTML).to.eql("<div>d</div>");
		});

		it("Warns of complex default value via field value", () => {
			const consoleWarn = console.warn;
			const output: [string, string][] = [];
			try {
				console.warn = function(...args: any[]) {
					consoleWarn.apply(console, args);
					if (args.length === 2) {
						output.push([args[0], args[1]]);
					}
				};
				@Component()
				class A extends Vue {
					@Data public test1: {} = { hello: "world" }; // invalid
					@Data public test2: any = null;
					@Data public test3: any = "hi";
					@Data public test4: any = 123;
					@Data public test5: any = []; // invalid
					@Data public test6: any = false;
					@Data public test7: any = undefined;
					@Data public test8: any = new Date(100000000); // invalid
				}

				expect(new A()["$data"]).to.deep.eq({
					test1: { hello: "world" },
					test2: null,
					test3: "hi",
					test4: 123,
					test5: [],
					test6: false,
					test7: undefined,
					test8: new Date(100000000),
				});

				expect(output).to.deep.eq([
					[
						"[vuety] avoid using non-primative objects via class assignment [#10]",
						"(unnamed component).test1 -> object",
					],
					[
						"[vuety] avoid using non-primative objects via class assignment [#10]",
						"(unnamed component).test5 -> object",
					],
					[
						"[vuety] avoid using non-primative objects via class assignment [#10]",
						"(unnamed component).test8 -> object",
					],
				]);
			} finally {
				console.warn = consoleWarn;
			}
		});
	});
}
