/**
 * Minimal Node declarations for the filesystem calls the tests make.
 *
 * The project keeps `types: []` in tsconfig and a four-package devDependency
 * set, so `@types/node` is deliberately absent. This file declares only what the
 * tests use; add a function here when a new test needs one, rather than pulling
 * in the full Node type package.
 */
declare module 'node:fs' {
  export function existsSync(path: string): boolean;
  export function readdirSync(path: string): string[];
  export function readFileSync(path: string, encoding: 'utf8'): string;
}
