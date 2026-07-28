import { createHash } from "node:crypto";
import { isIP } from "node:net";
import {
  BLOG_LINK_BLOCKED_INTERNAL_PREFIXES,
  BLOG_LINK_TRACKING_PARAMETER_NAMES,
  createBlogLinkConfig,
  type BlogLinkKind,
} from "./config";

export type BlogLinkNormalizationErrorCode =
  | "empty_href"
  | "protocol_relative"
  | "invalid_url"
  | "invalid_protocol"
  | "credentials_not_allowed"
  | "external_https_required"
  | "port_not_allowed"
  | "private_or_reserved_host"
  | "invalid_path_encoding"
  | "non_public_internal_path"
  | "internal_asset_path";

export class BlogLinkNormalizationError extends Error {
  readonly code: BlogLinkNormalizationErrorCode;

  constructor(code: BlogLinkNormalizationErrorCode, message: string) {
    super(message);
    this.name = "BlogLinkNormalizationError";
    this.code = code;
  }
}

export type NormalizeBlogLinkOptions = {
  publicSiteUrl?: string;
  additionalPublicHosts?: readonly string[];
};

export type NormalizedBlogLinkHref = {
  kind: BlogLinkKind;
  normalizedHref: string;
  displayHref: string;
  host: string;
};

const INTERNAL_ASSET_EXTENSION = /\.(?:avif|css|eot|gif|ico|jpe?g|js|json|map|mjs|mp3|mp4|pdf|png|svg|ttf|txt|wav|webm|webp|woff2?|xml|zip)$/i;

function stripTrailingDot(value: string): string {
  return value.toLowerCase().replace(/\.$/, "");
}

function normalizePathTrailingSlash(pathname: string): string {
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function parseIpv4Words(value: string): number[] | null {
  const parts = value.split(".");
  if (parts.length !== 4) return null;
  const words = parts.map(part => Number(part));
  return words.every(word => Number.isInteger(word) && word >= 0 && word <= 255)
    ? words
    : null;
}

function isForbiddenIpv4(value: string): boolean {
  const words = parseIpv4Words(value);
  if (!words) return true;
  const [a, b] = words;

  return (
    a === 0
    || a === 10
    || a === 127
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 0)
    || (a === 192 && b === 88 && words[2] === 99)
    || (a === 192 && b === 168)
    || (a === 198 && (b === 18 || b === 19))
    || (a === 198 && b === 51 && words[2] === 100)
    || (a === 203 && b === 0 && words[2] === 113)
    || a >= 224
  );
}

function ipv4ToHextets(value: string): [string, string] | null {
  const words = parseIpv4Words(value);
  if (!words) return null;
  return [
    ((words[0] << 8) | words[1]).toString(16),
    ((words[2] << 8) | words[3]).toString(16),
  ];
}

function parseIpv6Words(value: string): number[] | null {
  const withoutBrackets = value.replace(/^\[/, "").replace(/\]$/, "").toLowerCase();
  if (withoutBrackets.includes("%")) return null;

  let normalized = withoutBrackets;
  const lastColon = normalized.lastIndexOf(":");
  const possibleIpv4 = normalized.slice(lastColon + 1);
  if (possibleIpv4.includes(".")) {
    const converted = ipv4ToHextets(possibleIpv4);
    if (!converted) return null;
    normalized = `${normalized.slice(0, lastColon)}:${converted[0]}:${converted[1]}`;
  }

  const halves = normalized.split("::");
  if (halves.length > 2) return null;
  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const missing = 8 - left.length - right.length;
  if ((halves.length === 1 && missing !== 0) || (halves.length === 2 && missing < 1)) {
    return null;
  }

  const parts = halves.length === 2
    ? [...left, ...Array.from({ length: missing }, () => "0"), ...right]
    : left;
  if (parts.length !== 8 || parts.some(part => !/^[0-9a-f]{1,4}$/.test(part))) {
    return null;
  }
  return parts.map(part => Number.parseInt(part, 16));
}

