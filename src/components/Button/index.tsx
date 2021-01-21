import classNames from 'classnames'
import { useCallback } from 'react'

import { copyTextToClipboard, isClipboardAvailable } from '../../lib/helpers'

export default function Button(props: {
  className?: string
  disabled?: boolean
  onClick?: () => void
  children: string
}) {
  return (
    <button
      className={classNames('Button', props.className)}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}

export function CopyButton(props: { content: { toString: () => string } }) {
  const handleClick = useCallback(() => {
    copyTextToClipboard(props.content.toString())
  }, [props.content])

  return (
    <Button disabled={!isClipboardAvailable()} onClick={handleClick}>
      Copy
    </Button>
  )
}
