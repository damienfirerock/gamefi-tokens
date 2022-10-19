import { useEffect, useRef } from "react";

const usePreviousNumberValue = (value: number) => {
  const ref = useRef(0);

  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePreviousNumberValue;
