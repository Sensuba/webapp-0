import React, { Component } from 'react';
import "./Slider.css";

export default class Slider extends Component {

  constructor () {

    super();
    this.ref = React.createRef();
    this.state = { value: 1 }
  }

  render() {

    return (
      <div ref={this.ref} className="sensuba-slider" onClick={e => {
        var offset = this.ref.current.offsetLeft;
        var width = this.ref.current.clientWidth;
        var value = (e.clientX - offset) / width;
        this.setState({ value });
        if (this.props.onChange)
          this.props.onChange(value);
      }}>
        <div className="sensuba-slider-bar"/>
        <div style={{left: (0.225 + this.state.value*5) + "em"}} className="sensuba-slider-pin"/>
      </div>
    );
  }
}