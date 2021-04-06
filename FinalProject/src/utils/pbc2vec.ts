import * as THREE from 'three';
import Simulation from '../simulation/simulation';

/**
 * A utility function to apply periodic boundary conditions to a vector.
 * @param {THREE.Vector2} vector - the vector to be modified (maybe).
 * @param {string} type - the type of vector, either position or distance.
 * @param {Simulation} simulation - the simulation parent object.
 */
export default function applyPBC2Vector(vector: THREE.Vector2, type: string, simulation: Simulation) {
  const center: THREE.Vector2 = new THREE.Vector2();
  if (type == 'position') {
    center.copy(simulation.parameters.center);
  }
  if (vector.x > center.x + simulation.parameters.width / 2) {
    vector.setX(vector.x - simulation.parameters.width);
  } else if (vector.x < center.x - simulation.parameters.width / 2) {
    vector.setX(vector.x + simulation.parameters.width);
  }
  if (vector.y > center.y + simulation.parameters.height / 2) {
    vector.setY(vector.y - simulation.parameters.height);
  } else if (vector.y < center.y - simulation.parameters.height / 2) {
    vector.setY(vector.y + simulation.parameters.height);
  }
}
