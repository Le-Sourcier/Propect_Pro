/**
 * Checks if a column is completely empty across all items
 * @param items Array of data items
 * @param key The column key to check
 * @returns Boolean indicating if the column is completely empty
 */
export const isColumnEmpty = (items: any[], key: string): boolean => {
  if (!items || items.length === 0) return true;

  // Handle nested properties like "siege.ville"
  if (key.includes(".")) {
    const [parent, child] = key.split(".");
    return items.every((item) => {
      const value = item[parent]?.[child];
      return value === undefined || value === null || value === "";
    });
  }

  // Handle regular properties
  return items.every((item) => {
    const value = item[key];
    return value === undefined || value === null || value === "";
  });
};

/**
 * Gets the value from an object given a possibly nested key
 * @param item The data item
 * @param key The key to access (may be nested with dot notation)
 * @returns The value at the given key or a dash if empty
 */
export const getValueByKey = (item: any, key: string): string => {
  let value;

  // Handle nested properties
  if (key.includes(".")) {
    const [parent, child] = key.split(".");
    value = item[parent]?.[child];
  } else {
    value = item[key];
  }

  // Return dash for empty values
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  // Convert numbers to strings with appropriate formatting
  if (typeof value === "number") {
    return value.toString();
  }

  return value;
};
