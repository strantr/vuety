import { expect } from "chai";
import { Component } from "../../src";
import Vue from "vue";

export default function() {
    describe("Component", () => {
        it("Should create new Vue element", () => {
            @Component() class A extends Vue {
            }
            expect(new A()).instanceof(Vue);
        });

        it("Passes options", () => {
            const template = "<div>a</div>";
            @Component({
                template
            }) class A extends Vue {
            }
            expect(new A().$options.template).to.equal(template);
        });
    });
}