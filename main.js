"use strict"

const player = (sign)=>{
   
    const getSign = ()=>{
        return sign;
    }

   return {getSign};
}

//on the board module pattern we initialize the gameBoard, 
//set a value to it and get the values when we want them.
//Also, it resets the gameBoard to empty values.

const board = (()=>{
 const gameBoard = ['','','','','','','','',''];

 const setBoard = (index,sign) => {
  if (index > gameBoard.length) return;
    gameBoard[index] = sign;
 }
 
 const getBoard = (index) => {
    return gameBoard[index];
 }

 const reset = () =>{
   for(let i=0; i < gameBoard.length;i++){
     gameBoard[i] = '';
   }
 }

 return {setBoard,getBoard,gameBoard,reset};
})();


// the displayController render the gameBoard, counts the each win
// and displays the winner.

const displayControler = (()=>{
   const cell = document.querySelectorAll('.cell');
   const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
   const winningMessage = document.getElementById('winningMessage');
   const restartButton = document.getElementById('restartButton');
   const XCounter = document.querySelector('.counter1');
   const tieCounter = document.querySelector('.counterTie');
   const Ocounter = document.querySelector('.counter2');
   let xctr = 0;
   let oCtr = 0;
   let dCtr = 0;


   //on each game board click it gives the assigned index.
    cell.forEach((elem) => elem.addEventListener('click',(e) => {
            gameController.playRound(parseInt(e.target.dataset.index));
            renderGameBoard();
        })
    );

    //places the each sign on clicked spot
    const renderGameBoard = () => {
       for(let i=0; i < cell.length; i++){
            cell[i].textContent = board.gameBoard[i];
       }
    };

    const setResultMessage = (winner) => {
      if (winner == 'Draw'){
        winningMessageTextElement.textContent = `It's Draw!`;
        dCtr++;
        tieCounter.innerHTML = dCtr;
      }
      else{
        winningMessageTextElement.textContent = ` ${winner} Wins!!`;
        if (winner == 'X'){
          xctr++;
          XCounter.innerHTML = xctr; 
        }
        else{
          oCtr++;
          Ocounter.innerHTML = oCtr;
        }
      }

      winningMessage.classList.add('show')
    };

    restartButton.addEventListener('click',(e)=>{
      board.reset();
      gameController.Reset();
      renderGameBoard();
      winningMessage.classList.remove('show');

    });
    return{setResultMessage};
})();


//gamecontoller plays the game,checks the winner, reset and stops when
//the game is over

const gameController = (() =>{
    const playerOne = player('X');
    const playerTwo = player('O');
    let round = 1;
    let isOver = false;
    
    const playRound = (cell) =>{
      board.setBoard(cell,getcurrentSign());
      if(checkWinner(cell)){
        displayControler.setResultMessage(getcurrentSign());
        isOver = true;
        return;
      }
      if (round == 9){
        displayControler.setResultMessage('Draw');
        isOver = true
        return;
      }
      round++;

    };

    const getcurrentSign = ()=>{
        return round % 2 === 1 ? playerOne.getSign() : playerTwo.getSign();
      }
     
      
    const checkWinner = (index) =>{
       const winCombination = [
                  [0,1,2],
                  [3,4,5],
                  [6,7,8],
                  [0,3,6],
                  [1,4,7],
                  [2,5,8],
                  [0,4,8],
                  [2,4,6]
                ]
       return winCombination
       .filter((combination)=>combination.includes(index)) // filters the arrays that contain the index.
       .some((possibleComb) => possibleComb.every( 
        (index)=>board.getBoard(index)===getcurrentSign() // checks if the sign on the index is similar to the filtered array indexs values on the gameBoard.
       )
      );
    
    };

    const Reset = () =>{
      round = 1;
      isOver = false; 
    }
    
    const gameOver = () =>{
        return isOver;
    }

    return {playRound,getcurrentSign,gameOver,Reset};
})();

