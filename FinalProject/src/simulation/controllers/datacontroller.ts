import * as THREE from 'three';
import Simulation from '../simulation';
import P5PlotFieldVsField from '../../graph/plotfieldvsfield';
import P5PlotFieldVsParam from '../../graph/plotfieldvsparam';

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

  public c1: number[];
  public c2: number[];
  public c3: number[];
  public c4: number[];
  public R: number[];
  public repellantStrength: number[];

  public numRuns: number;

  public graphs: any[];

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

    this.c1 = [];
    this.c2 = [];
    this.c3 = [];
    this.c4 = [];
    this.R = [];
    this.repellantStrength = [];

    this.graphs = [];

    const parents: HTMLElement[] = [
      document.getElementById('graphSketch0'),
      document.getElementById('graphSketch1'),
      document.getElementById('graphSketch2'),
    ];
    this.graphs.push(new P5PlotFieldVsField(this.timesteps, this.radiusOfGyration, this.c4, parents[0]));
    this.graphs.push(new P5PlotFieldVsParam(this.alignment, this.c4, this.timesteps, parents[1]));
    this.graphs.push(new P5PlotFieldVsParam(this.timesteps, this.alignment, this.c4, parents[2]));
  }
}
