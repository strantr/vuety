import { expect } from "chai";
import { Component, Lifecycle, Emit } from "../../src";
import * as Vue from "vue";

export default function () {
    describe("Emit", () => {
        it("Can raise events by naming convention", () => {
            let result = false;
            @Component() class A extends Vue {
                @Emit protected testEvent() { }

                @Lifecycle protected beforeCreate() {
                    this.$on("testEvent", () => {
                        result = true;
                    });
                }

                @Lifecycle protected created() {
                    this.testEvent();
                }
            }
            new A();
            expect(result).to.eq(true);
        });

        it("Can raise events by name", () => {
            let result = false;
            @Component() class A extends Vue {
                @Emit("testEvent") protected raiseEvent() { }

                @Lifecycle protected beforeCreate() {
                    this.$on("testEvent", () => {
                        result = true;
                    });
                }

                @Lifecycle protected created() {
                    this.raiseEvent();
                }
            }
            new A();
            expect(result).to.eq(true);
        });

        it("Can raise events on target component by naming convention", async () => {
            let result = false;

            @Component({
                created() {
                    this["eventName"]();
                },
                template: "<div/>"
            }) class A extends Vue {
                @Emit(v => v.$root) protected eventName() { }
            }

            @Component({
                components: {
                    "child": A
                },
                template: "<child/>"
            }) class Root extends Vue {
                @Lifecycle protected beforeCreate() {
                    this.$on("eventName", () => {
                        result = true;
                    });
                }
            }
            await new Root().$mount(document.createElement("div")).$nextTick();
            expect(result).to.eq(true);
        });

        it("Can raise events on target component by name", async () => {
            let result = false;

            @Component({
                created() {
                    this["eventName"]();
                },
                template: "<div/>"
            }) class A extends Vue {
                @Emit(v => v.$root, "testEvent") protected eventName() { }
            }

            @Component({
                components: {
                    "child": A
                },
                template: "<child/>"
            }) class Root extends Vue {
                @Lifecycle protected beforeCreate() {
                    this.$on("testEvent", () => {
                        result = true;
                    });
                }
            }
            await new Root().$mount(document.createElement("div")).$nextTick();
            expect(result).to.eq(true);
        });

        it("Invokes method body before the event", async () => {
            let result = "";
            @Component({
                template: "<div/>"
            }) class Root extends Vue {
                @Lifecycle protected beforeCreate() {
                    this.$on("eventName", () => {
                        result += "b";
                    });
                    this["eventName"]();
                }

                @Emit(v => v.$root) protected eventName() {
                    result += "a";
                }
            }
            await new Root().$mount(document.createElement("div")).$nextTick();
            expect(result).to.eq("ab");
        });

        it("Invokes returned callback after the event", async () => {
            let result = "";
            @Component({
                template: "<div/>"
            }) class Root extends Vue {
                @Lifecycle protected beforeCreate() {
                    this.$on("eventName", () => {
                        result += "b";
                    });
                    this["eventName"]();
                }

                @Emit(v => v.$root) protected eventName() {
                    result += "a";
                    return () => result += "c";
                }
            }
            await new Root().$mount(document.createElement("div")).$nextTick();
            expect(result).to.eq("abc");
        });
        it("Can pass arguments", () => {
            let result = "";
            @Component() class A extends Vue {
                @Emit protected testEvent(v: string) { }

                @Lifecycle protected beforeCreate() {
                    this.$on("testEvent", (v: string) => {
                        result = v;
                    });
                }

                @Lifecycle protected created() {
                    this.testEvent("test");
                }
            }
            new A();
            expect(result).to.eq("test");
        });
    });
}