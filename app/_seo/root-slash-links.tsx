export default function RootSlashSeoLinks({
  includeCanonical = false,
}: {
  includeCanonical?: boolean;
}) {
  return (
    <>
      {includeCanonical && (
        <>
          <link rel="canonical" href="https://www.healingmindsp.com/" />
          <meta property="og:url" content="https://www.healingmindsp.com/" />
        </>
      )}
      <link rel="alternate" hrefLang="en" href="https://www.healingmindsp.com/" />
      <link rel="alternate" hrefLang="es" href="https://www.healingmindsp.com/es" />
      <link rel="alternate" hrefLang="x-default" href="https://www.healingmindsp.com/" />
    </>
  );
}
