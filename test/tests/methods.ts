import { expect } from "chai";
import { Component } from "../../src";
import Vue from "vue";

export default function () {

    describe("Methods", () => {
        it("Should be bound to the instance", async () => {
            let result: any = undefined;
            @Component({
                template: "<div>{{test()}}</div>"
            }) class A extends Vue {
                public test() {
                    result = this;
                    return "test";
                }
            }

            const a = new A();
            const el = document.createElement("div");
            a.$mount(el);
            await a.$nextTick();
            expect(result).to.be.ok;
        });

        it("Should be bound to the instance on event callbacks", async () => {
            let result: any = undefined;
            @Component({
                template: "<button @click='clicked'></button>"
            }) class A extends Vue {
                public clicked() {
                    result = this;
                }
            }

            const a = new A();
            const el = document.createElement("div");
            a.$mount(el);
            await a.$nextTick();
            a.$el.click();
            expect(result).to.be.ok;
        });
    });
}