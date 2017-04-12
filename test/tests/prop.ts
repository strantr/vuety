import { expect } from "chai";
import { Component, Prop, Data } from "../../src";
import Vue from "vue";

export default function () {
    Prop.warn = false;

    describe("Prop", () => {

        it("Should be empty by default", () => {
            @Component() class A extends Vue {
            }
            expect(new A()["$props"]).to.eql(undefined);
        });

        it("Populates options", () => {
            @Component() class A extends Vue {
                @Prop public test: string;
            }
            expect(new A()["$props"]).to.eql({
                test: undefined
            });
        });

        it("Populates options via Prop factory", () => {
            @Component() class A extends Vue {
                @Prop() public test: string;
            }
            expect(new A()["$props"]).to.eql({
                test: undefined
            });
        });

        it("Allows default value via PropOpts", () => {
            @Component() class A extends Vue {
                @Prop({ default: "a" })
                public test: string;
            }
            expect(new A().test).to.eql("a");
        });

        it("Allows default value via PropOpts factory", () => {
            @Component() class A extends Vue {
                @Prop({ default: () => "a" })
                public test: string;
            }
            expect(new A().test).to.eql("a");
        });

        it("Allows default value via field value", () => {
            @Component() class A extends Vue {
                @Prop public test: string = "b";
            }
            expect(new A().test).to.eql("b");
        });

        it("PropOpts overrides field default", () => {
            @Component() class A extends Vue {
                @Prop({
                    default: "d"
                })
                public test: string = "c";
            }
            expect(new A().test).to.eql("d");
        });

        it("Factory default overrides field default", () => {
            @Component() class A extends Vue {
                @Prop({
                    default: () => "d"
                })
                public test: string = "c";
            }
            expect(new A().test).to.eql("d");
        });

        it("Can be used for binding", async () => {
            @Component({
                template: "<div>{{test}}</div>"
            }) class A extends Vue {
                @Prop public test: string = "c";
            }
            const a = new A().$mount(document.createElement("div"));
            expect(a.$el.outerHTML).to.eql("<div>c</div>");
        });

        it("Can be passed in", async () => {
            @Component({
                template: "<span>{{p}}</span>"
            }) class Child extends Vue {
                @Prop public p: string;
            };

            @Component({
                template: `<div><test :p="test"/></div>`,
                components: {
                    test: Child
                }
            }) class A extends Vue {
                @Data public test: string = "hello";
            };
            const a = new A().$mount(document.createElement("div"));
            expect(a.$el.outerHTML).to.eql("<div><span>hello</span></div>");
            a.test = "d";
            await a.$nextTick();
            expect(a.$el.outerHTML).to.eql("<div><span>d</span></div>");
        });
    });
}