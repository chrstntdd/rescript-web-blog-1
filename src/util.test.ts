import * as crypto from "node:crypto"

import { beforeAll, describe, expect, vi, it } from "vitest"

import { random_int_reduce } from "./Util.bs"

describe("random_int_reduce", () => {
	beforeAll(() => {
		vi.stubGlobal("crypto", {
			getRandomValues: (x) => crypto.webcrypto.getRandomValues(x),
		})
	})
	it("should return a number", () => {
		let res = random_int_reduce(0, 1)

		expect(res).toBeTypeOf("number")
	})

	it("should return a number in the range", () => {
		let res = random_int_reduce(0, 10)

		expect(res).toBeGreaterThanOrEqual(0)
		expect(res).toBeLessThanOrEqual(10)
	})

	it("should work with big numbers, too", () => {
		let res = random_int_reduce(1_000_000, 100_000_000)

		expect(res).toBeGreaterThanOrEqual(1_000_000)
		expect(res).toBeLessThanOrEqual(100_000_000)
	})
})
