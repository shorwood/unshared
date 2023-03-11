import { XMLParser } from 'fast-xml-parser';

/**
 * Scap licenses from the `spdx/license-list-data` repository.
 */
export async function scrapeLicences(): Promise<void> {
  const 