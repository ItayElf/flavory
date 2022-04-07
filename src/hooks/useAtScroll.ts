import { useEffect } from "react";

export default function useAtScroll(
  func: () => Promise<void>,
  finished: boolean
) {
  useEffect(() => {
    const scrollingFunction = async () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 10
      ) {
        await func;
        window.removeEventListener("scroll", scrollingFunction);
      }
    };
    if (!finished) {
      window.addEventListener("scroll", scrollingFunction);
    }
    return () => {
      window.removeEventListener("scroll", scrollingFunction);
    };
  }, [func, finished]);
}
