// Data shapes returned by readRvt(). All lengths in Revit internal units (decimal feet)
// unless the name ends in _m / _m2. Everything except RvtModel.preview.png is JSON-serializable.
// Part of our own clean-room RVT reader (see rvt.ts).

export type RvtErrorCode =
  | 'not-ole'               // not an OLE2/CFB container
  | 'not-rvt'               // OLE file without the Revit streams
  | 'encrypted'             // OLE file containing an EncryptedPackage (e.g. protected Office file)
  | 'unsupported-version'   // older than 2022 and decoding failed
  | 'corrupt';              // structural error while reading

export interface ExternalRef {
  elementId: string | null;
  type: string | null;
  path: string | null;
  absolutePath: string | null;
  pathType: string | null;
  loadState: string | null;
}

export interface ProjectParam {
  feature: string | null;
  group: string | null;
  name: string;
  key: string;
  type: string | null;
  value: string | null;
}

export interface Workset { id: number; name: string; deleted: boolean; type: number }

export interface RvtInfo {
  revitVersion: string;           // "2025"
  build: string;                  // "20250227_1515(x64)"
  originalPath: string;
  documentGuid: string;
  locale: string;
  worksharing: string | null;     // "Not enabled", ...
  basicFileInfo: Record<string, string>;   // the Key: Value text block
  projectTitle: string | null;
  projectParameters: ProjectParam[];
  externalReferences: ExternalRef[];
  worksets: Workset[];
  streams: { name: string; size: number }[];
  schemaClasses: number;
}

export interface Level {
  id: number; name: string | null; elevation_ft: number | null; elevation_m: number | null;
  isBuildingStory: boolean; levelType: string | null; inGroupType: boolean;
}
export interface View {
  id: number; class: string; name: string | null; viewType: string | null;
  isTemplate: boolean; scale: number | null; levelId: number | null;
}
export interface Sheet { id: number; number: string; name: string | null; drawnBy: string | null; issueDate: string | null }
export type Vec3 = [number, number, number];
export interface Wall {
  id: number; typeId: number | null; type: string | null;
  baseLevel: string | null; topLevel: string | null; baseLevelId: number | null; topLevelId: number | null;
  curve: 'line' | 'arc' | string | null; start: Vec3 | null; end: Vec3 | null;
  length_ft: number | null; height_ft: number | null; thickness_ft: number | null; flipped: boolean;
}
export interface Opening {
  id: number; category: 'Doors' | 'Windows'; family: string | null; type: string | null;
  level: string | null; levelId: number | null; hostWallId: number | null; origin_ft: Vec3 | null;
}
export interface Room {
  id: number; number: string | null; name: string | null; level: string | null; levelId: number | null;
  area_m2: number | null;    // from the room's floor face in its geometry (outer loop), if present
  height_ft: number | null;
}
export interface Grid { id: number; name: string | null; start: Vec3 | null; end: Vec3 | null }
export interface FamilyInfo { id: number; name: string | null; categoryId: number | null; category: string | null; instances: number }
export interface CategoryCount { categoryId: number | null; label: string | null; count: number }

export interface RvtSummary {
  elements: number; levels: number; views: number; sheets: number; walls: number;
  doors: number; windows: number; rooms: number; grids: number; families: number;
}

export interface RvtModel {
  info: RvtInfo;
  summary: RvtSummary;
  classCounts: Record<string, number>;      // element class -> count
  categoryCounts: CategoryCount[];
  levels: Level[];
  views: View[];
  sheets: Sheet[];
  walls: Wall[];
  openings: Opening[];
  rooms: Room[];
  grids: Grid[];
  families: FamilyInfo[];
  warnings: string[];
  timings: Record<string, number>;          // ms per stage
  preview: { png: Uint8Array; width: number; height: number } | null;
}

export interface ReadOptions {
  roomAreas?: boolean;   // default true: inflate the geometry stream for RoomElem records only
}

// ---------------------------------------------------------------------------- 3D geometry
// Contract: GEOM-CONTRACT.md (shapes kept exactly; `opacity` on buckets is an optional extra).
export type BBox3 = { min: [number, number, number]; max: [number, number, number] };

export interface GeomBucket {
  category: number | null;
  categoryName: string | null;
  color: [number, number, number];          // 0..1, material colour if decoded, else category default
  opacity?: number;                           // optional extra: < 1 for glass / transparent materials
  materialId?: number | null;                 // MaterialElem id (RvtGeometry.materials) or null (category default colour)
  positions: Float32Array;                    // xyz, metres
  normals: Float32Array;
  indices: Uint32Array;
  ranges: Array<{ elementId: number; start: number; count: number }>;   // start/count in indices
}

export interface GeomElement {
  id: number;
  category: number | null;
  categoryName: string | null;
  className: string;
  name: string | null;
  typeName: string | null;
  familyName: string | null;
  levelId: number | null;
  levelName: string | null;
  bbox: BBox3 | null;
}

// Render appearance of a material, decoded from its AppearanceAssetElem (see spec section "Appearance assets").
// The texture images themselves are not in the file (they live in the authoring tool's own library); only their
// names, real-world sizes and colours are stored.
export type AppearanceKind =
  | 'generic' | 'masonry' | 'concrete' | 'wood' | 'ceramic' | 'stone' | 'metal' | 'glass'
  | 'plastic' | 'paint' | 'water' | 'fabric' | 'site' | 'mirror';