function isForbiddenIpv6(value: string): boolean {
  const words = parseIpv6Words(value);
  if (!words) return true;

  const allZero = words.every(word => word === 0);
  const loopback = words.slice(0, 7).every(word => word === 0) && words[7] === 1;
  const uniqueLocal = (words[0] & 0xfe00) === 0xfc00;
  const linkLocal = (words[0] & 0xffc0) === 0xfe80;
  const deprecatedSiteLocal = (words[0] & 0xffc0) === 0xfec0;
  const multicast = (words[0] & 0xff00) === 0xff00;
  const documentation = words[0] === 0x2001 && words[1] === 0x0db8;
  const benchmarking = words[0] === 0x2001 && words[1] === 0x0002;
  const teredo = words[0] === 0x2001 && words[1] === 0;
  const discardOnly = words[0] === 0x0100
    && words.slice(1, 4).every(word => word === 0);
  const ipv4Mapped = words.slice(0, 5).every(word => word === 0) && words[5] === 0xffff;
  const ipv4Compatible = words.slice(0, 6).every(word => word === 0);
  const ipv4Translated = words.slice(0, 4).every(word => word === 0)
    && words[4] === 0xffff
    && words[5] === 0;
  const nat64WellKnown = words[0] === 0x0064
    && words[1] === 0xff9b
    && words.slice(2, 6).every(word => word === 0);
  const nat64LocalUse = words[0] === 0x0064
    && words[1] === 0xff9b
    && words[2] === 0x0001;
  const sixToFour = words[0] === 0x2002;
  const isatap = (words[4] === 0 || words[4] === 0x0200)
    && words[5] === 0x5efe;

  if (nat64WellKnown || nat64LocalUse) return true;
  if (ipv4Mapped || ipv4Compatible || ipv4Translated || isatap) {
    const mapped = [
      words[6] >> 8,
      words[6] & 0xff,
      words[7] >> 8,
      words[7] & 0xff,
    ].join(".");
    return isForbiddenIpv4(mapped);
  }
  if (sixToFour) {
    const embedded = [
      words[1] >> 8,
      words[1] & 0xff,
      words[2] >> 8,
      words[2] & 0xff,
    ].join(".");
    return isForbiddenIpv4(embedded);
  }

  return (
    allZero
    || loopback
    || uniqueLocal
    || linkLocal
    || deprecatedSiteLocal
    || multicast
    || documentation
    || benchmarking
    || teredo
    || discardOnly
  );
}

export function isForbiddenExternalHostname(rawHostname: string): boolean {
  const hostname = stripTrailingDot(rawHostname.replace(/^\[/, "").replace(/\]$/, ""));
  if (
    hostname === "localhost"
    || hostname.endsWith(".localhost")
    || hostname.endsWith(".local")
    || hostname.endsWith(".internal")
    || hostname === "metadata"
    || hostname === "metadata.google.internal"
  ) {
    return true;
  }

  const ipVersion = isIP(hostname);
  if (ipVersion === 4) return isForbiddenIpv4(hostname);
  if (ipVersion === 6) return isForbiddenIpv6(hostname);
  return false;
}

function parseUrl(value: string, base?: string): URL {
  try {
    return base ? new URL(value, base) : new URL(value);
  } catch {
    throw new BlogLinkNormalizationError("invalid_url", "Link target is not a valid URL");
  }
}

function assertNoCredentials(url: URL): void {
  if (url.username || url.password) {
    throw new BlogLinkNormalizationError(
      "credentials_not_allowed",
      "Link target cannot contain URL credentials",
    );
  }
}

function normalizeInternalTarget(url: URL, canonicalHost: string): NormalizedBlogLinkHref {
  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(url.pathname);
  } catch {
    throw new BlogLinkNormalizationError(
      "invalid_path_encoding",
      "Internal link path contains invalid percent encoding",
    );
  }

  const normalizedDecoded = normalizePathTrailingSlash(decodedPath.replace(/\/{2,}/g, "/"));
  const lowerPath = normalizedDecoded.toLowerCase();
  if (
    BLOG_LINK_BLOCKED_INTERNAL_PREFIXES.some(prefix => (
      lowerPath === prefix || lowerPath.startsWith(`${prefix}/`)
    ))
  ) {
    throw new BlogLinkNormalizationError(
      "non_public_internal_path",
      "Internal link points to a non-public application path",
    );
  }
  if (INTERNAL_ASSET_EXTENSION.test(lowerPath)) {
    throw new BlogLinkNormalizationError(
      "internal_asset_path",
      "Internal link points to an asset rather than a public page",
    );
  }

  const normalizedHref = normalizePathTrailingSlash(url.pathname.replace(/\/{2,}/g, "/"));
  return {
    kind: "internal",
    normalizedHref,
    displayHref: normalizedHref,
    host: canonicalHost,
  };
}

