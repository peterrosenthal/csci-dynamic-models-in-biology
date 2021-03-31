import * as THREE from 'three';
import * as P5 from 'p5';
import Boid from './boid';
import Simulation from './simulation';

/**
 * Flocking-like behaivior is simulated using a boids algorithm, visualization is done with p5*js
 */
export default class Flocking {
  private parent: HTMLElement;
  private simulation: Simulation;
  private boids: Boid[];
  private width: number;
  private height: number;
  private scale: number;
  private playingMaxSpeed: boolean;

  /**
   * Simulation is initialized upon creation of the class,
   * but not started right away,
   * allowing time for the user to hit the play button.
   * @param {HTMLCanvasElement} parent - p5 canvas element.
   * @param {Simulation} simulation - the settings object for simulation.
   * @constructor
   */
  constructor(parent: HTMLElement, simulation: Simulation) {
    this.parent = parent;
    this.simulation = simulation;
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;
    this.boids = [];
    this.playingMaxSpeed = false;

    this.updateScale();
    this.initSketch();
  }

  /**
   * (Re)start the simulation by cleaning out the boids array and repopulating it.
   */
  public restart() {
    this.boids = [];
    for (let i: number = 0; i < this.simulation.parameters.N; i++) {
      this.boids.push(new Boid(this.simulation));
    }
  }

  /**
   * Updates this.scale based on the values in simulation parameters.
   */
  public updateScale() {
    this.scale = Math.min(
      this.width / this.simulation.parameters.width,
      this.height / this.simulation.parameters.height,
    );
  }

  /**
   * Start running the simulation at max speed
   * @param {number} start - the start time of max-speed running
   */
  private async runMax(start: number) {
    while (this.simulation.speedController.speed < 0) {
      const input: number = Math.min(this.simulation.parameters.N, 300);
      const output: number = this.updateBoids(Math.min(this.simulation.parameters.N, 300));
      if (input == output) {
        this.setBoidsUpdated(false);
      }
      if (performance.now() > start + 20) {
        start = performance.now();
        await new Promise((r) => setTimeout(r, 0));
      }
    }
    this.playingMaxSpeed = false;
  }

  /**
   * Update boid positions and return the number of boids that should have been updated but weren't.
   * @param {number} amount - number of boids to update.
   * @return {number} the number of boids that should have been updated but weren't.
   */
  private updateBoids(amount: number) {
    let boidsUpdated: number = 0;
    this.boids.forEach((boid) => {
      if (!boid.updated && boidsUpdated < amount) {
        boid.updateFromInteractions(this.boids);
        boid.updated = true;
        boidsUpdated++;
      }
    });
    return amount - boidsUpdated;
  }

  /**
   * (Re)sets every boids' updated value to the specified value.
   * @param {boolean} value - the value to set to.
   */
  private setBoidsUpdated(value: boolean) {
    this.boids.forEach((boid) => {
      boid.updated = value;
    });
  }

  /**
   * p5 setup() function override.
   * @param {P5} p5 - the p5 instance.
   */
  private setup(p5: P5) {
    const canvas = p5.createCanvas(this.width, this.height);
    canvas.parent(this.parent);
  }

  /**
   * p5 draw() function override.
   * @param {p5} p5 - the p5 instance.
   */
  private draw(p5: P5) {
    // drawing options
    p5.background(15);
    p5.noStroke();
    p5.rectMode('center');

    // move drawing domain
    p5.translate(
      this.simulation.parameters.center.x + this.width / 2,
      this.simulation.parameters.center.y + this.height / 2,
    );

    // draw the background of the simulation domain
    p5.fill(30);
    p5.rect(
      0,
      0,
      this.simulation.parameters.width * this.scale,
      this.simulation.parameters.height * this.scale,
    );

    // compute boid updates
    if (this.simulation.speedController.speed > 0) {
      let boidsToUpdate: number = this.simulation.speedController.speed;
      let updatedBoidsToUpdate:number = this.updateBoids(boidsToUpdate);
      while (updatedBoidsToUpdate > 0) {
        if (updatedBoidsToUpdate == boidsToUpdate) {
          this.setBoidsUpdated(false);
        }
        boidsToUpdate = updatedBoidsToUpdate;
        updatedBoidsToUpdate = this.updateBoids(boidsToUpdate);
      }
    } else if (this.playingMaxSpeed == false && this.simulation.speedController.speed < 0) {
      this.playingMaxSpeed = true;
      this.runMax(performance.now());
    }

    // draw the boids
    p5.fill(190);
    this.boids.forEach((boid) => {
      const heading: THREE.Vector2 = new THREE.Vector2().addVectors(
        boid.position,
        boid.velocity.clone().normalize(),
      );
      p5.triangle(
        heading.x * this.scale,
        heading.y * this.scale,
        heading.clone().rotateAround(boid.position, 4 * Math.PI / 5).x * this.scale,
        heading.clone().rotateAround(boid.position, 4 * Math.PI / 5).y * this.scale,
        heading.clone().rotateAround(boid.position, 6 * Math.PI / 5).x * this.scale,
        heading.clone().rotateAround(boid.position, 6 * Math.PI / 5).y * this.scale,
      );
    });
  }

  /**
   * Creates the p5 instance.
   */
  private initSketch() {
    new P5((self: P5) => {
      self.setup = () => this.setup(self);
      self.draw = () => this.draw(self);
    });
  }
}
