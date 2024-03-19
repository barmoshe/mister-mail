import { useEffect, useRef } from "react";

export function useEffectOnChange(effect, dependencies) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    return effect();
  }, dependencies);
}
