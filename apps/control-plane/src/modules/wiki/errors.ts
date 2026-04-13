export class CfoWikiCompileAlreadyRunningError extends Error {
  constructor(companyKey: string) {
    super(`A CFO Wiki compile is already running for company ${companyKey}`);
    this.name = "CfoWikiCompileAlreadyRunningError";
  }
}

export class CfoWikiPageNotFoundError extends Error {
  constructor(companyKey: string, pageKey: string) {
    super(`CFO Wiki page ${pageKey} was not found for company ${companyKey}`);
    this.name = "CfoWikiPageNotFoundError";
  }
}

export class CfoWikiSourceBindingUnsupportedError extends Error {
  constructor(sourceId: string, sourceKind: string) {
    super(
      `Source ${sourceId} has kind ${sourceKind} and cannot be bound into F3B document compilation`,
    );
    this.name = "CfoWikiSourceBindingUnsupportedError";
  }
}
