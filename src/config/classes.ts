import { ClassConfig } from "@triply/facetcheck/build/src/facetConfUtils";
const CLASSES: ClassConfig[] = [
  {
    iri: "http://dbeerpedia.com/def#Beer",
    label: "🍺 Bier",
    facets: [
      "http://dbeerpedia.com/def#style",
      "http://dbeerpedia.com/def#alcoholpercentage",
      "http://dbeerpedia.com/def#minSchenkTemperatuur",
      "http://dbeerpedia.com/def#maxSchenkTemperatuur",
      "http://dbeerpedia.com/def#stamwortgehalte",
      "pdok-approved"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}>
          ?p ?o ;
          dct:description ?description .`;
      var selectPattern = `
        graph <https://data.pdok.nl/bier> {
          <${iri}> ?p ?o .
          optional {
            <${iri}> dbeerpedia:description ?description
          }
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  {
    iri: "http://schema.org/Brewery",
    label: "🏭 Brouwerij",
    facets: [
      "http://dbeerpedia.com/def#provincie",
      "http://dbeerpedia.com/def#categorie",
      "http://dbeerpedia.com/def#opgericht"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}>
          ?p ?o ;
          geo:hasGeometry <${iri}-1> ;
          rdfs:label ?label .
        <${iri}-1> geo:asWKT ?wkt .`;
      var selectPattern = `
        <${iri}>
          ?p ?o ;
          schema:address ?address ;
          schema:name ?label .
        optional{
          ?address
            schema:latitude ?lat ;
            schema:longitude ?long .
        }
        bind(strdt(concat('Point(',str(?long),' ',str(?lat),')'),geo:wktLiteral) as ?wkt)`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  }
];
export default CLASSES;
