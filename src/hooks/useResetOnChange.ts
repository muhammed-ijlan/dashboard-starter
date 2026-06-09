import { useState } from "react";

export function useResetOnChange<T>(value: T, onChange: () => void): void {
  const [prev, setPrev] = useState(value);
  if (prev !== value) {
    setPrev(value);
    onChange();
  }
}
