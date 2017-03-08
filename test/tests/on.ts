import { expect } from "chai";
import { Component, On } from "../../src";
import * as Vue from "vue";

export default function () {
    describe("On", () => {
        it("Can handle events by naming convention", () => {
            let result = 0;
            @Component({
                created() {
                    this.$emit("eventName");
                }
            }) class A extends Vue {
                @On protected eventName() {
                    result++;
                }
            }
            new A();
            expect(result).to.eq(1);
        });
        it("Can handle events by name", () => {
            let result = 0;
            @Component({
                created() {
                    this.$emit("eventName");
                }
            }) class A extends Vue {
                @On("eventName") protected test() {
                    result++;
                }
            }
            new A();
            expect(result).to.eq(1);
        });
        it("Can handle events on target component by naming convention", async () => {
            let result = 0;

            @Component({
                created() {
                    this.$root.$emit("eventName");
                },
                template: "<div/>"
            }) class A extends Vue {
                @On(v => v.$root) protected eventName() {
                    result++;
                }
            }

            @Component({
                components: {
                    "child": A
                },
                template: "<child/>"
            }) class Root extends Vue {
            }
            await new Root().$mount(document.createElement("div")).$nextTick();
            expect(result).to.eq(1);
        });
        it("Can handle events on target component by name", async () => {
            let result = 0;

            @Component({
                created() {
                    this.$root.$emit("eventName");
                },
                template: "<div/>"
            }) class A extends Vue {
                @On(v => v.$root, "eventName") protected test() {
                    result++;
                }
            }

            @Component({
                components: {
                    "child": A
                },
                template: "<child/>"
            }) class Root extends Vue {
            }
            await new Root().$mount(document.createElement("div")).$nextTick();
            expect(result).to.eq(1);
        });
        it("Handlers are bound to the instance", () => {
            let result = 0;
            @Component({
                created() {
                    this.$emit("eventName");
                },
                props: {
                    "test": {
                        default: 123
                    }
                }
            }) class A extends Vue {
                @On protected eventName() {
                    result = this["test"];
                }
            }
            new A();
            expect(result).to.eq(123);
        });
        it("Can be passed arguments", () => {
            let result = "";
            @Component({
                created() {
                    this.$emit("eventName", "hello", { complex: "world" });
                }
            }) class A extends Vue {
                @On() protected eventName(arg1: string, arg2: {}) {
                    result = arg1 + " " + arg2["complex"];
                }
            }
            new A();
            expect(result).to.eq("hello world");
        });
    });
}