const { shuffleDeck, generateDeck } = require("../utils.js");
const { DOUBLE_DECK } = require("../constants.js");

const Dealers = {};

let id = 0;

const Dealer = () => ({
  hand: [],
  deck: [],
  tossed: [],
  hidden: true,
  wallet: 100000000,
  id: id,
});

const createDealer = () => {
  const newDealer = Dealer();
  const deck = generateDeck(DOUBLE_DECK);
  shuffleDeck(deck);
  newDealer.deck = deck;

  Dealers[id] = newDealer;
  id++;
  return newDealer;
};

const resetDealer = (dealer) => {
  const deck = generateDeck(DOUBLE_DECK);
  shuffleDeck(deck);
  dealer.deck = deck;
  dealer.hand = [];
  dealer.tossed = [];
  dealer.hidden = true;
  return dealer;
};

module.exports = { resetDealer, createDealer, Dealers };
