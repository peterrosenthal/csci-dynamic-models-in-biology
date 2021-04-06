import Flocking from './flocking';
import Parameters from './controllers/parameters';
import DataController from './controllers/datacontroller';
import RunController from './controllers/runcontroller';
import SpeedController from './controllers/speedcontroller';

/**
 * Settings for the boids simulation.
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
    // TODO: move play, pause, and reset buttons to the SpeedController?
    const playButton: HTMLButtonElement = document.getElementById('playButton') as HTMLButtonElement;
    const pauseButton: HTMLButtonElement = document.getElementById('pauseButton') as HTMLButtonElement;
    const resetButton: HTMLButtonElement = document.getElementById('resetButton') as HTMLButtonElement;
    playButton.addEventListener('click', () => {
      this.speedController.play();
      playButton.style.display = 'none';
      pauseButton.style.display = 'inline-block';
    });
    pauseButton.addEventListener('click', () => {
      this.speedController.pause();
      playButton.style.display = 'inline-block';
      pauseButton.style.display = 'none';
    });
    resetButton.addEventListener('click', () => {
      this.flocking.restart();
    });

    // TODO: move parameters open and close buttons to Parameters?
    const openParameters: HTMLButtonElement = document.getElementById('openParameters') as HTMLButtonElement;
    const parametersDiv: HTMLDivElement = document.getElementById('parametersDiv') as HTMLDivElement;
    openParameters.addEventListener('click', () => {
      if (parametersDiv.style.display == 'none') {
        parametersDiv.style.display = 'block';
      } else {
        parametersDiv.style.display = 'none';
      }
    });

    this.parameters = new Parameters(this);
    this.speedController = new SpeedController(document.getElementById('speedController'), this);
    this.dataController = new DataController(this);
    this.flocking = new Flocking(document.getElementById('flockSketch'), this);
    this.runController = new RunController(document.getElementById('runController'), this);
    parametersDiv.style.display = 'none';
  }
}
