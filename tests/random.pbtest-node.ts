import crypto from "node:crypto"

globalThis.crypto = {
	// @ts-ignore
	getRandomValues: (x) => crypto.webcrypto.getRandomValues(x),
}

import "./random.pbtest"
