import { expect } from "chai";
import { Component, Render, Data } from "../../src";
import Vue, { CreateElement, VNode } from "vue";

export default function() {
	describe("Render", () => {
		it("Can render", async () => {
			@Component()
			class A extends Vue {
				@Data public test: string = "a";
				@Render
				protected render(r: CreateElement): VNode {
					return r("div", this.test);
				}
			}
			const a = new A().$mount(document.createElement("div"));
			expect(a.$el.outerHTML).to.eql("<div>a</div>");
			a.test = "d";
			await a.$nextTick();
			expect(a.$el.outerHTML).to.eql("<div>d</div>");
		});
	});
}
