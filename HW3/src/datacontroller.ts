import * as THREE from 'three';
import Simulation from './simulation';
import P5PlotFieldVsField from './plotfieldvsfield';

/**
 * P5Plotter is a class that holds a bunch of simulation output data,
 * and hosts a bunch of p5 canvases to plot the data in real time.
 */
export default class DataController {
  public timesteps: number[];
  public centerOfMass: THREE.Vector2[];
  public radiusOfGyration: number[];
  public groupVelocity: THREE.Vector2[];
  public groupSpeed: number[];
  public alignment: number[];

  public graphs: P5PlotFieldVsField[];

  private simulation: Simulation;

  /**
   * @constructor
   * @param {Simulation} simulation - the simulation object (parent of all other ts classes).
   */
  constructor(simulation: Simulation) {
    this.simulation = simulation;
    this.timesteps = [];
    this.centerOfMass = [];
    this.radiusOfGyration = [];
    this.groupVelocity = [];
    this.groupSpeed = [];
    this.alignment = [];

    this.graphs = [];

    const parents: HTMLElement[] = [
      document.getElementById('graphSketch0'),
      document.getElementById('graphSketch1'),
      document.getElementById('graphSketch2'),
    ];
    this.graphs.push(new P5PlotFieldVsField(this.timesteps, this.radiusOfGyration, parents[0]));
    this.graphs.push(new P5PlotFieldVsField(this.timesteps, this.groupSpeed, parents[1]));
    this.graphs.push(new P5PlotFieldVsField(this.timesteps, this.alignment, parents[2]));
  }
}
