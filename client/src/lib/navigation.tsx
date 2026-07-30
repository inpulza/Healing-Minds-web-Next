"use client";

import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export type NavigateOptions = { replace?: boolean };

type CompatLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: NextLinkProps["href"];
  children?: ReactNode;
};

export function Link({ href, children, ...props }: CompatLinkProps) {
  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  );
}

export function useLocation(): [string, (to: string, options?: NavigateOptions) => void] {
  const pathname = usePathname() || "/";
  const router = useRouter();

  const navigate = (to: string, options?: NavigateOptions) => {
    if (options?.replace) router.replace(to);
    else router.push(to);
  };

  return [pathname, navigate];
}

export function useRoute<T extends Record<string, string> = Record<string, string>>(
  pattern: string,
): [boolean, T | null] {
  const pathname = usePathname() || "/";
  const routeParams = useParams();
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);

  if (patternParts.length !== pathParts.length) return [false, null];

  const params: Record<string, string> = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const expected = patternParts[index];
    const actual = pathParts[index];
    if (expected.startsWith(":")) params[expected.slice(1)] = actual;
    else if (expected !== actual) return [false, null];
  }

  // Prefer the values decoded by Next when they correspond to this route.
  for (const [key, value] of Object.entries(routeParams)) {
    if (typeof value === "string" && key in params) params[key] = value;
  }

  return [true, params as T];
}
