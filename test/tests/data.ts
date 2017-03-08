import { expect } from "chai";
import { Component, Data } from "../../src";
import * as Vue from "vue";

export default function () {
    describe("Data", () => {

        it("Should be empty by default", () => {
            @Component() class A extends Vue {
            }
            expect(new A()["$data"]).to.eql({});
        });

        it("Populates options", () => {
            @Component() class A extends Vue {
                @Data public test: string;
            }
            expect(new A()["$data"]).to.eql({
                test: undefined
            });
        });

        it("Populates options via empty factory", () => {
            @Component() class A extends Vue {
                @Data() public test: string;
            }
            expect(new A()["$data"]).to.eql({
                test: undefined
            });
        });

        it("Allows default value via factory", () => {
            @Component() class A extends Vue {
                @Data(() => "a")
                public test: string;
            }
            expect(new A()["$data"]).to.eql({
                test: "a"
            });
        });

        it("Allows default value via field value", () => {
            @Component() class A extends Vue {
                @Data public test: string = "b";
            }
            expect(new A()["$data"]).to.eql({
                test: "b"
            });
        });

        it("Factory default overrides field default", () => {
            @Component() class A extends Vue {
                @Data(() => "d")
                public test: string = "c";
            }
            expect(new A()["$data"]).to.eql({
                test: "d"
            });
        });

        it("Can be assigned to", () => {
            @Component() class A extends Vue {
                @Data public test: string = "c";
            }
            const a = new A();
            a.test = "e";
            expect(a.test).to.eql("e");
        });

        it("Can be used for binding", async () => {
            @Component({
                template: "<div>{{test}}</div>"
            }) class A extends Vue {
                @Data public test: string = "c";
            }
            const a = new A().$mount(document.createElement("div"));
            expect(a.$el.outerHTML).to.eql("<div>c</div>");
            a.test = "d";
            await a.$nextTick();
            expect(a.$el.outerHTML).to.eql("<div>d</div>");
        });
    });
}