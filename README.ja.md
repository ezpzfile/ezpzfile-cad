# ezpzfile-cad

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
