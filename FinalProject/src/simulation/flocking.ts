import * as THREE from 'three';
import * as P5 from 'p5';
import Boid from './objects/boid';
import Simulation from './simulation';
import applyPBC2Vector from '../utils/pbc2vec';
import Repellant from './objects/repellant';

/**
 * Flocking-like behaivior is simulated using a boids algorithm, visualization is done with p5*js
 */
export default class Flocking {
  public maxTimestep: number;

  private parent: HTMLElement;
  private simulation: Simulation;
  private boids: Boid[];
  private repellants: Repellant[];
  private width: number;
  private height: number;
  private scale: number;
  private playingMaxSpeed: boolean;
  private timestep: number;

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
    this.width = parent.offsetWidth;
    this.height = parent.offsetHeight;
    this.boids = [];
    this.repellants = [];
    this.timestep = 0;
    this.playingMaxSpeed = false;

    this.maxTimestep = -1;

    this.updateScale();
    this.initSketch();
  }

  /**
   * (Re)start the simulation by cleaning out the boids array and repopulating it.
   */
  public restart() {
    this.timestep = 0;
    this.boids = [];
    this.repellants = [];
    for (let i: number = 0; i < this.simulation.parameters.N; i++) {
      this.boids.push(new Boid(this.simulation));
    }
    for (let i: number = 0; i < this.simulation.parameters.R; i++) {
      this.repellants.push(new Repellant(this.simulation));
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
        this.timestep++;
        this.calculateOutputValues();
        if (this.maxTimestep > 0 && this.timestep >= this.maxTimestep) {
          if (this.simulation.runController.run == 0) {
            this.simulation.runController.run++;
          }
          this.simulation.runController.nextRunStep();
        }
      }
      if (performance.now() > start + 33) {
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
        boid.updateFromInteractions(this.boids, this.repellants);
        boid.updated = true;
        boidsUpdated++;
      }
    });
    // if (amount == boidsUpdated) {
    //   this.calculateOutputValues();
    // }
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
   * Caluclates and places in simulation.dataPlotter:
   * * current timestep
   * * center of mass
   * * radius of gyration
   */
  private calculateOutputValues() {
    // calculate the center of mass accounting for PBC according to Wikipedia:
    const ξ: THREE.Vector2 = new THREE.Vector2();
    const ζ: THREE.Vector2 = new THREE.Vector2();
    this.boids.forEach((boid: Boid) => {
      const θ: THREE.Vector2 = boid.position.clone();
      θ.sub(this.simulation.parameters.center);
      θ.setX((θ.x + this.simulation.parameters.width / 2) / this.simulation.parameters.width);
      θ.setY((θ.y + this.simulation.parameters.height / 2) / this.simulation.parameters.height);
      θ.multiplyScalar(2 * Math.PI);
      ξ.add(new THREE.Vector2(Math.cos(θ.x), Math.cos(θ.y)));
      ζ.add(new THREE.Vector2(Math.sin(θ.x), Math.sin(θ.y)));
    });
    ξ.divideScalar(this.boids.length);
    ζ.divideScalar(this.boids.length);
    const θ: THREE.Vector2 = new THREE.Vector2(
      Math.atan2(-ζ.x, -ξ.x) + Math.PI,
      Math.atan2(-ζ.y, -ξ.y) + Math.PI,
    );
    const centerOfMass = θ.clone().divideScalar(2 * Math.PI).multiplyScalar(this.simulation.parameters.width);
    centerOfMass.add(this.simulation.parameters.center);
    centerOfMass.setX(centerOfMass.x - this.simulation.parameters.width / 2);
    centerOfMass.setY(centerOfMass.y - this.simulation.parameters.height / 2);

    // calculate radius of gyration
    let radiusOfGyration: number = 0;
    this.boids.forEach((boid: Boid) => {
      const dist: THREE.Vector2 = new THREE.Vector2().subVectors(centerOfMass, boid.position);
      applyPBC2Vector(dist, 'distance', this.simulation);
      radiusOfGyration += dist.lengthSq();
    });
    radiusOfGyration = Math.sqrt(radiusOfGyration / this.boids.length);

    // calculate avg alignment
    let alignment: number = 0;
    this.boids.forEach((boidI: Boid) => {
      this.boids.forEach((boidJ: Boid) => {
        if (boidI !== boidJ) {
          alignment += boidI.velocity.dot(boidJ.velocity) /
            (boidI.velocity.length() * boidJ.velocity.length());
        }
      });
    });
    alignment /= (this.boids.length * this.boids.length);

    if (this.simulation.runController.realizations == 1) {
      this.simulation.dataController.timesteps.values.push(this.timestep);
      this.simulation.dataController.radiusOfGyration.values.push(radiusOfGyration);
      this.simulation.dataController.alignment.values.push(alignment);
      if (this.timestep == 1) {
        this.simulation.dataController.N.values.push(this.simulation.parameters.N);
        this.simulation.dataController.R.values.push(this.simulation.parameters.R);
        this.simulation.dataController.width.values.push(this.simulation.parameters.width);
        this.simulation.dataController.height.values.push(this.simulation.parameters.height);
        this.simulation.dataController.centerX.values.push(this.simulation.parameters.center.x);
        this.simulation.dataController.centerY.values.push(this.simulation.parameters.center.y);
        this.simulation.dataController.startX.values.push(this.simulation.parameters.start.x);
        this.simulation.dataController.startY.values.push(this.simulation.parameters.start.y);
        this.simulation.dataController.P.values.push(this.simulation.parameters.P);
        this.simulation.dataController.V.values.push(this.simulation.parameters.V);
        this.simulation.dataController.c1.values.push(this.simulation.parameters.c1);
        this.simulation.dataController.c2.values.push(this.simulation.parameters.c2);
        this.simulation.dataController.c3.values.push(this.simulation.parameters.c3);
        this.simulation.dataController.c4.values.push(this.simulation.parameters.c4);
        this.simulation.dataController.vlimit.values.push(this.simulation.parameters.vlimit);
        this.simulation.dataController.repellantStrength.values.push(
          this.simulation.parameters.repellantStrength,
        );
      }
    } else {
      const index: number = this.timestep + (this.simulation.runController.runNum - 1) * this.maxTimestep - 1;
      this.simulation.dataController.radiusOfGyration.values[index] = (1 - 1 /
        this.simulation.runController.realizations) *
        this.simulation.dataController.radiusOfGyration.values[index] +
        1 / this.simulation.runController.realizations * radiusOfGyration;
      this.simulation.dataController.alignment.values[index] = (1 - 1 /
        this.simulation.runController.realizations) *
        this.simulation.dataController.alignment.values[index] +
        1 / this.simulation.runController.realizations * alignment;
    }
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
          this.timestep++;
          this.calculateOutputValues();
          if (this.maxTimestep > 0 && this.timestep >= this.maxTimestep) {
            if (this.simulation.runController.run == 0) {
              this.simulation.runController.run++;
            }
            this.simulation.runController.nextRunStep();
          }
        }
        boidsToUpdate = updatedBoidsToUpdate;
        updatedBoidsToUpdate = this.updateBoids(boidsToUpdate);
      }
    } else if (this.playingMaxSpeed == false && this.simulation.speedController.speed < 0) {
      this.playingMaxSpeed = true;
      this.runMax(performance.now());
    }

    // draw the repellants
    p5.fill(150);
    this.repellants.forEach((repellant: Repellant) => {
      p5.circle(repellant.position.x * this.scale, repellant.position.y * this.scale, 4);
    });

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
      self.windowResized = () => {
        this.width = this.parent.offsetWidth;
        this.height = this.parent.offsetHeight;
        self.resizeCanvas(this.width, this.height);
      };
    });
  }
}
