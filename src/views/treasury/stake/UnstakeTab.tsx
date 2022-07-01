import PEARL from 'assets/pearl.png'
import PearlCoin from 'assets/icons/PEARL-coin.svg'
import Button from 'components/Button'
import { useStake, useUnstake } from 'contracts/functions'
import { useTreasuryRealtimeMetrics } from 'contracts/views'
import { utils } from 'ethers'
import { trim } from 'helpers/trim'
import usePearlBalance from 'hooks/usePearlBalance'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Caption, ContentLarge, ContentSmall, Headline } from 'styles/typography'
import StakeSuccessPopup from './StakeSuccessPopup'

const StyledUnstakeTab = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const StyledPearlBalance = styled(Caption)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`

const StyledPearlBalanceText = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  &:before {
    content: '';
    background: no-repeat center/contain url(${PEARL.src});
    width: 16px;
    height: 16px;
    margin-right: 5px;
    display: block;
  }
`

const StyledInput = styled(ContentSmall).attrs({ as: 'input' })`
  width: 100%;
  padding: 20px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  background: url(${PearlCoin.src}) no-repeat 20px;
  text-indent: 32px;

  ::placeholder {
    color: ${({ theme }) => theme.colors.lightGray400};
    opacity: 1;
  }
`

const StyledButton = styled(Button)``

// type Tab = 'stake' | 'unstake'

interface Props {
  className?: string
}

export default function UnstakeTab({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  const [pearlAmount, setPearlAmount] = useState('')
  const pearlBalance = usePearlBalance()
  const { unstakeState: state, unstake, resetState } = useUnstake()
  const { index } = useTreasuryRealtimeMetrics()
  useEffect(() => {
    if (state.state === 'Fail' || state.state === 'Exception') {
      window.alert(state.status.errorMessage)
      resetState()
    }
  }, [state, resetState])
  return (
    <StyledUnstakeTab className={className}>
      <Headline as="h1">{t('welcome')}</Headline>
      <ContentSmall as="p">{t('desc')}</ContentSmall>
      <StyledPearlBalance>
        {t('available')}
        <StyledPearlBalanceText>
          {pearlBalance !== undefined ? trim(utils.formatEther(pearlBalance), 2) : '-'}
        </StyledPearlBalanceText>
        <Button
          Typography={ContentLarge}
          primaryColor="white"
          padding="0 12px"
          onClick={() => pearlBalance && setPearlAmount(utils.formatEther(pearlBalance))}
        >
          {t('max')}
        </Button>
      </StyledPearlBalance>
      <StyledInput
        placeholder={t('input_placeholder')}
        value={pearlAmount}
        onChange={e => setPearlAmount(e.target.value)}
      />
      <StyledButton
        Typography={Headline}
        padding="6px"
        isWeb3
        loading={state.state !== 'None'}
        onClick={() => unstake(pearlAmount)}
      >
        {t('unstake_btn')}
      </StyledButton>
      {state.state === 'Success' && (
        <StakeSuccessPopup
          clamAmount={trim(utils.formatUnits(utils.parseUnits('122.53', 9).mul(index), 9), 4)}
          onClose={resetState}
        />
      )}
    </StyledUnstakeTab>
  )
}
