import {spawnSync} from "node:child_process";
import fs from "node:fs";

const mode = process.argv[2];

function git(args, {allowFailure = false} = {}) {
  const result = spawnSync("git", args, {encoding: "utf8"});
  if (result.error) throw result.error;
  if (result.status !== 0 && !allowFailure) {
    const detail = `${result.stderr || result.stdout}`.trim();
    throw new Error(`git ${args.join(" ")} failed${detail ? `: ${detail}` : ""}`);
  }
  return `${result.stdout}`.trim();
}

function requireCleanWorktree() {
  const status = git(["status", "--porcelain"]);
  if (status) {
    throw new Error("Worktree is not clean. Commit the current task or resolve ownership before synchronizing. Automatic stash is prohibited.");
  }
}

function requireProgressFile() {
  if (!fs.existsSync("PROJECT_STATUS.md")) {
    throw new Error("PROJECT_STATUS.md is missing.");
  }
}

function currentBranch() {
  const branch = git(["branch", "--show-current"]);
  if (!branch) throw new Error("Detached HEAD is not allowed for production work.");
  return branch;
}

function upstream() {
  const value = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], {allowFailure: true});
  if (!value) throw new Error("The current branch has no upstream. Push and set upstream before production work.");
  return value;
}

function start() {
  requireProgressFile();
  requireCleanWorktree();
  const branch = currentBranch();
  const trackingBranch = upstream();
  git(["fetch", "origin"]);
  git(["pull", "--ff-only"]);
  requireCleanWorktree();
  console.log(`Synchronized ${branch} with ${trackingBranch}. Read PROJECT_STATUS.md before claiming work.`);
}

function verify() {
  requireProgressFile();
  requireCleanWorktree();
  const branch = currentBranch();
  const localHead = git(["rev-parse", "HEAD"]);
  git(["fetch", "origin"]);
  const remoteHead = git(["rev-parse", `origin/${branch}`], {allowFailure: true});
  if (!remoteHead) throw new Error(`origin/${branch} does not exist.`);
  if (localHead !== remoteHead) {
    throw new Error(`Local HEAD ${localHead} does not match origin/${branch} ${remoteHead}.`);
  }
  console.log(`Verified ${branch} at ${localHead}: local and GitHub match.`);
}

try {
  if (mode === "start") start();
  else if (mode === "verify") verify();
  else throw new Error("Usage: node scripts/git-progress-sync.mjs <start|verify>");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
