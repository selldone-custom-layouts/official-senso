/* Senso in this language: the shared Kalio base and Senso's own words, one chunk. */
import base from "./base/hi";
import own from "./senso.hi";

export default { ...base, ...own } as Record<string, string>;
