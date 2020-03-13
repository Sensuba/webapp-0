import React, { Component } from 'react';
import './SoloPage.css';
import Nav from '../Nav';

export default class SoloPage extends Component {

  render() {

    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="main-section">
            <div className="solo-choicer">
              <div className="solo-panel panel-right">
                <img className="solo-panel-background" src="/tuto.jpg" alt="bg"/>
                <div className="solo-panel-filter"/>
                <div className="solo-panel-text">
                  <h3>Tutorial</h3>
                  <p>All you need to know can be learned here.</p>
                </div>
                <div className="solo-panel-chapters">
                  <div className="solo-panel-chapter" onClick={() => this.props.history.push("/solo/mission/tutorial/basics")}>1: Basics</div>
                  <div className="solo-panel-chapter" onClick={() => this.props.history.push("/solo/mission/tutorial/range")}>2: <span className="small-text-chapter-2">Range & Movement</span></div>
                  <div className="solo-panel-chapter" onClick={() => this.props.history.push("/solo/mission/tutorial/skills")}>3: <span className="small-text-chapter-2">Skills & Actions</span></div>
                  <div className="solo-panel-chapter" onClick={() => this.props.history.push("/solo/mission/tutorial/heroes")}>4: Heroes</div>
                  <div className="solo-panel-chapter" onClick={() => this.props.history.push("/solo/mission/tutorial/artifacts")}>5: <span className="small-text-chapter-2">Gems & Artifacts</span></div>
                  <div className="solo-panel-chapters-end"/>
                </div>
              </div>
            </div>
          </div>
      	</main>
      </div>
    );
  }
}