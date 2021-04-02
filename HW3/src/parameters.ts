import * as THREE from 'three';
import InputNumber from './inputnumber';
import Simulation from './simulation';

/**
 * Controls and stores the user adjusted parameters.
 */
export default class Parameters {
  /**
   * @member {number} N - The number of boids in the simulation.
   */
  public N: number;

  /**
   * @member {number} R - number of random repellants.
   */
  public R: number;

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

  /**
   * @member {number} repellantStrength - how many times stronger the repellants are than boids.
   */
  public repellantStrength: number;

  public testInputNumber: InputNumber;

  private simulation: Simulation;

  private NElement: HTMLInputElement;
  private RElement: HTMLInputElement;
  private widthElement: HTMLInputElement;
  private heightElement: HTMLInputElement;
  private centerXElement: HTMLInputElement;
  private centerYElement: HTMLInputElement;
  private startXElement: HTMLInputElement;
  private startYElement: HTMLInputElement;
  private PElement: HTMLInputElement;
  private VElement: HTMLInputElement;
  private c1Element: HTMLInputElement;
  private c2Element: HTMLInputElement;
  private c3Element: HTMLInputElement;
  private c4Element: HTMLInputElement;
  private vlimitElement: HTMLInputElement;
  private repellantStrengthElement: HTMLInputElement;

  private saveN: number;
  private saveR: number;
  private saveWidth: number;
  private saveHeight: number;
  private saveCenter: THREE.Vector2;
  private saveStart: THREE.Vector2;
  private saveP: number;
  private saveV: number;
  private saveC1: number;
  private saveC2: number;
  private saveC3: number;
  private saveC4: number;
  private saveVlimit: number;
  private saveRepellantStrength: number;

