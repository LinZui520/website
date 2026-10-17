export const FADE_IN_FROM = {
  opacity: 0,
  y: 18,
  scaleY: 1.1,
  filter: 'blur(10px)'
};

export const FADE_IN_TO = {
  opacity: 1,
  y: 0,
  scaleY: 1,
  filter: 'blur(0px)',
  duration: 1.5,
  stagger: 0.09,
  ease: 'expo.out'
};
