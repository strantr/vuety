import { expect } from "chai";
import { Component, Data, Prop, Watch } from "../../src";
import Vue from "vue";

export default function () {

    describe("Watch", () => {
        it("Can watch props", async () => {
            let result = "";
            @Component({
                template: "<b>{{p}}</b>"
            }) class Child extends Vue {
                @Prop public p: string;

                @Watch("p")
                protected pChanged(value: string, oldValue: string) {
                    result += value + "," + oldValue + ",";
                }
            };

            @Component({
                template: `<b><v :p="test"/></b>`,
                components: {
                    v: Child
                }
            }) class A extends Vue {
                @Data public test: string = "hello";
            };
            const a = new A().$mount(document.createElement("div"));
            a.test = "d";
            await a.$nextTick();
            expect(result).to.eql("d,hello,");
        });

        it("Can watch data", async () => {
            let result = "";
            @Component({
                template: `<b>{{test}}</b>`,
            }) class A extends Vue {
                @Data public test: string = "hello";

                @Watch("test")
                protected testChanged(value: string, oldValue: string) {
                    result += value + "," + oldValue + ",";
                }
            };
            const a = new A().$mount(document.createElement("div"));
            a.test = "d";
            await a.$nextTick();
            expect(result).to.eql("d,hello,");
        });

        it("Is passed the property name", async () => {
            let result = "";
            @Component({
                template: `<b>{{test}}</b>`,
            }) class A extends Vue {
                @Data public test: string = "hello";

                @Watch("test")
                protected testChanged(value: string, oldValue: string, name: string) {
                    result = name;
                }
            };
            const a = new A().$mount(document.createElement("div"));
            a.test = "d";
            await a.$nextTick();
            expect(result).to.eql("test");
        });
    });
}