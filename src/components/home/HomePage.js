import React, { Component } from 'react';
import './HomePage.css';
import Nav from '../Nav';

export default class HomePage extends Component {
  
  render() {
    return (
      <div>
        <Nav api={this.props.api} history={this.props.history}/>
      	<main>
          <div className="home-choicer">
            <div className="home-panel panel-left">
              <img className="home-panel-background" src="/img1.jpg" alt="bg"/>
              <div className="home-panel-filter"/>
              <div className="home-panel-text">
                <h3>Plongez dans la bataille</h3>
                <p>Une fois encore, les mondes convergent dans une bataille infernale ! Utilisez le pouvoir de vos cartes pour mener des batailles entre héros de tous temps et de tout univers. Jouez à Sensuba en ligne gratuitement pour profiter du duels épiques entre vos personnages d'animes préférés.</p>
                <button className="select-button" onClick={() => this.props.history.push("/play")}>Lancer une partie</button>
              </div>
            </div>
            <div className="home-panel panel-right">
              <img className="home-panel-background" src="/img2.jpg" alt="bg"/>
              <div className="home-panel-filter"/>
              <div className="home-panel-text">
                <h3>Comment jouer ?</h3>
                <p>Découvrez les règles de Sensuba à travers un tutoriel en plusieurs missions pour maîtriser les arcanes des cartes et battre tous vos amis.</p>
                <button className="select-button" onClick={() => this.props.history.push("/solo")}>Apprendre à jouer</button>
              </div>
            </div>
            <div className="home-panel panel-left">
              <img className="home-panel-background" src="/img3.jpg" alt="bg"/>
              <div className="home-panel-filter"/>
              <div className="home-panel-text">
                <h3>Une grande variété de cartes</h3>
                <p>Explorez la collection pour découvrir les 400 cartes disponibles. Concevez les meilleures stratégies !</p>
                <button className="select-button" onClick={() => this.props.history.push("/cards")}>Voir la collection</button>
              </div>
            </div>
            <div className="home-panel panel-right">
              <img className="home-panel-background" src="/img4.jpg" alt="bg"/>
              <div className="home-panel-filter"/>
              <div className="home-panel-text">
                <h3>Rejoignez-nous sur Discord</h3>
                <p>Rencontrez la communauté et affrontez d'autres passionnés. En partageant votre expérience et votre temps avec les autres, vous supportez le jeu et vous améliorez en même temps.</p>
                <a className="select-button" target="_blank" rel="noopener noreferrer" href="https://discordapp.com/invite/gqRdwg2">Ouvrir Discord</a>
              </div>
            </div>
            <div className="home-panel panel-left">
              <img className="home-panel-background" src="/img5.jpg" alt="bg"/>
              <div className="home-panel-filter"/>
              <div className="home-panel-text">
                <h3>Supportez-nous</h3>
                <p>Sensuba est un jeu complètement gratuit, mais nous coûte du temps et de l'argent. Gérer les serveurs et les données coûte de plus en plus au fil du temps. Si vous voulez que le jeu perdure ou souhaitez nous aidez, nous en serions très reconnaissants !</p>
                <a className="select-button" target="_blank" rel="noopener noreferrer" href="https://ko-fi.com/flynnsp">Ouvrir Ko-fi</a>
              </div>
            </div>
          </div>
      	</main>
      </div>
    );
  }
}