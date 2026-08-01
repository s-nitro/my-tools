import { useEffect, useState } from 'react'

const STARTED_KEY = 'sessionTime.startedAt'
const DURATION_KEY = 'sessionTime.durationMinutes'
const DEFAULT_DURATION_MINUTES = 210 // 3.5 hours

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)

function fmtClock(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtRemaining(ms) {
  if (ms <= 0) return '00:00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function fmtDuration(totalMinutes) {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

export default function SessionTime() {
  const [startedAt, setStartedAt] = useState(() => {
    const saved = localStorage.getItem(STARTED_KEY)
    return saved ? Number(saved) : null
  })
  const [durationMinutes, setDurationMinutes] = useState(() => {
    const saved = localStorage.getItem(DURATION_KEY)
    return saved ? Number(saved) : DEFAULT_DURATION_MINUTES
  })
  const [pendingHours, setPendingHours] = useState(() =>
    Math.floor(durationMinutes / 60)
  )
  const [pendingMinutes, setPendingMinutes] = useState(() => durationMinutes % 60)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!startedAt) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [startedAt])

  function handleStart() {
    const ts = Date.now()
    localStorage.setItem(STARTED_KEY, String(ts))
    setStartedAt(ts)
    setNow(ts)
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Reset your start time? This will clear today's tracked time."
    )
    if (!confirmed) return
    localStorage.removeItem(STARTED_KEY)
    setStartedAt(null)
  }

  function handleDurationSubmit(e) {
    e.preventDefault()
    const minutes = pendingHours * 60 + pendingMinutes
    if (!minutes || minutes <= 0) return

    const message = startedAt
      ? `Set session length to ${fmtDuration(minutes)}? This will recalculate today's leave time.`
      : `Set session length to ${fmtDuration(minutes)}?`
    const confirmed = window.confirm(message)
    if (!confirmed) {
      // revert the fields back to the last applied value
      setPendingHours(Math.floor(durationMinutes / 60))
      setPendingMinutes(durationMinutes % 60)
      return
    }

    localStorage.setItem(DURATION_KEY, String(minutes))
    setDurationMinutes(minutes)
  }

  const durationControl = (
    <form className="session-duration" onSubmit={handleDurationSubmit}>
      <label className="session-duration__label">Session length</label>
      <div className="session-duration__controls">
        <select
          aria-label="Hours"
          className="session-duration__select"
          value={pendingHours}
          onChange={(e) => setPendingHours(Number(e.target.value))}
        >
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {String(h).padStart(2, '0')} h
            </option>
          ))}
        </select>
        <span className="session-duration__sep">:</span>
        <select
          aria-label="Minutes"
          className="session-duration__select"
          value={pendingMinutes}
          onChange={(e) => setPendingMinutes(Number(e.target.value))}
        >
          {MINUTES.map((m) => (
            <option key={m} value={m}>
              {String(m).padStart(2, '0')} m
            </option>
          ))}
        </select>
        <button type="submit" className="session-duration__submit">
          Set
        </button>
      </div>
      <p className="session-duration__current">
        Currently {fmtDuration(durationMinutes)}
      </p>
    </form>
  )

  if (!startedAt) {
    return (
      <div className="session">
        <button type="button" className="session__start-btn" onClick={handleStart}>
          Start Day
        </button>
        <p className="session__hint">
          Logs your start time and works out when your {fmtDuration(durationMinutes)}{' '}
          session is done.
        </p>
        {durationControl}
      </div>
    )
  }

  const endAt = startedAt + durationMinutes * 60 * 1000
  const remaining = endAt - now
  const isDone = remaining <= 0

  return (
    <div className="session">
      <div className={`session__result ${isDone ? 'session__result--done' : ''}`}>
        <div className="session__row">
          <span className="session__label">Started</span>
          <span className="session__value">{fmtClock(startedAt)}</span>
        </div>
        <div className="session__row">
          <span className="session__label">Leave at</span>
          <span className="session__value session__value--big">{fmtClock(endAt)}</span>
        </div>
        <div className="session__row">
          <span className="session__label">{isDone ? 'Status' : 'Remaining'}</span>
          <span className="session__value">
            {isDone ? 'Done — you can head out ✅' : fmtRemaining(remaining)}
          </span>
        </div>
      </div>
      <button type="button" className="session__reset-btn" onClick={handleReset}>
        Reset
      </button>
      {durationControl}
    </div>
  )
}
