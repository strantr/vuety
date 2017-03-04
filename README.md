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
