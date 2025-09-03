import type { ReviewsResponse } from '@shared/schema';

interface CacheEntry {
  data: ReviewsResponse;
  timestamp: number;
  expiresAt: number;
}

export class ReviewsCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly cacheDuration = 30 * 60 * 1000; // 30 minutes in milliseconds

  set(key: string, data: ReviewsResponse): void {
    const now = Date.now();
    const entry: CacheEntry = {
      data,
      timestamp: now,
      expiresAt: now + this.cacheDuration,
    };
    
    this.cache.set(key, entry);
    console.log(`📝 Reviews cache: Stored data for key "${key}"`);
  }

  get(key: string): ReviewsResponse | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      console.log(`❌ Reviews cache: Cache miss for key "${key}"`);
      return null;
    }

    const now = Date.now();
    
    if (now > entry.expiresAt) {
      console.log(`⏰ Reviews cache: Cache expired for key "${key}"`);
      this.cache.delete(key);
      return null;
    }

    console.log(`✅ Reviews cache: Cache hit for key "${key}"`);
    return entry.data;
  }

  clear(): void {
    this.cache.clear();
    console.log(`🗑️  Reviews cache: Cache cleared`);
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  size(): number {
    return this.cache.size;
  }

  getCacheStats(): { size: number; keys: string[]; oldestEntry?: number } {
    const keys = Array.from(this.cache.keys());
    const entries = Array.from(this.cache.values());
    const oldestEntry = entries.length > 0 
      ? Math.min(...entries.map(e => e.timestamp))
      : undefined;

    return {
      size: this.cache.size,
      keys,
      oldestEntry,
    };
  }
}

// Singleton instance
export const reviewsCache = new ReviewsCache();