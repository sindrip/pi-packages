import { appendFile, readFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import path from "node:path";

const pkgDir = "packages/pi-provider-corti";
const pkg = JSON.parse(await readFile(path.join(pkgDir, "package.json"), "utf8"));

// npm honors NPM_CONFIG_PROVENANCE (set in the workflow) and auto-detects OIDC.
// pnpm ignores that env var and `changeset publish` doesn't pass --provenance,
// so publish via npm directly to attach a provenance attestation.
execSync("npm publish --provenance --access public", { cwd: pkgDir, stdio: "inherit" });

if (process.env.CHANGESETS_OUTPUT) {
	const event = { type: "git-tag", tag: `${pkg.name}@${pkg.version}`, packageName: pkg.name };
	await appendFile(process.env.CHANGESETS_OUTPUT, JSON.stringify(event) + "\n");
}
