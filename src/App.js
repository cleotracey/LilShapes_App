import React, { Component } from 'react';
import './App.css';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import Notifications, {notify} from 'react-notify-toast';
import img from './shapes.png';
import ScrollableAnchor from 'react-scrollable-anchor';
import AceEditor from 'react-ace';
import 'brace/theme/github';
import CustomDSLMode from './CustomDSLMode.js';
import ReactCursorPosition from 'react-cursor-position';

const exampleCode =
    'circle "circle1" radius: 40 color: red';

const exampleImg = <circle cx="50" cy="50" r="40" fill="red" />


const Coordinates = (props) => {
    const {
        position: {
            x = 0,
            y = 0
        } = {}
    } = props;

    return (
        <div className="coordinates">
            {`x: ${x}`}<br />
            {`y: ${y}`}<br />
        </div>)
};


class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            items: [{'svg': exampleImg}],
            code: exampleCode,
            drawing: exampleImg,
            error: null
        };
        this.renderDrawing = this.renderDrawing.bind(this);
    }

    componentDidMount(){

        const customMode = new CustomDSLMode();
        this.refs.aceEditor.editor.getSession().setMode(customMode);
    }

    /**
     Sends the current code input to the DSL parser.
     Fetches and renders the SVG image from the parser, or displays an error.
     **/
    renderDrawing() {
        var url = '/greeting';
        var data = {"code": this.state.code, "isDebug": false};

        console.log(JSON.stringify(data));

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json; charset=utf-8'}
        }).then(res => res.json())
            .then(response =>
                this.setState({drawing: this.parse(response)})
            )
            .catch(error => console.error('Error:', error));

    }

    parse(response) {

        console.log(response);

        if (response['error'] != null) {

            this.setState({
                error: <text x="0" y="15" fill="red">response['error']</text>
            });
        }

        else {
            this.setState({
                error: null
            });
            return response['svg'];
        }

    }

    createSVG() {
        return {__html: this.state.drawing}
    }

    createError() {
        return {__html: this.state.error}
    }

    render() {
        const options = {
            selectOnLineNumbers: true
        };
        return (
      <div className="App">
          <Notifications/>
          <div className="header">
              <img src={img} width="60" height="60" className="logo"/>
              <div className="title">Shapes</div>
              <a className='help-link' href='#section1'>Help</a>
          </div>
          <div className="wrapper">
          <div className="editor-container">
              <div className="editor-title">
                  Your code here
              </div>
              <AceEditor
                  ref="aceEditor"
                  mode="javascript"
                  theme="github"
                  onChange={code => this.setState({ code })}
                  name="editor"
                  fontSize={14}
                  value={this.state.code}
                  editorProps={{$blockScrolling: true}}
              />
              <AwesomeButton
                  className="run-code-button"
                  type="twitter"
                  action={this.renderDrawing}>
                  Draw my picture!
              </AwesomeButton>
          </div>
              <ReactCursorPosition className="react-cursor">
          <div className="drawing-wrapper">
              <div className="drawing-title">Your shapes here</div>
              <div className="drawing-canvas">
                  <svg height="100%" width="100%" dangerouslySetInnerHTML={this.state.error != null ? this.createError() : this.createSVG()}/>
              </div>
          </div>
                  <Coordinates/>
              </ReactCursorPosition>
      </div>
          <ScrollableAnchor id={'section1'}>
          <div className="documentation">
              <div className="docs-title">Help</div>
              <div className="docs-container"></div>
          </div>
          </ScrollableAnchor>
      </div>

    );
  }
}

export default App;
