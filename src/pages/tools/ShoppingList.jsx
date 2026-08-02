import { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import PublicList from './shopping-list/PublicList.jsx'

// React.lazy means PrivateList.jsx — and everything it imports, including
// Firebase — is split into its own chunk that only loads when someone is
// actually on the private route below. Public visitors never fetch it.
const PrivateList = lazy(() => import('./shopping-list/PrivateList.jsx'))

export default function ShoppingList() {
  // Route is registered as "shopping-list/*", so the wildcard segment
  // (everything after /shopping-list/) lands in params['*'].
  const params = useParams()
  const privateId = params['*']

  if (privateId) {
    return (
      <Suspense fallback={<p className="shopping__loading">Loading…</p>}>
        <PrivateList listId={privateId} />
      </Suspense>
    )
  }

  return <PublicList />
}
