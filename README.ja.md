<p align="center">
  <img src="docs/icon.png" alt="EZPZ File CAD" width="128">
</p>
<h1 align="center">ezpzfile-cad</h1>
<p align="center"><a href="README.md">English</a> · <a href="README.ko.md">한국어</a> · <b>日本語</b></p>
<p align="center">
  <a href="https://www.npmjs.com/package/ezpzfile-cad"><img src="https://img.shields.io/npm/v/ezpzfile-cad?color=0155FF&label=npm" alt="npm"></a>
  <img src="https://img.shields.io/badge/dependencies-0-0155FF" alt="0 dependencies">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-0155FF" alt="MIT"></a>
</p>
<p align="center"><sub><a href="https://ezpzfile.com/ja/cad-viewer">CAD ビューアを開く</a></sub></p>

JavaScript で CAD・BIM 図面を読み込みます。ネイティブコード、WebAssembly、依存パッケージはありません。
[ezpzfile.com の CAD ビューア](https://ezpzfile.com/ja/cad-viewer)と同じエンジンで、ブラウザ・Web Worker・Node で動きます。

```bash
npm install ezpzfile-cad
```

```js
import { openCad, prepare, toSvg } from 'ezpzfile-cad'

const drawing = await openCad(bytes, () => {}, { name: '平面図.jww' })
if (drawing.kind === '2d') {
  const layers = drawing.layers.map((l) => l.name)
  const svg = toSvg(prepare(drawing.sheets[0], layers), new Uint8Array(layers.length))
}
```

対応形式: DWG（AutoCAD 1.4〜R12、R13〜2018 以降）、DXF、DWFx、Jw_cad（JWW・JWC、レイヤグループの縮尺付き）、
iCAD SX、SXF（SFC・P21）、ガーバー・ドリル・ODB++・IPC-2581、IGES、Inventor、IFC、STEP、SketchUp、glTF・OBJ・STL・3DS・FBX。

すべて公開仕様書またはサンプルファイルの解析から書き起こしたクリーンルーム実装です。ほかの CAD ライブラリのコードは使っていません。

このリポジトリは ezpzfile.com のソースから書き出した写しです。Issue・Pull Request はここで受け付けます。ライセンス MIT。
