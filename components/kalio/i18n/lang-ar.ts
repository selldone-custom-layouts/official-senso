/* Senso in this language: the shared Kalio base and Senso's own words, one chunk. */
import base from "./base/ar";
import own from "./senso.ar";

export default { ...base, ...own } as Record<string, string>;
