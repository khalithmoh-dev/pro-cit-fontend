export const sanitizePayload = (
  oPayload: Record<string, any> = {},
  aSanitizeKeys: string[] = []
): Record<string, any> => {
  const sanitized: Record<string, any> = {};

  for (const key in oPayload) {
    if (!Object.prototype.hasOwnProperty.call(oPayload, key)) continue;

    const value = oPayload[key];

    // Skip (delete) if key is in sanitize list OR value is "" or undefined
    if (aSanitizeKeys.includes(key) || value === "" || value === undefined) {
      continue;
    }

    sanitized[key] = value;
  }

  return sanitized;
};
