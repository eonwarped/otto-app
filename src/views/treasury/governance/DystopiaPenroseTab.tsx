import CLAM from 'assets/clam.svg'
import CLAMCoin from 'assets/icons/CLAM.svg'
import Button from 'components/Button'
import DystopiaPenroseFunnelChart from 'components/DystopiaPenroseFunnelChart'
import SnapshotProposalGroup from 'components/SnapshotProposalGroup'
import { useStake } from 'contracts/functions'
import { useTreasuryRealtimeMetrics } from 'contracts/views'
import { utils } from 'ethers'
import { trim } from 'helpers/trim'
import useGovernanceMetrics from 'hooks/useGovernanceMetrics'
import useOtterClamProposals from 'hooks/useSnapshotProposals'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Caption, ContentLarge, ContentSmall, Headline } from 'styles/typography'

// const StyledOtterClamTab = styled.div`
//   display: block;
//   flex-direction: row;
//   gap: 10px;
// `

const CenteredHeadline = styled.span`
  font-family: 'Pangolin', 'naikaifont';
  white-space: none;
  font-size: 24px;
  font-weight: 400;
  text-align: center;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 20px;
  }
`

const StyledButton = styled(Button)``

interface Props {
  className?: string
}

export default function DystopiaPenroseTab({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  const { metrics } = useGovernanceMetrics()
  const otterClamVlPenRounded = parseFloat(metrics[0].otterClamVlPenPercentOwned).toFixed(2)
  const otterClamVeDystRounded = parseFloat(metrics[0].otterClamVeDystPercentOwned).toFixed(2)
  // {`OtterClam controls ${otterClamVlPenRounded}% of Penrose voting power,`}

  return (
    <div className={className}>
      <CenteredHeadline as="h1">
        {'OtterClam controls '}
        <span style={{ color: 'red' }}>{`${otterClamVlPenRounded}%`}</span>
        {' of Penrose voting power,'}
      </CenteredHeadline>
      <CenteredHeadline as="h1">
        {'equivalent to '}
        <span style={{ color: 'red' }}>{`${otterClamVeDystRounded}%`}</span>
        {' of total Dystopia voting power.'}
      </CenteredHeadline>
      <ContentSmall as="p">{}</ContentSmall>
      <DystopiaPenroseFunnelChart metrics={metrics} />
    </div>
  )
}
