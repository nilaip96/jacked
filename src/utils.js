export const getRandomPosition = () => {
  const x = Math.floor(Math.random() * 100);
  const y = Math.floor(Math.random() * 100);
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
