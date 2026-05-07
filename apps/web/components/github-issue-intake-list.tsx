import React from "react";
import type { GitHubIssueIntakeItem } from "@pocket-cto/domain";
import { GitHubIssueIntakeCard } from "./github-issue-intake-card";

type GitHubIssueIntakeListProps = {
  emptyHeading?: string;
  emptyMessage?: string;
  issues: GitHubIssueIntakeItem[];
};

export function GitHubIssueIntakeList({
  emptyHeading = "No GitHub issue envelopes yet",
  emptyMessage = "No signed GitHub issues delivery has been stored for this secondary intake path yet.",
  issues,
}: GitHubIssueIntakeListProps) {
  if (issues.length === 0) {
    return (
      <div className="mission-list-empty">
        <h3>{emptyHeading}</h3>
        <p className="muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="mission-list">
      {issues.map((issue) => (
        <GitHubIssueIntakeCard key={`${issue.repoFullName}#${issue.issueNumber}`} issue={issue} />
      ))}
    </div>
  );
}
