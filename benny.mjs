import * as crypto from "node:crypto"
import * as b from "benny"
import { random_int_rec, random_int_reduce } from "./src/util.bs.js"

globalThis.crypto = {
	// getRandomValues: (x) => crypto.webcrypto.getRandomValues(x),
	// Perform no mutation on the typed array argument
	getRandomValues: (x) => x,
}

let ctx = { min: 1, max: 10 }

b.suite(
	"reduce vs recursion",
	b.add("reduce", () => {
		let { min, max } = ctx
		return function benchReduce() {
			random_int_reduce(min, max)
		}
	}),
	b.add("recursion", () => {
		let { min, max } = ctx
		return function benchRecursion() {
			random_int_rec(min, max)
		}
	}),

	b.cycle(),
	b.complete(),
)
