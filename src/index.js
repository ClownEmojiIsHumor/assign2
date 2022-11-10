import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

//Note that I learnt react off of this tutorial:https://reactjs.org/tutorial/tutorial.html
//It created a tic-tac-toe game, so there were some similarities, but it was mostly different
//So I also had some coding practises that followed what was taught there. 
//Simple function that takes ina  num which corresponds to a players turn, and assigns the object a colour based on that player
function pickColor(num) {
  //Just a quick note, I'm aware that using == means im not comparing object types, 
  //However its not relevant in any of the code I'm writing for this small project
  if (num === 0) {
    return "silver";
  }
  else if (num === 1) {
    return "red"
  }
  else if (num === 2) {
    return "blue"
  }
  else {
    return "green"
  }
}


//Here are some of the jsx elements that I use for rendering.
//If they have an onclick function, it is associated with their parent's functtions
//As modification to any of these react components corresponds to a change in state for the parent's state
//As the parent keeps track of the "main logic"
function Square(props) {
  return (
    <div className="square" onClick={props.onClick} style={{ backgroundColor: pickColor(props.value), opacity: .3 }} >
      {/* {props.value} */}
    </div>
  );
}
function Dot() {
  return <div className="dot"></div>
}

function HorizontalLine(props) {
  return (
    //style={{backgroundColor:props.pickColor(props.value)}
    <div className="horizontalLine" onClick={props.onClick} style={{ backgroundColor: pickColor(props.value) }} >
      {/* {props.value} */}
    </div>
  );
}

function VerticalLine(props) {
  return (
    <div className="verticalLine" onClick={props.onClick} style={{ backgroundColor: pickColor(props.value) }}>
      {/* {props.value} */}
    </div>
  );
}

//This is the pop up screen
//While it is not beautifully rendered it does the conditional logic behind who won and starting a new game 
//basic idea is the parent passes it the new game function to alter the parent's state
//and passes it the scores of all the players so it can determine who won. 
function Modal(props){
  //console.log("Inside Modal")
  let player1score=props.player1;
  let player2score=props.player2;
  let player3score=props.player3;
  let winnerMessage=""
  if (player1score>player2score && player1score>player3score){
    winnerMessage="Player 1 won!"
  }
  else if (player2score>player1score && player2score>player3score){
    winnerMessage="Player 2 won!"
  }
  else if (player3score>player1score && player3score>player2score){
    winnerMessage="Player 3 won!"
  }
  else if (player1score== player2score && player2score>player3score){
    winnerMessage="Player 1 and Player 2 tied!"
  }
  else if (player1score== player3score && player3score>player2score){
    winnerMessage="Player 1 and Player 3 tied!"
  }
  else if (player2score== player3score && player3score>player1score){
    winnerMessage="Player 2 and Player 3 tied!"
  }
  else{
    winnerMessage="It was a three way tie!"
  }
  console.log(winnerMessage)

  const renderWinner=()=>{
    return(
    <div className="modal">
      <div className="modalContent">
        <button className="newGameModal" onClick={props.onClick}> Start a new game!</button>
        <div className="modalBody">
          {winnerMessage}
        </div>
      </div>
    </div>
    )

  }
  return (
    renderWinner()
  )
}

