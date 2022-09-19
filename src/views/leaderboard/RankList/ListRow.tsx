import CLAM from 'assets/clam.png'
import OttOLoading from 'assets/ui/otto-loading.jpg'
import styled from 'styled-components/macro'
import { useBreakpoints } from 'contexts/Breakpoints'
import Otto from 'models/Otto'
import Link from 'next/link'
import { memo } from 'react'
import { ContentLarge } from 'styles/typography'
import OttoBoostLabels from 'components/OttoBoostLabels'
import useEstimatedReward from 'hooks/useEstimatedReward'
import FirstRank from './Icon/Rank/1st.png'
import SecondRank from './Icon/Rank/2nd.png'
import ThirdRank from './Icon/Rank/3rd.png'
import RarityScore from './rarity_score.png'

const StyledRow = styled.div<{ isMyOttoRow?: boolean }>`
  display: flex;
  align-items: center;

  > * {
    &:nth-child(1) {
      // rank
      width: 80px;
      text-align: center;
    }
    &:nth-child(2) {
      flex: 1;
    }
    &:nth-child(3) {
      // reward
      width: 154px;
      text-align: center;
    }
    &:nth-child(4) {
      // rarity score
      width: 122px;
      text-align: center;
    }
    &:nth-child(5),
    &:nth-child(6) {
      // brs + rrs
      width: 64px;
      text-align: center;
    }
  }

  ${({ isMyOttoRow, theme }) =>
    isMyOttoRow &&
    `
    background: ${theme.colors.white};
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    padding: 10px 0px;

    &:hover {
      background: ${theme.colors.lightGray100};
    }
  `}
`

const StyledOttoRow = styled(StyledRow)`
  color: ${({ theme }) => theme.colors.otterBlack};
  width: 100%;
  position: relative;
  padding: 10px 40px;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 10px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.lightGray100};
  }
  &:before {
    position: absolute;
    content: '';
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray200};
    width: calc(100% - 80px);
    transform: translateX(-50%);
    bottom: 0px;
    left: 50%;
  }
`

const StyledTd = styled(ContentLarge).attrs({ as: 'div' })``

const StyledRank = styled(ContentLarge).attrs({ as: 'div' })<{ rank: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 42px;
  color: ${({ rank, theme }) => (rank <= 3 ? 'transparent' : theme.colors.otterBlack)};
  background: url(${({ rank }) =>
      rank === 1 ? FirstRank.src : rank === 2 ? SecondRank.src : rank === 3 ? ThirdRank.src : ''})
    no-repeat;
  background-size: 42px 42px;
  background-position: center;
`

const StyledRarityScore = styled(ContentLarge).attrs({
  as: 'div',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  &:before {
    content: '';
    width: 24px;
    height: 24px;
    background-image: url(${RarityScore});
    background-size: 100%;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    justify-content: start;
  }
`

const StyledAvatarName = styled(ContentLarge).attrs({ as: 'div' })`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
  grid-column-start: span 2;
`

const StyledNameColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const StyledOttoAvatar = styled.img<{ isMyOttoRow?: boolean }>`
  width: ${({ isMyOttoRow }) => (isMyOttoRow ? 60 : 100)}px;
  height: ${({ isMyOttoRow }) => (isMyOttoRow ? 60 : 100)}px;
  min-height: ${({ isMyOttoRow }) => (isMyOttoRow ? 60 : 100)}px;
  background: url(${OttOLoading.src});
  background-size: 100% 100%;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 60px;
    height: 60px;
    min-width: 60px;
  }
`

const StyledReward = styled(ContentLarge).attrs({ as: 'div' })`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  &:before {
    content: '';
    width: 24px;
    height: 24px;
    background-image: url(${CLAM.src});
    background-size: 100%;
  }
  @media ${({ theme }) => theme.breakpoints.mobile} {
    justify-content: start;
  }
`

const StyledMobileRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  color: ${({ theme }) => theme.colors.otterBlack};
  background: ${({ theme }) => theme.colors.white};
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray200};
`

const StyledMobileContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 5px;
  width: 100%;
`

export interface ListRowProps {
  rank: number
  otto: Otto
  isMyOttoRow?: boolean
}

// we will update leaderboard epoch periodically, the rank list will be updated periodically as well.
// so we cache rendering result via `React.memo` to improve rendering performance.
export default memo(function ListRow({ rank, otto, isMyOttoRow }: ListRowProps) {
  const { isMobile } = useBreakpoints()
  const { tokenId, smallImage: image, name, totalRarityScore, baseRarityScore, relativeRarityScore } = otto
  const estimatedReward = useEstimatedReward(rank)

  if (isMobile) {
    return (
      <Link href={`/ottos/${tokenId}`} passHref>
        <a>
          <StyledMobileRow>
            <StyledTd>
              <StyledRank rank={rank}>{rank}</StyledRank>
            </StyledTd>
            <StyledOttoAvatar src={image} />
            <StyledMobileContent>
              <StyledAvatarName>{name}</StyledAvatarName>
              <OttoBoostLabels otto={otto} />
              <StyledReward as="div">{estimatedReward}</StyledReward>
              <StyledRarityScore>{totalRarityScore}</StyledRarityScore>
            </StyledMobileContent>
          </StyledMobileRow>
        </a>
      </Link>
    )
  }

  return (
    <Link href={`/ottos/${tokenId}`} passHref>
      <a>
        <StyledOttoRow isMyOttoRow={isMyOttoRow}>
          <StyledTd>
            <StyledRank rank={rank}>{rank}</StyledRank>
          </StyledTd>
          <StyledTd>
            <StyledAvatarName>
              <StyledOttoAvatar isMyOttoRow={isMyOttoRow} src={image} />
              <StyledNameColumn>
                {name}
                <OttoBoostLabels otto={otto} />
              </StyledNameColumn>
            </StyledAvatarName>
          </StyledTd>
          <StyledTd>
            <StyledReward>{estimatedReward}</StyledReward>
          </StyledTd>
          <StyledRarityScore>{totalRarityScore}</StyledRarityScore>
          <StyledTd>{baseRarityScore}</StyledTd>
          <StyledTd>{relativeRarityScore}</StyledTd>
        </StyledOttoRow>
      </a>
    </Link>
  )
})
