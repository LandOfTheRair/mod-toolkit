export const clone = obj => JSON.parse(JSON.stringify(obj));

export const objectPosition = (sprite, divisor) => {
  const y = Math.floor(sprite / divisor);
  const x = sprite % divisor;
  return `-${x * 64}px -${y * 64}px`;
};
