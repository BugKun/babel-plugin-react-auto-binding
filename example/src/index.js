import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import "./index.scss"


class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            text: "abc"
        }

    }

    setTextVal(e) {
        this.setState({
            text: e.target.value
        });
    }

    render() {
        const { text } = this.state;

        return (
           <div className="main">
               <h4>React auto bind example：</h4>
               <div>
                    Text:
                    <input type="text" value={text} onChange={this.setTextVal}/>
               </div>
           </div>
        )
    }
}



ReactDOM.render(<App/>, document.getElementById('app'));