import React from 'react';
import ReactDOM from 'react-dom/client';

function Square(props) {
    return (
        <button style={props.style} className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    highlightStyle(i) {
        if (!this.props.lines) {
            return null;
        }

        for (const item of this.props.lines) {
            if (item === i) {
                return {backgroundColor: 'yellow'};
            }
        }
    }

    renderSquare(i) {
        const style = this.highlightStyle(i);
        return (<Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            style={style}
        />);
    }

    renderRowSquares(row) {
        const cols = [];
        for (let col = 0; col < 3; col++) {
            cols.push(this.renderSquare(row * 3 + col));
        }
        return cols;
    }


    render() {
        let board = [];
        for (let row = 0; row < 3; row++) {
            const boardRow = (
                <div key={row} className="board-row">
                    {this.renderRowSquares(row)}
                </div>
            );
            board.push(boardRow)
        }

        return (
            <div>
                {board}
            </div>
        );
    }
}

class HistoryItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bold: false,
        }
    }

    render() {
        const bold = {
            fontWeight: this.state.bold ? "bold" : '',
        }
        return (
            <li key={this.key}
                onMouseOver={() => this.toggleBold()}
                onMouseLeave={() => this.toggleBold()}
                style={bold}>
                <button onClick={this.props.onClick}>
                    {this.props.desc}
                </button>
            </li>
        )
    }

    toggleBold() {
        this.setState({
            bold: !this.state.bold,
        })
    }

}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: {row: 0, col: 0}
            }],
            stepNumber: 0,
            xIsNext: true,
            asc: true,
            filled: false
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares)[0] || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        let filled = true;
        for (let square of squares) {
            console.log(square)
            if (square === undefined || square === null) {
                filled = false;
                break;
            }
        }
        this.setState({
            history: history.concat([{
                squares: squares,
                position: {row: parseInt(i / 3) + 1, col: i - 3 * parseInt(i / 3) + 1}
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            filled: filled
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step, xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const [winner, lines] = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let desc = move ? 'Go to move #' + move : 'Go to game start';
            desc += `     row:${step.position.row} col:${step.position.col}`;

            return (
                <HistoryItem
                    key={move}
                    onClick={() => this.jumpTo(move)}
                    desc={desc}
                />
            );
        }).sort(this.state.asc ? (a, b) => a.key - b.key : (a, b) => b.key - a.key);

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else if (!winner && this.state.filled) {
            status = "Game ended with a draw";
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
        return (<div className="game">
            <div className="game-board">
                <Board
                    lines={lines}
                    squares={current.squares}
                    onClick={i => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
                <button onClick={() => this.setState({asc: !this.state.asc})}>{"ASC|DESC"}</button>
            </div>
        </div>);
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>);

function calculateWinner(squares) {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], lines[i]];
        }
    }
    return [null, null];
}

