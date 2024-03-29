import RunController from '../runcontroller';
import ControllerElement from './controllerelement';

/**
 * ChangeParameterElement gives a UI to automate parameter changes in between runs of the simulation.
 */
export default class ChangeParameterElement extends ControllerElement {
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

    const widthTmpSelect: HTMLSelectElement = document.getElementById('widthTmpSelect') as HTMLSelectElement;
    const widthTmpOption: HTMLOptionElement = document.getElementById('widthTmpOption') as HTMLOptionElement;

    parameterLabel.htmlFor = `parameterSelect${this.id}`;
    parameterLabel.innerHTML = ': ';

    parameterSelect.id = parameterLabel.htmlFor;
    parameterSelect.name = parameterSelect.id;
    parameterSelect.addEventListener('change', () => {
      widthTmpOption.innerHTML = parameterSelect.options[parameterSelect.selectedIndex].innerHTML;
      widthTmpSelect.style.display = 'inline';
      parameterSelect.style.width = `${widthTmpSelect.offsetWidth}px`;
      widthTmpSelect.style.display = 'none';
      this.parameter = parameterSelect.value;
    });

    const parameters: string[] = [
      'N', 'R', 'width', 'height',
      'centerX', 'centerY', 'startX', 'startY',
      'P', 'V', 'c1', 'c2', 'c3', 'c4', 'vlim', 'repellantStrength',
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
    this.parameter = 'N';
    widthTmpOption.innerHTML = 'N';
    widthTmpSelect.style.display = 'inline';
    // for some reason the value is wrong the first time accessing widthTmpSelect.offsetWidth here
    // console.log() will do the trick so that it's all fixed up by the time we need it one line later
    console.log(`${widthTmpSelect.offsetWidth}px`);
    parameterSelect.style.width = `${widthTmpSelect.offsetWidth}px`;
    widthTmpSelect.style.display = 'none';

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
