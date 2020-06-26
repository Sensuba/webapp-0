import React, { Component } from 'react';
import './SoloPage.css';
import Nav from '../Nav';
import MuteButton from '../../game/view/UI/MuteButton';

export default class SoloPage extends Component {

  render() {

    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <MuteButton switch={() => {}} changeVolume={(volume, sfx) => {}}/>
          <div className="main-section">
            <div className="solo-choicer">
              <div className="solo-panel panel-right">
                <img className="solo-panel-background" src="/tuto.jpg" alt="bg"/>
                <div className="solo-panel-filter"/>
                <div className="solo-panel-text">
                  <h3>Tutoriel</h3>
                  <p>Tout ce que vous avez besoin de savoir se trouve ici.</p>
                </div>
                <div className="solo-panel-chapters">
                  <div className="solo-panel-chapter" onClick={() => this.props.history.push("/solo/mission/tutorial/basics")}>1: Bases</div>
                  <div className="solo-panel-chapter" onClick={() => this.props.history.push("/solo/mission/tutorial/range")}>2: <span className="small-text-chapter-2">Portée & Mouvement</span></div>
                  <div className="solo-panel-chapter" onClick={() => this.props.history.push("/solo/mission/tutorial/skills")}>3: <span className="small-text-chapter-3">Actions & Compétences</span></div>
                  <div className="solo-panel-chapter" onClick={() => this.props.history.push("/solo/mission/tutorial/heroes")}>4: Héros</div>
                  <div className="solo-panel-chapter" onClick={() => this.props.history.push("/solo/mission/tutorial/artifacts")}>5: <span className="small-text-chapter-2">Gemmes & Artéfacts</span></div>
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