export interface RvtAppearance {
  kind: AppearanceKind;
  schema: string | null;                    // asset schema or library asset id, e.g. 'MasonryCMUSchema', 'PrismOpaqueSchema', 'Masonry-002'
  assetName: string | null;                 // asset UI name, e.g. 'Non-Uniform Running - Burgundy'
  assetCategory: string | null;             // asset library category, e.g. ':Masonry/Brick:Default:Brick'
  color?: [number, number, number];         // base (diffuse / albedo) colour 0..1 when given as a value
  textureName?: string;                     // diffuse bitmap file as stored, first entry, e.g. '1\\mats\\brick_non_uniform_running_burgundy.png'
  bumpName?: string;                        // bump / pattern / normal bitmap
  sizeM?: [number, number];                 // real-world size of one texture tile, metres
  offsetM?: [number, number];
  rotationDeg?: number;
  tint?: [number, number, number];          // only when a tint toggle is on
  roughness?: number;                       // 0..1 when stored (glossiness inverted)
  metallic?: boolean;
}
/** Model surface pattern (lines drawn on faces in shaded views): grids of parallel lines in metres */
export interface RvtSurfacePattern {
  name: string;
  color: [number, number, number];
  grids: Array<{ angle: number; origin: [number, number]; shift: number; spacing: number; dashes: number[] }>;
}
export interface RvtMaterial {
  id: number;                               // MaterialElem id
  name: string;
  materialClass: string | null;             // e.g. 'Masonry', 'Wood', 'Unassigned'
  color: [number, number, number];          // graphics (shaded) colour 0..1
  opacity: number;                          // 0..1
  appearance: RvtAppearance;
  surfacePattern?: RvtSurfacePattern;       // model pattern only
}

export interface RvtGeometry {
  units: 'm';
  up: 'z';
  bbox: BBox3;
  buckets: GeomBucket[];
  edges?: Array<{ category: number | null; categoryName?: string | null; positions: Float32Array }>;
  elements: GeomElement[];
  materials?: RvtMaterial[];                 // materials referenced by buckets (bucket.materialId)
  detailLevel?: 1 | 2 | 3;                   // detail level used for family geometry variants (1 coarse, 2 medium, 3 fine)
  viewDetailLevel?: 1 | 2 | 3 | null;        // detail level of the file's default 3D view
  viewName?: string | null;                  // the 3D view whose visibility settings were applied
  stats: { elements: number; triangles: number; skippedFaces: number; ms: number };
  warnings: string[];
}

export interface GeometryOptions {
  maxTriangles?: number;            // default 20M (full) / 4M (fast)
  lod?: 'fast' | 'full';            // fast: coarser curved-surface tessellation, no tiny instances' edges
  edges?: boolean;                  // default true
  includeMass?: boolean;            // default false (masses are hidden in Revit's default 3D view)
  detailLevel?: 1 | 2 | 3;          // default: the detail level of the file's 3D view (else fine)
  keepForRebuild?: boolean;         // keep the tessellated records so rebuildRvtGeometry(handle, level) needs no re-read
}

// ---------------------------------------------------------------------------- sheets (drawings)
// Contract: SHEET-CONTRACT.md. Sheet coordinates in mm, origin bottom-left, y up.
export type SheetItem = (
  | { kind: 'line'; pts: number[]; w?: number; color?: string; dash?: number[] }       // polyline [x0,y0,x1,y1,...]
  | { kind: 'arc'; cx: number; cy: number; r: number; a0: number; a1: number; w?: number; color?: string }
  | { kind: 'fill'; pts: number[]; color: string; opacity?: number }                   // closed polygon
  | { kind: 'text'; x: number; y: number; text: string; size: number; rot?: number; align?: 'left' | 'center' | 'right'; color?: string; font?: string }
  | { kind: 'image'; x: number; y: number; w: number; h: number; png: Uint8Array; mime?: string }
) & { layer?: string };
// Optional extras from the CAD engines (src/lib/cad): `layer` = CAD layer name, image `mime` = 'image/jpeg' when the
// bytes in `png` are JPEG.
// text: (x, y) is the baseline point at the alignment side, size = font em height in mm, rot in radians (counter-clockwise)

export interface SheetViewport {
  viewId: number;
  viewName: string;
  box: [number, number, number, number];   // x0,y0,x1,y1 mm on the sheet (crop region)
  // extras (contract "engine should expose per viewport")
  scale: number;                            // 100 for 1:100
  viewType: 'plan' | 'section' | 'elevation' | '3d' | 'schedule' | 'legend' | 'drafting' | 'rendering' | 'other';
  levelId: number | null;
  levelName: string | null;
  cutHeight: number | null;                 // m, absolute elevation of the plan cut plane
  crop: BBox3 | null;                       // model-space crop box (m), null when the view is not cropped
  detailNumber: string | null;
  // model -> sheet mapping: sheet = sheetPoint + mmPerM * [dot(P - origin, right), dot(P - origin, up)]
  xform: { origin: [number, number, number]; right: number[]; up: number[]; viewDir: number[]; sheetPoint: [number, number]; mmPerM: number } | null;
  annotations: number;                      // number of items drawn for this view's annotations
}

export interface RvtSheet2D {
  id: number;
  number: string;
  name: string;
  size: { w: number; h: number };           // mm (title block extents, else content extents)
  items: SheetItem[];
  viewports: SheetViewport[];
  completeness: 'full' | 'partial' | 'outline';
  warnings: string[];
  origin?: [number, number];                // CAD extra: drawing-unit point mapped to sheet (0,0)
}
