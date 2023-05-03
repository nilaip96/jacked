export const getRandomPosition = () => {
  const x = 3 + Math.floor(Math.random() * 94);
  const y = 3 + Math.floor(Math.random() * 94);
  return { left: `${x}%`, top: `${y}%` };
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
