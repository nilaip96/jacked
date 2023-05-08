export const startInputAnimation = (controls, ref) => {
  const randomX = 10 + Math.floor(Math.random() * 50);
  const randomY = 10 + Math.floor(Math.random() * 20);
  const randomTime = 5 + Math.floor(Math.random() * 20);

  controls.start({
    x: [0, randomX, -randomX, 0],
    y: [0, -randomY, 0],
    transition: {
      duration: randomTime,
      times: [0, 0.5, 1],
      ease: "easeInOut",
      repeat: Infinity,
      onRepeat: () => {
        // Force input element to lose focus when animation restarts
        if (document.activeElement === ref.current) {
          ref.current.blur();
        }
      },
    },
  });
};

export const startTypingAnimation = (controls) => {
  const degrees = 1;
  controls.start({
    rotate: [-degrees, degrees, -degrees, degrees, 0],
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
    zIndex: 2,
  });
};

export const startButtonAnimation = (controls, ref) => {
  const randomX = 10 + Math.floor(Math.random() * 200);
  const randomY = 10 + Math.floor(Math.random() * 100);
  const randomTime = 5 + Math.floor(Math.random() * 5);

  controls.start({
    x: [0, randomX, -randomX, 0],
    y: [0, randomY, 0],
    transition: {
      duration: randomTime,
      times: [0, 0.5, 1],
      ease: "easeInOut",
      repeat: Infinity,
      onRepeat: () => {
        // Force input element to lose focus when animation restarts
        if (document.activeElement === ref.current) {
          ref.current.blur();
        }
      },
    },
  });
};
