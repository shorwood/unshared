import { Vector } from "./createVector";

/**
 * Print a graph of the vectors. The origin is at the center of the graph.
 * and pipes are used to represent the axes.
 *
 * @param vectors
 */
export function printGraph(...vectors: Vector<2>[]) {
  const height = 1080 / 40;
  const width = 1920 / 20;
  const ratio = (width / height) / 1.5;
  const canvas = Array.from({ length: height }, () => Array.from({ length: width }, () => ' '));
  const origin = [width / 2, height / 2].map(Math.round);

  // using utf8 characters
  for (let i = 0; i < canvas.length; i++) {
    canvas[i][origin[0]] = '│';
  }

  // using utf8 characters
  for (let i = 0; i < canvas[0].length; i++) {
    canvas[origin[1]][i] = '─';
  }

  // set the origin character, using utf8 characters
  canvas[origin[1]][origin[0]] = '┼';

  // Draw the vectors.
  for (const vector of vectors) {
    const xRatio = ratio > 1 ? ratio : 1;
    const yRatio = ratio > 1 ? 1 : 1 / ratio;

    const x = Math.round(origin[0] + vector[0] * xRatio);
    const y = Math.round(origin[1] - vector[1] * yRatio);

    // if out of bounds, skip
    if (x < 0 || x >= width || y < 0 || y >= height) continue;

    const text = `•`;
    canvas[y].splice(x, text.length, ...text);
  }

  // Print the canvas.
  for (const row of canvas) {
    console.log(row.join(''));
  }
}
