import { expect } from "chai";
import { Component, Prop, Data } from "../../src";
import Vue from "vue";

export default function() {
	Prop.warn = false;

	describe("Prop", () => {
		it("Should be empty by default", () => {
			@Component()
			class A extends Vue {}
			expect(new A()["$props"]).to.eql(undefined);
		});

		it("Populates options", () => {
			@Component()
			class A extends Vue {
				@Prop public test: string;
			}
			expect(new A()["$props"]).to.eql({
				test: undefined,
			});
		});

		it("Populates options via Prop factory", () => {
			@Component()
			class A extends Vue {
				@Prop() public test: string;
			}
			expect(new A()["$props"]).to.eql({
				test: undefined,
			});
		});

		it("Allows default value via PropOpts", () => {
			@Component()
			class A extends Vue {
				@Prop({ default: "a" })
				public test: string;
			}
			expect(new A().test).to.eql("a");
		});

		it("Allows default value via PropOpts factory", () => {
			@Component()
			class A extends Vue {
				@Prop({ default: () => "a" })
				public test: string;
			}
			expect(new A().test).to.eql("a");
		});

		it("Allows default value via field value", () => {
			@Component()
			class A extends Vue {
				@Prop public test: string = "b";
			}
			expect(new A().test).to.eql("b");
		});

		it("PropOpts overrides field default", () => {
			@Component()
			class A extends Vue {
				@Prop({
					default: "d",
				})
				public test: string = "c";
			}
			expect(new A().test).to.eql("d");
		});

		it("Factory default overrides field default", () => {
			@Component()
			class A extends Vue {
				@Prop({
					default: () => "d",
				})
				public test: string = "c";
			}
			expect(new A().test).to.eql("d");
		});

		it("Can be used for binding", async () => {
			@Component({
				template: "<div>{{test}}</div>",
			})
			class A extends Vue {
				@Prop public test: string = "c";
			}
			const a = new A().$mount(document.createElement("div"));
			expect(a.$el.outerHTML).to.eql("<div>c</div>");
		});

		it("Can be passed in", async () => {
			@Component({
				template: "<span>{{p}}</span>",
			})
			class Child extends Vue {
				@Prop public p: string;
			}

			@Component({
				template: `<div><test :p="test"/></div>`,
				components: {
					test: Child,
				},
			})
			class A extends Vue {
				@Data public test: string = "hello";
			}
			const a = new A().$mount(document.createElement("div"));
			expect(a.$el.outerHTML).to.eql("<div><span>hello</span></div>");
			a.test = "d";
			await a.$nextTick();
			expect(a.$el.outerHTML).to.eql("<div><span>d</span></div>");
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
					@Prop public test1: {} = { hello: "world" }; // invalid
					@Prop public test2: any = null;
					@Prop public test3: any = "hi";
					@Prop public test4: any = 123;
					@Prop public test5: any = []; // invalid
					@Prop public test6: any = false;
					@Prop public test7: any = undefined;
					@Prop public test8: any = new Date(100000000); // invalid
				}

				const v = new A();
				expect(v.test1).to.deep.eq({ hello: "world" });
				expect(v.test2).to.deep.eq(null);
				expect(v.test3).to.deep.eq("hi");
				expect(v.test4).to.deep.eq(123);
				expect(v.test5).to.deep.eq([]);
				expect(v.test6).to.deep.eq(false);
				expect(v.test7).to.deep.eq(undefined);
				expect(v.test8).to.deep.eq(new Date(100000000));

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
