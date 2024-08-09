import { useState } from "react";

export const useLocalStorage = (
  key: string,
  defaultValue: string
): [string, (newValue: string) => void] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return value.toString();
      } else {
        window.localStorage.setItem(key, defaultValue);
        return defaultValue;
      }
    } catch (e) {
      return defaultValue;
    }
  });

  const setValue = (newValue: string) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};
