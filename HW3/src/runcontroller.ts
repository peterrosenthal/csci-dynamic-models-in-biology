import Simulation from './simulation';

/**
 * Base class for controller elements to extend.
 */
class ControllerElement {
  public id: number;
  public type: string;
  public runController: RunController;
  public element: HTMLElement;
  public punctuation: HTMLElement;

  /**
   * @constructor
   * @param {number} id - the id of the element, useful for HTML identifying.
   * @param {string} type - the type of the controller element.
   * @param {RunController} runController - the RunController object.
   */
  constructor(id: number, type: string, runController: RunController) {
    this.id = id;
    this.type = type;
    this.runController = runController;
    this.element = document.createElement<'span'>('span');
    this.element.id = `${this.type}Element${this.id}`;
    this.punctuation = document.createElement<'span'>('span');
    this.punctuation.id = `punctuation${this.id}`;
  }
}

/**
 * RunElement to be used in the run controller.
 * This is my second idea/attempt where a class helps hold onto the info
 * instead of losing track of it when we leave the scope of a function.
 */
class RunElement extends ControllerElement {
  public duration: number;

  public runTypeElement: HTMLSpanElement;
  public runDurationElement: HTMLSpanElement; // maybe replace this with exressive input later, but not yet.

  /**
   * @constructor
   * @param {number} id - the id of the run element, useful for HTML identifying.
   * @param {RunController} runController - the RunController object.
   */
  constructor(id: number, runController: RunController) {
    super(id, 'run', runController);
    this.addRunType();
    this.runController.parent.appendChild(this.element);
  }

  /**
   * Adds a run type element, assigns it to this.runTypeElment, and adds it as a child.
   */
  private addRunType() {
    this.runTypeElement = document.createElement<'span'>('span');
    const runTypeSelect: HTMLSelectElement = document.createElement<'select'>('select');
    const runIndefiniteOption: HTMLOptionElement = document.createElement<'option'>('option');
    const runForOption: HTMLOptionElement = document.createElement<'option'>('option');

    const id: string = `runType${this.id}`;

    runTypeSelect.id = id;
    runTypeSelect.name = id;

    runTypeSelect.addEventListener('change', () => {
      if (parseInt(runTypeSelect.value) > 0) {
        if (this.runDurationElement == null) {
          this.addRunDuration();
          this.element.removeChild(this.punctuation);
          this.punctuation.innerHTML = ',<br>';
          this.element.appendChild(this.punctuation);
          this.runController.addElement('then');
        }
      } else {
        this.duration = parseInt(runTypeSelect.value);
        if (this.runDurationElement != null) {
          this.element.removeChild(this.runDurationElement);
          this.runDurationElement = null;
          this.runController.removeElementsAfter(this.id);
          this.element.removeChild(this.punctuation);
          this.punctuation.innerHTML = '.';
          this.element.appendChild(this.punctuation);
        }
      }
    });

    runIndefiniteOption.value = '-1';
    runIndefiniteOption.innerHTML = 'indefinitely';
    runIndefiniteOption.selected = true;

    runForOption.value = '1';
    runForOption.innerHTML = 'until timestep';

    this.punctuation.innerHTML = '.';

    runTypeSelect.appendChild(runIndefiniteOption);
    runTypeSelect.appendChild(runForOption);
    this.runTypeElement.appendChild(runTypeSelect);
    this.element.appendChild(this.runTypeElement);
    this.element.appendChild(this.punctuation);
  }

  /**
   * Adds a run duration element, assigns it to this.runDurationElment, and adds it as a child.
   */
  private addRunDuration() {
    this.runDurationElement = document.createElement<'span'>('span');
    const runDurationLabel: HTMLLabelElement = document.createElement<'label'>('label');
    const runDurationInput: HTMLInputElement = document.createElement<'input'>('input');

    const id: string = `runDuration${this.id}`;

    runDurationLabel.htmlFor = id;
    runDurationLabel.innerHTML = ': ';

    runDurationInput.id = id;
    runDurationInput.name = id;
    runDurationInput.type = 'number';
    runDurationInput.step = '1';
    runDurationInput.value = '100';

    runDurationInput.addEventListener('change', () => {
      this.duration = parseInt(runDurationInput.value);
    });
    this.duration = parseInt(runDurationInput.value);

    this.runDurationElement.appendChild(runDurationLabel);
    this.runDurationElement.appendChild(runDurationInput);
    this.element.appendChild(this.runDurationElement);
  }
}

