import { expect } from "chai";
import { Component } from "../../src";
import Vue from "vue";

export default function () {
    describe("Computed Properties", () => {
        it("Should be bound to the instance", async () => {
            let result: any = undefined;
            @Component({
                template: "<div>{{test}}</div>"
            }) class A extends Vue {
                public get test() {
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

        it("Should require a getter", () => {
            expect(function () {
                @Component() class A extends Vue {
                    public set test(v: number) {
                    }
                }
                new A();
            }).to.throw("Computed properties must have a getter: A.test");
        });

        it("Should be bound to the instance on events", async () => {
            let result: any = undefined;
            @Component({
                template: "<button @click='test=1'></button>"
            }) class A extends Vue {
                public set test(v: number) {
                    result = this;
                }
                public get test() {
                    return 1;
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