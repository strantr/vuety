import { expect } from "chai";
import { Component } from "../../src";
import Vue from "vue";

export default function () {
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

        it("Allows a name to be provided", () => {
            const template = "<div>a</div>";
            @Component({
                template,
                name: "hello"
            }) class Test extends Vue {
            }
            expect(new Test().$options.name).to.equal("hello");
        });

        it("Provides a name if not provided", () => {
            const template = "<div>a</div>";
            @Component({
                template
            }) class Test extends Vue {
            }
            expect(new Test().$options.name).to.equal("Test");
        });
    });
}