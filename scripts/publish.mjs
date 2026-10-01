import { appendFile, readFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import path from "node:path";

const pkgDir = "packages/pi-provider-corti";
const pkg = JSON.parse(await readFile(path.join(pkgDir, "package.json"), "utf8"));

// npm bundled with Node 22 is too old for trusted publishing (needs 11.5.1+),
// but pnpm 12 auto-detects OIDC for auth. `changeset publish` runs pnpm
// publish without --provenance, so publish via pnpm directly to attach the
// provenance attestation, and emit the git-tag event for tag/release creation.
execSync("pnpm publish --provenance --access public --no-git-checks", {
	cwd: pkgDir,
	stdio: "inherit",
});

if (process.env.CHANGESETS_OUTPUT) {
	const event = { type: "git-tag", tag: `${pkg.name}@${pkg.version}`, packageName: pkg.name };
	await appendFile(process.env.CHANGESETS_OUTPUT, JSON.stringify(event) + "\n");
}
