import {ClassConfig} from '../facetConfUtils'
const CLASSES: { [className: string]: ClassConfig } = {
  "http://dbpedia.org/ontology/WindMotor": {
    default: false,
    iri: "http://dbpedia.org/ontology/WindMotor",
    label: "Windturbine",
    facets: [
      "http://data.labs.pdok.nl/dataset/windstats/def#Ashoogte",
      "http://data.labs.pdok.nl/dataset/windstats/def#Diameter",
      "http://data.labs.pdok.nl/dataset/windstats/def#Fabrikant",
      "http://data.labs.pdok.nl/dataset/windstats/def#Productie",
      "http://data.labs.pdok.nl/dataset/windstats/def#Provincie",
      "http://data.labs.pdok.nl/dataset/windstats/def#Startjaar",
      "http://data.labs.pdok.nl/dataset/windstats/def#Type",
      "http://data.labs.pdok.nl/dataset/windstats/def#Vermogen",
      "http://data.labs.pdok.nl/dataset/windstats/def#Windpark"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o ; rdfs:label ?label .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        <${iri}> ?p ?o .
        optional { <${iri}> <http://data.labs.pdok.nl/dataset/windstats/def#Turbine> ?label . }
        optional { ?p rdfs:label ?pLabel . }
        optional { ?o rdfs:label ?oLabel . }
        optional {
          <${iri}> geo:hasGeometry ?geo .
          ?geo geo:asWKT ?wkt .
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  "http://bgt.basisregistraties.overheid.nl/def/bgt#Pand": {
    default: true,
    iri: "http://bgt.basisregistraties.overheid.nl/def/bgt#Pand",
    label: "Pand",
    facets: [
      "http://bgt.basisregistraties.overheid.nl/def/bgt#bronhouder",
      "http://bgt.basisregistraties.overheid.nl/def/bgt#eindRegistratie",
      "http://bgt.basisregistraties.overheid.nl/def/bgt#objectBegintijd",
      "http://bgt.basisregistraties.overheid.nl/def/bgt#objectEindtijd",
      "http://bgt.basisregistraties.overheid.nl/def/bgt#publicatiedatumLandelijkeVoorziening",
      "http://bgt.basisregistraties.overheid.nl/def/bgt#relatieveHoogteligging"
    //"http://bgt.basisregistraties.overheid.nl/def/bgt#status",
    //"http://bgt.basisregistraties.overheid.nl/def/bgt#tijdstipRegistratie"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o ;
                 bgt:bronhouder ?bronhouder ;
                 bgt:eindRegistratie ?eindRegistratie ;
                 bgt:inOnderzoek ?inOnderzoek ;
                 bgt:objectBegintijd ?objectBegintijd ;
                 bgt:publicatiedatumLandelijkeVoorziening ?publicatiedatum ;
                 bgt:tijdstipRegistratie ?tijdstipRegistratie ;
                 bgt:objectEindtijd ?objectEindtijd .
        ?bronhouder rdfs:label ?bronhouderLabel .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        {
          <${iri}> ?p ?o .
          optional { ?p rdfs:label ?pLabel . }
          optional { ?o rdfs:label ?oLabel . }
          optional {
            <${iri}> geo:hasGeometry ?geo .
            ?geo geo:asWKT ?wkt .
          }
        } union {
          <${iri}> foaf:isPrimaryTopicOf ?g .
          optional {
            ?g bgt:bronhouder ?bronhouder .
            ?bronhouder rdfs:label ?bronhouderLabel .
          }
          optional { ?g bgt:eindRegistratie ?eindRegistratie . }
          optional { ?g bgt:inOnderzoek ?inOnderzoek . }
          optional { ?g bgt:objectBegintijd ?objectBegintijd . }
          optional { ?g bgt:publicatiedatumLandelijkeVoorziening ?publicatiedatum . }
          optional { ?g bgt:tijdstipRegistratie ?tijdstipRegistratie . }
          optional { ?g bgt:objectEindtijd ?objectEindtijd . }
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  }
};
export default CLASSES
