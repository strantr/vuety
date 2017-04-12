import { expect } from "chai";
import { Component, Data, Inject, Lifecycle } from "../../src";
import * as Vue from "vue";

export default function () {
    describe("Inject", () => {
        it("Injects property from ancestor automatically named", async () => {
            let instanceVal: string | undefined;
            @Component({
                template: "<span>{{test}}</span>"
            }) class Child extends Vue {
                @Inject public test: string;

                @Lifecycle protected created() {
                    instanceVal = this.test;
                }
            };

            @Component({
                template: `<test ref="child"/>`,
                components: {
                    "test": Child
                },
                provide: function (this: Ancestor) {
                    return { test: this.test };
                }
            }) class Ancestor extends Vue {
                @Data public test: string = "A";
            };

            const a = new Ancestor().$mount(document.createElement("div"));
            expect(a.$refs["child"]["test"]).to.eq("A");
            expect(instanceVal).to.eq("A");
        });
        it("Injects property from ancestor automatically named from factory", async () => {
            @Component({
                template: "<span>{{test}}</span>"
            }) class Child extends Vue {
                @Inject() public test: string;
            };

            @Component({
                template: `<test ref="child"/>`,
                components: {
                    "test": Child
                },
                provide: function (this: Ancestor) {
                    return { test: this.test };
                }
            }) class Ancestor extends Vue {
                @Data public test: string = "B";
            };

            const a = new Ancestor().$mount(document.createElement("div"));
            expect(a.$refs["child"]["test"]).to.eq("B");
        });
        it("Injects property from ancestor manually named", async () => {
            @Component({
                template: "<span>{{field}}</span>"
            }) class Child extends Vue {
                @Inject("test") public field: string;
            };

            @Component({
                template: `<test ref="child"/>`,
                components: {
                    "test": Child
                },
                provide: function (this: Ancestor) {
                    return { test: this.test };
                }
            }) class Ancestor extends Vue {
                @Data public test: string = "C";
            };

            const a = new Ancestor().$mount(document.createElement("div"));
            expect(a.$refs["child"]["field"]).to.eq("C");
        });
    });
}