export const TOPIC_INVENTORY_PAGE_SIZE = 200;

type TopicInventoryItem = {
  status: string;
};

type TopicInventoryPageLoader<T extends TopicInventoryItem> = (options: {
  status: "all";
  language: "en" | "es";
  limit: number;
  offset: number;
}) => Promise<T[]>;

export async function loadCompleteTopicInventory<T extends TopicInventoryItem>(
  language: "en" | "es",
  loadPage: TopicInventoryPageLoader<T>,
): Promise<T[]> {
  const posts: T[] = [];
  for (let offset = 0; ; offset += TOPIC_INVENTORY_PAGE_SIZE) {
    const page = await loadPage({
      status: "all",
      language,
      limit: TOPIC_INVENTORY_PAGE_SIZE,
      offset,
    });
    posts.push(...page);
    if (page.length < TOPIC_INVENTORY_PAGE_SIZE) break;
  }
  return posts.filter(post => post.status !== "rejected");
}
