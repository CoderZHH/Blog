# Obsidian Notes Sync Technical Plan

## 1. Goal

This document defines the production-ready technical plan for synchronizing updates from the private GitHub repository `CoderZHH/ObsdianNote` into the Obsidian section of this blog.

Target behavior:

- Source repository: `CoderZHH/ObsdianNote`
- Repository visibility: `private`
- Source branch: `master`
- Only monitor the root-level `开发/` folder
- Exclude every other directory and file outside `开发/`
- Only display the most recent 10 notes that were newly created or updated
- Do not link users to the original GitHub file
- Development environment: `http://localhost:3000`
- Target deployment: `Vercel`

The page should behave as a recent update feed, not a full note browser.

## 2. Final Architecture

Recommended architecture:

`GitHub push -> GitHub Webhook -> Blog invalidates cache -> Blog server fetches latest GitHub data -> Homepage renders top 10 updates`

This combines notification and active fetching:

- GitHub Webhook is used to notify the blog that new commits were pushed.
- The blog server is still the component that actively fetches and computes the update list.

Reason:

- Pure polling is slower and wastes requests.
- Pure notification is incomplete because a webhook only says "something changed" and does not itself provide the final display data.
- `Webhook + fetch` is the most stable structure for a Next.js app deployed on Vercel.

## 3. Scope Rules

Only files matching all rules below are included:

- File is under `开发/`
- File extension is `.md`, `.mdx`, or `.markdown`
- File change type is one of:
  - `added`
  - `modified`
  - `renamed`

Excluded:

- Any file outside `开发/`
- Images, attachments, PDFs, binaries
- Deleted notes
- Templates, if they are not inside `开发/`
- Any folder other than `开发/`

Interpretation of change types:

- `added` -> `NEW`
- `modified` -> `UPDATED`
- `renamed` -> `UPDATED`
- `removed` -> ignored

## 4. User-Facing Display Rules

The Obsidian section on the homepage should display a maximum of 10 cards.

Each card should show:

- Note title
- Relative path inside `开发/`
- Update type: `NEW` or `UPDATED`
- Last update time
- Commit message summary
- Commit short SHA

The card should not:

- Link to GitHub
- Show full note body
- Show private content excerpts by default

Recommended title source:

1. Use the file name without extension
2. If future support is added for frontmatter title, that can override the file name

For the initial implementation, file name only is enough.

## 5. Data Source Strategy

Do not scan the full repository tree as the primary method.

Use recent commits as the source of truth because the requirement is "recent updates", not "all files".

Recommended server workflow:

1. Request recent commits from `CoderZHH/ObsdianNote` on branch `master`
2. Limit the request to the `开发/` path if supported by the GitHub API call
3. Fetch commit details for recent commits
4. Iterate through changed files in each commit
5. Keep only note files under `开发/`
6. Convert file changes into feed items
7. Deduplicate by file path, keeping only the newest record for each file
8. Sort by update time descending
9. Return the first 10 items

Why commit-based sync is correct here:

- It naturally gives update ordering
- It naturally distinguishes `NEW` vs `UPDATED`
- It avoids scanning unrelated note files
- It matches the "recent update feed" product requirement

## 6. Blog-Side Components

The blog project should add three pieces.

### 6.1 Server-side GitHub sync module

Responsibility:

- Read GitHub commit data
- Filter note files under `开发/`
- Convert commit/file data into a normalized feed
- Return the latest 10 records

Suggested internal type:

```ts
type NoteUpdate = {
  id: string;
  title: string;
  path: string;
  updatedAt: string;
  changeType: "new" | "updated";
  sha: string;
  commitMessage: string;
};
```

### 6.2 Webhook endpoint

Suggested route:

`POST /api/obsidian/webhook`

Responsibility:

- Validate GitHub webhook signature
- Accept only `push` events
- Accept only repository `CoderZHH/ObsdianNote`
- Accept only branch `refs/heads/master`
- Invalidate the Obsidian cache tag

