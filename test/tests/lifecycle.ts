import { expect } from "chai";
import { Component, Lifecycle } from "../../src";
import * as Vue from "vue";

export default function () {

    describe("Lifecycle", () => {
        it("Should populate options", () => {
            @Component() class A extends Vue { }
            expect(new A().$options).to.not.have.property("beforeCreate");

            @Component() class B extends Vue {
                @Lifecycle protected beforeCreate() {
                }
            };
            expect(new B().$options).to.have.property("beforeCreate");
        });

        it("Should allow multiple via options and decorators handlers", () => {
            let res = "";
            @Component({
                beforeCreate() {
                    res += "1";
                }
            }) class B extends Vue {
                @Lifecycle protected beforeCreate() {
                    res += "2";
                }
            };
            new B();
            expect(res).to.eql("12");
        });

        it("Should be called via lifecycle events", () => {
            @Component({
                template: "<div/>"
            }) class A extends Vue {
                public field: string;

                @Lifecycle() protected beforeCreate() {
                    this.field = (this.field || "") + "a";
                }
                @Lifecycle protected created() {
                    this.field = (this.field || "") + "b";
                }
                @Lifecycle protected beforeMount() {
                    this.field = (this.field || "") + "c";
                }
                @Lifecycle protected mounted() {
                    this.field = (this.field || "") + "d";
                }
            }

            const a = new A();
            expect(a.field).to.equal("ab");
            const el = document.createElement("div");
            a.$mount(el);
            expect(a.field).to.equal("abcd");
        });
    });
}