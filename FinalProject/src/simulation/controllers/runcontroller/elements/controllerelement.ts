import RunController from '../runcontroller';

/**
 * Base class for controller elements to extend.
 */
export default class ControllerElement {
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
