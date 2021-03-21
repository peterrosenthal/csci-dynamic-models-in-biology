import * as THREE from 'three';

/**
 * Settings for the boids simulation.
 */
export default class Settings {
  /**
   * @member {number} N - The number of boids in the simulation.
   */
  public N: number;

  /**
   * @member {number} width - The width of the simulation domain.
   */
  public width: number;

  /**
   * @member {number} height - The height of the simulation domain.
   */
  public height: number;

  /**
   * @member {THREE.Vector2} center - The center of the simulation domain.
   */
  public center: THREE.Vector2;

  /**
   * @member {THREE.Vector2} start - The starting point of the boids.
   */
  public start: THREE.Vector2;

  /**
   * @member {number} P - The gaussian spread of the boids' starting positions.
   */
  public P: number;

  /**
   * @member {number} V - The gaussian spread of the boids' starting velocities.
   */
  public V: number;

  /**
   * @member {number} c1 - Scaling factor for attraction.
   */
  public c1: number;

  /**
   * @member {number} c2 - Scaling factor for repulsion.
   */
  public c2: number;

  /**
   * @member {number} c3 - Scaling factor for heading.
   */
  public c3: number;

  /**
   * @member {number} c4 - Scaling factor for randomness.
   */
  public c4: number;

  /**
   * @member {number} vlimit - Maximum boid velocity.
   */
  public vlimit: number;

  public play: boolean;
  public reset: boolean;

  /**
   * Sets some default variables (for now)
   * @constructor
   */
  constructor() {
    const nav: HTMLDivElement = document.getElementsByTagName('nav')[0] as HTMLDivElement;
    const playButton: HTMLButtonElement = document.getElementById('playButton') as HTMLButtonElement;
    const pauseButton: HTMLButtonElement = document.getElementById('pauseButton') as HTMLButtonElement;
    const resetButton: HTMLButtonElement = document.getElementById('resetButton') as HTMLButtonElement;
    playButton.addEventListener('click', () => {
      this.play = true;
      playButton.style.display = 'none';
      pauseButton.style.display = 'inline-block';
      resetButton.style.display = 'inline-block';
    });
    pauseButton.addEventListener('click', () => {
      this.play = false;
      playButton.style.display = 'inline-block';
      pauseButton.style.display = 'none';
    });
    resetButton.addEventListener('click', () => {
      this.reset = true;
      resetButton.style.display = 'none';
    });

    const openParameters: HTMLButtonElement = document.getElementById('openParameters') as HTMLButtonElement;
    const parametersDiv: HTMLDivElement = document.getElementById('parametersDiv') as HTMLDivElement;
    openParameters.addEventListener('click', () => {
      nav.style.display = 'none';
      parametersDiv.style.display = 'block';
    });

    const closeParameters: HTMLButtonElement = document.getElementById('closeParameters') as HTMLButtonElement;
    const parameterN: HTMLInputElement = document.getElementById('inputN') as HTMLInputElement;
    closeParameters.addEventListener('click', () => {
      parameterN.value = this.N.toString();

      nav.style.display = 'block';
      parametersDiv.style.display = 'none';
    });

    const applyParameters: HTMLButtonElement = document.getElementById('applyParameters') as HTMLButtonElement;
    applyParameters.addEventListener('click', () => {
      this.N = parseInt(parameterN.value);

      nav.style.display = 'block';
      parametersDiv.style.display = 'none';
    });

    parametersDiv.style.display = 'none';
    this.N = parseInt(parameterN.value);

    this.width = 200;
    this.height = 200;
    this.center = new THREE.Vector2();
    this.start = new THREE.Vector2();
    this.P = 10;
    this.V = 10;
    this.c1 = 0.00001;
    this.c2 = 0.01;
    this.c3 = 1;
    this.c4 = 0.2;
    this.vlimit = 1;
  }
}
