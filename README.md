# Vuety
TypeScript decorators for [Vue.js](https://vuejs.org/) 2.*. 

A set of TypeScript decorators allowing you to write your Vue.js components in a type-safe and more object-oriented manner.

## Installation

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
- [Methods](#methods)
- [Computed Properties](#computed-properties)
- [Provide](#provide)
- [Inject](#inject)
- [Custom Decorators](#custom-decorators)

### Component
In order to create a new component you should create a class definition and decorate it with the `@Component` decorator.  
This class should extend the Vue object.  
If no name is provided the name of the class will be passed as the "name" option to the Vue constructor.

**Example:**
```typescript
import { Component } from "vuety";
import Vue from "vue";
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

### Methods
All methods on the component will automatically be exposed on the Vue object, you do not need to do anything special in order to use them, they will automatically be bound to the component instance.

**Example:**
```typescript
@Component({...options}) 
class MyComponent extends Vue {
    public test() {
        console.log(this); //instance of MyComponent
    }
}
````

### Computed Properties
Computed properties are created using getters and setters on the class.  
*Note: Set only properties are not allowed, there must always be a getter.*

**Example:**
```typescript
@Component({...options}) 
class MyComponent extends Vue {
    public get test() {
        return ...;
    }
    public set test(value: ...) {
        ...
    }
}
````

### Provide
[Provided dependencies](https://vuejs.org/v2/api/#provide-inject) can be specified using the `@Provide` decorator.
The decorator is valid on [@Prop](#prop), [@Data](#data) and [Computed](#computed-properties) members.
Fields can be aliased by passing a name to the Provide decorator, the when injecting the dependency use the aliased name.

**Example:**
```typescript
@Component({...options}) 
class Ancestor extends Vue {
    @Provide public get test() {
        return ...;
    }
    @Provide @Prop public prop : string;
    @Provide("alias") @Data public data : string; // Provide a field with a different alias
    
    // Inject a field, or allow to be specified via a Prop and then re-provide that value
    @Provide @Inject @Prop public thing : {};
}
````

### Inject
[Injected dependencies](https://vuejs.org/v2/api/#provide-inject) can be specified using the `@Inject` decorator.
The decorator should be used on standard class fields, however you may also use them on `@Prop` members in order to allow the property to be specified overriding the provided value.
Fields can be aliased by passing a name to the Provide decorator, the when injecting the dependency use the aliased name.

**Example:**
```typescript
@Component({...options}) 
class Descendant extends Vue {
    @Inject test() : {};
    @Inject @Prop prop: string; // Allow the provided dependency to be overridden by a prop
    @Inject("alias") @Data public data : string; // Inject a field from a dependency with a different name
}
````

### Custom Decorators
You can use the Vuety method to create custom decorators to perform logic upon the creation of new components.
```
import { Vuety } from "vuety";
```
You should create a [standard decorator](https://www.typescriptlang.org/docs/handbook/decorators.html), either as a factory or function (or both) and from within you
function call:
```
// Target being the decorators target
Vuety("Unique_id_for_decorator", target)((v : VuetyCallbackData) => {
  // Decorator logic
});
```
The `VuetyCallbackData` object provides a few useful members:
- `getDefault` - Gets the default value of the specified member
- `options` - The Vue [component options object](https://vuejs.org/v2/api/#Options-Data) that can be used to extend the object
- `proto` - The protoype of the Vue instance being created
- `storeData` - Used to extend the Vue data object with an additional element, must be passed as a factory.

All Vuety decorators other than `@Component` are written using the exposed `Vuety` function, for better understanding of how to implement your own it is best to simpy look at the source of one of the standard decorators.
