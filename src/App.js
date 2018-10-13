import React, { Component } from 'react';
import './App.css';
import { highlight, languages } from 'prismjs/components/prism-core';
import Editor from 'react-simple-code-editor';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import Notifications, {notify} from 'react-notify-toast';


const exampleCode =
    `circle "circle1"
    radius: 40
    color: red
`;


const exampleImg = <svg height="100" width="100">
    <circle cx="50" cy="50" r="40" fill="red" />
</svg>

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            items: [{'svg': exampleImg}],
            code: exampleCode,
            drawing: exampleImg
        };
        this.renderDrawing = this.renderDrawing.bind(this);
    }

    componentDidMount(){
        fetch('https://749d7bea-94d5-4b69-a2df-70414f6dfb4e.mock.pstmn.io/post')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    items: json,
                    drawing: json['svg']
                })
            });
    }

    /**
     Sends the current code input to the DSL parser.
     Fetches and renders the SVG image from the parser, or displays an error.
     **/
    renderDrawing() {
        var url = 'https://749d7bea-94d5-4b69-a2df-70414f6dfb4e.mock.pstmn.io/post';
        var data = {data: this.state.code};

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(res => res.json())
            .then(response =>
                //this.setState({drawing: this.parse(response)})
                console.log(response)
            )
            .catch(error => console.error('Error:', error));
    }

    parse(response) {

        // Empty or undefined response from server.
        if (response === null || response[0] === null ||
            response === 'undefined' || response[0] === 'undefined'
            || !response[0].hasOwnProperty('svg')) {
            return <svg height="400" width="400">
                <text>"Oops! Something went wrong."</text>
            </svg>

        }
        // Error thrown from server.
        if (response[0].hasOwnProperty('error')) {
            return <svg height="400" width="400">
                <text>{response[0]['error']}</text>
            </svg>
        }

        // Valid SVG to render drawing.
        else {
            return response[0]['svg'];
        }
    }


    render() {

        return (
      <div className="App">
          <Notifications/>
          <div className="header">LIL SHAPES</div>
          <div className="wrapper">
          <div className="editor-container">
              <div className="editor-title">
                  Your code here
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
                  action={this.renderDrawing}>
                  Draw my picture!
              </AwesomeButton>
          </div>
          <div className="drawing-wrapper">
              <div className="drawing-title">Your shapes here</div>
              <div className="drawing-canvas">
                  {this.state.drawing}
              </div>
          </div>
      </div>
      </div>
    );
  }
}

export default App;
