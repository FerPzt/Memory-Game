let symbols = ['diamond', 'diamond',
              'paper-plane', 'paper-plane',
              'anchor', 'anchor',
              'bolt', 'bolt',
              'cube', 'cube',
              'leaf', 'leaf',
              'bicycle', 'bicycle',
              'bomb', 'bomb'];
let opened = [];
let match = 0;
let moves = 0;
let restart = $('.restart');
let deck = $('#deck-id');
let gameStarted = false;
let timer = 0;
let interval;
let gameCards = symbols.length / 2;
let rating = $('i');
const ranking3stars = 10;
const ranking2stars = 16;
const ranking1star = 24;

 // Shuffle function from http://stackoverflow.com/a/2450976
 function shuffle(array) {
     var currentIndex = array.length, temporaryValue, randomIndex;

     while (currentIndex !== 0) {
         randomIndex = Math.floor(Math.random() * currentIndex);
         currentIndex -= 1;
         temporaryValue = array[currentIndex];
         array[currentIndex] = array[randomIndex];
         array[randomIndex] = temporaryValue;
     }

     return array;
 }

//Display the cards on the page
function showCards(array) {
  //shuffle the list of cards
  let unorderedCards = shuffle(array);
  deck.empty();
  var grid = '';
  //loop through each card and create its HTML
  for (let i = 0; i < unorderedCards.length; i++) {
    let cardName = unorderedCards[i];
    grid += '<li class="card"><i class="fa fa-' + cardName + '"></i></li>';
  }
  //add each card's HTML to the page
  deck.html(grid);
};

//Start Game
function startGame() {
  //initiaze variables
  match = 0;
  moves = 0;
  timer = 0;
  gameStarted = false;
  opened = [];
  $('.moves').text('0');
  $('.timer').text('0 min 0 sec');
  rating.removeClass('fa-star-o').addClass('fa-star');
  showCards(symbols);
  cardListener();
  //start timer when game begins
  interval = setInterval(function(){
    if(gameStarted === true) {
      timer++;
      let numSeconds = (((timer % 31536000) % 86400) % 3600) % 60;
      let numMinutes = Math.floor((((timer % 31536000) % 86400) % 3600) / 60);
      $('.timer').html(numMinutes + " min " + numSeconds + " sec" );
    }
  }, 1000)
};

$(document).ready(function(){
  startGame();
});

//Set and return number of starts according to number of moves
function setRate(moves) {
  if (ranking3stars < moves && moves < ranking2stars) {
    rating.eq(2).removeClass('fa-star').addClass('fa-star-o');
    return 2;
  } else if (ranking2stars < moves && moves < ranking1star) {
    rating.eq(1).removeClass('fa-star').addClass('fa-star-o');
    return 1;
  } else if (ranking1star < moves) {
    rating.eq(0).removeClass('fa-star').addClass('fa-star-o');
    return 0;
  }
  return 3;
};

//Restart Game when restart button is clicked
restart.click(function() {
  let restartAlert = confirm("Are you sure you want to restart the game? \nYour progress will be lost.");
  if (restartAlert == true) {
    //reset timer
    clearInterval(interval);
    startGame();
  } else {
    return false;
  }
});

//End Game
function endGame(moves, score) {
  //reset timer
  clearInterval(interval);
  //display a message with the final score and check if player wants to play again
  let endGameAlert = confirm("You won with " + moves + " moves and " + score + " stars! \nDo you want to play again?");
  if (endGameAlert == true) {
    startGame();
  } else {
    return false;
  }
};

 //card click event listener
 var cardListener = (function () {
   deck.find('.card').click(function(){
     if ($(this).hasClass('open') || $(this).hasClass('match')) {
       return true;
     };
     if ($('.show').length > 1){
       return true;
     };
     gameStarted = true;

     //add the card to a *list* of "open" cards
     var card = $(this).html();
     $(this).addClass('open show');
     opened.push(card);

     //if the list already has another card
     if (opened.length > 1) {
       //check to see if the two cards match
       if (opened[0] === opened[1]) {
         //if the cards do match, lock the cards in the open position
         deck.find('.open').addClass('match');
         setTimeout (function(){
           deck.find('.match').removeClass('open show');
         }, 800 );
         match++;
       }
       else {
         //if the cards do not match, remove the cards from the list and hide the card's symbol
         deck.find('.open').addClass('notmatch');
         setTimeout (function(){
           deck.find('.notmatch').removeClass('notmatch open show');
         }, 800);
       }
       opened = [];
       //increment the move counter and display it on the page
       moves++;
       $('.moves').html(moves);
       setRate(moves);
     }
     //if all cards have matched, end the game
     if (gameCards === match) {
       let score = setRate(moves);
       setTimeout(function() {
         endGame(moves, score);
       }, 500);
     }
  });
});
