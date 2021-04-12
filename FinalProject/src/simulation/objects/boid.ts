import * as THREE from 'three';
import applyPBC2Vector from '../../utils/pbc2vec';
import randn from '../../utils/randn';
import Repellant from './repellant';
import Simulation from '../simulation';

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
    this.position = new THREE.Vector2(randn(), randn());
    this.position.multiplyScalar(this.simulation.parameters.P);
    this.position.add(this.simulation.parameters.start);
    this.velocity = new THREE.Vector2(randn(), randn());
    this.velocity.multiplyScalar(this.simulation.parameters.V);
    this.updated = false;
  }

  /**
   * Checks interactions with surrounding boids and updates position accordingly.
   * @param {Boid[]} boids - list of boids to (check) interact with.
   * @param {Repellant[]} repellants - list of repellants to interact with.
   */
  public updateFromInteractions(boids: Boid[], repellants: Repellant[]) {
    const v1: THREE.Vector2 = new THREE.Vector2();
    const v2: THREE.Vector2 = new THREE.Vector2();
    const v3: THREE.Vector2 = new THREE.Vector2();
    const v4: THREE.Vector2 = new THREE.Vector2(randn(), randn())
      .multiplyScalar(this.simulation.parameters.c4);

    boids.forEach((boid: Boid) => {
      const r: THREE.Vector2 = new THREE.Vector2().subVectors(boid.position, this.position);
      if (r.length() > 0) {
        applyPBC2Vector(r, 'distance', this.simulation);
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

    repellants.forEach((repellant: Repellant) => {
      const r: THREE.Vector2 = new THREE.Vector2().subVectors(repellant.position, this.position);
      applyPBC2Vector(r, 'distance', this.simulation);
      v2.sub(
        r
          .clone()
          .multiplyScalar(this.simulation.parameters.c2)
          .multiplyScalar(this.simulation.parameters.repellantStrength)
          .divideScalar(r.lengthSq()),
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
    applyPBC2Vector(this.position, 'position', this.simulation);
  }
}
