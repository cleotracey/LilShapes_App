import React, { Component } from 'react';
import './App.css';
import { highlight, languages } from 'prismjs/components/prism-core';
import Editor from 'react-simple-code-editor';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import Notifications, {notify} from 'react-notify-toast';


const code = `function add(a, b) {
  return a + b;
}
`;

const img = <svg height="100" width="100">
    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            items: [{'name': 'cleeooo'}],
            code: code,
            drawing: ''
        };
        this.fetchDrawing = this.fetchDrawing.bind(this);
    }

    componentDidMount(){
        // fetch('https://afd295a2-049f-4833-9935-875c90e4bd25.mock.pstmn.io/demo')
        //     .then(res => res.json())
        //     .then(json => {
        //         this.setState({
        //             items: json,
        //             drawing: json[0]['name']
        //         })
        //     });
    }

    // Returns the fetched image, or renders an error.
    fetchDrawing() {
        var url = 'https://a765f506-35a5-4c86-9cff-de1b16a91a83.mock.pstmn.io/he';
        var data = {data: this.state.code};

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(res => res.json())
            .then(response =>
                console.log(response)
                //this.setState({items: response})
            )
            .catch(error => console.error('Error:', error));
           this.setState ({drawing: this.state.items[0]['name']});
    }

    render() {

        return (
      <div className="App">
          <Notifications/>
          <div className="header">draw lil shapes</div>
          <div className="editor-container">
              <div className="editor-title">
                  Your code here.
              </div>
          <Editor
              className="editor"
              value={this.state.code}
              onValueChange={code => this.setState({ code })}
              highlight={code => highlight(code, languages.js)}
              padding={10}
              style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 14,
              }}
          />
              <AwesomeButton
                  className="run-code-button"
                  type="twitter"
                  action={this.fetchDrawing}>
                  Draw my picture!
              </AwesomeButton>
          </div>
          <div className="drawing-wrapper">
              <div className="drawing-title">your drawing here</div>
              <div className="drawing-canvas">
                  {this.state.drawing}
              </div>
          </div>
      </div>
    );
  }
}

export default App;
