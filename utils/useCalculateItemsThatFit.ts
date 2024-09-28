import { useEffect, useMemo, useState } from "react";

export function useCalculateElementsThatFit<Type>({
  elementRef,
  items,
  itemWidth,
}: {
  elementRef: HTMLDivElement | null;
  items: Type[];
  itemWidth: number;
}) {
  const [resizableElementWidth, setResizableElementWidth] = useState(0);

  useEffect(() => {
    if (elementRef) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setResizableElementWidth(entry.contentRect.width);
        }
      });
      resizeObserver.observe(elementRef);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [elementRef]);

  const visibleItems = useMemo(() => {
    const result = items.reduce<{ leftWidth: number; artists: Type[] }>(
      (previousValue, current) => {
        if (previousValue.leftWidth > itemWidth) {
          previousValue.artists.push(current);
          previousValue.leftWidth -= itemWidth;
        }
        return previousValue;
      },
      {
        leftWidth: resizableElementWidth,
        artists: [],
      }
    );
    return result.artists;
  }, [items, resizableElementWidth, itemWidth]);

  return visibleItems;
}
