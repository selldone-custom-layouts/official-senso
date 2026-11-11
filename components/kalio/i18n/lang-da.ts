/* Senso in this language: the shared Kalio base and Senso's own words, one chunk. */
import base from "./base/da";
import own from "./senso.da";

export default { ...base, ...own } as Record<string, string>;
