const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([type=hidden]):not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[tabindex]',
].join(',')

export function findFocusable(
  $parent: HTMLElement,
  filterFn: (el: HTMLElement) => boolean = () => true,
): HTMLElement[] {
  if (!$parent || typeof $parent.querySelectorAll !== 'function') {
    return []
  }

  const matches = $parent.querySelectorAll<HTMLElement>(focusableSelector)

  return Array.from(matches).filter($el => filterFn($el) && visible($el))
}

export function findTabbable($parent: HTMLElement): HTMLElement[] {
  return findFocusable($parent, hasValidTabIndex)
}

function hasValidTabIndex($el: HTMLElement): boolean {
  const tabIndex = Number($el.getAttribute('tabindex'))
  return isNaN(tabIndex) || tabIndex >= 0
}

function visible($el: HTMLElement): boolean {
  let $currentEl = $el
  while ($currentEl) {
    // Stop traversing up the hierarchy at the document body.
    if ($currentEl === document.body) {
      break
    }

    // When the element is hidden, it cannot be focused.
    if (hidden($currentEl)) {
      return false
    }

    $currentEl = $currentEl.parentNode as HTMLElement
  }

  return true
}

function hidden($el: HTMLElement): boolean {
  const style = window.getComputedStyle($el)
  return (
    (style.display !== 'inline' && $el.offsetWidth <= 0 && $el.offsetHeight <= 0) ||
    style.display === 'none'
  )
}