function isTrackingParameter(name: string): boolean {
  const normalized = name.toLowerCase();
  return normalized.startsWith("utm_") || BLOG_LINK_TRACKING_PARAMETER_NAMES.has(normalized);
}

function normalizeExternalTarget(url: URL, allowedPorts: readonly string[]): NormalizedBlogLinkHref {
  if (url.protocol !== "https:") {
    throw new BlogLinkNormalizationError(
      "external_https_required",
      "Managed external links must use HTTPS",
    );
  }
  if (!allowedPorts.includes(url.port)) {
    throw new BlogLinkNormalizationError(
      "port_not_allowed",
      "External links may use only ports 80 and 443",
    );
  }

  const hostname = stripTrailingDot(url.hostname);
  if (isForbiddenExternalHostname(hostname)) {
    throw new BlogLinkNormalizationError(
      "private_or_reserved_host",
      "External link host is private, local, metadata, documentation, or reserved",
    );
  }

  for (const key of Array.from(url.searchParams.keys())) {
    if (isTrackingParameter(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  url.hash = "";
  url.hostname = hostname;
  url.pathname = normalizePathTrailingSlash(url.pathname.replace(/\/{2,}/g, "/"));

  const normalizedHref = url.toString();
  return {
    kind: "external",
    normalizedHref,
    displayHref: normalizedHref,
    host: hostname,
  };
}

export function normalizeBlogLinkHref(
  rawHref: string,
  options: NormalizeBlogLinkOptions = {},
): NormalizedBlogLinkHref {
  const href = rawHref.trim();
  if (!href) {
    throw new BlogLinkNormalizationError("empty_href", "Link target is empty");
  }
  if (href.startsWith("//")) {
    throw new BlogLinkNormalizationError(
      "protocol_relative",
      "Protocol-relative links are not managed targets",
    );
  }

  const config = createBlogLinkConfig({
    publicSiteUrl: options.publicSiteUrl,
    additionalPublicHosts: options.additionalPublicHosts,
  });
  const publicUrl = new URL(config.publicSiteUrl);

  if (href.startsWith("/")) {
    const internalUrl = parseUrl(href, config.publicSiteUrl);
    return normalizeInternalTarget(internalUrl, publicUrl.hostname.toLowerCase());
  }

  const url = parseUrl(href);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new BlogLinkNormalizationError(
      "invalid_protocol",
      "Link target must use an internal path, HTTP, or HTTPS",
    );
  }
  assertNoCredentials(url);

  const hostname = stripTrailingDot(url.hostname);
  if (config.publicHosts.includes(hostname)) {
    if (url.port && url.port !== publicUrl.port) {
      throw new BlogLinkNormalizationError(
        "port_not_allowed",
        "Same-site link uses an unexpected port",
      );
    }
    return normalizeInternalTarget(url, publicUrl.hostname.toLowerCase());
  }

  return normalizeExternalTarget(url, config.allowedExternalPorts);
}

export function tryNormalizeBlogLinkHref(
  rawHref: string,
  options: NormalizeBlogLinkOptions = {},
): NormalizedBlogLinkHref | null {
  try {
    return normalizeBlogLinkHref(rawHref, options);
  } catch {
    return null;
  }
}

export function createCanonicalBlogLinkKey(normalizedHref: string): string {
  return createHash("sha256").update(normalizedHref, "utf8").digest("hex");
}

export function rememberCrossDomainBlogLinkRedirect(
  crossDomainSeen: boolean,
  fromUrl: URL,
  toUrl: URL,
): boolean {
  return crossDomainSeen
    || stripTrailingDot(fromUrl.hostname) !== stripTrailingDot(toUrl.hostname);
}

export function normalizeBlogLinkSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
