import * as P5 from 'p5';
import * as THREE from 'three';

/**
 * P5PlotFieldVsField: a class to plot a specified field vs another specifed field
 */
export default class P5PlotFieldVsField {
  private fieldX: number[];
  private fieldY: number[];
  private parent: HTMLElement;
  private width: number;
  private height: number;
  private margin: number;
  private scale: THREE.Vector2;
  private max: THREE.Vector2;

  /**
   * @constructor
   * @param {number[]} fieldX - the field to plot along the x-axis.
   * @param {number[]} fieldY - the field to plot along the y-axis.
   * @param {HTMLElement} parent - the HTML element to set as the parent of the p5 sketch.
   */
  constructor(fieldX: number[], fieldY: number[], parent: HTMLElement) {
    this.fieldX = fieldX;
    this.fieldY = fieldY;
    this.parent = parent;
    this.width = parent.offsetWidth;
    this.height = parent.offsetHeight;
    this.margin = 25;
    this.scale = new THREE.Vector2();
    this.max = new THREE.Vector2();

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

    p5.background(255);
    p5.stroke(0, 105, 92);
    p5.strokeWeight(2.5);

    for (let i: number = 1; i < Math.max(this.fieldX.length, this.fieldY.length); i++) {
      if (this.fieldX[i] == 1) {
        // cycle to the next color?
        // p5.stroke(173, 20, 87);
      } else {
        p5.line(
          this.margin * 2 + this.fieldX[i - 1] * this.scale.x,
          p5.height - (this.margin * 2 + this.fieldY[i - 1] * this.scale.y),
          this.margin * 2 + this.fieldX[i] * this.scale.x,
          p5.height - (this.margin * 2 + this.fieldY[i] * this.scale.y),
        );
      }
    }

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

    p5.textAlign(p5.CENTER, p5.CENTER);
    for (let i: number = 0; i < 5; i++) {
      p5.noStroke();
      p5.text(
        this.max.x * i / 4,
        this.margin * 2 + (this.width - 3 * this.margin) * i / 4,
        this.height - this.margin,
      );
      p5.text(
        (this.max.y * i / 4).toFixed(2),
        this.margin * 3 / 4,
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
    });
  }
}
