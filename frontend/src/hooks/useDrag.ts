import { useEffect, useRef, useState } from "react";

function useDrag<T extends HTMLElement>() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [onDrop, setOnDrop] = useState<DragEvent>();
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const onDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setOnDrop(e);
    };

    if (node) {
      node.addEventListener("dragover", onDragOver);
      node.addEventListener("dragenter", onDragEnter);
      node.addEventListener("dragleave", onDragLeave);
      node.addEventListener("drop", onDrop);
    }
    return () => {
      node?.removeEventListener("dragover", onDragOver);
      node?.removeEventListener("dragenter", onDragEnter);
      node?.removeEventListener("dragleave", onDragLeave);
      node?.removeEventListener("drop", onDrop);
    };
  }, [ref]);

  return { isDragging, ref, onDrop };
}

export default useDrag;
