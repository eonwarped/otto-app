import axios from 'axios'
import Otto, { OttoMeta, RawOtto } from 'models/Otto'
import { useEffect, useMemo, useState } from 'react'

export default function useOtto(rawOtto: RawOtto) {
  const [loading, setLoading] = useState(true)
  const [metadata, setMetadata] = useState<OttoMeta | null>(null)
  const otto = useMemo(() => (metadata ? new Otto(rawOtto, metadata) : null), [rawOtto, metadata])
  useEffect(() => {
    axios
      .get<OttoMeta>(rawOtto.tokenURI)
      .then(res => {
        setMetadata(res.data)
      })
      .catch(err => console.error('fetch otto meta failed', err))
      .finally(() => setLoading(false))
  }, [rawOtto])
  return { loading, otto }
}