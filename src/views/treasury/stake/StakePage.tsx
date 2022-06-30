import TreasurySection from 'components/TreasurySection'
import styled from 'styled-components'
import BG from './bg.jpg'
import Otter1 from './clam_pond_otter-1.png'
import Fountain from './fountain.png'
import StakeDialog from './StakeDialog'
import StakeInfo from './StakeInfo'

const StyledStakePage = styled(TreasurySection)`
  display: flex;
  background: no-repeat center / cover url(${BG.src});
  position: relative;
`

const StyledStakeDialog = styled(StakeDialog)`
  flex: 1;
  margin-top: 140px;
  margin-left: 80px;
`

const StyledStakeInfo = styled(StakeInfo)`
  position: relative;
  margin-bottom: 80px;
`

const StyledOtter = styled.img.attrs({ src: Otter1.src })`
  position: absolute;
  width: 468px;
  left: 0;
  bottom: 0;
`

const StyledFountain = styled.img.attrs({ src: Fountain.src })`
  position: absolute;
  width: 860px;
  right: 0;
  bottom: 0;
`

export default function StakePage() {
  return (
    <StyledStakePage>
      <StyledFountain />
      <StyledOtter />
      <StyledStakeDialog />
      <StyledStakeInfo />
    </StyledStakePage>
  )
}
