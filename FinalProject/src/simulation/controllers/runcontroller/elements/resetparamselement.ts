import RunController from '../runcontroller';
import ControllerElement from './controllerelement';

/**
 * ResetParamsElement provides a UI for reseting parameters back to the initial conditions set in the IC tab
 */
export default class ResetParamsElement extends ControllerElement {
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
