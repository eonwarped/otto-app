import { useBreakpoints } from 'contexts/Breakpoints'
import useAssetsBundles from 'hooks/useAssetsBundles'
import { BundleName } from 'worker/consts'
import DesktopHomePage from './DesktopHomePage'
import MobileHomePage from './MobileHomePage'

export default function HomePage() {
  const { isTablet, isMobile } = useBreakpoints()
  const desktopVersion = !(isTablet || isMobile)

  useAssetsBundles([BundleName.HomePage])

  if (desktopVersion) {
    return <DesktopHomePage />
  }
  return <MobileHomePage />
}
