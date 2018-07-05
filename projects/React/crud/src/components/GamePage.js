import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import GameList from './GameList';
import * as gameActions from '../actions';

class GamePage extends Component {
  componentDidMount() {
    const { fetchGames } = this.props;
    fetchGames();
  }

  render() {
    const { games } = this.props;
    return (
      <div>
        <GameList games={games} />
      </div>
    );
  }
}

GamePage.propTypes = {
  games: PropTypes.array.isRequired
};

const mapStateToProps = ({ games }) => ({
  games
});

GamePage.propTypes = {
  fetchGames: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { ...gameActions }
)(GamePage);
