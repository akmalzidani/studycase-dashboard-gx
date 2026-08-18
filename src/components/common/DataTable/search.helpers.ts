export type SearchableValue = string | number | null | undefined;

export const matchesSearchKeyword = (
  values: SearchableValue[],
  keyword: string,
) =>
  values.some((value) =>
    String(value ?? "").toLowerCase().includes(keyword),
  );
