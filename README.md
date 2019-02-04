# babel-plugin-react-auto-binding
Babel plugin for React component to take event handler to bind context automatically.

## Installation

```bash
$ npm install babel-plugin-react-auto-binding --save-dev
```

## Motivation

When you are building a React component, you have to be careful about event handler. In component, class methods are not bound by default. If you forget to bind `this.handleClick` and pass it to onClick, this will be undefined when the function is actually called.

Therefore, you have to bind the event handler in constructor method, like this,

``` jsx
class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      view: false
    }
    this.handleClick = this.handleClick.bind(this) // binding method
  }
  handleClick(e) {
    this.setSate({
      view: true
    })
  }
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Click me</button>
        <br />
        {
            (view) && <div>React auto binding succeed</div>
        }
      </div>
    )
  }
}

```

Oh shit! It's so troublesome.
So, this plugin is born to resolve these thorny problems.
With this plugin, you can easily code without caring about context.

Instead,

``` jsx
class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      view: false
    }
    // needn't binding method
  }
  
  handleClick(e) {
    this.setSate({
      view: 'value'
    })
  }
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Click me</button>
        <br />
        {
            (view) && <div>React auto binding succeed</div>
        }
      </div>
    )
  }
}
```

## Usage

Write via [babelrc](https://babeljs.io/docs/usage/babelrc/).

``` json
// .babelrc
{
  "plugins": [
    "react-auto-binding"
  ]
}

```

## Warning

This plugin check the spuerClass after the `extends` in classDeclaration to know whether it is `React component` or not.

Only supported `React.Component`, `React.PureComponent`, `Component`, `PureComponent`

Do not use other words instead of it, like this,

``` jsx
import {Component as ReactComponent} from "react"

class App extends ReactComponent{
  //...
}
```
