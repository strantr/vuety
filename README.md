# Vuety
TypeScript decorators for [Vue.js](https://vuejs.org/) 2.0. 

A set of TypeScript decorators allowing you to write your Vue.js components in a type-safe and more object-oriented manner.

## Installation

TODO: Publish to npm

`npm install vuety --save`

## Usage

- [Component](#component)
- [Lifecycle](#lifecycle)
- [Prop](#prop)
- [Data](#data)
- [Watch](#watch)
- [Render](#render)
- [On](#on)
- [Emit](#emit)

### Component
In order to create a new component you should create a class definition and decorate it with the `@Component` decorator.  
This class should extend the Vue object.  

**Example:**
```typescript
import { Component } from "vuety";
import * as Vue from "vue";
@Component({...options}) 
class MyComponent extends Vue {
    // Component members
}
````

### Lifecycle
Vue provides multiple [lifecycle events](https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks). You can utilise these by decorating a method with `@Lifecycle`. The method must be named the same as one of the lifecycle hooks.

**Example:**
```typescript
@Component({...options}) 
class MyComponent extends Vue {
    @Lifecycle protected created() { // Code to run on created }
    @Lifecycle protected mounted() { // Code to run on mounted }
}
````

### Prop
You can create props on your component using the `@Prop` decorator on a field.  
Default values will either be picked up by creating an instance of the component and inspecting the value of the field, or by specifying passing options to the decorator function.

*Note: It is recommended to use the property option default value method as the inspection technique causes a one-time performance hit as an instance of the component must be created to determine the default value of the property which is then cached.*

**Example:**
```typescript
@Component({...options}) 
class MyComponent extends Vue {
    // Value from option
    @Prop({
        default: "default value"
    }) public text1: string;

    // Value from inspection
    @Prop public text2: string = "default value";
}
````


### Data
Reactive data fields are created using the `@Data` decorator.  
Default values work similarly to [Props](#prop) in you can either specify a default value against the member or pass the value to the decorator.  
If passing the default value as an option it must be provided via a factory function, as shown in the example.

*Note: It is recommended to use the option default value method as the inspection technique causes a one-time performance hit as an instance of the component must be created to determine the default value is then cached.*

**Example:**
```typescript
@Component({...options}) 
class MyComponent extends Vue {
    // Value from factory
    @Data(() => "default value") public text1: string;

    // Value from inspection
    @Data public text2: string = "default value";
}
````

### Watch
Watches are created using the `@Watch` decorator. The decorator accepts a string which must be a member of the current component in order to watch that value.  
The watch function is sent the newValue, oldValue and the name of the watched property.

**Example:**
```typescript
@Component({...options}) 
class MyComponent extends Vue {
    @Data public field: string;

    @Watch("field") 
    protected fieldChanged(newValue: string, oldValue: string, watchee: keyof MyComponent) {
        //watchee === "field"
    }
}
````

### Render
You can specify the render function by creating a method with the name "render" and decorating it with `@Render`.  
This function must accept an argument of type `Vue.CreateElement` and return a `Vue.VNode`.  

**Example:**
```typescript
@Component({...options}) 
class MyComponent extends Vue {
    @Render protected render(create: Vue.CreateElement): Vue.VNode {
        return create("div", "test");
    }
}
````

### On
You can specify an event handler using the `@On` decorator. This will be raised whenever an event is emitted.  
You can either specify the name of the event in the decorators constructor or it will use the name of the handler method.  
The first parameter of the decorator function may also be a target selector being passed the current instance and returning a Vue component (e.g. $parent, $root, $refs["child"])  

**Example:**
```typescript
@Component({...options}) 
class MyComponent extends Vue {
    @On protected eventName(e : Event) {
        // Handle event "eventName"
    }
    @On("event2") protected handler(name: string) {
        // Handle "event2 "
    }
    @On(v => v.$parent) protected parentEvent() {
        // Handle "parentEvent" on the parent component
    }
    @On(v => v.$root, "rootEvent") protected handler2() {
        // Handle "rootEvent" on the root component
    }
}
````

### Emit
A method that raises an event can be created by adding the `@Emit` decorator to a function.  
The body of the function will be executed BEFORE the event is raised. If the body returns a callback function (e.g. `return ()=>{...}`) this will be called after the event is raised.  
You can either specify the name of the event in the decorators constructor or it will use the name of the method.  
The first parameter of the decorator function may also be a target selector being passed the current instance and returning a Vue component (e.g. $parent, $root, $refs["child"])  

**Example:**
```typescript
@Component({...options}) 
class MyComponent extends Vue {
    @Emit protected eventName(e : Event) {
        // Raise event "eventName"
    }
    @Emit("event2") protected handler(name: string) {
        // Raise "event2 "
    }
    @Emit(v => v.$parent) protected parentEvent() {
        // Raise "parentEvent" on the parent component
    }
    @Emit(v => v.$root, "rootEvent") protected handler2() {
        // Raise "rootEvent" on the root component
    }
    @Emit protected event2() {
        console.log("before event is emitted");
        return () => console.log("after event is emitted");
    }
}
````