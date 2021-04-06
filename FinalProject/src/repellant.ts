import * as THREE from 'three';
import Simulation from './simulation';

/**
 * An object to repel boids
 */
export default class Repellant {
  public position: THREE.Vector2;

  /**
   * @constructor
   * @param {Simulation} simulation - the simulation parent object
   */
  constructor(simulation: Simulation) {
    this.position = new THREE.Vector2(
      Math.random() * simulation.parameters.width +
        simulation.parameters.center.x - simulation.parameters.width / 2,
      Math.random() * simulation.parameters.height +
        simulation.parameters.center.y - simulation.parameters.height / 2,
    );
  }
}
