import { notFound, redirect } from "next/navigation";
import { metadataForPath } from "./_seo/metadata";
import RootSlashSeoLinks from "./_seo/root-slash-links";
import SocialIdentityStructuredData from "./_seo/social-identity-structured-data";
import PublicPage from "./_routing/public-page";
import { resolvePublicRoute } from "./_routing/public-routes.mjs";

export const metadata = metadataForPath("/");

export default function HomePage() {
  const route = resolvePublicRoute("/");
  if (!route) notFound();
  if ("redirectTo" in route) redirect(route.redirectTo);
  if (!("page" in route)) notFound();

  return (
    <>
      <SocialIdentityStructuredData />
      <RootSlashSeoLinks includeCanonical />
      <PublicPage page={route.page} locale={route.locale} />
    </>
  );
}
