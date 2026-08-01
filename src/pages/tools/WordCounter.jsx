import { useMemo, useState } from 'react'

export default function WordCounter() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const trimmed = text.trim()
    const words = trimmed ? trimmed.split(/\s+/).length : 0
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const sentences = trimmed
      ? (trimmed.match(/[.!?]+(?=\s|$)/g) || []).length || (trimmed ? 1 : 0)
      : 0
    const readingMinutes = words ? Math.max(1, Math.round(words / 200)) : 0
    return { words, chars, charsNoSpaces, sentences, readingMinutes }
  }, [text])

  return (
    <div className="tool word-counter">
      <textarea
        className="word-counter__input"
        placeholder="Paste or type something…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
      />
      <dl className="stat-row">
        <div className="stat">
          <dt>Words</dt>
          <dd>{stats.words}</dd>
        </div>
        <div className="stat">
          <dt>Characters</dt>
          <dd>{stats.chars}</dd>
        </div>
        <div className="stat">
          <dt>No spaces</dt>
          <dd>{stats.charsNoSpaces}</dd>
        </div>
        <div className="stat">
          <dt>Sentences</dt>
          <dd>{stats.sentences}</dd>
        </div>
        <div className="stat">
          <dt>Reading time</dt>
          <dd>{stats.readingMinutes ? `${stats.readingMinutes} min` : '—'}</dd>
        </div>
      </dl>
    </div>
  )
}
