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
import rectImg from './rect-example.png';
import Checkbox from 'rc-checkbox';

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
            items: [],
            code: '',
            drawing: '',
            error: null,
            isDebug: false
        };
        this.fetchDrawing = this.fetchDrawing.bind(this);
        this.toggleDebugMode = this.toggleDebugMode.bind(this);
    }

    componentDidMount(){

        const customMode = new CustomDSLMode();
        this.refs.aceEditor.editor.getSession().setMode(customMode);
    }

    /**
     Sends the current code input to the DSL parser.
     Fetches and renders the SVG image from the parser, or displays an error.
     **/
    fetchDrawing() {
        var url = '/greeting';
        var data = {"code": this.state.code, "isDebug": this.state.isDebug};

        console.log(JSON.stringify(data));

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json; charset=utf-8'}
        }).then(res => res.json())
            .then(response =>
                this.renderDrawing(response)
            )
            .catch(error => console.error('Error:', error));
    }

    renderDrawing(response) {

        console.log(response);

        if (response['error'] != null) {

            this.setState({
                error: response['error']
            });
        }

        else if (response['svg'] === "") {
            this.setState({
                error: 'Oops! You haven\'t defined a proper shape to draw.'
            });
        }

        else {
            this.setState({
                drawing: response['svg'],
                error: null
            });
        }
    }

    createSVG() {
        return {__html: this.state.drawing}
    }



    toggleDebugMode = (e) => {
        console.log(e.target.checked);
        this.setState({
           isDebug: e.target.checked
        });
        console.log(this.state.isDebug)
    };


    // toggleDebugMode = () => {
    //     console.log('before togging' + this.state.isDebug);
    //     this.setState(prevState => ({
    //         isDebug: !prevState.isDebug
    //     }));
    //
    //     console.log('after togging' + this.state.isDebug);
    //
    // };

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
              <div>
                  Debug Mode
              </div><Checkbox
                name="debug mode"
                onChange={this.toggleDebugMode}/>
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
              <div className="error-console">
                  {this.state.error}
              </div>
              <AwesomeButton
                  className="run-code-button"
                  type="twitter"
                  action={this.fetchDrawing}>
                  Draw my picture!
              </AwesomeButton>
          </div>
              <ReactCursorPosition className="react-cursor">
          <div className="drawing-wrapper">
              <div className="drawing-title">Your shapes here</div>
              <div className="drawing-canvas">
                  <svg height="100%" width="100%" dangerouslySetInnerHTML={this.createSVG()}/>
              </div>
          </div>
                  <Coordinates/>
              </ReactCursorPosition>
      </div>
          <ScrollableAnchor id={'section1'}>
          <div className="documentation">
              <div className="docs-title">Here's an example of code you can input to draw a picture.
                  Copy and paste it into the editor and try it out for yourself!
                  <div className="docs-description">Simple Rectangle </div>
                  <div className="example-code">
                      <ul>// This is rectangle</ul>
                      <ul>rectangle "r1"</ul>
                      <ul>color: turquoise</ul>
                      <ul>height: 75</ul>
                      <ul>width: 100</ul>
                      <ul>draw r1 at 10, 10</ul>
                  </div>
                  <div className="example-pic">
                      <div className="docs-description">Result: </div>
                      <img src={rectImg} width="100" height="75" className="rect-img"/>
                  </div>
              </div>
          </div>
          </ScrollableAnchor>
      </div>

    );
  }
}

export default App;
