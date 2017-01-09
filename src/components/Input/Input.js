/* eslint react/jsx-filename-extension:0*/

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import './Input_styles.css';
import { updateMessageList } from '../../containers/Chat/actions';


// TODO: move to a constants file?
const KEY_ENTER = 13;

class Input extends Component {
  static propTypes = {
    chatStyle: PropTypes.string,
    dispatch: PropTypes.func,
    socket: (props, propName) => {
      if (!(propName in props)) {
        throw new Error('socket must be set.');
      }
    },
  }


  constructor (props) {
    super(props);
    this.socket = props.socket;

    this.state = { messageBox: '' };
  }


  onKeyPress = (event) => {
    const { key, keyCode, shiftKey, ctrlKey, altKey, input } = event;
    console.log(`INPUT KEYPRESS ${key} (${keyCode}), SHIFT ${shiftKey}, CTRL ${ctrlKey}, ALT ${altKey}`);

    if (keyCode === KEY_ENTER) {
      if (!shiftKey) {
        console.log('SENDING MESSAGE ...');
        // Send data
        this.socket.emit('client:message', event.target.value);
        this.props.dispatch(updateMessageList(event.target.value));
        this.setState({ messageBox: '' });

        event.preventDefault();
      } else {
        // TODO: implement soft enter.
        // this.props.dispatch({ type: UI_SOFT_ENTER });
      }
    }

    this.socket.emit('client:typing');
  }

  handleChange = (e) => { this.setState({ messageBox: e.target.value }); }

  render() {
    const chatStyle = this.props.chatStyle;

    return (
      <textarea
        type="text"
        className={`Input_${chatStyle}`}
        placeholder="Type a message&hellip;"
        onKeyDown={this.onKeyPress}
        onChange={this.handleChange}
        value={this.state.messageBox}
      />
    );
  }
}

const mapStateToProps = state => ({ chatStyle: state.ui.chatStyle });
const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Input);
