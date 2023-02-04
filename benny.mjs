import * as crypto from "node:crypto"
import * as b from "benny"
import {
	random_int_rec,
	random_int_reduce,
	random_int_no_loop,
} from "./src/util.bs.js"

let USE_CRYPTO = process.env.USE_CRYPTO === "true"

globalThis.crypto = {
	getRandomValues: USE_CRYPTO
		? (x) => crypto.webcrypto.getRandomValues(x)
		: // Perform no mutation on the typed array argument
		  (x) => x,
}

let ctx = { min: 1, max: 10 }

b.suite(
	`reduce vs recursion vs no loop ${USE_CRYPTO ? "w/webcrypto" : "w/identity"}`,
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
	b.add("no loop", () => {
		let { min, max } = ctx
		return function benchNoLoop() {
			random_int_no_loop(min, max)
		}
	}),

	b.cycle(),
	b.complete(),
)
