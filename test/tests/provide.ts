import { expect } from "chai";
import { Component, Data, Provide, Lifecycle } from "../../src";
import Vue from "vue";

export default function() {
	describe("Provide", () => {
		it("Provides automatically named property", async () => {
			let instanceVal: string | undefined;
			@Component({
				template: "<span>{{test}}</span>",
				inject: ["test"],
			})
			class Child extends Vue {
				public test: string;
				@Lifecycle
				protected created() {
					instanceVal = this.test;
				}
			}

			@Component({
				template: `<test ref="child"/>`,
				components: {
					test: Child,
				},
			})
			class Ancestor extends Vue {
				@Provide
				@Data
				public test: string = "A";
			}

			const a = new Ancestor().$mount(document.createElement("div"));
			expect(a.$refs["child"]["test"]).to.eq("A");
			expect(instanceVal).to.eq("A");
		});
		it("Provides automatically named property from factory", async () => {
			let instanceVal: string | undefined;
			@Component({
				template: "<span>{{test}}</span>",
				inject: ["test"],
			})
			class Child extends Vue {
				public test: string;
				@Lifecycle
				protected created() {
					instanceVal = this.test;
				}
			}

			@Component({
				template: `<test ref="child"/>`,
				components: {
					test: Child,
				},
			})
			class Ancestor extends Vue {
				@Provide()
				@Data
				public test: string = "B";
			}

			const a = new Ancestor().$mount(document.createElement("div"));
			expect(a.$refs["child"]["test"]).to.eq("B");
			expect(instanceVal).to.eq("B");
		});
		it("Provides manually named property from factory", async () => {
			let instanceVal: string | undefined;
			@Component({
				template: "<span>{{field}}</span>",
				inject: ["field"],
			})
			class Child extends Vue {
				public field: string;
				@Lifecycle
				protected created() {
					instanceVal = this.field;
				}
			}

			@Component({
				template: `<test ref="child"/>`,
				components: {
					test: Child,
				},
			})
			class Ancestor extends Vue {
				@Provide("field")
				@Data
				public test: string = "C";
			}

			const a = new Ancestor().$mount(document.createElement("div"));
			expect(a.$refs["child"]["field"]).to.eq("C");
			expect(instanceVal).to.eq("C");
		});
		it("Provides multiple", async () => {
			let instanceVal: number | undefined;
			@Component({
				template: "<span>{{field1}}</span>",
				inject: ["field1", "field2"],
			})
			class Child extends Vue {
				public field1: number;
				public field2: number;
				@Lifecycle
				protected created() {
					instanceVal = this.field1 + this.field2;
				}
			}

			@Component({
				template: `<test ref="child"/>`,
				components: {
					test: Child,
				},
			})
			class Ancestor extends Vue {
				@Provide("field1")
				@Data
				public test: number = 10;
				@Provide
				@Data
				public field2: number = 1;
			}

			const a = new Ancestor().$mount(document.createElement("div"));
			expect(a.$refs["child"]["field1"]).to.eq(10);
			expect(a.$refs["child"]["field2"]).to.eq(1);
			expect(instanceVal).to.eq(11);
		});
	});
}