/**
 * A ThenElement gives the user the ability to continue doing something
 * with the simulation after a previous acton.
 */
class ThenElement extends ControllerElement {
  /**
   * @constructor
   * @param {number} id - the id number, helpful for HTML identification.
   * @param {RunController} runController - the RunController object.
   */
  constructor(id: number, runController: RunController) {
    super(id, 'then', runController);

    const thenLabel: HTMLLabelElement = document.createElement<'label'>('label');
    const thenSelect: HTMLSelectElement = document.createElement<'select'>('select');
    const thenStopOption: HTMLOptionElement = document.createElement<'option'>('option');
    const thenRunOption: HTMLOptionElement = document.createElement<'option'>('option');
    const thenAddOption: HTMLOptionElement = document.createElement<'option'>('option');
    const thenSubOption: HTMLOptionElement = document.createElement<'option'>('option');
    const thenMultOption: HTMLOptionElement = document.createElement<'option'>('option');
    const thenDivOption: HTMLOptionElement = document.createElement<'option'>('option');
    const thenRepeatOption: HTMLOptionElement = document.createElement<'option'>('option');
    const thenResetOption: HTMLOptionElement = document.createElement<'option'>('option');

    thenLabel.htmlFor = `thenSelect${this.id}`;
    thenLabel.innerHTML = 'then ';

    thenSelect.id = thenLabel.htmlFor;
    thenSelect.name = thenSelect.id;

    thenSelect.addEventListener('change', () => {
      switch (thenSelect.value) {
      default:
        this.runController.removeElementsAfter(this.id);
        this.element.removeChild(this.punctuation);
        this.punctuation.innerHTML = '.';
        this.element.appendChild(this.punctuation);
        break;
      case 'run':
      case 'add':
      case 'sub':
      case 'mult':
      case 'div':
      case 'repeat':
      case 'reset':
        this.runController.removeElementsAfter(this.id);
        this.element.removeChild(this.punctuation);
        this.punctuation.innerHTML = '';
        this.element.appendChild(this.punctuation);
        this.runController.addElement(thenSelect.value);
      }
    });

    thenStopOption.value = '';
    thenStopOption.innerHTML = 'stop';
    thenStopOption.selected = true;

    thenRunOption.value = 'run';
    thenRunOption.innerHTML = 'run';

    thenAddOption.value = 'add';
    thenAddOption.innerHTML = 'increase parameter';

    thenSubOption.value = 'sub';
    thenSubOption.innerHTML = 'subtract parameter';

    thenMultOption.value = 'mult';
    thenMultOption.innerHTML = 'multiply parameter';

    thenDivOption.value = 'div';
    thenDivOption.innerHTML = 'divide parameter';

    thenRepeatOption.value = 'repeat';
    thenRepeatOption.innerHTML = 'repeat';

    thenResetOption.value = 'reset';
    thenResetOption.innerHTML = 'reset parameters to initial conditions';
    let addResetOption: boolean = false;
    this.runController.elements.forEach((element: ControllerElement) => {
      if (element.type == 'param') {
        addResetOption = true;
      }
    });

    this.punctuation.innerHTML = '.';

    thenSelect.appendChild(thenStopOption);
    thenSelect.appendChild(thenRunOption);
    thenSelect.appendChild(thenAddOption);
    thenSelect.appendChild(thenSubOption);
    thenSelect.appendChild(thenMultOption);
    thenSelect.appendChild(thenDivOption);
    thenSelect.appendChild(thenRepeatOption);
    if (addResetOption) {
      thenSelect.appendChild(thenResetOption);
    }
    this.element.appendChild(thenLabel);
    this.element.appendChild(thenSelect);
    this.element.appendChild(this.punctuation);
    this.runController.parent.appendChild(this.element);
  }
}

