import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const getOperatorReadiness = vi.fn();

vi.mock("../../lib/api", () => ({
  getOperatorReadiness,
}));

vi.mock("../../components/operator-readiness-card", () => ({
  OperatorReadinessCard(props: {
    readiness: { companyKey: string; aggregateStatus: string } | null;
  }) {
    return props.readiness ? (
      <article>
        operator-readiness-card:{props.readiness.companyKey}:
        {props.readiness.aggregateStatus}
      </article>
    ) : (
      <article>operator-readiness-card:null</article>
    );
  },
}));

describe("OperatorReadinessPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the selected company's internal readiness posture", async () => {
    getOperatorReadiness.mockResolvedValue({
      companyKey: "acme",
      aggregateStatus: "needs_review",
    });

    const mod = await import("./page");
    const html = renderToStaticMarkup(
      await mod.default({
        searchParams: Promise.resolve({ companyKey: " acme " }),
      }),
    );

    expect(getOperatorReadiness).toHaveBeenCalledWith("acme");
    expect(html).toContain("Operator readiness for acme.");
    expect(html).toContain("operator-readiness-card:acme:needs_review");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<button");
  });

  it("defaults to the seeded demo company key", async () => {
    getOperatorReadiness.mockResolvedValue(null);

    const mod = await import("./page");
    const html = renderToStaticMarkup(await mod.default({}));

    expect(getOperatorReadiness).toHaveBeenCalledWith("acme");
    expect(html).toContain("Operator readiness for acme.");
    expect(html).toContain("operator-readiness-card:null");
  });
});
