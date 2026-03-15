/**
 * Spring physics simulation matching Android's SpringForce.
 * Uses semi-implicit Euler integration with sub-stepping.
 */
export class Spring {
  private k: number;
  private c: number;

  pos: number;
  vel: number;
  target: number;

  constructor(stiffness: number, dampingRatio: number) {
    this.k = stiffness;
    // critical damping = 2 * sqrt(k * mass), mass = 1
    this.c = dampingRatio * 2 * Math.sqrt(stiffness);
    this.pos = 0;
    this.vel = 0;
    this.target = 0;
  }

  step(dt: number): void {
    const SUB_STEPS = 12;
    const sub = dt / SUB_STEPS;
    for (let i = 0; i < SUB_STEPS; i++) {
      const accel = -this.k * (this.pos - this.target) - this.c * this.vel;
      this.vel += accel * sub;
      this.pos += this.vel * sub;
    }
  }

  reset(): void {
    this.pos = 0;
    this.vel = 0;
    this.target = 0;
  }
}
