import Flocking from './flocking';
import Parameters from './controllers/parameters';
import DataController from './controllers/datacontroller';
import RunController from './controllers/runcontroller/runcontroller';
import SpeedController from './controllers/speedcontroller';

/**
 * Parent object for the boids simulation.
 * Passing 'this' around is a crude way for the
 * different classes of the simulation to communicate.
 */
export default class Simulation {
  public parameters: Parameters;
  public speedController: SpeedController;
  public dataController: DataController;
  public flocking: Flocking;
  public runController: RunController;

  /**
   * @constructor
   */
  constructor() {
    this.parameters = new Parameters(
      document.getElementById('parametersDiv'),
      document.getElementById('parametersButton') as HTMLButtonElement,
      this,
    );
    this.speedController = new SpeedController(document.getElementById('speedController'), this);
    this.dataController = new DataController(this);
    this.flocking = new Flocking(document.getElementById('flockSketch'), this);
    this.runController = new RunController(
      document.getElementById('runControllerDiv'),
      document.getElementById('runControllerButton') as HTMLButtonElement,
      this,
    );
  }
}
