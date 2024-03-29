import * as P5 from 'p5';
import P5Plot from './p5plot';

/**
 * P5PlotFieldVsField: a class to plot a specified field vs another specifed field
 */
export default class P5PlotFieldVsField extends P5Plot {
  private fieldX: number[];
  private fieldY: number[];

  /**
   * @constructor
   * @param {number[]} fieldX - the field to plot along the x-axis.
   * @param {number[]} fieldY - the field to plot along the y-axis.
   * @param {number[]} timesteps - helps determine coloring,
   * may be a repeat of one of the fields, but c`est la vie.
   * @param {HTMLElement} parent - the HTML element to set as the parent of the p5 sketch.
   * @param {string} title - the title of the graph.
   * @param {string} xlabel - the label for the x-axis.
   * @param {string} ylabel - the label for the y-axis.
   * @param {number} id - identification number of the graph... useful for identification.
   */
  constructor(
    fieldX: number[],
    fieldY: number[],
    timesteps: number[],
    parent: HTMLElement,
    title: string,
    xlabel: string,
    ylabel: string,
    id: number,
  ) {
    super(timesteps, parent, title, xlabel, ylabel, id);

    this.fieldX = fieldX;
    this.fieldY = fieldY;

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
    if (this.remove) {
      p5.remove();
    }
    // set scale
    if (this.fieldX.length > 0) {
      for (let i:number = this.fieldX.length - 1;
        i >= Math.min(0, this.fieldX.length - 10);
        i--) {
        if (this.fieldX[i] > this.max.x) {
          this.max.setX(this.fieldX[i]);
        }
      }
      this.scale.setX((p5.width - this.margin * 3) / this.max.x);
    }
    if (this.fieldY.length > 0) {
      for (let i: number = this.fieldY.length - 1;
        i >= Math.min(0, this.fieldY.length - 10);
        i--) {
        if (this.fieldY[i] > this.max.y) {
          this.max.setY(this.fieldY[i]);
        }
      }
      this.scale.setY((p5.height - this.margin * 3) / this.max.y);
    }

    // set draw characteristics
    p5.background(236, 239, 241);
    p5.stroke(136, 14, 79);
    p5.strokeWeight(2.5);

    // find number of runs, this determines coloring
    let numRuns: number = 0;
    this.timesteps.forEach((timestep) => {
      if (timestep == 1) {
        numRuns++;
      }
    });

    // draw line plots
    let runIndex: number = 0;
    for (let i: number = 1; i < Math.max(this.fieldX.length, this.fieldY.length); i++) {
      if (this.timesteps[i] == 1) {
        runIndex++;
      } else {
        p5.stroke(
          21 + runIndex * ((216 - 21) / numRuns),
          101 - runIndex * ((101 - 67) / numRuns),
          192 - runIndex * ((192 - 21) / numRuns),
        );
        p5.line(
          this.margin * 2 + this.fieldX[i - 1] * this.scale.x,
          p5.height - (this.margin * 2 + this.fieldY[i - 1] * this.scale.y),
          this.margin * 2 + this.fieldX[i] * this.scale.x,
          p5.height - (this.margin * 2 + this.fieldY[i] * this.scale.y),
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

    // draw title
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.noStroke();
    p5.fill(0);
    p5.textSize(18);
    p5.text(this.title, this.width / 2, 2);

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
      p5.text(
        (this.max.x * i / 4).toFixed(2),
        this.margin * 2 + (this.width - 3 * this.margin) * i / 4,
        this.height - this.margin * 4 / 3,
      );
      p5.text(
        (this.max.y * i / 4).toFixed(2),
        this.margin * 7 / 6,
        this.height - this.margin * 2 - (this.height - 3 * this.margin) * i / 4,
      );
      p5.stroke(0);
      p5.strokeWeight(0.9);
      p5.line(
        this.margin * 2 + (this.width - 3 * this.margin) * i / 4,
        this.height - this.margin * 1.8,
        this.margin * 2 + (this.width - 3 * this.margin) * i / 4,
        this.height - this.margin * 2.1,
      );
      p5.line(
        this.margin * 1.8,
        this.height - this.margin * 2 - (this.height - 3 * this.margin) * i / 4,
        this.margin * 2.1,
        this.height - this.margin * 2 - (this.height - 3 * this.margin) * i / 4,
      );
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
