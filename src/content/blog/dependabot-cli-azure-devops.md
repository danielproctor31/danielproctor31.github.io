---
title: "Run Dependabot in Azure DevOps"
description: "Set up Dependabot CLI in Azure DevOps to automate dependency update pull requests."
pubDatetime: 2026-03-30
author: Daniel Proctor
featured: false
draft: false
tags:
  - azure-devops
  - dependabot
  - dependency-management
  - dotnet
---

Azure DevOps does not provide a built-in, Dependabot-style dependency update experience for Azure Repos in the same way GitHub does. You can still automate dependency updates by running the [Dependabot CLI](https://github.com/dependabot/cli) on a schedule in an Azure Pipeline.

This setup gives you repeatable update jobs and pull requests without introducing a separate service.

## Table of contents

## Prerequisites

- An [Azure DevOps](https://azure.microsoft.com/en-us/products/devops) project with an Azure Repos Git repository
- An existing YAML pipeline in that repository
- Permission to create Personal Access Tokens (PATs) in your Azure DevOps organization
- A repository where your dependency manifests are under `/src` (or adjust the directory in the config)

## Dependabot CLI in Azure DevOps

The pipeline below downloads the latest Dependabot CLI release, builds an `input.yml` job definition, and runs `dependabot update` daily.

```yaml
trigger: none
schedules:
  - cron: "0 2 * * *" # every day at 2:00 AM
    displayName: Daily Scan
    branches:
      include: [develop]
    always: true

variables:
  - group: dependabot-secrets

jobs:
  - job: RunDependabot
    pool:
      vmImage: "ubuntu-latest"
    steps:
      - checkout: none
      - script: |
          set -e
          echo "Fetching latest Dependabot CLI..."
          DOWNLOAD_URL=$(curl -s https://api.github.com/repos/dependabot/cli/releases/latest | grep "browser_download_url" | grep "linux-amd64.tar.gz" | cut -d '"' -f 4 | head -n 1)
          curl -Lo dependabot.tar.gz "$DOWNLOAD_URL"
          tar -xzf dependabot.tar.gz
          chmod +x dependabot

          if [ -z "$AZURE_ACCESS_TOKEN" ]; then echo "ERROR: AZURE_ACCESS_TOKEN is empty"; exit 1; fi
          echo "Token is set"

          AZURE_DEVOPS_ORG=$(echo "$(System.CollectionUri)" | sed -E 's#https://dev.azure.com/([^/]+)/.*#\1#')
          if [ -z "$AZURE_DEVOPS_ORG" ]; then echo "ERROR: Failed to derive AZURE_DEVOPS_ORG from System.CollectionUri"; exit 1; fi

          cat > input.yml <<EOF
          job:
            package-manager: nuget
            source:
              provider: azure
              repo: ${AZURE_DEVOPS_ORG}/$(System.TeamProjectId)/_git/$(Build.Repository.Name)
              directory: /src
            allowed-updates:
              - update-type: all
            max-update-pull-requests: 10
            dependency-groups:
              - name: dotnet-core
                rules:
                  patterns:
                    - "Microsoft.Extensions.*"
                    - "System.*"
          credentials:
            - type: git_source
              host: dev.azure.com
              username: x-access-token
              password: "$AZURE_ACCESS_TOKEN"
          EOF

          ./dependabot update -f input.yml
        displayName: "Run Dependabot CLI"
        env:
          AZURE_ACCESS_TOKEN: $(AZURE_ACCESS_TOKEN)
```

### How this works

- The schedule runs daily on `develop`.
- The CLI release is downloaded dynamically, so you always run the latest version.
- `input.yml` declares the ecosystem (`nuget`), repo provider (`azure`), and update rules.
- The script derives the organization name from `$(System.CollectionUri)`, so there is no hardcoded org value.
- Credentials are injected from an environment variable so the token is not hardcoded.

The Dependabot CLI supports `$VAR` substitution in job files, so `$AZURE_ACCESS_TOKEN` is replaced from the runtime environment.

## Configure the PAT

Create a PAT in Azure DevOps from `User settings` -> `Personal access tokens`.

For this workflow, use a token with code read/write capability for the target repository scope. That corresponds to the ability to read/update code and create/manage pull requests.

Why this matters: Dependabot authenticates to Azure DevOps as the PAT owner. The PAT owner identity is what needs repository permissions to push update branches and open pull requests.

Security recommendations:

- Use the minimum scope needed
- Set a short expiration
- Rotate the token regularly
- Store it only as a secret variable (or in a secret manager)

## Add the PAT to a Variable Group

Create a variable group (for example `dependabot-secrets`) in `Pipelines` -> `Library`.

Add a variable:

- Name: `AZURE_ACCESS_TOKEN`
- Value: your PAT
- Secret: enabled

Authorize the pipeline to use this variable group.

## Paid alternative: GitHub Advanced Security for Azure DevOps

[GitHub Advanced Security for Azure DevOps](https://azure.microsoft.com/en-us/products/devops/github-advanced-security) is a paid option that adds native security capabilities in Azure DevOps, including dependency scanning alerts, code scanning, and secret scanning.

It is a good alternative if your goal is integrated vulnerability detection and governance in Azure DevOps. It is not the same as this Dependabot CLI automation pattern, which is focused on dependency update execution and PR workflow automation.

## Conclusion

Using Dependabot CLI in an Azure Pipeline gives you a practical dependency update workflow for Azure Repos with very little infrastructure. The key is getting identity and permissions right: PAT owner permissions drive Dependabot operations, while Build Service permissions govern pipeline-level access.

If you need deeper security posture management, GitHub Advanced Security for Azure DevOps is the native paid path for dependency and code security scanning.
