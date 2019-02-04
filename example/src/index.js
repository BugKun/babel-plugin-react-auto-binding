import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import "./index.scss"


class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            view: false,
            text: ''
        }

    }

    setTextVal(e) {
        this.setState({
            text: e.target.value
        });
    }

    handleClick() {
        this.setState({
            view: true
        });
    }

    render() {
        const { text, view } = this.state;

        return (
           <div className="main">
               <h4>The example of <i>React auto binding</i>：</h4>
               <div>
                    Text: 
                    <input type="text" value={text} onChange={this.setTextVal}/>
               </div>
               <br />
               <div>
                    <button onClick={this.handleClick}>Click me</button>
               </div>
               <br />
                {
                   (view) && <div>React auto binding succeeded</div>
                }
           </div>
        )
    }
}



ReactDOM.render(<App/>, document.getElementById('app'));