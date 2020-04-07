import React, { Component } from 'react';
import "./EndTurn.css";

export default class EndTurn extends Component {

  constructor (props) {

    super(props);
    this.state = {timer: null};
    window.resetTimer = this.resetTimer.bind(this);
  }

  componentWillUnmount () {

    delete window.resetTimer;
  }

  resetTimer (timer = 150) {

    if (this.interval)
      clearInterval(this.interval);
    this.setState({timer});
    this.interval = setInterval(() => this.decrement(), 1000);
  }

  decrement () {

    if (!this.state.timer) {
      if (this.interval)
        clearInterval(this.interval);
      return;
    }
    this.setState({timer: this.state.timer-1});
  }

  render () {

    return (
      <div 	className={"sensuba-end-turn " + (this.props.locked ? "sensuba-end-turn-locked" : "sensuba-end-turn-active") + (this.props.extra ? " sensuba-end-turn-extra" : "")}
      		onClick={this.props.locked ? () => {} : () => this.props.endTurn()}>
      		<div className="sensuba-end-turn-circle">
      			{
      				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(no => <div id={"sensuba-end-turn-dot-" + no} className="sensuba-end-turn-dot" key={no}/>)
      			}
      		</div>
      		<div className="sensuba-end-turn-text">{this.props.locked ? "" : (this.props.extra ? "Tour bonus" : "Fin du tour")}</div>
          <div className="sensuba-end-turn-timer">{this.props.timer && this.state.timer !== undefined && this.state.timer <= 60 ? this.state.timer : ""}</div>
      	</div>
    )
  }
}