import fc from "fast-check"
import { suite } from "uvu"

import { random_int_reduce, random_int_rec } from "../../src/Util.bs.js"

let baseTest = suite("base")

let isInInclusiveRange = (min, max, result) => result >= min && result <= max

let isInteger = (_, __, result) => Number.isInteger(result)

let notNaN = (_, __, result) => !Number.isNaN(result)

function makePredicate(randomFnImpl, predFn) {
	return function validateProperty(min, max) {
		fc.pre(min < max)

		const result = randomFnImpl(min, max)

		return predFn(min, max, result)
	}
}

function makeTestsForIntegers(name, predicate, opts) {
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

function makeBaseTest(randomFnImpl, opts) {
	makeTestsForIntegers(
		"always returns a number within the specified range",
		makePredicate(randomFnImpl, isInInclusiveRange),
		opts,
	)
	makeTestsForIntegers(
		"always returns an integer",
		makePredicate(randomFnImpl, isInteger),
		opts,
	)
	makeTestsForIntegers(
		"never returns NaN",
		makePredicate(randomFnImpl, notNaN),
		opts,
	)
}

let opts = { numRuns: 1000 }
makeBaseTest(random_int_reduce, opts)
makeBaseTest(random_int_rec, opts)

baseTest.run()
