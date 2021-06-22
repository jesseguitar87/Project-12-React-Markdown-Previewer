const Component = React.Component;
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;

const UPDATE = 'UPDATE';

const renderer = new marked.Renderer();

// Allows line break with return button
marked.setOptions({
  breaks: true,
});

// Action Creator
const updateText = (text) => { 
  return { type: UPDATE, payload: text } 
}

const initialState = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`;

// Reducer
const textReducer = (state=initialState, action) => { 
  switch(action.type){
    case UPDATE: 
      return action.payload;
    default: 
      return state;
  }
}

// Presentational Component
class Input extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.props.updateText(event.target.value);
  }
  render() {
    return (
      <div className="col-sm">
        <textarea rows="20" id="editor" className="form-control" onChange={this.handleChange} value={this.props.text}></textarea>
      </div>
    )
  }
}

class Output extends Component {
  constructor(props) {
    super(props);
    this.createMarkup = this.createMarkup.bind(this);
  }
  createMarkup() {
    return {
      __html: marked(this.props.text, {sanitize: true})
    }
  }
  render() {
    return (
      <div id="preview" className="col-sm" dangerouslySetInnerHTML={ this.createMarkup() }></div>
    )
  }
}

const mapStateToProps = (state) => { return { text: state } }
const mapDispatchToProps = (dispatch) => Redux.bindActionCreators({updateText}, dispatch)
const InputContainer = connect(mapStateToProps, mapDispatchToProps)(Input);
const OutputContainer = connect(mapStateToProps, null)(Output);

const store = Redux.createStore(textReducer);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <InputContainer />
      <OutputContainer />
    </div>
  </Provider>,
  document.getElementById('app')
);
