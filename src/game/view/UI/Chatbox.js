import React, { Component } from 'react';
import "./Chatbox.css";
import { Input } from 'reactstrap';
import {chatMessage, sendChat} from '../../Chat';

export default class Chatbox extends Component {

	constructor (props) {

		super(props);
		this.count = 0;
		this.state = {
			messages: []
		}

		this.props.master.addMessage = (message) => this.add(message);
	}

	add (message) {

		const visible = chatMessage(message);
		if (!visible) return;
		var id = this.count++;
		this.state.messages.push(Object.assign({id}, visible));

		var history = document.getElementById("sensuba-chat-history");
		this.setState( { messages: this.state.messages } , () => history.scrollTop = history.scrollHeight);
		setTimeout(() => {
			var messages = this.state.messages.filter(m => m.id !== id);
			this.setState( { messages: messages } );
		}, 120000)
	}

	submit (e) {

		var el = document.getElementById("sensuba-chat-input");
		e.preventDefault();
		const result = sendChat(this.props.master, el.value);
		this.setState({error: result.ok ? null : result.error});
		if (result.ok) el.value = "";
	}

  render () {

    return (
    	<div className="sensuba-chatbox">
    		<div id="sensuba-chat-history" className="sensuba-chat-history">
    		{
    			this.state.messages.map(m => 
    				<div key={m.id} className="sensuba-chat-message">
    					{ m.from ? <div className="sensuba-chat-message-author">{ m.from + ":" }</div> : <span/> }
    					<div className="sensuba-chat-message-text">{ m.text }</div>
    				</div>
    			)
    		}
    		</div>
    		<form autoComplete="off" onSubmit={e => this.submit(e)}>
    			<Input id="sensuba-chat-input" className="sensuba-chat-input" maxLength="120" defaultValue=""/>
    		</form> 
            {this.state.error && <div role="alert">{this.state.error}</div>}
    	</div>
    )
  }
}
