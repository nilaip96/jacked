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

const CHEAT_SHEET = {
  "8-3": ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
  9: ["H", "DD", "DD", "DD", "DD", "H", "H", "H", "H", "H"],
  10: ["DD", "DD", "DD", "DD", "DD", "DD", "DD", "DD", "H", "H"],
  11: ["DD", "DD", "DD", "DD", "DD", "DD", "DD", "DD", "DD", "DD"],
  12: ["H", "H", "S", "S", "S", "H", "H", "H", "H", "H"],
  13: ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"],
  14: ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"],
  15: ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"],
  16: ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"],
  "A-2": ["H", "H", "DD", "DD", "DD", "H", "H", "H", "H", "H"],
  "A-3": ["H", "H", "DD", "DD", "DD", "H", "H", "H", "H", "H"],
  "A-4": ["H", "H", "DD", "DD", "DD", "H", "H", "H", "H", "H"],
  "A-5": ["H", "H", "DD", "DD", "DD", "H", "H", "H", "H", "H"],
  "A-6": ["H", "H", "DD", "DD", "DD", "H", "H", "H", "H", "H"],
  "A-7": ["S", "DD", "DD", "DD", "DD", "S", "S", "H", "H", "H"],
  "A-8": ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
  "A-9": ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
  "2-2": ["H", "H", "SP", "SP", "SP", "SP", "H", "H", "H", "H"],
  "3-3": ["H", "H", "SP", "SP", "SP", "SP", "H", "H", "H", "H"],
  "4-4": ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
  "5-5": ["DD", "DD", "DD", "DD", "DD", "DD", "DD", "DD", "H", "H"],
  "6-6": ["SP", "SP", "SP", "SP", "SP", "H", "H", "H", "H", "H"],
  "7-7": ["SP", "SP", "SP", "SP", "SP", "SP", "H", "H", "H", "H"],
  "8-8": ["SP", "SP", "SP", "SP", "SP", "SP", "SP", "SP", "SP", "SP"],
  "9-9": ["SP", "SP", "SP", "SP", "SP", "S", "SP", "SP", "S", "S"],
  "10-10": ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
  "A-A": ["SP", "SP", "SP", "SP", "SP", "SP", "SP", "SP", "SP", "SP"],
};
Object.freeze(CHEAT_SHEET);

module.exports = {
  NAMES,
  DOUBLE_DECK,
  WEIGHT,
  PLAYER_STATUS,
  SUITS,
  OUTCOMES,
  CHEAT_SHEET,
};
