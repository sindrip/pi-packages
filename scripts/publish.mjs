import { appendFile, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

const pkgDir = "packages/pi-provider-corti";
const pkg = JSON.parse(await readFile(path.join(pkgDir, "package.json"), "utf8"));

// setup-node writes `_authToken=${NODE_AUTH_TOKEN}` to the user .npmrc; with
// NODE_AUTH_TOKEN unset, npm sends that broken token instead of using OIDC
// auto-detection (pnpm ignores it, npm does not). Publish with a clean
// userconfig so npm has no token and falls back to OIDC, then attaches the
// provenance attestation via --provenance.
const tmpNpmrc = path.join(await mkdtemp(path.join(tmpdir(), "npmrc-")), ".npmrc");
await writeFile(tmpNpmrc, "registry=https://registry.npmjs.org\n");
execSync(`npm publish --provenance --access public --userconfig ${tmpNpmrc}`, {
	cwd: pkgDir,
	stdio: "inherit",
});

if (process.env.CHANGESETS_OUTPUT) {
	const event = { type: "git-tag", tag: `${pkg.name}@${pkg.version}`, packageName: pkg.name };
	await appendFile(process.env.CHANGESETS_OUTPUT, JSON.stringify(event) + "\n");
}
