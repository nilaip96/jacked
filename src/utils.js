import { WEIGHT, CHEAT_SHEET } from "./Constants.js";

export const getRandomPosition = () => {
  const x = 3 + Math.floor(Math.random() * 94);
  const y = 3 + Math.floor(Math.random() * 94);
  return {
    left: `${x}%`,
    top: `${y}%`,
    leftFlower: `${x - 0.33}%`,
    topFlower: `${y - 1.4}%`,
    zIndex: getZIndex(y),
    windTime: `${x / 30 + 1}s `,
  };
};

export const getRandomHeight = () => 5 + Math.floor(Math.random() * 2);

export const getRandomWindTime = () => 1 + Math.floor(Math.random() * 7);

export const getRandomGreenColor = () => {
  const minColorValue = 128;
  const maxColorValue = 255;

  const g = Math.floor(
    Math.random() * (maxColorValue - minColorValue) + minColorValue
  );

  return `rgb(0,${g},0)`;
};

export const getRandomBrownColor = () => {
  const minRedColorValue = 210;
  const maxRedColorValue = 255;
  const minGreenColorValue = 190;
  const maxGreenColorValue = 245;
  const minBlueColorValue = 50;
  const maxBlueColorValue = 200;

  const r = Math.floor(
    Math.random() * (maxRedColorValue - minRedColorValue) + minRedColorValue
  );
  const g = Math.floor(
    Math.random() * (maxGreenColorValue - minGreenColorValue) +
      minGreenColorValue
  );
  const b = Math.floor(
    Math.random() * (maxBlueColorValue - minBlueColorValue) + minBlueColorValue
  );

  return `rgb(${r},${g},${b})`;
};

export const getRandomHorizontalShift = () => Math.floor(Math.random() * 2);

export const getRandomTwinkleTime = () => 1 + Math.floor(Math.random() * 7);

export const getRandomSize = () => 1 + Math.floor(Math.random() * 5);

export const getRandomColor = () => {
  const minColorValue = 128;
  const maxColorValue = 255;

  const r = Math.floor(
    Math.random() * (maxColorValue - minColorValue) + minColorValue
  );
  const g = Math.floor(
    Math.random() * (maxColorValue - minColorValue) + minColorValue
  );
  const b = Math.floor(
    Math.random() * (maxColorValue - minColorValue) + minColorValue
  );
  return `rgb(${r},${g},${b})`;
};

export const getRandomLightColor = () => {
  const minColorValue = 128;
  const maxColorValue = 255;

  const r = Math.floor(
    Math.random() * (maxColorValue - minColorValue) + minColorValue
  );
  const g = Math.floor(
    Math.random() * (maxColorValue - minColorValue) + minColorValue
  );
  const b = Math.floor(
    Math.random() * (maxColorValue - minColorValue) + minColorValue
  );
  return `rgb(${r},${g},${b})`;
};

export const getRandomSaturatedLightColor = () => {
  const randomHueExceptGreen = () => {
    let hue;
    do {
      // Generate a hue between 0 and 360, excluding the green range (100-150)
      hue =
        Math.floor(Math.random() * 261) +
        (Math.floor(Math.random() * 2) === 0 ? 0 : 150);
    } while (hue >= 100 && hue <= 150);

    return hue;
  };

  const hslToRgb = (h, s, l) => {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  const hue = randomHueExceptGreen();
  const saturation = 0.8;
  const lightness = 0.6;
  const rgb = hslToRgb(hue / 360, saturation, lightness);

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};

export const minValue = (hand) =>
  hand.reduce((acc, { value }) => Math.min(...WEIGHT[value]) + acc, 0);
export const maxValue = (hand) =>
  hand.reduce((acc, { value }) => Math.max(...WEIGHT[value]) + acc, 0);

export const bestScore = (hand) => {
  let maxScore = maxValue(hand);
  let minScore = minValue(hand);

  if (maxScore > 21) {
    return minScore;
  } else {
    return maxScore;
  }
};
export const isBust = (hand) => minValue(hand) > 21;

export const isSplit = (hand) =>
  hand.length === 2 && WEIGHT[hand[0].value][0] === WEIGHT[hand[1].value][0];

export const getZIndex = (y) => y - 1000;

export const getAvailablePlays = ({ hands }) => {
  const newPlays = [];
  newPlays.push(`stay`);
  if (hands.length === 1 && hands[0].length === 2) {
    newPlays.push(`double-down`);
  }
  hands.forEach((hand, index) => {
    // Add "hit" and "stay" for every hand thats not 21
    if (bestScore(hand) <= 21) newPlays.push(`hit-${index}`);

    if (isSplit(hand)) newPlays.push(`split-${index}`);
  });

  return newPlays;
};


export const suggest = (hand, upCard) => {
  const upCardIndex = WEIGHT[upCard][0] - 2
  const [card1, card2] = hand.map(card => card.value);

  if (card1 === card2) {
    // Pair case
    const pairKey = `${card1}-${card2}`;
    return CHEAT_SHEET[pairKey][upCardIndex];
  }
  if (card1 === 'ace' || card2 === 'ace') {
    // Soft hand case
    const softKey = card1 === 'ace' ? `A-${card2}` : `A-${card1}`;
    return CHEAT_SHEET[softKey][upCardIndex];
  }  
  // Hard hand case
  const total = WEIGHT[card1][0] + WEIGHT[card2][0];
  if (total >= 17) {
    return ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"][upCardIndex];
  } 
  
  return CHEAT_SHEET[total][upCardIndex] !== undefined ? CHEAT_SHEET[total][upCardIndex] : null;
}