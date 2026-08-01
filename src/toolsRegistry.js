import WordCounter from './pages/tools/WordCounter.jsx'
import UnitConverter from './pages/tools/UnitConverter.jsx'

// To add a new tool:
// 1. Create src/pages/tools/YourTool.jsx (default export a component)
// 2. Import it above
// 3. Add an entry below — `path` becomes /my-tools/<path>
export const tools = [
  {
    path: 'word-counter',
    name: 'Word Counter',
    blurb: 'Live word, character, and reading-time count as you type.',
    component: WordCounter,
  },
  {
    path: 'unit-converter',
    name: 'Unit Converter',
    blurb: 'Convert length, weight, and temperature on the fly.',
    component: UnitConverter,
  },
]
