// Internal PCB model shared by the readers (Gerber, Excellon, ODB++, IPC-2581) and the builders (2D, 3D, compare).
import type { BB, Part } from './geom.ts';
import type { PcbLayerKind, PcbSide } from './types.ts';

export type ObjType = 'flash' | 'draw' | 'arc' | 'region' | 'hole' | 'slot' | 'text' | 'surface';

export interface PObj {
  dark: boolean;
  /** union of parts; every part is filled even-odd */
  parts: Part[];
  bb: BB;
  t: ObjType;
  net?: string;
  comp?: string;
  /** aperture function (X2 .AperFunction first field) */
  fn?: string;
  /** centre line for draws, arcs and slots, mm, [x0,y0,x1,y1,...] */
  path?: Float64Array;
  /** stroke or hole diameter, mm */
  w?: number;
}

export type SourceFormat = 'gerber' | 'excellon' | 'odb' | 'ipc2581';

export interface PLayer {
  /** display name, unique in a document */
  name: string;
  file: string;
  format: SourceFormat;
  kind: PcbLayerKind;
  side: PcbSide;
  /** copper layer number (1 = top), 0 unknown */
  order: number;
  /** X2 .FileFunction value or ODB++ / IPC-2581 layer function */
  fn?: string;
  objs: PObj[];
  /** image polarity is inverted (Gerber %IPNEG, negative ODB++ layer, negative copper plane) */
  invert?: boolean;
  plated?: boolean;
  /** extra facts for info */
  stats: Record<string, string | number>;
  warnings: string[];
  generator?: string;
}

export interface PComp {
  refdes: string;
  x: number; y: number; rot: number;
  side: 'top' | 'bottom';
  part?: string;
  pkg?: string;
}

export interface PcbDoc {
  layers: PLayer[];
  comps: PComp[];
  nets: Set<string>;
  warnings: string[];
  /** board thickness mm when the data says so (Gerber job file, ODB++ / IPC-2581 stackup) */
  thickness?: number;
  source: string;
  info: Record<string, string | number>;
  /** board outline parts (mm) when the source states the profile directly (ODB++ profile, IPC-2581 Profile) */
  profile?: Part[];
}
