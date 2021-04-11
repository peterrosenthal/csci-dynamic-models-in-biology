import * as THREE from 'three';

/**
 * Class with some things to be inherited by P5PlotFieldVsField and P5PlotFieldVsParam
 */
export default class P5Plot {
  public id: number;
  public remove: boolean;

  protected timesteps: number[];
  protected parent: HTMLElement;
  protected width: number;
  protected height: number;
  protected margin: number;
  protected max: THREE.Vector2;
  protected min: THREE.Vector2;
  protected scale: THREE.Vector2;
  protected title: string;
  protected xlabel: string;
  protected ylabel: string;

  /**
   * @constructor
   * @param {number[]} timesteps - the timesteps array.
   * @param {HTMLElement} parent - the HTML element to set as the parent of the p5 sketch.
   * @param {string} title - the title of the graph.
   * @param {string} xlabel - the label for the x-axis.
   * @param {string} ylabel - the label for the y-axis.
   * @param {number} id - identification number of the graph... useful for identification.
   */
  constructor(
    timesteps: number[],
    parent: HTMLElement,
    title: string,
    xlabel: string,
    ylabel: string,
    id: number,
  ) {
    this.timesteps = timesteps;
    this.parent = parent;
    this.width = parent.offsetWidth;
    this.height = parent.offsetHeight;
    this.margin = 30;
    this.max = new THREE.Vector2();
    this.min = new THREE.Vector2();
    this.scale = new THREE.Vector2();
    this.title = title;
    this.xlabel = xlabel;
    this.ylabel = ylabel;
    this.id = id;
    this.remove = false;
  }
}
