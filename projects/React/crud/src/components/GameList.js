import React from 'react';
import PropTypes from 'prop-types';

const GameList = ({ games }) => {
  const emptyMessage = (
    <p>There are no games yet in your collection.</p>
  );

  const gamesList = (
    <p>games List</p>
  );

  return (
    <div>
      { games.length === 0 ? emptyMessage : gamesList }
    </div>
  )
}

GameList.propTypes = {
  games: PropTypes.array.isRequired
}

export default GameList;