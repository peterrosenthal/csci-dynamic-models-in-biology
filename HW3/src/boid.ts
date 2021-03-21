import * as THREE from 'three';
import randn from './randn';
import Settings from './settings';

/**
 * Boid - A bird-like individual with certain behaviors, many of them make a flock
 */
export default class Boid {
  public position: THREE.Vector2;
  public velocity: THREE.Vector2;

  private positionVectorType: string;
  private distanceVectorType: string;
  private settings: Settings;

  /**
   * @constructor
   * @param {Settings} settings - the settings object for simulation;
   */
  constructor(settings: Settings) {
    this.settings = settings;
    this.position = new THREE.Vector2(randn(), randn()).multiplyScalar(this.settings.P);
    this.velocity = new THREE.Vector2(randn(), randn()).multiplyScalar(this.settings.V);
    this.positionVectorType = 'position';
    this.distanceVectorType = 'distance';
  }

  /**
   * Checks interactions with surrounding boids and updates position accordingly.
   * @param {Boid[]} boids - list of boids to (check) interact with.
   */
  public updateFromInteractions(boids: Boid[]) {
    const v1: THREE.Vector2 = new THREE.Vector2();
    const v2: THREE.Vector2 = new THREE.Vector2();
    const v3: THREE.Vector2 = new THREE.Vector2();
    const v4: THREE.Vector2 = new THREE.Vector2(randn(), randn()).multiplyScalar(this.settings.c4);
    boids.forEach((boid: Boid) => {
      const r: THREE.Vector2 = new THREE.Vector2().subVectors(boid.position, this.position);
      if (r.length() > 0) {
        this.applyPBC2Vector(r, 'distance');
        v1.add(r.clone().multiplyScalar(this.settings.c1));
        v2.sub(r.clone().multiplyScalar(this.settings.c2).divideScalar(r.lengthSq()));
      }
      v3.add(boid.velocity.clone().multiplyScalar(this.settings.c3).divideScalar(this.settings.N));
    });
    if (v3.length() > this.settings.vlimit) {
      v3.multiplyScalar(this.settings.vlimit / v3.length());
    }
    this.velocity.add(v1).add(v2).add(v3).add(v4);
    if (this.velocity.length() > this.settings.vlimit) {
      this.velocity.multiplyScalar(this.settings.vlimit / this.velocity.length());
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
      center.copy(this.settings.center);
    }
    if (vector.x > center.x + this.settings.width / 2) {
      vector.setX(vector.x - this.settings.width);
    } else if (vector.x < center.x - this.settings.width / 2) {
      vector.setX(vector.x + this.settings.width);
    }
    if (vector.y > center.y + this.settings.height / 2) {
      vector.setY(vector.y - this.settings.height);
    } else if (vector.y < center.y - this.settings.height / 2) {
      vector.setY(vector.y + this.settings.height);
    }
  }
}
