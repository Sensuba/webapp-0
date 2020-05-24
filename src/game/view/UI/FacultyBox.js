import React, { Component } from 'react';
import Faculty from "./Faculty.js";
import "./Faculty.css";

export default class FacultyBox extends Component {

  render () {

    return (
    	<div className={"faculty-box faculty-box-" + this.props.faculties.length}>
      {
        this.props.faculties.map((f, i) => <Faculty key={i} src={f} select={this.props.select} master={this.props.master}/>)
      }
      {
      	this.props.secret ?
      	<div className="faculty-secret-params">
      		{ [0, 1, 2, 3, 4, 5].map(i => <div key={i}
              onClick={e => { this.props.select({ id: { type: "parameter", no: i } }); }}
              className="faculty-secret-param">
              {(i === 0 ? "-" : i)}
            </div> ) }
      	</div> : <span/>
      }
		</div>
    )
  }
}