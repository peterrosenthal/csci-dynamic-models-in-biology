import * as THREE from 'three';
import * as P5 from 'p5';
import Settings from './settings';

/**
 * A slider adjustable value to control the speed of the simulation
 */
export default class SpeedController {
  private parent: HTMLElement;
  private settings: Settings;
  private width: number;
  private height: number;
  private margin: number;
  private thickness: number;
  private handlePosition: number;
  private minSeparation: number;
  private tickPositions: number[];
  private tickValues: number[];
  private tickLabels: string[];

  /**
   * @param {HTMLCanvasElement} parent - p5 canvas element.
   * @param {Settings} settings - the settings object for simulation.
   * @constructor
   */
  constructor(parent: HTMLElement, settings: Settings) {
    this.parent = parent;
    this.settings = settings;
    this.width = parent.offsetWidth;
    this.height = parent.offsetHeight;
    this.margin = 12;
    this.thickness = 7;
    this.handlePosition = this.width * 2 / 3;

    this.updateTicks();

    this.initSketch();
  }

  /**
   * Updates the tick marks on the slider based on Settings.N
   */
  private updateTicks() {
    const sliderWidth = this.width - this.margin * 2;
    this.tickPositions = [this.width - this.margin, sliderWidth * 9 / 10 + this.margin];
    this.tickValues = [-1, this.settings.N * 2];
    this.tickLabels = ['Max', '2x'];
    let numTicks = 0;
    while (this.settings.N >> numTicks > 0) {
      this.tickPositions.push(this.margin + ((sliderWidth * 3 / 5) >> numTicks));
      this.tickValues.push(this.settings.N >> numTicks);
      let d = '';
      if (numTicks > 0) {
        d = '/' + Math.pow(2, numTicks).toString();
      }
      this.tickLabels.push('1' + d + 'x');
      numTicks++;
    }
    this.tickPositions.push(this.margin);
    this.tickValues.push(0);
    this.tickLabels.push('Paused');
  }

  /**
   * p5 setup() function override.
   * @param {P5} p5 - the p5 instance.
   */
  private setup(p5: P5) {
    const canvas = p5.createCanvas(this.width, this.height);
    canvas.parent(this.parent);
  }

  /**
   * p5 draw() function override.
   * @param {p5} p5 - the p5 instance.
   */
  private draw(p5: P5) {
    p5.clear();

    p5.fill(211, 47, 47);
    p5.noStroke();
    p5.rect(
      this.margin,
      (this.height - this.thickness) / 2,
      this.width - this.margin * 2,
      this.thickness,
      2,
    );

    p5.strokeWeight(1);
    // p5.stroke(239, 154, 154);
    p5.stroke(255);
    this.updateTicks();
    this.tickPositions.forEach((pos) => {
      p5.line(pos, (this.height - this.thickness) / 2 + 1, pos, (this.height + this.thickness) / 2 - 2);
    });

    p5.fill(229, 115, 115);
    p5.noStroke();
    let radius: number = this.margin;
    let closestTick: number = 0;
    let closestTickLabel: string = '';
    this.tickPositions.forEach((pos, index) => {
      if (Math.abs(this.handlePosition - pos) < Math.abs(this.handlePosition - closestTick)) {
        closestTick = pos;
        closestTickLabel = this.tickLabels[index];
      }
    });
    if (p5.mouseIsPressed &&
        p5.mouseX >= 0 && p5.mouseX <= this.width &&
        p5.mouseY >= 0 && p5.mouseY <= this.height) {
      this.handlePosition = p5.constrain(p5.mouseX, this.margin, this.width - this.margin);
      radius *= 1.333;
    } else {
      this.handlePosition = closestTick;
    }
    p5.circle(this.handlePosition, this.height / 2, radius);
    p5.fill(255);
    p5.text(closestTickLabel, this.width / 2, this.height / 2 + this.thickness * 3);
  }

  /**
   * Creates the p5 instance.
   */
  private initSketch() {
    new P5((self: P5) => {
      self.setup = () => {
        this.setup(self);
      };
      self.draw = () => {
        this.draw(self);
      };
    });
  }
}
