/**
 * ezpzfile-cad: read CAD and BIM drawings in JavaScript, no native code, no dependencies.
 *
 *   const drawing = await openCad(bytes, () => {}, { name: 'plan.dwg' })
 *   if (drawing.kind === '2d') {
 *     const svg = toSvg(prepare(drawing.sheets[0], drawing.layers.map((l) => l.name)), new Uint8Array(drawing.layers.length))
 *   }
 */
export { openCad, comparePcbSets, CadOpenError, CAD_CAT_BASE } from './cad/dispatch.ts'
export type { CadOpened, CadMeta, CadLayer, CadFormat, CadErrorCode, CadOpenOptions, AssemblyNode, PcbDiffItem } from './cad/dispatch.ts'
export { prepare, toSvg, query, inkFor } from './cad/draw2d.ts'
export type { Prepared, View } from './cad/draw2d.ts'
export { findFrames } from './cad/frames.ts'
export type { Box } from './cad/frames.ts'
export type { RvtSheet2D, SheetItem, SheetViewport, RvtModel, RvtGeometry, GeomElement, Level } from './rvt/types.ts'
