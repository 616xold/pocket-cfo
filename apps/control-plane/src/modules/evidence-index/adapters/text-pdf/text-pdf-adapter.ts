import {
  TEXT_PDF_ADAPTER_NAME,
  TEXT_PDF_ADAPTER_VERSION,
  TextPdfAdapterResultSchema,
  type TextPdfAdapterResult,
} from "@pocket-cto/domain";
import {
  buildFailedTextPdfArtifacts,
  buildSupportedTextPdfArtifacts,
} from "./artifacts";
import {
  buildPrecisionCapabilityBoundaries,
  TEXT_PDF_RUNTIME_BOUNDARY,
} from "./boundaries";
import {
  checksumPdfBytes,
  extractDeterministicPdfText,
} from "./extractor";
import {
  detectPostExtractionFailure,
  detectPreExtractionFailure,
  mapExtractionError,
} from "./quality-gates";
import type { TextPdfAdapterSourceInput } from "./types";

export class TextPdfAdapter {
  async inspect(input: TextPdfAdapterSourceInput): Promise<TextPdfAdapterResult> {
    const mediaType =
      input.latestSnapshot?.mediaType ?? input.latestSourceFile?.mediaType ?? null;
    const preExtractionFailure = detectPreExtractionFailure({
      bytes: input.body,
      documentRole: input.documentRole,
      expectedChecksum: input.latestSnapshot?.checksumSha256 ?? null,
      mediaType,
      sourceFileId: input.latestSourceFile?.id ?? null,
      sourceSnapshotId: input.latestSnapshot?.id ?? null,
    });

    if (preExtractionFailure) {
      return this.failed(input, preExtractionFailure);
    }

    const body = input.body!;
    const checksum = checksumPdfBytes(body);

    if (
      checksum !== input.latestSnapshot?.checksumSha256 ||
      checksum !== input.latestSourceFile?.checksumSha256
    ) {
      return this.failed(input, "checksum_mismatch");
    }

    try {
      const extraction = await extractDeterministicPdfText(body);
      const postExtractionFailure = detectPostExtractionFailure({
        bytes: body,
        extraction,
      });

      if (postExtractionFailure) {
        return this.failed(input, postExtractionFailure);
      }

      return this.supported(input, extraction);
    } catch (error) {
      return this.failed(
        input,
        mapExtractionError(error instanceof Error ? error : new Error(String(error))),
      );
    }
  }

  private supported(
    input: TextPdfAdapterSourceInput,
    extraction: Parameters<typeof buildSupportedTextPdfArtifacts>[0]["extraction"],
  ) {
    const artifacts = buildSupportedTextPdfArtifacts({
      extraction,
      generatedAt: input.generatedAt,
      sourceInput: input,
    });

    return TextPdfAdapterResultSchema.parse({
      ...artifacts,
      adapterName: TEXT_PDF_ADAPTER_NAME,
      adapterVersion: TEXT_PDF_ADAPTER_VERSION,
      capabilityBoundaries: buildPrecisionCapabilityBoundaries({
        freshness: artifacts.documentMap.sourceDocument.freshness,
        sourceId: artifacts.documentMap.sourceDocument.sourceId,
      }),
      companyKey: input.companyKey,
      documentRole: input.documentRole,
      extractionMethod: "text_pdf_deterministic",
      failureCode: null,
      mediaType:
        input.latestSnapshot?.mediaType ?? input.latestSourceFile?.mediaType ?? null,
      runtimeBoundary: TEXT_PDF_RUNTIME_BOUNDARY,
      status: "supported",
      supportedDocumentRole: "policy_document",
      supportedMediaType: "application/pdf",
    });
  }

  private failed(
    input: TextPdfAdapterSourceInput,
    failureCode: NonNullable<TextPdfAdapterResult["failureCode"]>,
  ) {
    const artifacts = buildFailedTextPdfArtifacts({
      failureCode,
      generatedAt: input.generatedAt,
      sourceInput: input,
    });

    return TextPdfAdapterResultSchema.parse({
      ...artifacts,
      adapterName: TEXT_PDF_ADAPTER_NAME,
      adapterVersion: TEXT_PDF_ADAPTER_VERSION,
      capabilityBoundaries: buildPrecisionCapabilityBoundaries({
        freshness: artifacts.documentMap.sourceDocument.freshness,
        sourceId: artifacts.documentMap.sourceDocument.sourceId,
      }),
      companyKey: input.companyKey,
      documentRole: input.documentRole,
      extractionMethod: artifacts.documentMap.extractionMethod,
      failureCode,
      mediaType:
        input.latestSnapshot?.mediaType ?? input.latestSourceFile?.mediaType ?? null,
      runtimeBoundary: TEXT_PDF_RUNTIME_BOUNDARY,
      status: "failed",
      supportedDocumentRole: "policy_document",
      supportedMediaType: "application/pdf",
    });
  }
}

export function inspectTextPdfSource(input: TextPdfAdapterSourceInput) {
  return new TextPdfAdapter().inspect(input);
}
