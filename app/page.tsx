import { notFound, redirect } from "next/navigation";
import { getFrozenSeo, metadataForPath } from "./_seo/metadata";
import RootSlashSeoLinks from "./_seo/root-slash-links";
import { buildStaticStructuredData } from "./_seo/structured-data";
import StructuredDataScript from "./_seo/structured-data-script";
import PublicPage from "./_routing/public-page";
import { resolvePublicRoute } from "./_routing/public-routes.mjs";

export const metadata = metadataForPath("/");

export default function HomePage() {
  const route = resolvePublicRoute("/");
  if (!route) notFound();
  if ("redirectTo" in route) redirect(route.redirectTo);
  if (!("page" in route)) notFound();
  const seo = getFrozenSeo("/");

  return (
    <>
      <StructuredDataScript
        data={buildStaticStructuredData({
          pathname: "/",
          pageName: route.page,
          title: seo?.title || "Healing Minds Psychiatry",
          description: seo?.description,
        })}
      />
      <RootSlashSeoLinks includeCanonical />
      <PublicPage page={route.page} locale={route.locale} />
    </>
  );
}
