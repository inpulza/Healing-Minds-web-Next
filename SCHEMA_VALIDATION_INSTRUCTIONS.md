# Structured-data validation notice

This file previously documented an early legacy schema experiment. Its claims about self-controlled review stars, expandable FAQ results, medical rich results and guaranteed Search Console enhancements are obsolete and must not be used as implementation or validation guidance.

Use the current, route-owned methodology instead:

- [`docs/STRUCTURED_DATA_AEO_LOCAL_SEO_PLAYBOOK.md`](docs/STRUCTURED_DATA_AEO_LOCAL_SEO_PLAYBOOK.md)
- [`_arnes/evidencia/HM-WEB-02-STRUCTURED-DATA-AEO-2026-08-20.md`](_arnes/evidencia/HM-WEB-02-STRUCTURED-DATA-AEO-2026-08-20.md)

Current policy:

- validate raw server HTML and every public route, not only the hydrated home page;
- use Schema.org Validator for vocabulary and graph integrity;
- use Google Rich Results Test only for result types currently supported by Google;
- keep `FAQPage` only when it matches visible initial HTML, without claiming a Google FAQ rich result;
- do not publish self-serving `Review` or `AggregateRating` markup for the practice;
- do not promise rankings, stars, FAQ expandables, local panels or knowledge panels from valid markup.

Authoritative references:

- https://developers.google.com/search/updates
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- https://schema.org/FAQPage

Git history preserves the original document for historical investigation.
