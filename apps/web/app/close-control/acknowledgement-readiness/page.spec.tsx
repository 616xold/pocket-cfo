import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const getCloseControlAcknowledgementReadiness = vi.fn();

vi.mock("../../../lib/api", () => ({
  getCloseControlAcknowledgementReadiness,
}));

vi.mock("../../../components/close-control-acknowledgement-card", () => ({
  CloseControlAcknowledgementCard(props: {
    readiness: { companyKey: string; aggregateStatus: string } | null;
  }) {
    return props.readiness ? (
      <article>
        acknowledgement-card:{props.readiness.companyKey}:
        {props.readiness.aggregateStatus}
      </article>
    ) : (
      <article>acknowledgement-card:null</article>
    );
  },
}));

describe("CloseControlAcknowledgementPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the selected company's internal acknowledgement-readiness posture", async () => {
    getCloseControlAcknowledgementReadiness.mockResolvedValue({
      companyKey: "acme",
      aggregateStatus: "needs_review_before_acknowledgement",
    });

    const mod = await import("./page");
    const html = renderToStaticMarkup(
      await mod.default({
        searchParams: Promise.resolve({ companyKey: " acme " }),
      }),
    );

    expect(getCloseControlAcknowledgementReadiness).toHaveBeenCalledWith(
      "acme",
    );
    expect(html).toContain(
      "Close/control acknowledgement readiness for acme.",
    );
    expect(html).toContain(
      "acknowledgement-card:acme:needs_review_before_acknowledgement",
    );
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<button");
  });

  it("defaults to the seeded demo company key", async () => {
    getCloseControlAcknowledgementReadiness.mockResolvedValue(null);

    const mod = await import("./page");
    const html = renderToStaticMarkup(await mod.default({}));

    expect(getCloseControlAcknowledgementReadiness).toHaveBeenCalledWith(
      "acme",
    );
    expect(html).toContain(
      "Close/control acknowledgement readiness for acme.",
    );
    expect(html).toContain("acknowledgement-card:null");
  });
});
