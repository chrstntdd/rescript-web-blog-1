import { resolve } from "node:path"

import { expect, test } from "@playwright/test"
import { build } from "esbuild"

test.describe("browser pbt", () => {
	let scriptContents: ReadonlyArray<string> = []

	test.beforeAll(async () => {
		let bundled = await build({
			bundle: true,
			entryPoints: [resolve("tests", "random.pbtest.ts")],
			format: "iife",
			platform: "browser",
			target: "esnext",
			write: false,
		})

		scriptContents = bundled.outputFiles.map((r) =>
			new TextDecoder().decode(r.contents),
		)
	})

	test("run property based tests in the browser", async ({ page }) => {
		let [error] = await Promise.all([
			new Promise<void>((res, rej) => {
				page.on("console", (line) => {
					let lineText = line.text()
					if (lineText.includes("Duration: ")) {
						res()
					} else if (lineText.includes("FAIL")) {
						rej(new Error("🥲"))
					}
				})
			}),
			...scriptContents.map(async (content) => page.addScriptTag({ content })),
		])

		expect(error).toBeUndefined()
	})
})
