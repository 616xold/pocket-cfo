import type { SourceIngestZipEntry, SourceIngestZipReceiptSummary } from "@pocket-cto/domain";
import { SourceIngestExecutionError } from "../errors";
import type { SourceParserInput, SourceParserResult } from "../parser-registry";

const CENTRAL_DIRECTORY_HEADER_SIGNATURE = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;
const MAX_ENTRY_PREVIEW_COUNT = 20;
const MAX_END_OF_CENTRAL_DIRECTORY_SEARCH = 65_557;

export function parseZipReceipt(input: SourceParserInput): SourceParserResult {
  const entries = readZipInventory(input.body);
  const previewEntries = entries.slice(0, MAX_ENTRY_PREVIEW_COUNT);
  const summary: SourceIngestZipReceiptSummary = {
    kind: "zip_inventory",
    entries: previewEntries,
    entryCount: entries.length,
    totalCompressedSizeBytes: entries.reduce(
      (total, entry) => total + entry.compressedSizeBytes,
      0,
    ),
    totalSizeBytes: entries.reduce((total, entry) => total + entry.sizeBytes, 0),
  };
  const warnings =
    previewEntries.length < entries.length
      ? [
          {
            code: "zip_inventory_truncated",
            message: "ZIP entry preview was truncated to keep the receipt compact",
          },
        ]
      : [];

  return {
    receiptSummary: summary,
    warnings,
  };
}

function readZipInventory(buffer: Buffer) {
  const endOfCentralDirectoryOffset = findEndOfCentralDirectory(buffer);
  const totalEntries = buffer.readUInt16LE(endOfCentralDirectoryOffset + 10);
  const centralDirectoryOffset = buffer.readUInt32LE(
    endOfCentralDirectoryOffset + 16,
  );

  if (totalEntries === 0xffff) {
    throw new SourceIngestExecutionError(
      "zip64_unsupported",
      "ZIP64 archives are not supported by the current inventory parser",
    );
  }

  const entries: SourceIngestZipEntry[] = [];
  let currentOffset = centralDirectoryOffset;

  for (let index = 0; index < totalEntries; index += 1) {
    assertAvailableBytes(buffer, currentOffset, 46, "ZIP central directory");

    if (buffer.readUInt32LE(currentOffset) !== CENTRAL_DIRECTORY_HEADER_SIGNATURE) {
      throw new SourceIngestExecutionError(
        "zip_invalid_central_directory",
        "ZIP central directory entry signature was invalid",
      );
    }

    const compressedSizeBytes = buffer.readUInt32LE(currentOffset + 20);
    const sizeBytes = buffer.readUInt32LE(currentOffset + 24);
    const fileNameLength = buffer.readUInt16LE(currentOffset + 28);
    const extraFieldLength = buffer.readUInt16LE(currentOffset + 30);
    const fileCommentLength = buffer.readUInt16LE(currentOffset + 32);
    const fileNameOffset = currentOffset + 46;

    assertAvailableBytes(
      buffer,
      fileNameOffset,
      fileNameLength + extraFieldLength + fileCommentLength,
      "ZIP central directory variable fields",
    );

    const path = buffer
      .subarray(fileNameOffset, fileNameOffset + fileNameLength)
      .toString("utf-8");

    entries.push({
      compressedSizeBytes,
      isDirectory: path.endsWith("/"),
      path,
      sizeBytes,
    });

    currentOffset =
      fileNameOffset + fileNameLength + extraFieldLength + fileCommentLength;
  }

  return entries;
}

function findEndOfCentralDirectory(buffer: Buffer) {
  const minimumOffset = Math.max(
    0,
    buffer.length - MAX_END_OF_CENTRAL_DIRECTORY_SEARCH,
  );

  for (let offset = buffer.length - 22; offset >= minimumOffset; offset -= 1) {
    if (buffer.readUInt32LE(offset) === END_OF_CENTRAL_DIRECTORY_SIGNATURE) {
      return offset;
    }
  }

  throw new SourceIngestExecutionError(
    "zip_eocd_not_found",
    "ZIP end-of-central-directory record was not found",
  );
}

function assertAvailableBytes(
  buffer: Buffer,
  offset: number,
  length: number,
  sectionName: string,
) {
  if (offset + length > buffer.length) {
    throw new SourceIngestExecutionError(
      "zip_truncated",
      `${sectionName} was truncated while reading ZIP inventory`,
    );
  }
}
