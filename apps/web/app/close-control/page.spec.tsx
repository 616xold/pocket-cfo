import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const getCloseControlChecklist = vi.fn();

vi.mock("../../lib/api", () => ({
  getCloseControlChecklist,
}));

vi.mock("../../components/close-control-checklist-card", () => ({
  CloseControlChecklistCard(props: {
    checklist: { companyKey: string; aggregateStatus: string } | null;
  }) {
    return props.checklist ? (
      <article>
        close-control-card:{props.checklist.companyKey}:
        {props.checklist.aggregateStatus}
      </article>
    ) : (
      <article>close-control-card:null</article>
    );
  },
}));

describe("CloseControlPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the selected company's deterministic checklist posture", async () => {
    getCloseControlChecklist.mockResolvedValue({
      companyKey: "acme",
      aggregateStatus: "ready_for_review",
    });

    const mod = await import("./page");
    const html = renderToStaticMarkup(
      await mod.default({
        searchParams: Promise.resolve({ companyKey: " acme " }),
      }),
    );

    expect(getCloseControlChecklist).toHaveBeenCalledWith("acme");
    expect(html).toContain("Close/control checklist for acme.");
    expect(html).toContain("close-control-card:acme:ready_for_review");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<button");
  });

  it("defaults to the seeded demo company key", async () => {
    getCloseControlChecklist.mockResolvedValue(null);

    const mod = await import("./page");
    const html = renderToStaticMarkup(await mod.default({}));

    expect(getCloseControlChecklist).toHaveBeenCalledWith("acme");
    expect(html).toContain("Close/control checklist for acme.");
    expect(html).toContain("close-control-card:null");
  });
});