### 6.3 Homepage Obsidian section

Current placeholder component:

- `/Users/zhh/.codex/worktrees/8aaf/Blog/components/home/sections/NotesCarousel.tsx`

This section should become a server-rendered recent update feed with:

- loading-safe fallback
- empty state
- sync error state
- configured state

## 7. Cache Strategy

Recommended cache policy:

- Standard cache TTL: 300 seconds
- Cache tag dedicated to Obsidian feed
- Webhook invalidates that tag immediately after a valid push

Result:

- Normal page visits are fast
- GitHub is not called on every request
- After a push, the next request fetches fresh data quickly

This is better than polling-only because it reduces delay without adding unnecessary request volume.

## 8. Security Requirements

Because the source repository is private, server-side GitHub access must use a read-only credential.

Use a GitHub fine-grained personal access token with minimum required permissions:

- Repository metadata: read-only
- Repository contents: read-only

Do not use:

- account password
- broad classic token unless unavoidable
- any credential hardcoded in source code

All secrets must live in environment variables only.

Webhook security requirements:

- Validate `X-Hub-Signature-256`
- Reject requests with invalid signature
- Reject events other than `push`
- Reject pushes from any repo other than `CoderZHH/ObsdianNote`
- Reject pushes to any branch other than `master`

## 9. Environment Variables

The blog should use the following environment variables.

```env
GITHUB_NOTES_OWNER=CoderZHH
GITHUB_NOTES_REPO=ObsdianNote
GITHUB_NOTES_BRANCH=master
GITHUB_NOTES_PATH=开发
GITHUB_NOTES_TOKEN=your_read_only_token
GITHUB_NOTES_WEBHOOK_SECRET=your_random_secret
```

Meaning:

- `GITHUB_NOTES_OWNER`: GitHub owner name
- `GITHUB_NOTES_REPO`: notes repository name
- `GITHUB_NOTES_BRANCH`: branch to monitor
- `GITHUB_NOTES_PATH`: only monitor `开发/`
- `GITHUB_NOTES_TOKEN`: read private repo data
- `GITHUB_NOTES_WEBHOOK_SECRET`: verify webhook authenticity

## 10. GitHub Repository Changes Required

The notes repository does not need code changes for the core sync flow.

Required repository-side action:

- Add a webhook in the GitHub repository settings

Webhook settings:

- Payload URL:
  - local development: use a temporary public tunnel URL, not raw localhost
  - production: `https://<your-domain>/api/obsidian/webhook`
- Content type: `application/json`
- Secret: same value as `GITHUB_NOTES_WEBHOOK_SECRET`
- Trigger events: `Just the push event`
- Status: active

No repository content restructuring is required because the scope is already explicitly fixed to root `开发/`.

## 11. Local Development Plan

Current development base:

- `http://localhost:3000`

Important constraint:

GitHub Webhook cannot directly call `localhost`.

So local development should be split into two phases.

### Phase A: No webhook, fetch only

Use this first.

Behavior:

- Homepage fetches GitHub updates from the private repo
- Obsidian cards render from real server-side data
- Cache TTL still works
- No webhook needed yet

This phase is enough to verify:

- GitHub token permissions
- path filtering
- sorting
- top 10 behavior
- empty state
- error state

### Phase B: Webhook with tunnel

When validating near-real-time refresh, expose local dev using a tunnel.

Recommended tools:

- `cloudflared tunnel`
- `ngrok`

Example concept:

- tunnel gives a public HTTPS URL
- GitHub webhook points to `https://<temporary-domain>/api/obsidian/webhook`
- push to `ObsdianNote`
- local blog receives the webhook
- local cache is invalidated

## 12. Vercel Deployment Plan

Recommended platform:

- `Vercel`

Reason:

- Native support for Next.js route handlers
- Easy environment variable management
- Good fit for cache revalidation patterns

Deployment tasks:

