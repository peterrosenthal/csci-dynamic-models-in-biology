import RunController from '../runcontroller';
import ControllerElement from './controllerelement';

/**
 * RunElement to be used in the run controller.
 * This is my second idea/attempt where a class helps hold onto the info
 * instead of losing track of it when we leave the scope of a function.
 */
export default class RunElement extends ControllerElement {
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
      if (this.id == 0) {
        this.runController.run = 0;
        this.runController.nextRunStep();
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
      if (this.id == 0) {
        this.runController.run = 0;
        this.runController.nextRunStep();
      }
    });
    this.duration = parseInt(runDurationInput.value);

    this.runDurationElement.appendChild(runDurationLabel);
    this.runDurationElement.appendChild(runDurationInput);
    this.element.appendChild(this.runDurationElement);
  }
}
