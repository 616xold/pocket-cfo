export class SourceNotFoundError extends Error {
  constructor(readonly sourceId: string) {
    super("Source not found");
    this.name = "SourceNotFoundError";
  }
}

export class SourceFileNotFoundError extends Error {
  constructor(readonly sourceFileId: string) {
    super("Source file not found");
    this.name = "SourceFileNotFoundError";
  }
}

export class SourceIngestRunNotFoundError extends Error {
  constructor(readonly ingestRunId: string) {
    super("Source ingest run not found");
    this.name = "SourceIngestRunNotFoundError";
  }
}

export class SourceFilePayloadParseError extends Error {
  constructor() {
    super("Source file upload body must be raw binary data");
    this.name = "SourceFilePayloadParseError";
  }
}

export class SourceIngestExecutionError extends Error {
  readonly code: string;

  constructor(
    code: string,
    message: string,
  ) {
    super(message);
    this.name = "SourceIngestExecutionError";
    this.code = code;
  }
}
