import * as P5 from 'p5';
import Simulation from '../simulation';

interface SnapPoint {
  position: number,
  value: number,
  label: string,
}

/**
 * A slider adjustable value to control the speed of the simulation
 */
export default class SpeedController {
  public speed: number;

  private parent: HTMLElement;
  private simulation: Simulation;
  private width: number;
  private height: number;
  private margin: number;
  private padding: number;
  private thickness: number;
  private handlePosition: number;
  private snapPoints: SnapPoint[];

  /**
   * @param {HTMLCanvasElement} parent - p5 canvas element.
   * @param {Simulation} simulation - the settings object for simulation.
   * @constructor
   */
  constructor(parent: HTMLElement, simulation: Simulation) {
    this.parent = parent;
    this.simulation = simulation;
    this.width = parent.offsetWidth;
    this.height = parent.offsetHeight;
    this.margin = 16;
    this.padding = 2;
    this.thickness = 7;

    this.updateSnapPoints();
    this.pause();
    this.initSketch();
  }

  /**
   * Sets the handle position and speed values to the third snap point (default 'play' value).
   */
  public play() {
    this.handlePosition = this.snapPoints[2].position;
    this.speed = this.snapPoints[2].value;
  }

  /**
   * Sets the handle position and speed to the last snap point (default 'pause' value).
   */
  public pause() {
    this.handlePosition = this.snapPoints[this.snapPoints.length - 1].position;
    this.speed = this.snapPoints[this.snapPoints.length - 1].position;
  }

  /**
   * Updates the tick marks on the slider based on Settings.N
   */
  private updateSnapPoints() {
    const sliderWidth = this.width - (this.margin + this.padding) * 2;
    this.snapPoints = [
      {
        position: this.width - this.margin - this.padding,
        value: -1,
        label: 'Max',
      },
      {
        position: sliderWidth * 9 / 10 + this.margin + this.padding,
        value: this.simulation.parameters.N * 2,
        label: '2x',
      },
    ];
    let numTicks = 0;
    while (this.simulation.parameters.N >> numTicks > 0) {
      let d: string = '';
      if (numTicks > 0) {
        d = '/' + Math.pow(2, numTicks).toString();
      }
      this.snapPoints.push({
        position: this.margin + this.padding + ((sliderWidth * 3 / 5) >> numTicks),
        value: this.simulation.parameters.N >> numTicks,
        label: `1${d}x`,
      });
      numTicks++;
    }
    this.snapPoints.push({ position: this.margin + this.padding, value: 0, label: 'Paused' });

    let conflicts: boolean = this.checkAndResolveSnapConflicts();
    if (conflicts) {
      for (let i: number = 0; i < 400; i++) {
        conflicts = this.checkAndResolveSnapConflicts();
        if (!conflicts) {
          break;
        }
      }
    }
  }

  /**
   * Checks for snap points with conflicting position values, and attempts a fix.
   * @return {boolean} true if any conflicts were found.
   */
  private checkAndResolveSnapConflicts(): boolean {
    let conflicts: boolean = false;
    this.snapPoints.forEach((point1) => {
      this.snapPoints.forEach((point2) => {
        if (point1.position == point2.position && point1.value != point2.value) {
          if (point1.value > point2.value) {
            point1.position++;
          } else {
            point2.position++;
          }
          conflicts = true;
        }
      });
    });
    return conflicts;
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

    p5.strokeWeight(1.2);
    p5.stroke(255);
    this.updateSnapPoints();
    this.snapPoints.forEach((point) => {
      p5.line(
        point.position,
        (this.height - this.thickness) / 2 + 1,
        point.position,
        (this.height + this.thickness) / 2 - 2,
      );
    });

    p5.fill(229, 115, 115);
    p5.noStroke();
    let radius: number = this.margin;
    let closestSnapPoint: SnapPoint = this.snapPoints[0];
    this.snapPoints.forEach((point) => {
      const currentDist = Math.abs(this.handlePosition - point.position);
      const minDist = Math.abs(this.handlePosition - closestSnapPoint. position);
      if (currentDist < minDist) {
        closestSnapPoint = point;
      }
    });
    if (p5.mouseIsPressed &&
        p5.mouseX >= 0 && p5.mouseX <= this.width &&
        p5.mouseY >= 0 && p5.mouseY <= this.height) {
      // uncomment for mouse debugging: console.log(`x:${p5.mouseX}, y:${p5.mouseY}`);
      this.handlePosition = p5.constrain(p5.mouseX, this.margin, this.width - this.margin);
      radius *= 1.333;
    } else {
      this.handlePosition = closestSnapPoint.position;
    }
    p5.circle(this.handlePosition, this.height / 2, radius);
    p5.fill(255);
    p5.text(closestSnapPoint.label, this.width / 2, this.height / 2 + this.thickness * 3);
    this.speed = closestSnapPoint.value;
  }

  /**
   * Creates the p5 instance.
   */
  private initSketch() {
    new P5((self: P5) => {
      self.setup = () => this.setup(self);
      self.draw = () => this.draw(self);
    });
  }
}
