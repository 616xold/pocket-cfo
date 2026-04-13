import type { PersistCfoWikiPageLinkInput } from "../repository";
import type { WikiRegistryEntry } from "./page-registry";

export function buildWikiPageLinks(input: { registry: WikiRegistryEntry[] }) {
  const registryByKey = new Map(
    input.registry.map((entry) => [entry.pageKey, entry] as const),
  );
  const periodPages = input.registry.filter((entry) => entry.period !== null);
  const sourceDigestPages = input.registry.filter(
    (entry) => entry.pageKind === "source_digest" && entry.documentSnapshot !== null,
  );
  const links: PersistCfoWikiPageLinkInput[] = [];

  addLink(links, registryByKey, "index", "company/overview", "navigation", "Company overview");
  addLink(links, registryByKey, "index", "sources/coverage", "navigation", "Source coverage");
  addLink(links, registryByKey, "index", "log", "navigation", "Compile log");

  for (const periodPage of periodPages) {
    addLink(
      links,
      registryByKey,
      "index",
      periodPage.pageKey,
      "navigation",
      periodPage.title,
    );
    addLink(
      links,
      registryByKey,
      periodPage.pageKey,
      "index",
      "navigation",
      "Wiki index",
    );
    addLink(
      links,
      registryByKey,
      periodPage.pageKey,
      "company/overview",
      "related",
      "Company overview",
    );
    addLink(
      links,
      registryByKey,
      periodPage.pageKey,
      "sources/coverage",
      "related",
      "Source coverage",
    );
  }

  addLink(links, registryByKey, "company/overview", "index", "navigation", "Wiki index");
  addLink(links, registryByKey, "company/overview", "sources/coverage", "related", "Source coverage");
  addLink(links, registryByKey, "company/overview", "log", "related", "Compile log");

  addLink(links, registryByKey, "sources/coverage", "index", "navigation", "Wiki index");
  addLink(links, registryByKey, "sources/coverage", "company/overview", "related", "Company overview");
  addLink(links, registryByKey, "sources/coverage", "log", "related", "Compile log");

  addLink(links, registryByKey, "log", "index", "navigation", "Wiki index");
  addLink(links, registryByKey, "log", "company/overview", "related", "Company overview");

  for (const sourceDigestPage of sourceDigestPages) {
    addLink(
      links,
      registryByKey,
      "sources/coverage",
      sourceDigestPage.pageKey,
      "related",
      sourceDigestPage.title,
    );
    addLink(
      links,
      registryByKey,
      sourceDigestPage.pageKey,
      "index",
      "navigation",
      "Wiki index",
    );
    addLink(
      links,
      registryByKey,
      sourceDigestPage.pageKey,
      "sources/coverage",
      "navigation",
      "Source coverage",
    );
    addLink(
      links,
      registryByKey,
      sourceDigestPage.pageKey,
      "company/overview",
      "related",
      "Company overview",
    );
  }

  for (const sourceGroup of groupSourceDigestPages(sourceDigestPages)) {
    const currentPage = sourceGroup.find(
      (entry) => entry.documentSnapshot?.temporalStatus === "current",
    );

    for (const entry of sourceGroup) {
      if (entry.pageKey === currentPage?.pageKey) {
        continue;
      }

      addLink(
        links,
        registryByKey,
        entry.pageKey,
        currentPage?.pageKey ?? entry.pageKey,
        "related",
        currentPage?.documentSnapshot
          ? `Current snapshot v${currentPage.documentSnapshot.snapshot.version}`
          : "Current snapshot",
      );

      if (currentPage) {
        addLink(
          links,
          registryByKey,
          currentPage.pageKey,
          entry.pageKey,
          "related",
          `Superseded snapshot v${entry.documentSnapshot?.snapshot.version ?? "unknown"}`,
        );
      }
    }
  }

  return links;
}

function groupSourceDigestPages(sourceDigestPages: WikiRegistryEntry[]) {
  const groups = new Map<string, WikiRegistryEntry[]>();

  for (const page of sourceDigestPages) {
    const sourceId = page.documentSnapshot?.extract.sourceId;

    if (!sourceId) {
      continue;
    }

    const current = groups.get(sourceId);

    if (current) {
      current.push(page);
      continue;
    }

    groups.set(sourceId, [page]);
  }

  return [...groups.values()].map((group) =>
    group.sort(
      (left, right) =>
        (right.documentSnapshot?.snapshot.version ?? 0) -
        (left.documentSnapshot?.snapshot.version ?? 0),
    ),
  );
}

function addLink(
  links: PersistCfoWikiPageLinkInput[],
  registryByKey: Map<WikiRegistryEntry["pageKey"], WikiRegistryEntry>,
  fromPageKey: PersistCfoWikiPageLinkInput["fromPageKey"],
  toPageKey: PersistCfoWikiPageLinkInput["toPageKey"],
  linkKind: PersistCfoWikiPageLinkInput["linkKind"],
  label: string,
) {
  if (!registryByKey.has(fromPageKey) || !registryByKey.has(toPageKey)) {
    return;
  }

  links.push({
    fromPageKey,
    toPageKey,
    linkKind,
    label,
  });
}
