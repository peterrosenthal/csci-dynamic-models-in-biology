import * as P5 from 'p5';
import P5Plot from './p5plot';

/**
 * P5PlotFieldVsParam: a class to plot a specified field vs a specifed parameter.
 */
export default class P5PlotFieldVsField extends P5Plot {
  private field: number[];
  private param: number[];

  /**
   * @constructor
   * @param {number[]} param - the parameter to plot along the y-axis.
   * @param {number[]} field - the field to plot along the x-axis.
   * @param {number[]} timesteps - the timesteps array.
   * @param {HTMLElement} parent - the HTML element to set as the parent of the p5 sketch.
   * @param {string} title - the title of the graph.
   * @param {string} xlabel - the label for the x-axis.
   * @param {string} ylabel - the label for the y-axis.
   * @param {number} id - identification number of the graph... useful for identification.
   */
  constructor(
    param: number[],
    field: number[],
    timesteps: number[],
    parent: HTMLElement,
    title: string,
    xlabel: string,
    ylabel: string,
    id: number,
  ) {
    super(timesteps, parent, title, xlabel, ylabel, id);

    this.param = param;
    this.field = field;

    this.max.setX(param[param.length - 1]);
    this.min.setX(param[0]);

    this.initSketch();
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
    // set scale
    // TODO: fix this scaling sitch
    this.max.setX(this.param[this.param.length - 1]);
    this.min.setX(this.param[0]);
    this.scale.setX(this.param.length);
    if (this.field.length > 0) {
      for (let i: number = 0; i < this.field.length; i++) {
        if (this.field[i] > this.max.y) {
          this.max.setY(this.field[i]);
        }
      }
      this.scale.setY((p5.height - this.margin * 3) / this.max.y);
    }

    // calculate time average field values
    const fieldAvg: number[] = [];
    for (let i: number = 0; i < this.param.length; i++) {
      fieldAvg.push(0);
    }
    let runIndex: number = -1;
    for (let i: number = 0; i < this.field.length; i++) {
      // maybe keep track of parameter changing instead of timestep resetting to 0?
      if (this.timesteps[i] == 1) {
        runIndex++;
      }
      if (runIndex >= 0 && runIndex < fieldAvg.length) {
        fieldAvg[runIndex] += this.field[i];
      }/* else {
        console.log(`something went wrong, runIndex:${runIndex}`);
      }*/
    }
    for (let i: number = 0; i < fieldAvg.length; i++) {
      // gives inaccurate results up untill the graph is fully filled, then it should be good
      fieldAvg[i] /= this.field.length / (runIndex + 1);
    }

    // draw graph
    p5.background(255);
    if (Math.min(this.param.length, fieldAvg.length) < 2) {
      p5.noStroke();
      p5.fill(0, 105, 92);
      for (let i: number = 0; i < Math.min(this.param.length, fieldAvg.length); i++) {
        p5.circle(this.width / 2, p5.height - (this.margin * 2 + fieldAvg[i] * this.scale.y), 10);
      }
    } else {
      p5.stroke(0, 105, 92);
      p5.strokeWeight(2.5);
      for (let i: number = 1; i < Math.min(this.param.length, fieldAvg.length); i++) {
        p5.line(
          this.margin * 2 + (this.width - 3 * this.margin) * (i - 1) / (this.param.length - 1),
          this.height - (this.margin * 2 + fieldAvg[i - 1]* this.scale.y),
          this.margin * 2 + (this.width - 3 * this.margin) * i / (this.param.length - 1),
          this.height - (this.margin * 2 + fieldAvg[i]* this.scale.y),
        );
      }
    }

    // draw axes
    p5.stroke(0);
    p5.strokeWeight(1.5);
    p5.line(
      this.margin * 2,
      p5.height - this.margin * 2,
      this.margin * 2,
      this.margin,
    );
    p5.line(
      this.margin * 2,
      p5.height - this.margin * 2,
      p5.width - this.margin,
      p5.height - this.margin * 2,
    );

    // draw graph title
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.noStroke();
    p5.fill(0);
    p5.textSize(18);
    p5.text(this.title, this.width / 2, 0);

    // draw axes labels
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(12);
    p5.text(this.xlabel, this.width / 2, this.height - this.margin * 3 / 4);
    p5.push();
    p5.translate(6, this.height / 2);
    p5.rotate(Math.PI / 2);
    p5.text(this.ylabel, 0, 0);
    p5.pop();

    // draw axes ticks
    for (let i: number = 0; i < 5; i++) {
      p5.noStroke();
      if (this.param.length > 10) {
        p5.text(
          (this.min.x + this.max.x * i / 4).toFixed(2),
          this.margin * 2 + (this.width - 3 * this.margin) * i / 4,
          this.height - this.margin * 4 / 3,
        );
      }
      p5.text(
        (this.max.y * i / 4).toFixed(2),
        this.margin * 7 / 6,
        this.height - this.margin * 2 - (this.height - 3 * this.margin) * i / 4,
      );
      p5.stroke(0);
      p5.strokeWeight(0.9);
      if (this.param.length > 10) {
        p5.line(
          this.margin * 2 + (this.width - 3 * this.margin) * i / 4,
          this.height - this.margin * 1.8,
          this.margin * 2 + (this.width - 3 * this.margin) * i / 4,
          this.height - this.margin * 2.1,
        );
      }
      p5.line(
        this.margin * 1.8,
        this.height - this.margin * 2 - (this.height - 3 * this.margin) * i / 4,
        this.margin * 2.1,
        this.height - this.margin * 2 - (this.height - 3 * this.margin) * i / 4,
      );
    }
    // x-axis gets special ticks if there's less than 10 values
    if (this.param.length > 1 && this.param.length <= 10) {
      for (let i: number = 0; i < this.param.length; i++) {
        p5.noStroke();
        p5.text(
          this.param[i].toFixed(2),
          this.margin * 2 + (this.width - 3 * this.margin) * i / (this.param.length - 1),
          this.height - this.margin * 4 / 3,
        );
        p5.stroke(0);
        p5.strokeWeight(0.9);
        p5.line(
          this.margin * 2 + (this.width - 3 * this.margin) * i / (this.param.length - 1),
          this.height - this.margin * 1.8,
          this.margin * 2 + (this.width - 3 * this.margin) * i / (this.param.length - 1),
          this.height - this.margin * 2.1,
        );
      }
    }
  }

  /**
   * Creates the p5 instance.
   */
  private initSketch() {
    new P5((self: P5) => {
      self.setup = () => this.setup(self);
      self.draw = () => this.draw(self);
      self.windowResized = () => {
        this.width = this.parent.offsetWidth;
        this.height = this.parent.offsetHeight;
        self.resizeCanvas(this.width, this.height);
      };
    });
  }
}
