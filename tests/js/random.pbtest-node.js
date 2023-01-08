import crypto from "node:crypto"

globalThis.crypto = {
	getRandomValues: (x) => crypto.webcrypto.getRandomValues(x),
}

import "./random.pbtest.js"
