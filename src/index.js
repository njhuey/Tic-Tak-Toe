import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  const className = (props.line && props.line.includes(props.val))? 'winning-square' : 'square';
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {  
  renderSquare(i) {
    return (
    <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      line={this.props.line}
      key={i.toString()}
      val={i}
      />
    );
  }

  render_row(i) {
    const arr = Array(3).fill(null);
    const row = arr.map((_, index) => {
      return this.renderSquare(i*3 + index);
    });
    return row;
  }

  render_grid() {
    const arr = Array(3).fill(null);
    const grid = arr.map((_, index) => {
      return <div className="board-row" key={index.toString()}>{this.render_row(index)}</div>
    });
    return grid;
  }

  render() {
    return (
      <div>{this.render_grid()}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      moveCounter: 0,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice()
    const moveCounter = this.state.moveCounter + 1;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
      moveCounter: moveCounter,
    });
  }

  reset() {
    this.setState({
      squares: Array(9).fill(null),
      xIsNext: true,
      moveCounter: 0,
    });
  }
  
  render() {
    const squares = this.state.squares;
    const line = calculateWinner(squares);

    let status;
    if (line) {
      const winner = this.state.squares[line[0]]
      status = 'Winner: ' + winner;
    } else if (this.state.moveCounter == 9){
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <div className="game-info"> {status} </div>
          <Board 
            squares={squares}
            onClick={(i) => this.handleClick(i)}
            line={line}
          />
          {(line || this.state.moveCounter == 9) && 
          <button 
            className="reset-button"
            type="button"
            onClick={() => this.reset()}>Reset Game
          </button>}
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}