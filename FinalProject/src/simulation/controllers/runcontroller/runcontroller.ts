import Simulation from '../../simulation';
import ControllerElement from './elements/controllerelement';
import ChangeParameterElement from './elements/changeparameterelement';
import ThenElement from './elements/thenelement';
import RepeatElement from './elements/repeatelement';
import ResetParamsElement from './elements/resetparamselement';
import RunElement from './elements/runelement';

/**
 * Controls running and re-running the simulation based on various conditions.
 */
export default class RunController {
  public parent: HTMLElement;
  public simulation: Simulation;
  public elements: ControllerElement[];
  public step: number;
  public run: number;
  public runNum: number;
  public numRuns: number;
  public realizations: number;

  /**
   * @constructor
   * @param {HTMLElement} parent - the parent element to host all of the run contoller UI.
   * @param {HTMLButtonElement} button - the button element to toggle the parent's visibility on and off.
   * @param {Simulation} simulation - the simulation object that parents all other code.
   */
  constructor(parent: HTMLElement, button: HTMLButtonElement, simulation: Simulation) {
    this.parent = parent;
    this.simulation = simulation;

    const runLabel = document.createElement<'label'>('label');
    runLabel.htmlFor = 'runType0';
    runLabel.innerHTML = 'Run ';
    this.parent.appendChild(runLabel);

    this.step = 0;
    this.elements = [new RunElement(this.step, this)];
    this.step++;

    this.realizations = 1;
    this.runNum = 0;
    this.run = 0;
    this.nextRunStep();

    parent.style.display = 'none';
    button.addEventListener('click', () => {
      if (parent.style.display == 'none') {
        parent.style.display = 'block';
      } else {
        parent.style.display = 'none';
      }
    });
  }

  /**
   * Adds a new element to the list.
   * @param {ControllerElement} type - the type of element to add to the list.
   */
  public addElement(type: string) {
    let newElement: ControllerElement;
    switch (type) {
    default:
    case 'run':
      newElement = new RunElement(this.step, this);
      break;
    case 'then':
      newElement = new ThenElement(this.step, this);
      break;
    case 'add':
      newElement = new ChangeParameterElement(this.step, this, 'add');
      break;
    case 'sub':
      newElement = new ChangeParameterElement(this.step, this, 'sub');
      break;
    case 'mult':
      newElement = new ChangeParameterElement(this.step, this, 'mult');
      break;
    case 'div':
      newElement = new ChangeParameterElement(this.step, this, 'div');
      break;
    case 'repeat':
      newElement = new RepeatElement(this.step, this);
      break;
    case 'reset':
      newElement = new ResetParamsElement(this.step, this);
      break;
    }
    this.elements.push(newElement);
    this.step++;
    this.run = 0;
  }

  /**
   * Removes elements after a certain index
   * in the this.elements array from the dom,
   * then removes them from this.elements.
   * @param {number} index - the index of the last element to keep.
   */
  public removeElementsAfter(index: number) {
    for (let i: number = this.elements.length - 1; i > index; i--) {
      this.parent.removeChild(this.elements[i].element);
      this.elements.pop();
    }
    this.step = index + 1;
  }

