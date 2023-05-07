const PLAYER_STATUS = {
  spectator: "spectator",
  ready: "ready",
  playing: "playing",
  bust: "bust",
  stay: "stay",
  won: "won",
  push: "push",
  lost: "lost",
};
Object.freeze(PLAYER_STATUS);

const WEIGHT = {
  2: [2],
  3: [3],
  4: [4],
  5: [5],
  6: [6],
  7: [7],
  8: [8],
  9: [9],
  10: [10],
  jack: [10],
  queen: [10],
  king: [10],
  ace: [11, 1],
};
Object.freeze(WEIGHT);

const DOUBLE_DECK = 2;

const NAMES = [
  "Darth Vader",
  "Pablo Escobar",
  "Cocaine Bear",
  "Jon Wick",
  "Voldemort",
  "Michael Jackson",
  "Stephan Curry",
  "Guillermo Del Toro",
  "Omniman",
  "Olivia Rodrigo",
];
Object.freeze(NAMES);

const SUITS = ["hearts", "diamonds", "clubs", "spades"];
Object.freeze(SUITS);

const OUTCOMES = {
  Push: "PUSH",
  Dealer: "DEALER",
  Player: "PLAYER",
};
Object.freeze(OUTCOMES);

module.exports = { NAMES, DOUBLE_DECK, WEIGHT, PLAYER_STATUS, SUITS, OUTCOMES };