/**
 * ChangeParameterElement gives a UI to automate parameter changes in between runs of the simulation.
 */
class ChangeParameterElement extends ControllerElement {
  public operation: string;
  public parameter: string;
  public amount: number;

  /**
   * @constructor
   * @param {number} id - the id number, useful for HTML identifying.
   * @param {RunController} runController - the RunController object.
   * @param {string} operation - the operation to perform, add, subtract, multiply, or divide.
   */
  constructor(id:number, runController: RunController, operation: string) {
    super(id, 'param', runController);
    this.operation = operation;

    const parameterLabel: HTMLLabelElement = document.createElement<'label'>('label');
    const parameterSelect: HTMLSelectElement = document.createElement<'select'>('select');
    const amountLabel: HTMLLabelElement = document.createElement<'label'>('label');
    const amountInput: HTMLInputElement = document.createElement<'input'>('input');

    parameterLabel.htmlFor = `parameterSelect${this.id}`;
    parameterLabel.innerHTML = ': ';

    parameterSelect.id = parameterLabel.htmlFor;
    parameterSelect.name = parameterSelect.id;
    parameterSelect.addEventListener('change', () => {
      this.parameter = parameterSelect.value;
    });

    const parameters: string[] = [
      'N', 'width', 'height',
      'centerX', 'centerY', 'startX', 'startY',
      'P', 'V', 'c1', 'c2', 'c3', 'c4', 'vlim',
    ];
    parameters.forEach((parameter) => {
      const parameterOption: HTMLOptionElement = document.createElement<'option'>('option');
      parameterOption.value = parameter;
      parameterOption.innerHTML = parameter;
      if (parameter == 'N') {
        parameterOption.selected = true;
      }
      parameterSelect.appendChild(parameterOption);
    });

    amountLabel.htmlFor = `parameterAmount${this.id}`;
    amountLabel.innerHTML = ' by ';

    amountInput.id = amountLabel.htmlFor;
    amountInput.name = amountInput.id;
    amountInput.type = 'number';
    amountInput.step = '0.00000000001';
    amountInput.value = '1';
    this.amount = 1;
    amountInput.addEventListener('change', () => {
      this.amount = parseFloat(amountInput.value);
    });

    this.punctuation.innerHTML = ',<br>';

    this.element.appendChild(parameterLabel);
    this.element.appendChild(parameterSelect);
    this.element.appendChild(amountLabel);
    this.element.appendChild(amountInput);
    this.element.appendChild(this.punctuation);
    this.runController.parent.appendChild(this.element);
    this.runController.step++;
    this.runController.addElement('then');
    this.runController.step--;
  }
}

/**
 * RepeatElement gives a UI to automate run repeats.
 */
class RepeatElement extends ControllerElement {
  public lines: number;

