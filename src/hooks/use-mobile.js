import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    );
    const update = (e) => {
      setIsMobile(e?.matches ?? window.innerWidth < MOBILE_BREAKPOINT);
    };
    // Initialize
    update(mediaQueryList);
    // Subscribe
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", update);
      return () => mediaQueryList.removeEventListener("change", update);
    } else {
      // Safari fallback
      mediaQueryList.addListener(update);
      return () => mediaQueryList.removeListener(update);
    }
  }, []);

  return !!isMobile;
}
