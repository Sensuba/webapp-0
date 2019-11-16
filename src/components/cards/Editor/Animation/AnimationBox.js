import React, { Component } from 'react';
import { Input, FormGroup, Label, Button } from 'reactstrap';

export default class AnimationBox extends Component {
  
  render() {

    var src = this.props.src;

    var changeType = type => {

      src.type = type;
      switch(type) {
      case "effect":
        src.value = { animation: "silence", audio: "silence" };
        break;
      case "wait":
        src.value = { time: "1000" }
        break;
      default: break;
      }
      this.props.update(src);
    }

    var changeValue = (datatype, value) => {

      src.value[datatype] = value;
      this.props.update(src);
    }

    return (
      <div className="animation-box">
        <div className="animation-box-title">{"Animation [" + this.props.no + "]"}</div>
        <Button onClick={() => this.props.delete()} className="animation-box-delete modern-sensuba-button">Delete</Button>
        <FormGroup row>
          <Label for="form-anim-type">Type</Label>
          <Input type="select" name="select" id="form-anim-type" defaultValue={src.type} onChange={e => {changeType(e.target.value); e.preventDefault();}}>
            <option value="effect">Effect</option>
            <option value="wait">Wait</option>
          </Input>
        </FormGroup>
        {
          src.type === "effect" ?
          <div>
            <FormGroup row>
              <Label for="form-anim-anim">Animation</Label>
              <Input type="select" name="select" id="form-anim-anim" defaultValue={src.value.animation} onChange={e => changeValue("animation", e.target.value)}>
                <option value="silence">Silence</option>
              </Input>
            </FormGroup>
            <FormGroup row>
              <Label for="form-anim-audio">Audio</Label>
              <Input type="select" name="select" id="form-anim-audio" defaultValue={src.value.audio} onChange={e => changeValue("audio", e.target.value)}>
                <option value="silence">Silence</option>
              </Input>
            </FormGroup>
          </div>
          :
          <div>
            <FormGroup row>
              <div className="half-section"><Input type="text" id="form-anim-time" defaultValue={src.value.time} onChange={e => changeValue("time", e.target.value)}/></div>
              <div className="half-section"><Label for="form-anim-time">Milliseconds</Label></div>
            </FormGroup>
          </div>
        }
        
      </div>
    );
  }
}