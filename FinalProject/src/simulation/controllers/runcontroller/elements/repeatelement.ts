import RunController from '../runcontroller';
import ControllerElement from './controllerelement';

/**
 * RepeatElement gives a UI to automate run repeats.
 */
export default class RepeatElement extends ControllerElement {
  public times: number;
  public timesLeft: number;

  /**
   * @constructor
   * @param {number} id - the id number, useful for HTML identifying.
   * @param {RunController} runController - the RunController object.
   */
  constructor(id: number, runController: RunController) {
    super(id, 'repeat', runController);

    let amountInput: HTMLInputElement = null;
    const typeSelect: HTMLSelectElement = document.createElement<'select'>('select');
    const typeLabel: HTMLLabelElement = document.createElement<'label'>('label');
    const timesOption: HTMLOptionElement = document.createElement<'option'>('option');
    const indefiniteOption: HTMLOptionElement = document.createElement<'option'>('option');

    const widthTmpSelect: HTMLSelectElement = document.getElementById('widthTmpSelect') as HTMLSelectElement;
    const widthTmpOption: HTMLOptionElement = document.getElementById('widthTmpOption') as HTMLOptionElement;

    typeLabel.htmlFor = `repeatType${this.id}`;
    typeLabel.innerHTML = ' ';

    typeSelect.id = `repeatType${this.id}`;
    typeSelect.addEventListener('change', () => {
      widthTmpOption.innerHTML = typeSelect.options[typeSelect.selectedIndex].innerHTML;
      widthTmpSelect.style.display = 'inline';
      typeSelect.style.width = `${widthTmpSelect.offsetWidth}px`;
      widthTmpSelect.style.display = 'none';
      if (typeSelect.value == 'times' && amountInput == null) {
        this.element.removeChild(this.punctuation);
        this.element.removeChild(typeSelect);
        amountInput = this.createAmountInput(`repeatAmountInput${this.id}`);
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
        this.times = -1;
        this.timesLeft = -1;
        this.runController.removeElementsAfter(this.id);
      }
    });

    indefiniteOption.value = 'indefinitely';
    indefiniteOption.innerHTML = 'indefinitely';
    indefiniteOption.selected = true;

    timesOption.value = 'times';
    timesOption.innerHTML = 'times';

    this.times = -1;
    this.timesLeft = -1;

    this.punctuation.innerHTML = '.';

    typeSelect.appendChild(indefiniteOption);
    typeSelect.appendChild(timesOption);
    widthTmpOption.innerHTML = typeSelect.options[typeSelect.selectedIndex].innerHTML;
    widthTmpSelect.style.display = 'inline';
    // for some reason the value is wrong the first time accessing widthTmpSelect.offsetWidth here
    // console.log() will do the trick so that it's all fixed up by the time we need it one line later
    console.log(`${widthTmpSelect.offsetWidth}px`);
    typeSelect.style.width = `${widthTmpSelect.offsetWidth}px`;
    widthTmpSelect.style.display = 'none';
    if (amountInput != null) {
      this.element.appendChild(amountInput);
    }
    this.element.appendChild(typeLabel);
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
    this.times = 1;
    this.timesLeft = 1;

    amountInput.addEventListener('change', () => {
      this.times = parseInt(amountInput.value);
      this.timesLeft = this.times;
    });

    return amountInput;
  }
}