  /**
   * Interprets a step from the this.elements list, and performs the actions instructed by the element type.
   */
  public nextRunStep() {
    // console.log(`running step ${this.run}`);
    if (this.run >= this.elements.length) {
      this.simulation.speedController.pause();
      this.simulation.flocking.restart();
      return;
    }
    const element: ControllerElement = this.elements[this.run];
    switch (element.type) {
    default:
    case 'run':
      this.runNum++;
      if (this.runNum > this.numRuns) {
        this.numRuns++;
        this.simulation.dataController.numRuns = this.numRuns;
      }
      const runElement: RunElement = element as RunElement;
      this.simulation.flocking.maxTimestep = runElement.duration;
      this.simulation.flocking.restart();
      this.run++;
      break;
    case 'then':
      this.run++;
      this.nextRunStep();
      break;
    case 'param':
      const paramElement: ChangeParameterElement = element as ChangeParameterElement;
      switch (paramElement.parameter) {
      case 'N':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.N += paramElement.amount;
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.N -= paramElement.amount;
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.N *= paramElement.amount;
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.N /= paramElement.amount;
        }
        break;
      case 'R':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.R += paramElement.amount;
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.R -= paramElement.amount;
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.R *= paramElement.amount;
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.R /= paramElement.amount;
        }
        break;
      case 'width':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.width += paramElement.amount;
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.width -= paramElement.amount;
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.width *= paramElement.amount;
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.width /= paramElement.amount;
        }
        break;
      case 'height':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.height += paramElement.amount;
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.height -= paramElement.amount;
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.height *= paramElement.amount;
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.height /= paramElement.amount;
        }
        break;
      case 'centerX':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.center.setX(
            this.simulation.parameters.center.x + paramElement.amount,
          );
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.center.setX(
            this.simulation.parameters.center.x - paramElement.amount,
          );
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.center.setX(
            this.simulation.parameters.center.x * paramElement.amount,
          );
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.center.setX(
            this.simulation.parameters.center.x / paramElement.amount,
          );
        }
        break;
      case 'centerY':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.center.setY(
            this.simulation.parameters.center.y + paramElement.amount,
          );
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.center.setY(
            this.simulation.parameters.center.y - paramElement.amount,
          );
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.center.setY(
            this.simulation.parameters.center.y * paramElement.amount,
          );
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.center.setY(
            this.simulation.parameters.center.y / paramElement.amount,
          );
        }
        break;
      case 'startX':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.start.setX(
            this.simulation.parameters.start.x + paramElement.amount,
          );
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.start.setX(
            this.simulation.parameters.start.x - paramElement.amount,
          );
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.start.setX(
            this.simulation.parameters.start.x * paramElement.amount,
          );
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.start.setX(
            this.simulation.parameters.start.x / paramElement.amount,
          );
        }
        break;
      case 'startY':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.start.setY(
            this.simulation.parameters.start.y + paramElement.amount,
          );
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.start.setY(
            this.simulation.parameters.start.y - paramElement.amount,
          );
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.start.setY(
            this.simulation.parameters.start.y * paramElement.amount,
          );
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.start.setY(
            this.simulation.parameters.start.y / paramElement.amount,
          );
        }
        break;
      case 'P':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.P += paramElement.amount;
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.P -= paramElement.amount;
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.P *= paramElement.amount;
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.P /= paramElement.amount;
        }
        break;
      case 'V':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.V += paramElement.amount;
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.V -= paramElement.amount;
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.V *= paramElement.amount;
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.V /= paramElement.amount;
        }
        break;
      case 'c1':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.c1 += paramElement.amount;
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.c1 -= paramElement.amount;
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.c1 *= paramElement.amount;
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.c1 /= paramElement.amount;
        }
        break;
      case 'c2':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.c2 += paramElement.amount;
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.c2 -= paramElement.amount;
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.c2 *= paramElement.amount;
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.c2 /= paramElement.amount;
        }
        break;
      case 'c3':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.c3 += paramElement.amount;
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.c3 -= paramElement.amount;
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.c3 *= paramElement.amount;
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.c3 /= paramElement.amount;
        }
        break;
      case 'c4':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.c4 += paramElement.amount;
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.c4 -= paramElement.amount;
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.c4 *= paramElement.amount;
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.c4 /= paramElement.amount;
        }
        break;
      case 'vlim':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.vlimit += paramElement.amount;
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.vlimit -= paramElement.amount;
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.vlimit *= paramElement.amount;
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.vlimit /= paramElement.amount;
        }
        break;
      case 'repellantStrength':
        if (paramElement.operation == 'add') {
          this.simulation.parameters.repellantStrength += paramElement.amount;
        } else if (paramElement.operation == 'sub') {
          this.simulation.parameters.repellantStrength -= paramElement.amount;
        } else if (paramElement.operation == 'mult') {
          this.simulation.parameters.repellantStrength *= paramElement.amount;
        } else if (paramElement.amount != 0) {
          this.simulation.parameters.repellantStrength /= paramElement.amount;
        }
        break;
      }
      this.run++;
      this.nextRunStep();
      break;
    case 'repeat':
      const repeatElement: RepeatElement = element as RepeatElement;
      if (repeatElement.timesLeft == 0) {
        this.run++;
      } else {
        this.run = 0;
        if (repeatElement.timesLeft > 0) {
          repeatElement.timesLeft--;
        }
      }
      this.nextRunStep();
      break;
    case 'reset':
      this.simulation.parameters.reset();
      this.realizations++;
      this.runNum = 0;
      this.elements.forEach((e) => {
        if (e.type == 'repeat') {
          const repeatElement: RepeatElement = e as RepeatElement;
          repeatElement.timesLeft = repeatElement.times;
        }
      });
      this.run++;
      this.nextRunStep();
      break;
    }
  }
}
