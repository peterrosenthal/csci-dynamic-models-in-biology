import * as THREE from 'three';
import * as P5 from 'p5';
import Boid from './boid';
import Settings from './settings';

/**
 * Flocking-like behaivior is simulated using a boids algorithm, visualization is done with p5*js
 */
export default class Flocking2D {
  private parent: HTMLElement;
  private settings: Settings;
  private boids: Boid[];
  private width: number;
  private height: number;
  private scale: THREE.Vector2;

  /**
   * Simulation is initialized upon creation of the class,
   * but not started right away,
   * allowing time for the user to hit the play button.
   * @param {HTMLCanvasElement} parent - p5 canvas element.
   * @param {Settings} settings - the settings object for simulation.
   * @constructor
   */
  constructor(parent: HTMLElement, settings: Settings) {
    this.parent = parent;
    this.settings = settings;
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;
    this.scale = new THREE.Vector2(
      this.width / this.settings.width,
      this.height / this.settings.height,
    );
    if (this.settings.keepAspectRatio) {
      this.scale.setX(Math.min(this.scale.x, this.scale.y));
      this.scale.setY(Math.min(this.scale.x, this.scale.y));
    }
    this.boids = [];

    this.initSketch();
  }

  /**
   * (Re)start the simulation by cleaning out the boids array and repopulating it.
   */
  private start() {
    this.boids = [];
    for (let i: number = 0; i < this.settings.N; i++) {
      this.boids.push(new Boid(this.settings));
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
    if (this.settings.reset == true) {
      this.start();
      this.settings.reset = false;
    }

    // update scale from settings
    this.scale.setX(this.width / this.settings.width);
    this.scale.setY(this.height / this.settings.height);
    if (this.settings.keepAspectRatio) {
      this.scale.setX(Math.min(this.scale.x, this.scale.y));
      this.scale.setY(Math.min(this.scale.x, this.scale.y));
    }

    // drawing options
    p5.background(15);
    p5.noStroke();
    p5.rectMode('center');

    // move drawing domain
    p5.translate(
      this.settings.center.x + this.width / 2,
      this.settings.center.y + this.height / 2,
    );

    // draw the background of the simulation domain
    p5.fill(30);
    p5.rect(0, 0, this.settings.width * this.scale.x, this.settings.height * this.scale.y);

    // draw the boids (and compute them for now, though I want to abstract this later maybe somehow...)
    p5.fill(190);
    this.boids.forEach((boid) => {
      const heading: THREE.Vector2 = new THREE.Vector2().addVectors(
        boid.position,
        boid.velocity.clone().normalize(),
      );
      p5.triangle(
        heading.x * this.scale.x,
        heading.y * this.scale.y,
        heading.clone().rotateAround(boid.position, 4 * Math.PI / 5).x * this.scale.x,
        heading.clone().rotateAround(boid.position, 4 * Math.PI / 5).y * this.scale.y,
        heading.clone().rotateAround(boid.position, 6 * Math.PI / 5).x * this.scale.x,
        heading.clone().rotateAround(boid.position, 6 * Math.PI / 5).y * this.scale.y,
      );
      if (this.settings.play == true) {
        boid.updateFromInteractions(this.boids);
      }
    });
  }

  /**
   * Creates the p5 instance.
   */
  private initSketch() {
    new P5((self: P5) => {
      self.setup = () => {
        this.setup(self);
      };
      self.draw = () => {
        this.draw(self);
      };
    });
  }
}
