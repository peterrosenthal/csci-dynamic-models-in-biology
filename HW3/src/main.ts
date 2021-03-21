import Flocking2D from './flocking2d';
import Settings from './settings';

const flocking2d = new Flocking2D(
  document.getElementById("sketch") as HTMLCanvasElement,
  new Settings(),
);
