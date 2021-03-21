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
   * @member {boolean} keepAspectRatio - tells p5*js to draw with the aspect ratio
   *  of the simulation if true, or to fill the whole canvas if false.
   */
  public keepAspectRatio: boolean;

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

    const parameterN: HTMLInputElement = document.getElementById('inputN') as HTMLInputElement;
    const parameterWidth: HTMLInputElement = document.getElementById('inputWidth') as HTMLInputElement;
    const parameterHeight: HTMLInputElement = document.getElementById('inputHeight') as HTMLInputElement;
    const parameterCenterX: HTMLInputElement = document.getElementById('inputCenterX') as HTMLInputElement;
    const parameterCenterY: HTMLInputElement = document.getElementById('inputCenterY') as HTMLInputElement;
    const parameterKeepAR: HTMLInputElement = document.getElementById('inputAspectRatio') as HTMLInputElement;
    const parameterStartX: HTMLInputElement = document.getElementById('inputStartX') as HTMLInputElement;
    const parameterStartY: HTMLInputElement = document.getElementById('inputStartY') as HTMLInputElement;
    const parameterP: HTMLInputElement = document.getElementById('inputP') as HTMLInputElement;
    const parameterV: HTMLInputElement = document.getElementById('inputV') as HTMLInputElement;
    const parameterC1: HTMLInputElement = document.getElementById('inputC1') as HTMLInputElement;
    const parameterC2: HTMLInputElement = document.getElementById('inputC2') as HTMLInputElement;
    const parameterC3: HTMLInputElement = document.getElementById('inputC3') as HTMLInputElement;
    const parameterC4: HTMLInputElement = document.getElementById('inputC4') as HTMLInputElement;
    const parameterVLimit: HTMLInputElement = document.getElementById('inputVLimit') as HTMLInputElement;

    const closeParameters: HTMLButtonElement = document.getElementById('closeParameters') as HTMLButtonElement;
    closeParameters.addEventListener('click', () => {
      parameterN.value = this.N.toString();
      parameterWidth.value = this.width.toString();
      parameterHeight.value = this.height.toString();
      parameterCenterX.value = this.center.x.toString();
      parameterCenterY.value = this.center.y.toString();
      parameterKeepAR.checked = this.keepAspectRatio;
      parameterStartX.value = this.start.x.toString();
      parameterStartY.value = this.start.y.toString();
      parameterP.value = this.P.toString();
      parameterV.value = this.V.toString();
      parameterC1.value = this.c1.toString();
      parameterC2.value = this.c2.toString();
      parameterC3.value = this.c3.toString();
      parameterC4.value = this.c4.toString();
      parameterVLimit.value = this.vlimit.toString();

      nav.style.display = 'block';
      parametersDiv.style.display = 'none';
    });

    const applyParameters: HTMLButtonElement = document.getElementById('applyParameters') as HTMLButtonElement;
    applyParameters.addEventListener('click', () => {
      // TODO: some validation maybe? like make sure start is within the bounds?

      this.N = parseInt(parameterN.value);
      this.width = parseInt(parameterWidth.value);
      this.height = parseInt(parameterHeight.value);
      this.center.setX(parseFloat(parameterCenterX.value));
      this.center.setY(parseFloat(parameterCenterY.value));
      this.keepAspectRatio = parameterKeepAR.checked;
      this.start.setX(parseFloat(parameterStartX.value));
      this.start.setX(parseFloat(parameterStartY.value));
      this.P = parseFloat(parameterP.value);
      this.V = parseFloat(parameterV.value);
      this.c1 = parseFloat(parameterC1.value);
      this.c2 = parseFloat(parameterC2.value);
      this.c3 = parseFloat(parameterC3.value);
      this.c4 = parseFloat(parameterC4.value);
      this.vlimit = parseFloat(parameterVLimit.value);

      nav.style.display = 'block';
      parametersDiv.style.display = 'none';
    });

    parametersDiv.style.display = 'none';
    this.N = parseInt(parameterN.value);
    this.width = parseInt(parameterWidth.value);
    this.height = parseInt(parameterHeight.value);
    this.center = new THREE.Vector2(
      parseFloat(parameterCenterX.value),
      parseFloat(parameterCenterY.value),
    );
    this.keepAspectRatio = parameterKeepAR.checked;
    this.start = new THREE.Vector2(
      parseFloat(parameterStartX.value),
      parseFloat(parameterStartY.value),
    );
    this.P = parseFloat(parameterV.value);
    this.V = parseFloat(parameterP.value);
    this.c1 = parseFloat(parameterC1.value);
    this.c2 = parseFloat(parameterC2.value);
    this.c3 = parseFloat(parameterC3.value);
    this.c4 = parseFloat(parameterC4.value);
    this.vlimit = parseFloat(parameterVLimit.value);
  }
}
