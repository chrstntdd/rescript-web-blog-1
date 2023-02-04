import fc from "fast-check"
import { suite } from "uvu"

import {
	random_int_reduce,
	random_int_rec,
	random_int_no_loop,
} from "../src/Util.bs"

let baseTest = suite("base")

type RandomImpl = (min: number, max: number) => number

type Predicate = (min: number, max: number, result: number) => boolean

let isInInclusiveRange: Predicate = (min, max, result) =>
	result >= min && result <= max

let isInteger: Predicate = (_, __, result) => Number.isInteger(result)

let notNaN: Predicate = (_, __, result) => !Number.isNaN(result)

function harness(randomFnImpl: RandomImpl) {
	return function makeValidateProperty(predFn: Predicate) {
		return function validateProperty(min: number, max: number) {
			fc.pre(min < max)

			const result = randomFnImpl(min, max)

			return predFn(min, max, result)
		}
	}
}

function makeTestsForIntegers(
	name: string,
	predicate: ReturnType<ReturnType<typeof harness>>,
	opts: Parameters<(typeof fc)["assert"]>[1],
) {
	baseTest(`[integer] ${name}`, () =>
		fc.assert(fc.property(fc.integer(), fc.integer(), predicate), opts),
	)
	baseTest(`[nat] ${name}`, () =>
		fc.assert(fc.property(fc.nat(), fc.nat(), predicate), opts),
	)
	baseTest(`[maxSafeInteger] ${name}`, () =>
		fc.assert(
			fc.property(fc.maxSafeInteger(), fc.maxSafeInteger(), predicate),
			opts,
		),
	)
	baseTest(`[maxSafeNat] ${name}`, () =>
		fc.assert(fc.property(fc.maxSafeNat(), fc.maxSafeNat(), predicate), opts),
	)
}

function makeBaseTest(
	randomFnImpl: RandomImpl,
	opts: Parameters<(typeof fc)["assert"]>[1],
) {
	let validateProperty = harness(randomFnImpl)
	makeTestsForIntegers(
		"returns a number within the specified range",
		validateProperty(isInInclusiveRange),
		opts,
	)
	makeTestsForIntegers("returns an integer", validateProperty(isInteger), opts)
	makeTestsForIntegers("never returns NaN", validateProperty(notNaN), opts)
}

let sharedOptions = { numRuns: 1000 } satisfies Parameters<
	typeof makeBaseTest
>[1]
makeBaseTest(random_int_reduce, sharedOptions)
makeBaseTest(random_int_rec, sharedOptions)
makeBaseTest(random_int_no_loop, sharedOptions)

baseTest.run()
