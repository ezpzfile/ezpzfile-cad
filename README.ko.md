# ezpzfile-cad

자바스크립트로 캐드·BIM 도면을 읽습니다. 네이티브 코드, WebAssembly, 의존성이 없습니다.
[ezpzfile.com 캐드 뷰어](https://ezpzfile.com/ko/cad-viewer)가 쓰는 엔진 그대로이며, 브라우저·웹 워커·Node 에서 돌아갑니다.

```bash
npm install ezpzfile-cad
```

```js
import { openCad, prepare, toSvg } from 'ezpzfile-cad'

const drawing = await openCad(bytes, () => {}, { name: '평면도.dwg' })
if (drawing.kind === '2d') {
  const layers = drawing.layers.map((l) => l.name)
  const texts = drawing.sheets[0].items.filter((i) => i.kind === 'text').map((i) => i.text)
  const svg = toSvg(prepare(drawing.sheets[0], layers), new Uint8Array(layers.length))
}
```

읽는 형식: DWG(AutoCAD 1.4~R12, R13~2018 이후), DXF, DWFx, Jw_cad, iCAD SX, SXF, 거버·드릴·ODB++·IPC-2581,
IGES, Inventor, IFC, STEP, SketchUp, glTF·OBJ·STL·3DS·FBX. 형식은 이름이 아니라 파일 내용으로 가립니다.

2D 도면은 시트마다 mm 단위 항목(선, 호, 채움, 글자, 그림)과 각 항목의 레이어를, 3D 모델은 카테고리·층과 요소별 메시를
돌려줍니다. 열지 못하면 `CadOpenError` 와 이유 코드(`not-format`, `corrupt`, `unsupported-version`, `encrypted`,
`too-large` …)를 냅니다.

모든 엔진은 공개 규격 문서나 표본 파일 분석으로 직접 만들었습니다(클린룸). 다른 캐드 라이브러리 코드는 쓰지 않았습니다.

이 저장소는 ezpzfile.com 원본에서 내보낸 사본입니다. 이슈와 풀 리퀘스트는 여기서 받습니다. 라이선스 MIT.