//This is the "main react component"
//It is where most of the game's logic is hosted. 
class Board extends React.Component {
  constructor(props) {
    super(props);
    //The lines array is supposed to represent the main grid
    // The idea is that for a 4x4 grid
    //We can use a 5x5 array which contains two elements each corresponding to the vertical/horizontal lines that would be drawn from that point
    //As in each element of the 5x5 array can be thought of as a one of the dots int he grid
    //And every vertical line that is drawn from that point is drawn downwards, and every horizontal line is drawn rightwards
    // So for every point there is a vertical line and a horizontal line, so for the dot at (0, 0) we need to store the the two lines
    //Which is why each element of the 5x5 array has 1 array to store these 2 elements
    // Squares is a similar concept except it stores the state of the squares these lines enclose 
    this.state = {
      lines:
        [
          [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
        ],
      squares: Array(16).fill(0),
      nextPlayer: 1,
      player1: 0,
      player2: 0,
      player3: 0,
      totalSquares: 0,
      hasEnded: false
    };
    this.newBoard = this.newBoard.bind(this);


  }

  //This function is used to reset the state 
  //I had an issue where I had to bind a function, I had to use this link to figure it out
  //https://stackoverflow.com/questions/32317154/react-uncaught-typeerror-cannot-read-property-setstate-of-undefined
  newBoard() {
    console.log("NEW BOARD!!");
    let newState = {
      lines:
        [
          [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
        ],
      squares: Array(16).fill(0),
      nextPlayer: 1,
      player1: 0,
      player2: 0,
      player3: 0,
      totalSquares: 0,
      hasEnded: false

    }
    this.setState(newState)

  }


  //https://stackoverflow.com/questions/48251597/how-to-use-reacts-onclick-to-change-a-style-backgroundcolor-of-an-element
  handleClick(i, j, k) {
    //i= row
    //j= coloumn
    //k= Hor/Vert where k= 0 represents the line that starts from dot at spot (i, j) and k=1 the vertical line below that dot. 
    //console.log("hello");
    if (this.state.lines[i][j][k] === 0) {
      const squares = this.state.squares.slice();
      const lines = this.state.lines.slice();
      let player1T = this.state.player1;
      let player2T = this.state.player2;
      let player3T = this.state.player3;
      lines[i][j][k] = this.state.nextPlayer;

      let changeNextPlayer = 1;
      let tempSquaresEarned = this.state.totalSquares;
      if (k === 1) {
        //Then this is a vertical line 
        if (j != 4) {
          //Check right square
          if (lines[i][j + 1][1] != 0 && lines[i][j][0] != 0 && lines[i + 1][j][0] != 0) {
            if (this.state.nextPlayer === 1) {
              player1T++;
              squares[4 * i + j] = 1;
              changeNextPlayer = 0;
              tempSquaresEarned++;
            }
            else if (this.state.nextPlayer === 2) {
              player2T++;
              squares[4 * i + j] = 2;
              changeNextPlayer = 0;
              tempSquaresEarned++;
            }
            else {
              player3T++
              squares[4 * i + j] = 3;
              changeNextPlayer = 0;
              tempSquaresEarned++;
            }

          }
        }
        if (j != 0) {
          //Check left square
          if (lines[i][j - 1][1] != 0 && lines[i][j - 1][0] != 0 && lines[i + 1][j - 1][0] != 0) {
            if (this.state.nextPlayer === 1) {
              player1T++;
              squares[4 * i + j - 1] = 1;
              changeNextPlayer = 0;
              tempSquaresEarned++;
            }
            else if (this.state.nextPlayer === 2) {
              player2T++;
              squares[4 * i + j - 1] = 2;
              changeNextPlayer = 0;
              tempSquaresEarned++;
            }
            else {
              player3T++
              squares[4 * i + j - 1] = 3;
              changeNextPlayer = 0;
              tempSquaresEarned++;
            }

          }


        }


      }
      else {
        //k==0 so its horizontal

        if (i != 0) {
          //Check up square
          if (lines[i - 1][j][0] != 0 && lines[i - 1][j][1] != 0 && lines[i - 1][j + 1][1] != 0) {
            if (this.state.nextPlayer === 1) {
              player1T++;
              squares[4 * (i - 1) + j] = 1;
              changeNextPlayer = 0;
              tempSquaresEarned++;
            }
            else if (this.state.nextPlayer === 2) {
              player2T++;
              squares[4 * (i - 1) + j] = 2;
              changeNextPlayer = 0;
              tempSquaresEarned++;
            }
            else {
              player3T++
              squares[4 * (i - 1) + j] = 3;
              changeNextPlayer = 0;
              tempSquaresEarned++;
            }

          }
        }

        if (i != 4) {
          //Check down square
          if (lines[i + 1][j][0] != 0 && lines[i][j][1] != 0 && lines[i][j + 1][1] != 0) {
            if (this.state.nextPlayer === 1) {
              player1T++;
              squares[4 * (i) + j] = 1;
              changeNextPlayer = 0;
              tempSquaresEarned++;
            }
            else if (this.state.nextPlayer === 2) {
              player2T++;
              squares[4 * (i) + j] = 2;
              changeNextPlayer = 0;
              tempSquaresEarned++;
            }
            else {
              player3T++
              squares[4 * (i) + j] = 3;
              changeNextPlayer = 0;
              tempSquaresEarned++;
            }

          }
        }


      }
      //Iterate to the next player if and only if our currnent player didnt score a point
      let tempNext = (changeNextPlayer === 0) ? this.state.nextPlayer : (this.state.nextPlayer) % 3 + 1;
      this.setState({
        squares: squares,
        lines: lines,
        nextPlayer: tempNext,
        player1: player1T,
        player2: player2T,
        player3: player3T,
        totalSquares: tempSquaresEarned,
        hasEnded: false

      });


    }


  }

//Render methods for react components, just for modularity mostly
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
      />
    );
  }

