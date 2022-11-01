import AdventureFullscreen from 'components/AdventureFullscreen'
import { FilterSelector, SortedBySelector } from 'components/ItemFilterSelect'
import { AdventureLocationProvider, useAdventureLocation } from 'contexts/AdventureLocation'
import OttoAttrs from 'components/OttoAttrs'
import { ItemActionType } from 'constant'
import { AdventureOttoProvider, useAdventureOtto } from 'contexts/AdventureOtto'
import { ItemFiltersProvider } from 'contexts/ItemFilters'
import { useMyItems } from 'contexts/MyItems'
import { useRepositories } from 'contexts/Repositories'
import { useTrait } from 'contexts/TraitContext'
import useAdventurePreviewItems from 'hooks/useAdventurePreviewItems'
import { AdventurePreview } from 'models/AdventurePreview'
import { ItemAction } from 'models/Item'
import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { ContentExtraSmall, Note } from 'styles/typography'
import { AdventureLocation } from 'models/AdventureLocation'
import ItemList from './ItemList'
import ItemPreview from './ItemPreview'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -25px;
  gap: 20px;
  max-height: calc(80vh - 2px);
  overflow-y: scroll;
  padding: 35px 18px 15px;
  height: 100vh;
`

const StyledTitle = styled(ContentExtraSmall)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
`

const StyledActions = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledAction = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const StyledActionLabel = styled(Note)``

const StyledFullscreen = styled(AdventureFullscreen)<{ maxWidth?: number }>`
  width: 100%;
  background: ${({ theme }) => theme.colors.white} !important;
  ${({ maxWidth }) => maxWidth && `max-width: ${maxWidth}px;`}

  .fullscreen-inner {
    padding: 0 !important;
  }
`

const StyledOttoAttrs = styled(OttoAttrs)`
  .otto-level {
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.otterBlack};

    &::before {
      color: ${({ theme }) => theme.colors.otterBlack};
    }
  }
`

function PreviewAttrs({ otto, actions }: { otto?: Otto; actions: ItemAction[] }) {
  const location = useAdventureLocation()
  const { ottos: ottosRepo } = useRepositories()
  const [preview, setPreview] = useState<{
    otto: Otto
    location: AdventureLocation
  }>()

  useEffect(() => {
    if (!otto || !location) {
      return
    }
    ottosRepo
      .previewAdventureOtto(otto.id, location.id, actions)
      .then(setPreview)
      .catch(err => {
        // handle error
        alert(err.message)
      })
  }, [otto?.id, location, actions, ottosRepo])

  return (
    <AdventureOttoProvider otto={otto} draftOtto={preview?.otto}>
      <AdventureLocationProvider location={preview?.location}>
        <StyledOttoAttrs levelClassName="otto-level" />
      </AdventureLocationProvider>
    </AdventureOttoProvider>
  )
}

export interface OttoItemsPopupProps {
  className?: string
  onRequestClose?: () => void
  maxWidth?: number
}

export default memo(function OttoItemsPopup({ className, maxWidth, onRequestClose }: OttoItemsPopupProps) {
  const container = useRef<HTMLDivElement>(null)
  const { draftOtto, otto, actions: otherActions } = useAdventureOtto()
  const { traitType } = useTrait()
  const { t } = useTranslation('', { keyPrefix: 'ottoItemsPopup' })
  // eslint-disable-next-line prefer-const
  let { items, refetch } = useMyItems()
  items = useAdventurePreviewItems(items, draftOtto)
  const [selectedItemId, selectItem] = useState<string>()
  const filteredItems = items.filter(item => item.metadata.type === traitType)
  const selectedItem = useMemo(() => items.find(({ id }) => id === selectedItemId), [items, selectedItemId])
  let selectedItemMetadata = filteredItems?.find(({ id }) => id === selectedItemId)?.metadata
  const equippedItemMetadata = draftOtto?.equippedItems.find(({ id }) => id === selectedItemId)?.metadata
  const nativeItemMetadata = draftOtto?.nativeItemsMetadata.find(({ type }) => type === traitType)

  if (!selectedItemMetadata && equippedItemMetadata) {
    selectedItemMetadata = equippedItemMetadata
  }

  if (selectedItemId === 'native') {
    selectedItemMetadata = nativeItemMetadata
  }

  const actions = useMemo(() => {
    if (!selectedItemMetadata) {
      return otherActions
    }
    return otherActions.concat({
      type: ItemActionType.Equip,
      item_id: Number(selectedItemMetadata.tokenId),
      from_otto_id: 0,
    })
  }, [otherActions, selectedItemMetadata?.tokenId])

  useEffect(() => {
    refetch()
  }, [draftOtto?.id])

  useEffect(() => {
    if (!traitType) {
      selectItem(undefined)
    }
  }, [Boolean(traitType)])

  return (
    <ItemFiltersProvider items={filteredItems}>
      <StyledFullscreen
        className={className}
        show={Boolean(traitType)}
        onRequestClose={onRequestClose}
        maxWidth={maxWidth}
      >
        <StyledContainer ref={container}>
          <StyledTitle>{t('title', { type: traitType })}</StyledTitle>
          <PreviewAttrs otto={otto} actions={actions} />
          <StyledActions>
            <StyledAction>
              <StyledActionLabel>{t('sort')}</StyledActionLabel>
              <SortedBySelector />
            </StyledAction>
            <StyledAction>
              <StyledActionLabel>{t('filter')}</StyledActionLabel>
              <FilterSelector />
            </StyledAction>
          </StyledActions>

          <ItemList otto={draftOtto} selectedItemId={selectedItemId} selectItem={selectItem} />

          <ItemPreview
            metadata={selectedItemMetadata}
            selectedItem={selectedItem}
            selectedItemId={selectedItemId}
            onItemUpdated={onRequestClose}
            onClose={() => selectItem(undefined)}
          />
        </StyledContainer>
      </StyledFullscreen>
    </ItemFiltersProvider>
  )
})