  /**
   * @constructor
   * @param {number} id - the id number, useful for HTML identifying.
   * @param {RunController} runController - the RunController object.
   */
  constructor(id: number, runController: RunController) {
    super(id, 'repeat', runController);

    const linesLabel: HTMLLabelElement = document.createElement<'label'>('label');
    const linesInput: HTMLInputElement = document.createElement<'input'>('input');
    const amountLabel: HTMLLabelElement = document.createElement<'label'>('label');
    let amountInput: HTMLInputElement = null;
    const typeSelect: HTMLSelectElement = document.createElement<'select'>('select');
    const timesOption: HTMLOptionElement = document.createElement<'option'>('option');
    const indefiniteOption: HTMLOptionElement = document.createElement<'option'>('option');

    linesLabel.htmlFor = `repeatLines${this.id}`;
    linesLabel.innerHTML = ' the last ';

    linesInput.id = linesLabel.htmlFor;
    linesInput.name = linesInput.id;
    linesInput.type = 'number';
    linesInput.step = '1';
    linesInput.value = '1';
    linesInput.min = '1';
    // eslint-disable-next-line max-len
    // linesInput.max = `${this.id - 1}`; I'll figure out putting a cap on this thing later once I figure out how this.id actually translates into lines with then elements getting in the way... maybe then elements shouldn't increment the step number? they could use the same id as the element that comes after it...

    amountLabel.htmlFor = `repeatAmount${this.id}`;
    amountLabel.innerHTML = ' lines, ';

    typeSelect.id = `repeatType${this.id}`;
    typeSelect.addEventListener('change', () => {
      if (typeSelect.value == 'times' && amountInput == null) {
        this.element.removeChild(this.punctuation);
        this.element.removeChild(typeSelect);
        amountInput = this.createAmountInput(amountLabel.htmlFor);
        this.punctuation.innerHTML = ',<br>';
        this.element.appendChild(amountInput);
        this.element.appendChild(typeSelect);
        this.element.appendChild(this.punctuation);
        this.runController.addElement('then');
      } else if (typeSelect.value == 'indefinitely' && amountInput != null) {
        this.element.removeChild(this.punctuation);
        this.punctuation.innerHTML = '.';
        this.element.appendChild(this.punctuation);
        this.element.removeChild(amountInput);
        amountInput = null;
        this.lines = -1;
        this.runController.removeElementsAfter(this.id);
      }
    });

    indefiniteOption.value = 'indefinitely';
    indefiniteOption.innerHTML = 'indefinitely';
    indefiniteOption.selected = true;

    timesOption.value = 'times';
    timesOption.innerHTML = 'times';

    this.punctuation.innerHTML = '.';

    typeSelect.appendChild(indefiniteOption);
    typeSelect.appendChild(timesOption);
    this.element.appendChild(linesLabel);
    this.element.appendChild(linesInput);
    this.element.appendChild(amountLabel);
    if (amountInput != null) {
      this.element.appendChild(amountInput);
    }
    this.element.appendChild(typeSelect);
    this.element.appendChild(this.punctuation);
    this.runController.parent.appendChild(this.element);
  }

  /**
   * Creates an ammountInput item to be inserted into the element.
   * @param {string} id - the id of the input element.
   * @return {HTMLInputElement} the amountInput element.
   */
  private createAmountInput(id: string): HTMLInputElement {
    const amountInput = document.createElement<'input'>('input');
    amountInput.id = id;
    amountInput.name = id;
    amountInput.type = 'number';
    amountInput.step = '1';
    amountInput.value = '1';
    amountInput.min = '1';
    this.lines = 1;

    amountInput.addEventListener('change', () => {
      this.lines = parseInt(amountInput.value);
    });

    return amountInput;
  }
}

/**
 * ResetParamsElement provides a UI for reseting parameters back to the initial conditions set in the IC tab
 */
class ResetParamsElement extends ControllerElement {
  /**
   * @constructor
   * @param {number} id - the id number, helpful for identifying HTML elements
   * @param {RunController} runController - the RunController parent object
   */
  constructor(id: number, runController: RunController) {
    super(id, 'reset', runController);
    this.punctuation.innerHTML = ',<br>';
    this.element.appendChild(this.punctuation);
    this.runController.parent.appendChild(this.element);
    this.runController.step++;
    this.runController.addElement('then');
    this.runController.step--;
  }
}

/**
 * Controls running and re-running the simulation based on various conditions.
 */
export default class RunController {
  public parent: HTMLElement;
  public simulation: Simulation;
  public elements: ControllerElement[];
  public step: number;

  /**
   * @constructor
   * @param {HTMLElement} parent - the parent element to host all of the run contoller UI.
   * @param {Simulation} simulation - the simulation object that parents all other code.
   */
  constructor(parent: HTMLElement, simulation: Simulation) {
    this.parent = parent;
    this.simulation = simulation;

    const runLabel = document.createElement<'label'>('label');
    runLabel.htmlFor = 'runType0';
    runLabel.innerHTML = 'Run ';
    this.parent.appendChild(runLabel);

    this.step = 0;
    this.elements = [new RunElement(this.step, this)];
    this.step++;
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
}
