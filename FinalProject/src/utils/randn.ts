/**
 * Random number from normal distribution approximated by the Box-Muller transform.
 * Inspired by https://stackoverflow.com/a/36481059.
 * @return {number} - random number sampled from a normal distribution w/ mean 0 and variance 1.
 */
export default function randn(): number {
  return Math.sqrt(-2.0 * Math.log(1 - Math.random())) *
         Math.cos(2.0 * Math.PI * (1 - Math.random()));
}
