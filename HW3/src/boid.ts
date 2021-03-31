import * as THREE from 'three';
import randn from './randn';
import Simulation from './simulation';

/**
 * Boid - A bird-like individual with certain behaviors, many of them make a flock
 */
export default class Boid {
  public position: THREE.Vector2;
  public velocity: THREE.Vector2;
  public updated: boolean;

  private simulation: Simulation;

  /**
   * @constructor
   * @param {Simulation} simulation - the settings object for simulation;
   */
  constructor(simulation: Simulation) {
    this.simulation = simulation;
    this.position = new THREE.Vector2(randn(), randn()).multiplyScalar(this.simulation.parameters.P);
    this.velocity = new THREE.Vector2(randn(), randn()).multiplyScalar(this.simulation.parameters.V);
    this.updated = false;
  }

  /**
   * Checks interactions with surrounding boids and updates position accordingly.
   * @param {Boid[]} boids - list of boids to (check) interact with.
   */
  public updateFromInteractions(boids: Boid[]) {
    const v1: THREE.Vector2 = new THREE.Vector2();
    const v2: THREE.Vector2 = new THREE.Vector2();
    const v3: THREE.Vector2 = new THREE.Vector2();
    const v4: THREE.Vector2 = new THREE.Vector2(randn(), randn())
      .multiplyScalar(this.simulation.parameters.c4);

    boids.forEach((boid: Boid) => {
      const r: THREE.Vector2 = new THREE.Vector2().subVectors(boid.position, this.position);
      if (r.length() > 0) {
        this.applyPBC2Vector(r, 'distance');
        v1.add(
          r
            .clone()
            .multiplyScalar(this.simulation.parameters.c1),
        );
        v2.sub(
          r
            .clone()
            .multiplyScalar(this.simulation.parameters.c2)
            .divideScalar(r.lengthSq()),
        );
      }
      v3.add(
        boid.velocity
          .clone()
          .multiplyScalar(this.simulation.parameters.c3)
          .divideScalar(this.simulation.parameters.N),
      );
    });
    if (v3.length() > this.simulation.parameters.vlimit) {
      v3.multiplyScalar(this.simulation.parameters.vlimit / v3.length());
    }
    this.velocity.add(v1).add(v2).add(v3).add(v4);
    if (this.velocity.length() > this.simulation.parameters.vlimit) {
      this.velocity.multiplyScalar(this.simulation.parameters.vlimit / this.velocity.length());
    }
    this.position.add(this.velocity);
    this.applyPBC2Vector(this.position, 'position');
  }

  /**
   * Apply periodic boundary conditions (PBC) to a vector.
   * @param {THREE.Vector2} vector - the vector for PBC to be applied to.
   * @param {string} vectorType - the vector type, either 'position' or 'distance'.
   */
  private applyPBC2Vector(vector: THREE.Vector2, vectorType: string) {
    const center: THREE.Vector2 = new THREE.Vector2();
    if (vectorType == 'position') {
      center.copy(this.simulation.parameters.center);
    }
    if (vector.x > center.x + this.simulation.parameters.width / 2) {
      vector.setX(vector.x - this.simulation.parameters.width);
    } else if (vector.x < center.x - this.simulation.parameters.width / 2) {
      vector.setX(vector.x + this.simulation.parameters.width);
    }
    if (vector.y > center.y + this.simulation.parameters.height / 2) {
      vector.setY(vector.y - this.simulation.parameters.height);
    } else if (vector.y < center.y - this.simulation.parameters.height / 2) {
      vector.setY(vector.y + this.simulation.parameters.height);
    }
  }
}
