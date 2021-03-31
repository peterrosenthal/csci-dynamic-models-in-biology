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

  public testInputNumber: InputNumber;

  private simulation: Simulation;

  private NElement: HTMLInputElement;
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

  /**
   * Reads parameter values from the DOM, and sets up on-click
   * functions to update parameter values from the DOM in the future.
   * @constructor
   * @param {Simulation} simulation - the object housing the simulation.
   */
  constructor(simulation: Simulation) {
    this.simulation = simulation;

    this.NElement = document.getElementById('inputN') as HTMLInputElement;
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

    this.NElement.addEventListener('focusout', () => {
      const oldN = this.N;
      this.N = parseInt(this.NElement.value);
      if (this.N != oldN) {
        this.simulation.flocking.restart();
      }
    });

    this.widthElement.addEventListener('compositionupdate', () => {
      this.width = parseInt(this.widthElement.value);
      this.simulation.flocking.restart();
    });

    this.heightElement.addEventListener('compositionupdate', () => {
      this.height = parseInt(this.heightElement.value);
      this.simulation.flocking.restart();
    });

    this.centerXElement.addEventListener('compositionupdate', () => {
      this.center.setX(parseInt(this.centerXElement.value));
      this.simulation.flocking.restart();
    });

    this.centerYElement.addEventListener('compositionupdate', () => {
      this.center.setY(parseInt(this.centerYElement.value));
      this.simulation.flocking.restart();
    });

    this.startXElement.addEventListener('compositionupdate', () => {
      this.start.setX(parseInt(this.startXElement.value));
      this.simulation.flocking.restart();
    });

    this.startYElement.addEventListener('compositionupdate', () => {
      this.start.setY(parseInt(this.startYElement.value));
      this.simulation.flocking.restart();
    });

    this.PElement.addEventListener('compositionupdate', () => {
      this.P = parseFloat(this.PElement.value);
    });

    this.VElement.addEventListener('compositionupdate', () => {
      this.V = parseFloat(this.VElement.value);
    });

    this.c1Element.addEventListener('compositionupdate', () => {
      this.c1 = parseFloat(this.c1Element.value);
    });

    this.c2Element.addEventListener('compositionupdate', () => {
      this.c2 = parseFloat(this.c2Element.value);
    });

    this.c3Element.addEventListener('compositionupdate', () => {
      this.c3 = parseFloat(this.c3Element.value);
    });

    this.c4Element.addEventListener('compositionupdate', () => {
      this.c4 = parseFloat(this.c4Element.value);
    });

    this.vlimitElement.addEventListener('compositionupdate', () => {
      this.vlimit = parseFloat(this.vlimitElement.value);
    });
  }
}
