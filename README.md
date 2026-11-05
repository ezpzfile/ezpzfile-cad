# ezpzfile-cad

Read CAD and BIM drawings in JavaScript. No native code, no WebAssembly, no dependencies:
the same engines that run the [CAD viewer on ezpzfile.com](https://ezpzfile.com/cad-viewer),
in browsers, Web Workers and Node.

[한국어](README.ko.md) · [日本語](README.ja.md)

```bash
npm install ezpzfile-cad
```

```js
import { openCad, prepare, toSvg } from 'ezpzfile-cad'

const drawing = await openCad(bytes, (stage, ratio) => {}, { name: 'plan.dwg' })
if (drawing.kind === '2d') {
  const layers = drawing.layers.map((l) => l.name)
  for (const sheet of drawing.sheets) {
    const texts = sheet.items.filter((i) => i.kind === 'text').map((i) => i.text)
    const svg = toSvg(prepare(sheet, layers), new Uint8Array(layers.length)) // 1 unit = 1 mm
  }
} else {
  // 3D: drawing.model (categories, levels) and drawing.geometry (meshes per element)
}
```

## Formats

| Format | Read as | Notes |
| --- | --- | --- |
| DWG | 2D | AutoCAD 1.4 to R12 (byte analysis), R13 to 2018+ (R2004/R2007/R2010 paged containers, own LZ77 and Reed-Solomon) |
| DXF | 2D | ASCII and binary, from the Autodesk DXF Reference |
| DWFx | 2D | XPS pages; classic DWF is refused with `dwf-classic` |
| Jw_cad (JWW, JWC) | 2D | from the published Jw_cad data format 7.02, layer scales kept |
| iCAD SX (ICD) | 2D | byte analysis |
| SXF (SFC, P21, SFZ, P2Z) | 2D | from the OCF SXF reference |
| Gerber, Excellon drill, ODB++, IPC-2581 | 2D (+3D board) | from the Ucamco specifications; layer kinds and sides guessed from names |
| IGES | 3D | |
| Inventor (IPT, IAM) | 3D | assemblies take their parts through `resolve` |
| IFC (and IFCZIP) | 3D | categories by IFC class, storeys as levels |
| STEP (AP203, AP214, AP242) | 3D | |
| SketchUp (SKP) | 3D | files up to 2020 and the 2021+ container |
| glTF, GLB, OBJ, STL, 3DS, FBX | 3D | |

The format is chosen by the bytes, not the name.

## What comes back

2D drawings: `sheets[]`, each with `items[]` in millimetres (`line` polylines, `arc`, `fill`,
`text` with size and rotation, `image`), every item tagged with its CAD `layer`; `layers[]` with
name, colour, on/off and item counts; `meta.info` (version, units, object counts) and
`meta.warnings` (what was skipped and why).

3D models: `model` (categories, levels) and `geometry` (triangle meshes per element), the
contract the ezpzfile.com viewer draws.

Helpers: `prepare` + `toSvg` draw a sheet as SVG with chosen layers hidden; `findFrames` finds
title blocks (drawing frames) on a sheet.

## Errors

`openCad` rejects with `CadOpenError` and a `code`: `not-format`, `corrupt`,
`unsupported-version` (with `versionTag`), `encrypted`, `too-large`, `dwf-classic`,
`missing-parts` (with `missing`).

## Clean room

Every engine here is written from public specifications (Open Design Alliance's DWG
specification, the Autodesk DXF Reference, the Jw_cad format notes, OCF SXF, Ucamco Gerber and
XNC, ISO 10303) or, where none exists, from the analysis of sample files. No code from other CAD
libraries is used.

## Used by

- [ezpzfile.com CAD viewer](https://ezpzfile.com/cad-viewer): open, measure and print drawings in the browser
- [ezpzfile-mcp](https://github.com/ezpzfile/ezpzfile-mcp): CAD drawings for AI agents (inspect, read text, convert to PDF)

This repository is exported from the ezpzfile.com source, where the viewer is developed; issues
and pull requests are welcome here and are carried over.

## License

MIT. Copyright (c) 2026 EZPZ File (https://ezpzfile.com).
