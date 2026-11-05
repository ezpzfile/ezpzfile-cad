// Output shapes. Site integration: the sheet types are the site's own (src/lib/rvt/types.ts, which carries the
// optional `layer` extra on every item). Engine-only shapes below are unchanged from the master copy.
export type { SheetItem, BBox3, SheetViewport, RvtSheet2D } from '../../rvt/types.ts';
import type { RvtSheet2D } from '../../rvt/types.ts';

export interface DwgLayer { name: string; color: string; visible: boolean; frozen?: boolean; locked?: boolean }

export interface DwgCoverage {
  decoded: Record<string, number>;   // entities decoded and drawn, by type
  skipped: Record<string, number>;   // entities skipped (unsupported or failed), by type
  failed: number;                    // objects whose bits could not be decoded
}

export interface DwgResult {
  kind: '2d';
  sheets: RvtSheet2D[];
  layers: DwgLayer[];
  info: Record<string, string | number>;
  coverage: DwgCoverage;             // extra (not in the 3D contract), used by the test report
}
