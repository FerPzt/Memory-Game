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
let currentTimer = '';
let gameCards = symbols.length / 2;
let rating = $('i');
const ranking3stars = 12;
const ranking2stars = 17;

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
      currentTimer = numMinutes + " min " + numSeconds + " sec" ;
      $('.timer').html(currentTimer);
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
  } else if (ranking2stars < moves) {
    rating.eq(1).removeClass('fa-star').addClass('fa-star-o');
    return 1;
  }
  return 3;
};

//Restart Game when restart button is clicked
restart.click(function() {
  //dispay modal box to check if players really want to play again or continue the game he already started
    swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Are you sure?',
    text: 'If you restart the game your progress will be lost.',
    type: 'warning',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    confirmButtonColor: 'green',
    cancelButtonText: "No, I'm not sure",
    confirmButtonText: 'Yes, restart it!'
  }). then((result) => {
    if (result.value) {
      //reset timer
      clearInterval(interval);
      startGame();
    } else if (result.dismiss === 'cancel') {
      return false;
    }
  })
});

//End Game
function endGame(moves, score) {
  //reset timer
  clearInterval(interval);
  //display modal with a message containing the final score and checking if player wants to play again
  swal({
    title: 'You Won!',
    text: 'Your final score is: ' + moves + ' moves and ' + score + ' stars, in ' + currentTimer + '. \n Do you want to play again?',
    type: 'success',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    confirmButtonColor: 'green',
    cancelButtonText: 'No',
    confirmButtonText: 'Yes'
  }). then((result) => {
    if (result.value) {
      startGame();
    } else if (result.dismiss === 'cancel'){
      return false;
    }
  })
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
       }, 300);
     }
  });
});
