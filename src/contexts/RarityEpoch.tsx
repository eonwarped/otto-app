import { useQuery } from '@apollo/client'
import { useOttoInfo } from 'contracts/views'
import { GET_EPOCH } from 'graphs/otto'
import { useRouter } from 'next/router'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import { GetEpoch, GetEpochVariables } from 'graphs/__generated__/GetEpoch'
import { RARITY_S1_END } from 'constant'

const S1_START_DATE = new Date('2022-05-23').valueOf()
const S2_START_DATE = Date.now() // FIXME: replace with new Date('2022-09-19').valueOf()
const EPOCH_LENGTH = 14 * 86400 * 1000 // 14 days
const EPOCH_3_EXTEND = 2 * 86400 * 1000 // 2 days
const EPOCH_4_EXTEND = 2 * 86400 * 1000

const RaityEpochContext = createContext<{
  epoch: number
  epochEndTime: number
  latestEpoch: number
  isLatestEpoch: boolean
  hasPrevEpoch: boolean
  hasNextEpoch: boolean
  totalOttoSupply: number
}>({
  epoch: 0,
  epochEndTime: 0,
  latestEpoch: 0,
  isLatestEpoch: false,
  hasPrevEpoch: false,
  hasNextEpoch: false,
  totalOttoSupply: 0,
})

export const RaityEpochProvider = ({ children }: PropsWithChildren<object>) => {
  const router = useRouter()
  const epoch = Number(router.query.epoch || -1)
  const [latestEpoch, setLatestEpoch] = useState(epoch)
  const [totalSupply] = useOttoInfo()
  const { data } = useQuery<GetEpoch, GetEpochVariables>(GET_EPOCH, {
    variables: { epoch },
    skip: epoch === -1,
  })
  const isLatestEpoch = epoch === -1 || epoch === latestEpoch
  const currentEpoch = isLatestEpoch ? latestEpoch : epoch
  const epochEndTime =
    currentEpoch >= 6
      ? S2_START_DATE + (currentEpoch - 5) * EPOCH_LENGTH
      : S1_START_DATE +
        (currentEpoch + 1) * EPOCH_LENGTH +
        (currentEpoch >= 3 ? EPOCH_3_EXTEND : 0) +
        (currentEpoch >= 4 ? EPOCH_4_EXTEND : 0)
  const hasPrevEpoch = (epoch === -1 || epoch > 0) && latestEpoch > 0
  const hasNextEpoch = epoch !== -1
  const totalOttoSupply = epoch === -1 ? totalSupply - 250 : (data?.epoches[0].totalOttos ?? 0) - 250

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      if (now >= S2_START_DATE) {
        setLatestEpoch(Math.floor((now - S2_START_DATE) / EPOCH_LENGTH) + 6)
      } else if (now > RARITY_S1_END) {
        setLatestEpoch(5)
      } else if (now < S1_START_DATE) setLatestEpoch(0)
      else if (now > S1_START_DATE && now < S1_START_DATE + EPOCH_LENGTH * 3)
        setLatestEpoch(Math.floor((now - S1_START_DATE) / EPOCH_LENGTH))
      else if (now < S1_START_DATE + EPOCH_3_EXTEND + 4 * EPOCH_LENGTH) setLatestEpoch(3)
      else if (now < S1_START_DATE + EPOCH_3_EXTEND + EPOCH_4_EXTEND + 5 * EPOCH_LENGTH) setLatestEpoch(4)
      else setLatestEpoch(Math.floor((now - S1_START_DATE - EPOCH_3_EXTEND - EPOCH_4_EXTEND) / EPOCH_LENGTH))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const value = useMemo(
    () => ({
      epoch: currentEpoch,
      epochEndTime,
      latestEpoch,
      isLatestEpoch,
      hasPrevEpoch,
      hasNextEpoch,
      totalOttoSupply,
    }),
    [currentEpoch, epochEndTime, latestEpoch, isLatestEpoch, hasPrevEpoch, hasNextEpoch, totalOttoSupply]
  )

  return <RaityEpochContext.Provider value={value}>{children}</RaityEpochContext.Provider>
}

export function useRarityEpoch() {
  return useContext(RaityEpochContext)
}
