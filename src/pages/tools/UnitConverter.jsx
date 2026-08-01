import { useMemo, useState } from 'react'

const CATEGORIES = {
  length: {
    label: 'Length',
    units: {
      m: { label: 'Meters', toBase: 1 },
      km: { label: 'Kilometers', toBase: 1000 },
      cm: { label: 'Centimeters', toBase: 0.01 },
      mi: { label: 'Miles', toBase: 1609.344 },
      ft: { label: 'Feet', toBase: 0.3048 },
      in: { label: 'Inches', toBase: 0.0254 },
    },
  },
  weight: {
    label: 'Weight',
    units: {
      kg: { label: 'Kilograms', toBase: 1 },
      g: { label: 'Grams', toBase: 0.001 },
      lb: { label: 'Pounds', toBase: 0.453592 },
      oz: { label: 'Ounces', toBase: 0.0283495 },
    },
  },
  temperature: {
    label: 'Temperature',
    units: { c: { label: 'Celsius' }, f: { label: 'Fahrenheit' }, k: { label: 'Kelvin' } },
  },
}

function convertTemp(value, from, to) {
  if (from === to) return value
  let celsius = value
  if (from === 'f') celsius = ((value - 32) * 5) / 9
  if (from === 'k') celsius = value - 273.15
  if (to === 'c') return celsius
  if (to === 'f') return (celsius * 9) / 5 + 32
  return celsius + 273.15
}

export default function UnitConverter() {
  const [category, setCategory] = useState('length')
  const [from, setFrom] = useState('m')
  const [to, setTo] = useState('ft')
  const [value, setValue] = useState('1')

  const units = CATEGORIES[category].units
  const unitKeys = Object.keys(units)

  const result = useMemo(() => {
    const num = parseFloat(value)
    if (Number.isNaN(num)) return ''
    if (category === 'temperature') {
      return Number(convertTemp(num, from, to).toFixed(4))
    }
    const base = num * units[from].toBase
    return Number((base / units[to].toBase).toFixed(6))
  }, [value, from, to, category, units])

  function handleCategoryChange(next) {
    const keys = Object.keys(CATEGORIES[next].units)
    setCategory(next)
    setFrom(keys[0])
    setTo(keys[1] ?? keys[0])
  }

  return (
    <div className="tool unit-converter">
      <div className="segmented">
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            type="button"
            className={`segmented__btn ${category === key ? 'is-active' : ''}`}
            onClick={() => handleCategoryChange(key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="converter-row">
        <div className="converter-field">
          <label htmlFor="from-unit">From</label>
          <input
            id="from-value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <select
            id="from-unit"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            {unitKeys.map((k) => (
              <option key={k} value={k}>
                {units[k].label}
              </option>
            ))}
          </select>
        </div>

        <span className="converter-arrow" aria-hidden="true">→</span>

        <div className="converter-field">
          <label htmlFor="to-unit">To</label>
          <output className="converter-result">{result === '' ? '—' : result}</output>
          <select
            id="to-unit"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            {unitKeys.map((k) => (
              <option key={k} value={k}>
                {units[k].label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
