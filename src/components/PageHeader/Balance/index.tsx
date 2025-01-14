import useContractAddresses from 'hooks/useContractAddresses'
import { useBreakpoints } from 'contexts/Breakpoints'
import { useEthers } from '@usedapp/core'
import { formatClamEthers } from 'utils/currency'
import { useEffect, useMemo, useRef, useState } from 'react'
import useTokenBalance from 'hooks/useTokenBalance'
import ReactTooltip from 'react-tooltip'
import styled, { useTheme } from 'styled-components/macro'
import { ContentMedium } from 'styles/typography'
import useBrowserLayoutEffect from 'hooks/useBrowserLayoutEffect'
import Balance from './balance'
import LargeClamBg from './header_clam_xl.png'
import SmallClamBg from './header_clam_xs.png'
import LargeFishBg from './large-fish.png'
import SmallFishBg from './small-fish.png'

const StyledToolTip = styled(ReactTooltip)`
  background: ${({ theme }) => theme.colors.clamPink};
  padding: 1px 10px !important;
  opacity: 1 !important;
  border-radius: 5px !important;
`

interface Props {
  onClick: () => void
}

const NEW_WALLET_TOOLTIP_SHOWED = 'new-wallet-tooltip-showed'

const useNewWalletTooltipShowed = () => {
  const [newWalletTooltipShowed, setNewWalletTooltipShowed] = useState(false)

  useBrowserLayoutEffect(() => {
    setNewWalletTooltipShowed(Boolean(localStorage.getItem(NEW_WALLET_TOOLTIP_SHOWED)))
  }, [])

  return {
    newWalletTooltipShowed,
    setNewWalletTooltipShowed: (newVal: boolean) => {
      setNewWalletTooltipShowed(true)
      localStorage.setItem(NEW_WALLET_TOOLTIP_SHOWED, 'true')
    },
  }
}

export const ClamBalance = ({ onClick }: Props) => {
  const { newWalletTooltipShowed, setNewWalletTooltipShowed } = useNewWalletTooltipShowed()
  const { CLAM, PEARL_BANK, CLAM_POND } = useContractAddresses()
  const theme = useTheme()
  const tooltipRef = useRef(null)
  const clamBalance = useTokenBalance(CLAM)
  const pearlBalance = useTokenBalance(PEARL_BANK)
  const clamPlusBalance = useTokenBalance(CLAM_POND)
  const { isMobile } = useBreakpoints()
  const bg = isMobile ? SmallClamBg : LargeClamBg
  const width = isMobile ? 108 : 128
  const balance = useMemo(
    () => formatClamEthers(clamBalance?.add(pearlBalance || 0)?.add(clamPlusBalance) || 0, 2),
    [clamBalance, pearlBalance, clamPlusBalance]
  )
  useEffect(() => {
    tooltipRef?.current && ReactTooltip.show(tooltipRef.current)
  }, [tooltipRef])
  return (
    <div data-tip ref={tooltipRef}>
      <Balance
        showBuyButton
        background={bg.src}
        width={width}
        balance={balance}
        onClick={() => {
          setNewWalletTooltipShowed(true)
          onClick()
        }}
      />
      {!newWalletTooltipShowed && (
        <StyledToolTip
          place="bottom"
          effect="solid"
          backgroundColor={theme.colors.clamPink}
          arrowColor={theme.colors.clamPink}
          offset={{ top: 4 }}
        >
          <ContentMedium>New!</ContentMedium>
        </StyledToolTip>
      )}
    </div>
  )
}

export const FishBalance = () => {
  const { isMobile } = useBreakpoints()
  const bg = isMobile ? SmallFishBg : LargeFishBg
  const width = isMobile ? 103 : 155
  return <Balance disabled showBuyButton background={bg.src} width={width} balance="--" />
}
