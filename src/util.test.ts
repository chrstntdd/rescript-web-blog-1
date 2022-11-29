import { vi } from "vitest"
import { describe, expect, it } from "vitest"

import { hey } from "./Util.bs"

describe("hey", () => {
	it("should return a number", () => {
		let res = hey()

		expect(res).toBeTypeOf("number")
	})
	it("should log to the console", () => {
		let spy = vi.spyOn(console, "log")
		hey()

		expect(spy).toBeCalledTimes(1)
	})
})