  renderDot() {
    return <Dot />
  }

  renderHorizontal(i, j, k) {
    return (
      //value={this.state.lines[i][j][k]}
      <HorizontalLine
        value={this.state.lines[i][j][k]}
        onClick={() => this.handleClick(i, j, k)}
      />
    );
  }

  renderVertical(i, j, k) {
    return (
      <VerticalLine
        value={this.state.lines[i][j][k]}
        onClick={() => this.handleClick(i, j, k)}
      />
    );
  }


  render() {
    const status = 'Next player: ' + (this.state.nextPlayer);
    const stats1 = "Player 1 score: " + (this.state.player1);
    const stats2 = "Player 2 score: " + (this.state.player2);
    const stats3 = "Player 3 score: " + (this.state.player3);


    //return (
    const renderMain = () => {
      let tempSquaresEarned = this.state.totalSquares;
      let popUpShown = this.state.hasEnded;
      //We check if we have to display the pop up, the game is only not over if the number of squares are below 16
      if (tempSquaresEarned != 16 || popUpShown == true) {

        return (
          <div className="MainBoard">
            <div className="status">{status}</div>
            <div className="stats1">{stats1}</div>
            <div className="stats2">{stats2}</div>
            <div className="stats3">{stats3}</div>
            <br></br>
            <button className='newBoard' onClick={this.newBoard}> New Game</button>
            <br></br>

              {/* This is a poor way of creating the board, but I kept running into some strange browser issues when I tried for loops, so I settled for just running the code and copy pasting its contents.
              Had I had more time I'd have tried to fix it, but it works just fine. */}
            <div className="board-row">
              {this.renderDot()}
              {this.renderHorizontal(0, 0, 0)}
              {this.renderDot()}
              {this.renderHorizontal(0, 1, 0)}
              {this.renderDot()}
              {this.renderHorizontal(0, 2, 0)}
              {this.renderDot()}
              {this.renderHorizontal(0, 3, 0)}
              {this.renderDot()}
            </div>
            <div className="board-row">
              {this.renderVertical(0, 0, 1)}
              {this.renderSquare(0)}
              {this.renderVertical(0, 1, 1)}
              {this.renderSquare(1)}
              {this.renderVertical(0, 2, 1)}
              {this.renderSquare(2)}
              {this.renderVertical(0, 3, 1)}
              {this.renderSquare(3)}
              {this.renderVertical(0, 4, 1)}
            </div>
            <div className="board-row">
              {this.renderDot()}
              {this.renderHorizontal(1, 0, 0)}
              {this.renderDot()}
              {this.renderHorizontal(1, 1, 0)}
              {this.renderDot()}
              {this.renderHorizontal(1, 2, 0)}
              {this.renderDot()}
              {this.renderHorizontal(1, 3, 0)}
              {this.renderDot()}
            </div>
            <div className="board-row">
              {this.renderVertical(1, 0, 1)}
              {this.renderSquare(4)}
              {this.renderVertical(1, 1, 1)}
              {this.renderSquare(5)}
              {this.renderVertical(1, 2, 1)}
              {this.renderSquare(6)}
              {this.renderVertical(1, 3, 1)}
              {this.renderSquare(7)}
              {this.renderVertical(1, 4, 1)}
            </div>
            <div className="board-row">
              {this.renderDot()}
              {this.renderHorizontal(2, 0, 0)}
              {this.renderDot()}
              {this.renderHorizontal(2, 1, 0)}
              {this.renderDot()}
              {this.renderHorizontal(2, 2, 0)}
              {this.renderDot()}
              {this.renderHorizontal(2, 3, 0)}
              {this.renderDot()}
            </div>
            <div className="board-row">
              {this.renderVertical(2, 0, 1)}
              {this.renderSquare(8)}
              {this.renderVertical(2, 1, 1)}
              {this.renderSquare(9)}
              {this.renderVertical(2, 2, 1)}
              {this.renderSquare(10)}
              {this.renderVertical(2, 3, 1)}
              {this.renderSquare(11)}
              {this.renderVertical(2, 4, 1)}
            </div>
            <div className="board-row">
              {this.renderDot()}
              {this.renderHorizontal(3, 0, 0)}
              {this.renderDot()}
              {this.renderHorizontal(3, 1, 0)}
              {this.renderDot()}
              {this.renderHorizontal(3, 2, 0)}
              {this.renderDot()}
              {this.renderHorizontal(3, 3, 0)}
              {this.renderDot()}
            </div>
            <div className="board-row">
              {this.renderVertical(3, 0, 1)}
              {this.renderSquare(12)}
              {this.renderVertical(3, 1, 1)}
              {this.renderSquare(13)}
              {this.renderVertical(3, 2, 1)}
              {this.renderSquare(14)}
              {this.renderVertical(3, 3, 1)}
              {this.renderSquare(15)}
              {this.renderVertical(3, 4, 1)}
            </div>
            <div className="board-row">
              {this.renderDot()}
              {this.renderHorizontal(4, 0, 0)}
              {this.renderDot()}
              {this.renderHorizontal(4, 1, 0)}
              {this.renderDot()}
              {this.renderHorizontal(4, 2, 0)}
              {this.renderDot()}
              {this.renderHorizontal(4, 3, 0)}
              {this.renderDot()}
            </div>
          </div>
        )
      }
      else{
        //This implies that game is over, so display the pop up/modal 
        return(
        <div>
           <Modal player1={this.state.player1} player2={this.state.player2} player3={this.state.player3} onClick={() => this.newBoard()}/>

        </div>
        )
      }

    }
    return(
      renderMain()
    )
   
  }
}

