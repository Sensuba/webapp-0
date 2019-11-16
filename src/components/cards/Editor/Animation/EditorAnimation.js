import React, { Component } from 'react';
import Card from '../../Card';
//import { Form, Input, FormGroup, Label } from 'reactstrap';
import { Button } from 'reactstrap';
import AnimationBox from './AnimationBox';
//import Phychic from '../../../../game/view/animation/Phychic';

export default class EditorAnimation extends Component {

  addAnimation () {

    this.props.card.animations = this.props.card.animations || [];
    this.props.card.animations.push({ type: "effect", value: { animation: "silence", audio: "silence" } });
    this.props.update(this.props.card.animations);
  }

  deleteAnimation (no) {

    this.props.card.animations.splice(no, 1);
    if (this.props.card.animations.length === 0)
      delete this.props.card.animations;
    this.props.update(this.props.card.animations);
  }

  updateAnimation (no, anim) {

    this.props.card.animations[no] = anim;
    this.props.update(this.props.card.animations);
  }
  
  render() {

    var animations = this.props.card.animations || [];

    return (
      <div className={this.props.className}>
        <div className="half-section">
          <div className="editor-box">
          { animations.map((anim, key) => <AnimationBox src={anim} update={anim => this.updateAnimation(key, anim)} delete={() => this.deleteAnimation(key)} no={key} key={key}/>) }
          <Button className="modern-sensuba-button" onClick={() => this.addAnimation()}>Add</Button>
          </div>
        </div>
        <div className="half-section">
          <div className="animation-preview">
            <div className="animation-grid">
              <div className="animation-grid-line animation-grid-1"/>
              <div className="animation-grid-line animation-grid-2"/>
              <div className="sensuba-card-view">
                <Card src={this.props.model}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}