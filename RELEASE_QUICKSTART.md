# Release Quick Start Guide

Quick commands for releasing the Yelay Lite SDK.

## Beta Release (3 Commands)

```bash
# 1. Update version to beta
pnpm run version:beta:new
# OR increment existing beta: pnpm run version:beta:increment

# 2. Commit, tag, and push
git add package.json && git commit -m "chore: beta $(node -p "require('./package.json').version")"
pnpm run release:tag
pnpm run release:push

# 3. Monitor GitHub Actions
# https://github.com/YieldLayer/yelay-lite-sdk/actions
```

## Stable Release (3 Commands)

```bash
# 1. Update version
pnpm run version:stable:patch
# OR: version:stable:minor / version:stable:major

# 2. Commit, tag, and push
git add package.json && git commit -m "chore: release $(node -p "require('./package.json').version")"
pnpm run release:tag
pnpm run release:push

# 3. Monitor GitHub Actions
# https://github.com/YieldLayer/yelay-lite-sdk/actions
```

## Available Scripts

```bash
# Beta versions
pnpm run version:beta:new        # Start new beta (1.0.24 → 1.1.0-beta.0)
pnpm run version:beta:patch      # Beta patch (1.0.24 → 1.0.25-beta.0)
pnpm run version:beta:increment  # Next beta (1.1.0-beta.0 → 1.1.0-beta.1)

# Stable versions
pnpm run version:stable:patch    # Patch (1.0.24 → 1.0.25)
pnpm run version:stable:minor    # Minor (1.0.24 → 1.1.0)
pnpm run version:stable:major    # Major (1.0.24 → 2.0.0)

# Git operations
pnpm run release:tag             # Create git tag for current version
pnpm run release:push            # Push main branch + all tags
```

## Verify Release

```bash
# Check distribution tags
npm view @yelay-lite/sdk dist-tags

# Check all versions
npm view @yelay-lite/sdk versions

# Test installation
npm install @yelay-lite/sdk@beta
```

## One-Liner Examples

**Beta Release:**

```bash
pnpm run version:beta:new && git add package.json && git commit -m "chore: beta $(node -p "require('./package.json').version")" && pnpm run release:tag && pnpm run release:push
```

**Stable Release:**

```bash
pnpm run version:stable:patch && git add package.json && git commit -m "chore: release $(node -p "require('./package.json').version")" && pnpm run release:tag && pnpm run release:push
```

## Important Notes

-   ✅ GitHub Actions automatically publishes when tags are pushed
-   ✅ Beta versions won't affect users on `latest` tag
-   ✅ Users need `@beta` or exact version to install beta releases
-   ❌ Never push tags without committing version changes first
-   ❌ Always monitor GitHub Actions to ensure successful publication
