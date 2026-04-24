/**
 * Export utility functions for CSV and PDF generation.
 * CSV is implemented natively. PDF generation is stubbed for integration
 * with a library such as pdfkit or puppeteer.
 */

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

/**
 * Escape a CSV field value to handle commas, quotes, and newlines.
 */
function escapeCsvField(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generate a CSV string from an array of objects.
 */
export function generateCsv(
  data: Record<string, unknown>[],
  columns: ExportColumn[]
): string {
  const headerRow = columns.map((col) => escapeCsvField(col.header)).join(',');
  const dataRows = data.map((row) =>
    columns.map((col) => escapeCsvField(row[col.key])).join(',')
  );
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Generate a PDF buffer from an array of objects.
 * Stub implementation -- replace with pdfkit or similar in production.
 */
export async function generatePdf(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  title: string = 'Export'
): Promise<Buffer> {
  const lines: string[] = [];
  lines.push(`%PDF-1.4 (stub)`);
  lines.push(`Title: ${title}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Total Records: ${data.length}`);
  lines.push('');
  lines.push(columns.map((col) => col.header.padEnd(col.width || 20)).join(' | '));
  lines.push('-'.repeat(columns.reduce((sum, col) => sum + (col.width || 20) + 3, 0)));

  for (const row of data) {
    const line = columns
      .map((col) => {
        const val = row[col.key] === null || row[col.key] === undefined ? '' : String(row[col.key]);
        return val.padEnd(col.width || 20);
      })
      .join(' | ');
    lines.push(line);
  }

  return Buffer.from(lines.join('\n'), 'utf-8');
}

/**
 * Set CSV response headers on an Express response object.
 */
export function setCsvHeaders(res: any, filename: string): void {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
}

/**
 * Set PDF response headers on an Express response object.
 */
export function setPdfHeaders(res: any, filename: string): void {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
}
