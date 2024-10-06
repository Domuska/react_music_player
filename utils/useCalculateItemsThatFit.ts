import { useEffect, useMemo, useState } from "react";

export function useCalculateElementsThatFit<Type>({
  containingElement,
  items,
  itemWidth,
  gutterWidth = 0,
}: {
  containingElement: HTMLDivElement | null;
  items: Type[];
  itemWidth: number;
  gutterWidth?: number;
}) {
  const [resizableElementWidth, setResizableElementWidth] = useState(0);

  useEffect(() => {
    if (containingElement) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setResizableElementWidth(entry.contentRect.width);
        }
      });
      resizeObserver.observe(containingElement);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [containingElement]);

  const visibleItems = useMemo(() => {
    const result = items.reduce<{ leftWidth: number; items: Type[] }>(
      (previousValue, current) => {
        const fits = previousValue.leftWidth - itemWidth > gutterWidth;

        if (fits) {
          previousValue.items.push(current);
          previousValue.leftWidth -= itemWidth;
        }
        return previousValue;
      },
      {
        leftWidth: resizableElementWidth,
        items: [],
      }
    );
    return result.items;
  }, [items, resizableElementWidth, itemWidth, gutterWidth]);

  return visibleItems;
}
