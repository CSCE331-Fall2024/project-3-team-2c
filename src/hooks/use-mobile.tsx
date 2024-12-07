import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * useIsMobile is a custom React hook that detects if the current viewport width is below a specified mobile breakpoint.
 * It listens for changes in the window width and updates its state accordingly.
 *
 * @constant {number} MOBILE_BREAKPOINT - The width threshold (in pixels) to consider a device as "mobile".
 *
 * @returns {boolean} - `true` if the viewport width is less than the mobile breakpoint, `false` otherwise.
 *
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
