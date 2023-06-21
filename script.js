// array of available colors for creating cards, there will be 2 cards created for each color
const COLORS = ["red", "blue", "green", "orange", "purple"];

// function for shuffling items in an array
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// function to generate card id string
function getCardIdString(prefix, num) {
  cardId = prefix;
  // check if leading zeros should be added to id
  if (num < 10) {
    cardId = cardId.concat(0, num);
  } else {
    cardId = cardId.concat(num);
  }
  return cardId;
}

// this function creates a shuffled list of colors to be assigned to cards
// it creates a new div for each card
// it also adds an event listener for a click for each card
function createCards() {
  // an object to store cards in the game and their individual properties
  const cards = {};
  const gameContainer = document.getElementById("game");
  let colorCards = [];

  // loop through available colors twice to create pairs
  for (i = 0; i < 2; i++) {
    for (color of COLORS) {
      colorCards.push(color);
    }
  }

  // shuffle order of cards
  colorCards = shuffle(colorCards);

  let cardId = null;

  // loop through cards and create a div for each one
  for (let i = 0; i < colorCards.length; i++) {
    // create a new div
    const newDiv = document.createElement("div");

    // create an ID and assign it to card div
    cardId = getCardIdString("c", i);
    newDiv.setAttribute("id", cardId);

    // give it a new class attribute to identify it as a card
    newDiv.classList.add("card");

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);

    // create card object
    cards[cardId] = {
      color: colorCards[i],
      checking: false,
      solved: false,
    };
  }
  return cards;
}

function renderCards(game) {
  for (card in game["cards"]) {
    // get div of card
    cardDiv = document.querySelector(`#${card}`);
    if (game["cards"][card]["checking"] || game["cards"][card]["solved"]) {
      cardDiv.style.backgroundColor = game["cards"][card]["color"];
      if (game["cards"][card]["solved"]) {
        cardDiv.style.borderColor = "yellow";
        cardDiv.style.borderWidth = "5px";
        cardDiv.style.borderStyle = "dashed";
      }
    } else {
      cardDiv.style.backgroundColor = "black";
    }
  }
}

function checkForMatch(game) {
  let cardsToCheck = [];
  for (card in game["cards"]) {
    if (game["cards"][card]["checking"]) {
      cardsToCheck.push([card, game["cards"][card]["color"]]);
    }
  }
  return cardsToCheck[0][1] === cardsToCheck[1][1];
}

// function which cycles through all the cards in the game and updates count tallies
function updateGameState(game) {
  let checkingCount = 0;
  let solvedCount = 0;
  let checking = null;
  let solved = null;
  for (card in game["cards"]) {
    checking = game["cards"][card]["checking"];
    solved = game["cards"][card]["solved"];
    if (checking) {
      checkingCount += 1;
    }
    if (solved) {
      solvedCount += 1;
    }
  }
  game["checkingCount"] = checkingCount;
  game["solvedCount"] = solvedCount;
  renderCards(game);
}

// function to initialize memory game
function startMemoryGame() {
  // an object to store properties of the new game
  const game = {
    cards: createCards(),
    cardCount: document.querySelectorAll(".card").length,
    checkingCount: document.querySelectorAll(".checking").length,
    solvedCount: document.querySelectorAll(".solved").length,
    clickedCard: null,
    noClicking: false,
  };
  return game;
}

// function that handles game logic
// it detects whether a pair of cards are available to be evaluated for a match
// otherwise it updates the properties of the clicked card
function continueGame(game) {
  // if less than 2 cards are being checked, check clicked card
  if (game["checkingCount"] < 2) {
    // check clicked card
    clickedCardObject["checking"] = true;

    updateGameState(game);
  }

  // if 2 cards are being checked, check for match
  if (game["checkingCount"] === 2) {
    // ignore cicks until timeout is over
    game["noClicking"] = true;

    // check pair of cards
    matched = checkForMatch(game);

    setTimeout(function () {
      for (card in game["cards"]) {
        if (matched) {
          // if the two cards checked are matched, change solved status
          if (game["cards"][card]["checking"]) {
            game["cards"][card]["solved"] = true;
          }
        }
        // change checking status
        game["cards"][card]["checking"] = false;
      }

      updateGameState(game);

      // respond to clicks again after timeout
      game["noClicking"] = false;
      matched = null;
    }, 1000);
  } else return;
}

// function for handling click events
function handleCardClick(event) {
  // ignores click handling when two cards are currently being checked
  if (game["noClicking"]) return;

  clickedCardId = event.target.getAttribute("id");
  clickedCardObject = game["cards"][clickedCardId];

  // if the player is clicking on an already checked card, ignore
  if (clickedCardObject["checking"]) return;

  // if player is clicking a solved card, ignore
  if (clickedCardObject["solved"]) return;

  // continue game
  continueGame(game);
}

// start memory game
const game = startMemoryGame();
