type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, boolean>;

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  for (const input of inputs) {
    if (typeof input === 'string' && input) {
      classes.push(input);
    } else if (typeof input === 'number' && input) {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else if (typeof input === 'object' && input !== null) {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  
  return classes.join(' ');
}

