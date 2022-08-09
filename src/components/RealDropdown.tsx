import { IS_SERVER } from 'constant'
import useOnClickOutside from 'hooks/useOnClickOutside'
import { cloneElement, isValidElement, ReactChild, ReactElement, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components/macro'

const StyledContainer = styled.div<{ pos: { x: number; y: number } }>`
  position: fixed;
  z-index: var(--z-index-dropdown);
  left: ${({ pos }) => pos.x}px;
  top: ${({ pos }) => pos.y}px;
  transform-origin: top center;

  &.slide-enter {
    opacity: 0.3;
    transform: scaleY(0);
  }

  &.slide-enter-active {
    opacity: 1;
    transform: scaleY(1);
    transition: transform 0.2s, opacity 0.2s;
  }

  &.slide-exit {
    opacity: 1;
    transform: scaleY(1);
  }

  &.slide-exit-active {
    opacity: 0.3;
    transform: scaleY(0);
    transition: transform 0.2s, opacity 0.2s;
  }
`

export interface RealDropdownProps {
  children: ReactElement
  content: () => ReactChild
  className?: string
}

export default function RealDropdown({ className, children, content }: RealDropdownProps) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLElement>()

  const pos = useMemo(() => {
    if (!ref.current) {
      return { x: 0, y: 0 }
    }
    const rect = ref.current.getBoundingClientRect()
    return {
      x: rect.left,
      y: rect.top,
    }
  }, [ref.current, show])

  useOnClickOutside(ref, () => {
    setShow(false)
  })

  if (IS_SERVER || !isValidElement(children)) {
    return children
  }

  const child = cloneElement(children as ReactElement, {
    ref,
    onClick: (e: MouseEvent) => {
      e.stopPropagation()
      setShow(true)
    },
  })

  return (
    <>
      {child}
      {createPortal(
        <CSSTransition unmountOnExit in={show} timeout={200} classNames="slide">
          <StyledContainer className={className} pos={pos}>
            {content()}
          </StyledContainer>
        </CSSTransition>,
        document.querySelector('#modal-root')!
      )}
    </>
  )
}
