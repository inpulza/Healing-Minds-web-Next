import type { LookupFunction } from "node:net";

export type PinnedBlogLinkAddress = {
  address: string;
  family: 4 | 6;
};

export function createPinnedBlogLinkLookup(
  resolved: PinnedBlogLinkAddress,
): LookupFunction {
  return (_hostname, options, callback) => {
    if (options.all) {
      callback(null, [{
        address: resolved.address,
        family: resolved.family,
      }]);
      return;
    }
    callback(null, resolved.address, resolved.family);
  };
}
