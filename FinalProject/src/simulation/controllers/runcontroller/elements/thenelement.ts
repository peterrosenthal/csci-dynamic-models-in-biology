import RunController from '../runcontroller';
import ControllerElement from './controllerelement';

/**
 * A ThenElement gives the user the ability to continue doing something
 * with the simulation after a previous acton.
 */
export default class ThenElement extends ControllerElement {
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
    thenSubOption.innerHTML = 'decrease parameter';

    thenMultOption.value = 'mult';
    thenMultOption.innerHTML = 'multiply parameter';

    thenDivOption.value = 'div';
    thenDivOption.innerHTML = 'divide parameter';

    thenRepeatOption.value = 'repeat';
    thenRepeatOption.innerHTML = 'repeat from the beginning';

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
