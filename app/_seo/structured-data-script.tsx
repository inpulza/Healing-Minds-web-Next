import {
  serializeStructuredData,
  type StructuredDataGraph,
} from "./structured-data";

export default function StructuredDataScript({
  data,
}: {
  data: StructuredDataGraph;
}) {
  return (
    <script
      id="page-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeStructuredData(data) }}
    />
  );
}
