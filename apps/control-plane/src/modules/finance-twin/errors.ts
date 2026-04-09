export class FinanceCompanyNotFoundError extends Error {
  constructor(readonly companyKey: string) {
    super("Finance company not found");
    this.name = "FinanceCompanyNotFoundError";
  }
}

export class FinanceTwinUnsupportedSourceError extends Error {
  constructor(readonly sourceFileId: string) {
    super("Source file is not supported by the finance twin extractor");
    this.name = "FinanceTwinUnsupportedSourceError";
  }
}

export class FinanceTwinExtractionError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "FinanceTwinExtractionError";
    this.code = code;
  }
}