class Game extends React.Component {
  //Render function to make a new componenbt for the game
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

class Page extends React.Component {
//Main logic for the simulation of multiple pages
  constructor(props) {
    super(props);
    this.state = {
      isMainPage: 1,
    };
    console.log(this.state.isMainPage);
    this.nextPage = this.nextPage.bind(this);
    this.nextPage1 = this.nextPage1.bind(this);

  }

  nextPage() {
    console.log("NEW Page!!");
    let newState = { isMainPage: 0 }
    this.setState(newState);

  }
  nextPage1() {
    console.log("NEW Page Home!!");
    let newState = { isMainPage: 1 }
    this.setState(newState);

  }

  //Basic idea is that we simulate multiple pages by changing the state 
  //If the state is 0 we are int he game page, else we are on the main page
  render() {
    console.log("Inside render" + this.state.isMainPage);
    let isMain = this.state.isMainPage;
    const renderMain = () => {
      console.log(isMain);
      if (isMain == 1) {
        console.log("Hello!");
        return (
          <div className='mainPage'>
            <h1>Dots and Boxes!</h1>
            <div className='navBar'>
              <div className="ChangeHome" onClick={this.nextPage1}>-Home</div>
              <div className="ChangePage" onClick={this.nextPage}>-Play a Game!</div>
            </div>
            <h2 className='smallerHead'>
              What is dots and boxes?
            </h2>
            <p>
              Dots and boxes is a really cool game where you get to play a game. <br></br>
              In dots and boxes you connect the dots to make a box. If you make a box then you get another turn <br></br>
              Click play a game to play a dots and boxes game!
            </p>

          </div>
        )

      }
      else {
        return (
          <div className='mainPage'>
            <h1>Dots and Boxes!</h1>
            <div className='navBar'>
              <div className="ChangeHome" onClick={this.nextPage1}>-Home</div>
              <div className="ChangePage" onClick={this.nextPage}>-Play a Game!</div>
            </div>
            <div className='gameDiv'> <Game /></div>

          </div>
        )
      }
    }
    return (
      <div>
        {renderMain()}
      </div>
    )
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);

