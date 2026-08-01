export const TOPIC_PROVIDER_INVENTORY_POST_LIMIT = 40;
export const TOPIC_PROVIDER_JUDGE_POST_LIMIT = 40;

export function takeBoundedProviderInventory<T>(items: T[]): T[] {
  return items.slice(0, TOPIC_PROVIDER_INVENTORY_POST_LIMIT);
}

export function selectBoundedProviderItems<T>(
  items: T[],
  priorityKeys: Array<string | number>,
  keyOf: (item: T) => string | number,
  limit = TOPIC_PROVIDER_JUDGE_POST_LIMIT,
): T[] {
  const byKey = new Map(items.map(item => [keyOf(item), item]));
  const selected: T[] = [];
  const selectedKeys = new Set<string | number>();
  const add = (item: T | undefined) => {
    if (!item || selected.length >= limit) return;
    const key = keyOf(item);
    if (selectedKeys.has(key)) return;
    selectedKeys.add(key);
    selected.push(item);
  };

  for (const key of priorityKeys) add(byKey.get(key));
  for (const item of items) add(item);
  return selected;
}

export function getMissingProviderDimensions<T extends string>(
  dimensions: readonly T[],
  completeCounts: Record<string, number>,
): T[] {
  return dimensions.filter(dimension => (completeCounts[dimension] || 0) === 0);
}
