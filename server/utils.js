const { WEIGHT, SUITS, OUTCOMES } = require("./constants.js");
const { Card } = require("./models/card.js");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCurrentTimeInHoursAndMinutes = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return `${hours}:${minutes}`;
};

const generateDeck = (amount = 1) => {
  const suits = SUITS;
  const values = Object.keys(WEIGHT);
  const deck = [];

  for (var i = 0; i < amount; i++) {
    suits.forEach((suit) => {
      values.forEach((value) => {
        const card = Card(value, suit);
        deck.push(card);
      });
    });
  }

  return deck;
};

const shuffleDeck = (deck) => {
  deck.forEach((_card, i) => {
    const j = Math.floor(Math.random() * i);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  });

  return deck;
};

const minValue = (hand) =>
  hand.reduce((acc, { value }) => Math.min(...WEIGHT[value]) + acc, 0);
const maxValue = (hand) =>
  hand.reduce((acc, { value }) => Math.max(...WEIGHT[value]) + acc, 0);

const bestScore = (hand) => {
  let maxScore = maxValue(hand);
  let minScore = minValue(hand);

  if (maxScore > 21) {
    return minScore;
  } else {
    return maxScore;
  }
};

const compareHands = (dealerHand, playerHand) => {
  const dealerBest = bestScore(dealerHand);
  const playerBest = bestScore(playerHand);

  if (dealerBest === playerBest) {
    return OUTCOMES.Push;
  } else if (dealerBest > playerBest) {
    return OUTCOMES.Dealer;
  } else {
    return OUTCOMES.Player;
  }
};

const isBust = (hand) => minValue(hand) > 21;

const hasBlackJack = (hand) => {
  let hasAce = false;
  let hasTen = false;
  hand.forEach(({ value }) => {
    if (value === "ace") {
      hasAce = true;
    } else if (WEIGHT[value][0] === 10) {
      hasTen = true;
    }
  });

  return hasAce && hasTen && hand.length === 2;
};

const analyzeOutComes = (outcomes) =>
  outcomes.reduce(
    (acc, currVal) =>
      currVal === OUTCOMES.Player
        ? acc + 1
        : currVal === OUTCOMES.Dealer
        ? acc - 1
        : acc,
    0
  );

const determineWinner = (outcomes) => {
  const score = analyzeOutComes(outcomes);

  return score > 0
    ? OUTCOMES.Player
    : score === 0
    ? OUTCOMES.Push
    : OUTCOMES.Dealer;
};

module.exports = {
  compareHands,
  isBust,
  shuffleDeck,
  generateDeck,
  getCurrentTimeInHoursAndMinutes,
  hasBlackJack,
  bestScore,
  determineWinner,
  analyzeOutComes,
  delay,
};