1. Import the `Blog` repository into Vercel
2. Configure all environment variables in Vercel project settings
3. Deploy once to obtain the public domain
4. Add the GitHub webhook in `ObsdianNote`
5. Point webhook payload URL to:

```txt
https://<vercel-domain>/api/obsidian/webhook
```

6. Push a test note update to validate end-to-end behavior

## 13. UI States Required

The Obsidian section should support at least these states.

### 13.1 Not configured

Shown when required environment variables are missing.

Display:

- configuration missing message
- no crash

### 13.2 Sync failed

Shown when GitHub API request fails or token is invalid.

Display:

- sync failed message
- optional retry on next request
- no crash

### 13.3 Empty feed

Shown when no valid recent note update is found under `开发/`.

Display:

- no updates found message

### 13.4 Normal state

Shown when valid note updates are available.

Display:

- up to 10 update cards

## 14. Edge Cases

The implementation should define behavior for these cases.

### 14.1 Multiple commits for the same note

Only keep the newest update for that path.

### 14.2 Rename inside `开发/`

Treat as `UPDATED`.

### 14.3 Move from outside `开发/` into `开发/`

Treat as visible if the final path is inside `开发/`.

### 14.4 Move from `开发/` to outside `开发/`

Do not display it anymore in future updates.

### 14.5 Deleted note

Ignore.

### 14.6 Commit touches note plus attachment

Only note file enters the feed.

### 14.7 Large burst of commits

Fetch enough recent commits to reliably extract 10 unique note updates.
Suggested initial scan window:

- 20 commits

Increase if needed later.

## 15. Acceptance Tests

The implementation is complete only if all of the following pass.

### Functional tests

1. Create a new Markdown note under `开发/` and push to `master`
2. Homepage shows that note as `NEW`
3. Modify an existing note under `开发/` and push
4. Homepage shows that note as `UPDATED`
5. Modify a file outside `开发/`
6. Homepage does not change because of that file
7. Delete a note under `开发/`
8. Deleted note is not shown as a new feed record
9. Update more than 10 different notes
10. Homepage shows only the latest 10

### Security tests

1. Remove or break GitHub token
2. Homepage shows sync failure state instead of crashing
3. Send webhook with wrong signature
4. Endpoint rejects it
5. Send webhook from wrong branch or wrong repo payload
6. Endpoint ignores it

### Cache tests

1. Without webhook, data updates after cache TTL expires
2. With webhook, data refreshes on the next page request after push

## 16. Rollout Order

Recommended implementation order:

1. Add server-side GitHub fetch module
2. Replace homepage placeholder with real data-driven section
3. Add config and error states
4. Add cache policy
5. Add webhook endpoint
6. Validate locally without webhook
7. Validate locally with tunnel webhook
8. Deploy to Vercel
9. Configure production webhook
10. Run final acceptance tests

## 17. Risks and Mitigations

### Risk: private repo token scope is wrong

Mitigation:

- use a fine-grained PAT
- grant only read access to repository metadata and contents

### Risk: exposing unintended private notes

Mitigation:

- hard-filter to `开发/`
- never scan or display other paths
- do not display note content by default

### Risk: webhook not available in local dev

Mitigation:

- validate fetch flow first without webhook
- use `cloudflared` or `ngrok` only when testing the push notification path

### Risk: GitHub API temporary failure

Mitigation:

- render non-fatal sync error UI
- keep section isolated from rest of homepage

## 18. Final Decision Summary

The final approved implementation choice is:

- data source: GitHub commits from `CoderZHH/ObsdianNote`
- monitored branch: `master`
- monitored path: root `开发/`
- display size: top 10 latest note updates
- private repo access: server-side read-only token
- refresh mode: cache + GitHub webhook invalidation
- local dev: `localhost:3000`, webhook tested via tunnel when needed
- production deployment: `Vercel`
- no jump to GitHub original files

This is the recommended production design for the current project.
