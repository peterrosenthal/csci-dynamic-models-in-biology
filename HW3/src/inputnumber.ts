import * as P5 from 'p5';
import Simulation from './simulation';

interface Return {
  frame: number;
  position: number;
}

interface Handle {
  position: number;
  radius: number;
  spacing: number;
  width: number;
  isDragging: boolean;
  return: Return;
}

/**
 * An input field and slide-y editor made in p5*js to input a number.
 */
export default class InputNumber {
  public value: number;
  public type: string;

  private parent: HTMLElement;
  private width: number;
  private height: number;
  private simulaton: Simulation;
  private min: number;
  private max: number;
  private reset: boolean;
  private input: HTMLInputElement;
  private handle: Handle;

  /**
   * @constructor
   * @param {HTMLElement} parent - parent element of the sketch and text box.
   * @param {Simulation} simulation - the simulation class that parent's all the code.
   * @param {number} min - the minimum value that it can go.
   * @param {number} max - the maximum value of the input.
   * @param {string} type - the type of input, 'int' or 'float'.
   * @param {boolean} reset - restarts the simulation upon this.value changing if set to 'true'.
   * @param {number} value - the default value.
   */
  constructor(
    parent: HTMLElement,
    simulation: Simulation,
    min: number,
    max: number,
    type: string,
    reset: boolean,
    value: number,
  ) {
    this.parent = parent;
    this.width = parent.offsetWidth;
    this.height = parent.offsetHeight / 2;
    this.handle = {
      position: this.width / 2,
      radius: this.height / 4,
      spacing: this.height / 8,
      width: this.height * 9 / 8,
      isDragging: false,
      return: { frame: 0, position: this.width / 2 },
    };
    this.simulaton = simulation;
    this.min = min;
    this.max = max;
    this.type = type;
    this.reset = reset;
    this.value = value;
    if (this.type = 'int') {
      this.value = Math.round(this.value);
    }
    this.input = this.parent.querySelector<'input'>('input');
    this.input.value = this.value.toString();
    this.input.addEventListener('focusout', () => {
      // TODO: make sure this.inputEl.value *is* a number, or catch the exception(s) thrown by parseInt/Float()
      if (this.type == 'int') {
        this.value = parseInt(this.input.value);
      } else {
        this.value = parseFloat(this.input.value);
      }
      if (this.reset) {
        this.simulaton.flocking.restart();
      }
    });
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
    // calculate handle position and this.value(s)
    let add: number = 0;

    if (p5.mouseIsPressed) {
      if (this.handle.isDragging) {
        if (p5.mouseX > 0 && p5.mouseX < this.width &&
            p5.mouseY > 0 && p5.mouseY < this.height) {
          this.handle.position = p5.constrain(
            p5.mouseX,
            this.handle.width / 2,
            this.width - this.handle.width / 2,
          );
          add = (this.handle.position - this.width / 2) /
                (this.width / 2) *
                Math.pow(2, Math.ceil(Math.log(this.value)));
        }
      } else if (p5.mouseX > (this.width - this.handle.width) / 2 &&
                 p5.mouseX < (this.width + this.handle.width) / 2 &&
                 p5.mouseY > 0 && p5.mouseY < this.height) {
        this.handle.isDragging = true; // waits till the next frame to actually start taking input cause lazy
      }
    } else if (this.handle.isDragging) {
      this.handle.isDragging = false;
      this.handle.return.frame = p5.frameCount;
      this.handle.return.position = this.handle.position;
    }

    if (p5.frameCount - this.handle.return.frame < 10) {
      this.handle.position = p5.lerp(
        this.handle.return.position,
        this.width / 2,
        (p5.frameCount - this.handle.return.frame) / 10,
      );
    }

    if (add != 0) {
      if (this.type == 'int') {
        if (add < 1 && add > -1) {
          // add 1 every 1/add frames
        } else {
          this.value += Math.round(add);
        }
      } else {
        this.value += add;
      }
      this.input.value = this.value.toString();
      if (this.reset) {
        this.simulaton.flocking.restart();
      }
    }

    // draw handle
    p5.clear();
    p5.fill(63, 81, 181);
    p5.noStroke();
    p5.circle(
      this.handle.position - this.handle.radius - this.handle.spacing / 2,
      this.height / 2,
      this.handle.radius * 2,
    );
    p5.circle(
      this.handle.position + this.handle.radius + this.handle.spacing / 2,
      this.height / 2,
      this.handle.radius * 2,
    );
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
