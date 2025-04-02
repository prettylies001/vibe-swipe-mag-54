
import React, { useEffect, useRef } from "react";
import ContentCard from "./ContentCard";

interface Content {
  id: string;
  image: string;
  title: string;
  author: string;
  authorImage: string;
  category: string;
  height: number;
}

interface MasonryGridProps {
  items: Content[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ items }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to resizeAllGridItems
    const resizeGridItems = () => {
      const allItems = document.getElementsByClassName("masonry-item");
      for (let i = 0; i < allItems.length; i++) {
        resizeGridItem(allItems[i] as HTMLElement);
      }
    };

    // Function to resize a single grid item
    const resizeGridItem = (item: HTMLElement) => {
      const grid = gridRef.current;
      if (!grid) return;
      
      const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-row-gap"));
      const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-auto-rows"));
      
      const contentHeight = item.querySelector(".content")?.getBoundingClientRect().height;
      if (!contentHeight) return;
      
      const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = "span " + rowSpan;
    };

    // Initial resize
    resizeGridItems();

    // Add event listener for window resize
    window.addEventListener("resize", resizeGridItems);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeGridItems);
    };
  }, [items]);

  return (
    <div className="masonry-grid" ref={gridRef}>
      {items.map(item => (
        <div key={item.id} className="masonry-item">
          <div className="content">
            <ContentCard
              id={item.id}
              image={item.image}
              title={item.title}
              author={item.author}
              authorImage={item.authorImage}
              category={item.category}
              estimatedHeight={item.height}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
