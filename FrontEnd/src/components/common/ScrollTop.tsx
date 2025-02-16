// ScrollToTop.js

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface ScrollToTopProps {
  children: ReactNode;
}

export default function ScrollToTop({ children }: ScrollToTopProps) {
  const { pathname, search } = useLocation();

  useEffect(() => {
    console.log("Scrolling to top");
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return <>{children}</>;
}
