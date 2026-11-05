// A drawing made here (no sample files in the repository): two layers, lines and text.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { openCad, prepare, toSvg, findFrames, CadOpenError } from '../dist/index.js'

function dxf() {
  const head = ['0', 'SECTION', '2', 'TABLES', '0', 'TABLE', '2', 'LAYER', '70', '2',
    '0', 'LAYER', '2', 'WALLS', '70', '0', '62', '1', '6', 'CONTINUOUS',
    '0', 'LAYER', '2', 'NOTES', '70', '0', '62', '5', '6', 'CONTINUOUS',
    '0', 'ENDTAB', '0', 'ENDSEC', '0', 'SECTION', '2', 'ENTITIES']
  const ents = []
  for (const [x0, y0, x1, y1] of [[0, 0, 420, 0], [420, 0, 420, 297], [420, 297, 0, 297], [0, 297, 0, 0]]) {
    ents.push('0', 'LINE', '8', 'WALLS', '10', `${x0}`, '20', `${y0}`, '30', '0', '11', `${x1}`, '21', `${y1}`, '31', '0')
  }
  ents.push('0', 'TEXT', '8', 'NOTES', '10', '60', '20', '260', '30', '0', '40', '8', '1', 'FLOOR PLAN 1F')
  return new TextEncoder().encode([...head, ...ents, '0', 'ENDSEC', '0', 'EOF'].join('\n') + '\n')
}

test('a DXF opens as a 2D drawing with its layers and text', async () => {
  const d = await openCad(dxf(), () => {}, { name: 'plan.dxf' })
  assert.equal(d.kind, '2d')
  const names = d.layers.map((l) => l.name)
  assert.ok(names.includes('WALLS') && names.includes('NOTES'))
  const texts = d.sheets[0].items.filter((i) => i.kind === 'text').map((i) => i.text)
  assert.deepEqual(texts, ['FLOOR PLAN 1F'])
  const svg = toSvg(prepare(d.sheets[0], names), new Uint8Array(names.length))
  assert.match(svg, /FLOOR PLAN 1F/)
  assert.ok(Array.isArray(findFrames(d.sheets[0])))
})

test('bytes that are no drawing are refused with a code', async () => {
  await assert.rejects(openCad(new TextEncoder().encode('hello'), () => {}, { name: 'x.dwg' }), (e) => e instanceof CadOpenError && e.code === 'not-format')
})
