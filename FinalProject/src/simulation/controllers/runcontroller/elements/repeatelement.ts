import RunController from '../runcontroller';
import ControllerElement from './controllerelement';

/**
 * RepeatElement gives a UI to automate run repeats.
 */
export default class RepeatElement extends ControllerElement {
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
    this.lines = 1;
    linesInput.addEventListener('change', () => {
      this.lines = parseInt(linesInput.value);
    });

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
    console.log(this.lines);

    amountInput.addEventListener('change', () => {
      console.log(this.lines);
    });

    return amountInput;
  }
}