  /**
   * Reads parameter values from the DOM, and sets up on-click
   * functions to update parameter values from the DOM in the future.
   * @constructor
   * @param {Simulation} simulation - the object housing the simulation.
   */
  constructor(simulation: Simulation) {
    this.simulation = simulation;

    this.NElement = document.getElementById('inputN') as HTMLInputElement;
    this.RElement = document.getElementById('inputR') as HTMLInputElement;
    this.widthElement = document.getElementById('inputWidth') as HTMLInputElement;
    this.heightElement = document.getElementById('inputHeight') as HTMLInputElement;
    this.centerXElement = document.getElementById('inputCenterX') as HTMLInputElement;
    this.centerYElement = document.getElementById('inputCenterY') as HTMLInputElement;
    this.startXElement = document.getElementById('inputStartX') as HTMLInputElement;
    this.startYElement = document.getElementById('inputStartY') as HTMLInputElement;
    this.PElement = document.getElementById('inputP') as HTMLInputElement;
    this.VElement = document.getElementById('inputV') as HTMLInputElement;
    this.c1Element = document.getElementById('inputC1') as HTMLInputElement;
    this.c2Element = document.getElementById('inputC2') as HTMLInputElement;
    this.c3Element = document.getElementById('inputC3') as HTMLInputElement;
    this.c4Element = document.getElementById('inputC4') as HTMLInputElement;
    this.vlimitElement = document.getElementById('inputVLimit') as HTMLInputElement;
    this.repellantStrengthElement = document.getElementById('inputRepellantStrength') as HTMLInputElement;

    this.testInputNumber = new InputNumber(
      document.getElementById('testInputNumber'),
      this.simulation,
      0,
      100,
      'int',
      false,
      10,
    );

    this.N = parseInt(this.NElement.value);
    this.R = parseInt(this.RElement.value);
    this.width = parseInt(this.widthElement.value);
    this.height = parseInt(this.heightElement.value);
    this.center = new THREE.Vector2(parseInt(this.centerXElement.value), parseInt(this.centerYElement.value));
    this.start = new THREE.Vector2(parseInt(this.startXElement.value), parseInt(this.startYElement.value));
    this.P = parseFloat(this.PElement.value);
    this.V = parseFloat(this.VElement.value);
    this.c1 = parseFloat(this.c1Element.value);
    this.c2 = parseFloat(this.c2Element.value);
    this.c3 = parseFloat(this.c3Element.value);
    this.c4 = parseFloat(this.c4Element.value);
    this.vlimit = parseFloat(this.vlimitElement.value);
    this.repellantStrength = parseFloat(this.repellantStrengthElement.value);

    this.saveN = this.N;
    this.saveR = this.R;
    this.saveWidth = this.width;
    this.saveHeight = this.height;
    this.saveCenter = this.center.clone();
    this.saveStart = this.start.clone();
    this.saveP = this.P;
    this.saveV = this.V;
    this.saveC1 = this.c1;
    this.saveC2 = this.c2;
    this.saveC3 = this.c3;
    this.saveC4 = this.c4;
    this.saveVlimit = this.vlimit;
    this.saveRepellantStrength = this.repellantStrength;

    this.NElement.addEventListener('change', () => {
      this.N = parseInt(this.NElement.value);
      this.simulation.flocking.restart();
      this.saveN = this.N;
    });

    this.RElement.addEventListener('change', () => {
      this.R = parseInt(this.RElement.value);
      this.simulation.flocking.restart();
      this.saveR = this.R;
    });

    this.widthElement.addEventListener('change', () => {
      this.width = parseInt(this.widthElement.value);
      this.simulation.flocking.restart();
      this.saveWidth = this.width;
    });

    this.heightElement.addEventListener('change', () => {
      this.height = parseInt(this.heightElement.value);
      this.simulation.flocking.restart();
      this.saveHeight = this.height;
    });

    this.centerXElement.addEventListener('change', () => {
      this.center.setX(parseInt(this.centerXElement.value));
      this.simulation.flocking.restart();
      this.saveCenter = this.center.clone();
    });

    this.centerYElement.addEventListener('change', () => {
      this.center.setY(parseInt(this.centerYElement.value));
      this.simulation.flocking.restart();
      this.saveCenter = this.center.clone();
    });

    this.startXElement.addEventListener('change', () => {
      this.start.setX(parseInt(this.startXElement.value));
      this.simulation.flocking.restart();
      this.saveStart = this.start.clone();
    });

    this.startYElement.addEventListener('change', () => {
      this.start.setY(parseInt(this.startYElement.value));
      this.simulation.flocking.restart();
      this.saveStart = this.start.clone();
    });

    this.PElement.addEventListener('change', () => {
      this.P = parseFloat(this.PElement.value);
      this.saveP = this.P;
    });

    this.VElement.addEventListener('change', () => {
      this.V = parseFloat(this.VElement.value);
      this.saveV = this.V;
    });

    this.c1Element.addEventListener('change', () => {
      this.c1 = parseFloat(this.c1Element.value);
      this.saveC1 = this.c1;
    });

    this.c2Element.addEventListener('change', () => {
      this.c2 = parseFloat(this.c2Element.value);
      this.saveC2 = this.c2;
    });

    this.c3Element.addEventListener('change', () => {
      this.c3 = parseFloat(this.c3Element.value);
      this.saveC3 = this.c3;
    });

    this.c4Element.addEventListener('change', () => {
      this.c4 = parseFloat(this.c4Element.value);
      this.saveC4 = this.c4;
    });

    this.vlimitElement.addEventListener('change', () => {
      this.vlimit = parseFloat(this.vlimitElement.value);
      this.saveVlimit = this.vlimit;
    });

    this.repellantStrengthElement.addEventListener('change', () => {
      this.repellantStrength = parseFloat(this.repellantStrengthElement.value);
      this.saveRepellantStrength = this.repellantStrength;
    });
  }

  /**
   * Resets paramaters to their values found in the HTML elements
   */
  public reset() {
    this.N = this.saveN;
    this.R = this.saveR;
    this.width = this.saveWidth;
    this.height = this.saveHeight;
    this.center = this.saveCenter.clone();
    this.start = this.saveStart.clone();
    this.P = this.saveP;
    this.V = this.saveV;
    this.c1 = this.saveC1;
    this.c2 = this.saveC2;
    this.c3 = this.saveC3;
    this.c4 = this.saveC4;
    this.vlimit = this.saveVlimit;
    this.repellantStrength = this.saveRepellantStrength;
  }
}
