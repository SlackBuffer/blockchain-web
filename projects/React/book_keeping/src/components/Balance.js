import React from 'react';

const Balance = ({ text, type, doMath }) => {
  return (
    <div className="col">
      <div className="card">
        <div className={`card-header text-white bg-${type}`}>
          {text}
        </div>
        <div className="card-body">
          {doMath()}
        </div>
      </div>
    </div>
  )
};

export default Balance;