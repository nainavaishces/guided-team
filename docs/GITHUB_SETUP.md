# GitHub Setup for CI/CD Workflows

This document explains what you need to set up in GitHub to make the CI/CD workflows work properly.

## GitHub Actions Versions

The workflows use the following GitHub Actions:

| Action                    | Version | Purpose                           |
| ------------------------- | ------- | --------------------------------- |
| `actions/checkout`        | v4      | Checkout repository code          |
| `actions/setup-node`      | v4      | Set up Node.js environment        |
| `actions/upload-artifact` | v4      | Upload test reports and artifacts |
| `actions/github-script`   | v7      | Add PR comments with test results |

Using the latest versions ensures compatibility with GitHub's infrastructure and access to the latest features and security updates.

## Required GitHub Settings

### 1. GitHub Secrets

If your tests require any environment variables or secrets (like API keys, credentials, etc.), you'll need to add them to your repository's secrets:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add any required secrets (based on what your `.env` files contain)

For example, if your tests need authentication credentials, you might add:

- `TEST_USERNAME`
- `TEST_PASSWORD`

### 2. GitHub Permissions

The PR workflow uses `actions/github-script` to comment on PRs and requires specific permissions:

1. The workflow has explicit permissions defined in the YAML file:

   ```yaml
   permissions:
     contents: read
     pull-requests: write
   ```

2. Make sure your repository has the appropriate permissions:
   - Go to Settings > Actions > General
   - Under "Workflow permissions", select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"
   - Click "Save"

If you see errors like "Resource not accessible by integration", it's likely a permissions issue. Check both the workflow file permissions and the repository settings.

### 3. Branch Protection Rules

To enforce that PRs pass tests before merging:

1. Go to Settings > Branches
2. Click "Add rule" under "Branch protection rules"
3. For "Branch name pattern", enter `main` (and repeat for `develop` if needed)
4. Check "Require status checks to pass before merging"
5. Search for and select the status checks from your workflows (e.g., "Run Tests")
6. Click "Create" or "Save changes"

## Environment Variables

The workflows use environment variables like `TEST_ENV`. Make sure your application code properly handles these variables. You might need to create a `.env.example` file to document required variables.

Here are the environment variables used in the workflows:

| Variable   | Description                                         | Used In       |
| ---------- | --------------------------------------------------- | ------------- |
| `CI`       | Set to `true` to indicate running in CI environment | All workflows |
| `TEST_ENV` | Environment to test against (`dev`, `staging`)      | All workflows |
| `HEADLESS` | Set to `true` to run browsers in headless mode      | All workflows |

## Runner Configuration

These workflows use `ubuntu-latest` runners, which are provided by GitHub. If you're using GitHub.com, you don't need to set up anything special. If you're using GitHub Enterprise Server, make sure you have runners available.

## PR Test Results Comments

The PR workflow automatically adds a comment to the PR with detailed test results extracted from the Playwright HTML report. The comment includes:

- Counts of passed, failed, flaky, and skipped tests
- Total test count
- Success rate percentage
- Links to the detailed test report and artifacts

This functionality works by:

1. Creating an initial empty test summary file
2. Running the Playwright tests and capturing the output
3. Extracting test counts (passed, failed, flaky, skipped) directly from the test output using grep and sed
4. Calculating the total from the individual counts to ensure consistency
5. Creating a JSON summary file with the extracted counts
6. Uploading the test results and summary file as artifacts
7. Reading the summary file and creating a formatted comment with:
   - Test result counts and success rate
   - Link to the workflow run
   - Instructions on how to access the artifacts
8. Posting the comment to the PR using the GitHub API

This approach is more reliable than parsing the HTML report because it extracts the test counts directly from the test output, which is more consistent.

If you need to modify the format or content of the PR comment, you can edit the script in the `.github/workflows/playwright-pr.yml` file.

## Browser Installation

The workflows install all Playwright browsers using `npx playwright install --with-deps`. This is necessary because:

1. The global setup in `tests/setup/global-setup.ts` launches a browser to set cookies, even before the actual tests run
2. All browsers need to be installed for the global setup to work properly

If you see errors like:

```
Error: browserType.launch: Executable doesn't exist at /home/runner/.cache/ms-playwright/...
```

It means the browsers weren't installed correctly. Make sure the `npx playwright install --with-deps` command is run before any tests or setup scripts that use browsers.

## First-Time Setup

When the workflows run for the first time, GitHub will automatically:

- Create the necessary directories for artifacts
- Set up the workflow environment

You don't need to manually create these directories.

## Troubleshooting

If you encounter issues with the workflows:

1. Check the workflow run logs in GitHub Actions
2. Verify that all required secrets and environment variables are set
3. Ensure that the Playwright browsers are installing correctly
4. Check that your tests are compatible with the CI environment
5. Verify that you're using the latest versions of GitHub Actions (outdated actions may cause failures)
6. If you see errors about XServer or headed browsers, make sure the `HEADLESS` environment variable is set to `true` in your workflow
7. If you see errors about missing browser executables, check that `npx playwright install --with-deps` is running correctly

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
