import { ClassConfig } from "@triply/facetcheck/build/src/facetConfUtils";
const CLASSES: ClassConfig[] = [
  // cbs:Gemeente_Geografisch
  {
    iri: "http://betalinkeddata.cbs.nl/def/cbs#Gemeente_Geografisch",
    label: "Gemeente",
    facets: [
      "bevolking_SearchTest",
      "bevolking_AantalInwoners",
      "bevolking_BurgerlijkeStaat_Gehuwd-percentage",
      "bevolking_BurgerlijkeStaat_Gescheiden-percentage",
      "bevolking_BurgerlijkeStaat_Ongehuwd-percentage",
      "bevolking_GeboorteEnSterfte_GeboorteRelatief",
      "bevolking_GeboorteEnSterfte_SterfteRelatief",
      "bevolking_Geslacht_Mannen-percentage",
      "bevolking_Geslacht_Vrouwen-percentage",
      "bevolking_Leeftijdsgroepen_0Tot15Jaar",
      "bevolking_Leeftijdsgroepen_15Tot25Jaar",
      "bevolking_Leeftijdsgroepen_25Tot45Jaar",
      "bevolking_Leeftijdsgroepen_45Tot65Jaar",
      "bevolking_Leeftijdsgroepen_65JaarOfOuder",
      "bevolking_ParticuliereHuishoudens_GemiddeldeHuishoudensgrootte", //-
      "bevolking_ParticuliereHuishoudens_HuishoudensTotaal",
      "bevolking_ParticuliereHuishoudens_Eenpersoonshuishoudens-percentage",
      "bevolking_ParticuliereHuishoudens_HuishoudensMetKinderen-percentage",
      "bevolking_ParticuliereHuishoudens_HuishoudensZonderKinderen-percentage"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        {
          <${iri}> ?p ?o .
          optional {
            <${iri}> geo:hasGeometry ?geo .
            ?geo geo:asWKT ?wkt .
          }
        } union {
          ?observation dimension:regio <${iri}> ; ?p ?o .
          ?p a qb:MeasureProperty
        }
        optional { ?p rdfs:label ?pLabel }
        optional { ?o rdfs:label ?oLabel }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  // cbs:Wijk
  {
    iri: "http://betalinkeddata.cbs.nl/def/cbs#Wijk",
    label: "Wijk",
    facets: [
      "bevolking_AantalInwoners",
      "bevolking_BurgerlijkeStaat_Gehuwd-percentage",
      "bevolking_BurgerlijkeStaat_Gescheiden-percentage",
      "bevolking_BurgerlijkeStaat_Ongehuwd-percentage",
      "bevolking_GeboorteEnSterfte_GeboorteRelatief",
      "bevolking_GeboorteEnSterfte_SterfteRelatief",
      "bevolking_Geslacht_Mannen-percentage",
      "bevolking_Geslacht_Vrouwen-percentage",
      "bevolking_Leeftijdsgroepen_0Tot15Jaar",
      "bevolking_Leeftijdsgroepen_15Tot25Jaar",
      "bevolking_Leeftijdsgroepen_25Tot45Jaar",
      "bevolking_Leeftijdsgroepen_45Tot65Jaar",
      "bevolking_Leeftijdsgroepen_65JaarOfOuder",
      "bevolking_ParticuliereHuishoudens_GemiddeldeHuishoudensgrootte", //-
      "bevolking_ParticuliereHuishoudens_HuishoudensTotaal",
      "bevolking_ParticuliereHuishoudens_Eenpersoonshuishoudens-percentage",
      "bevolking_ParticuliereHuishoudens_HuishoudensMetKinderen-percentage",
      "bevolking_ParticuliereHuishoudens_HuishoudensZonderKinderen-percentage"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        {
          <${iri}> ?p ?o .
          optional {
            <${iri}> geo:hasGeometry ?geo .
            ?geo geo:asWKT ?wkt .
          }
        } union {
          ?observation dimension:regio <${iri}> ; ?p ?o .
          ?p a qb:MeasureProperty
        }
        optional { ?p rdfs:label ?pLabel }
        optional { ?o rdfs:label ?oLabel }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  // cbs:Buurt
  {
    iri: "http://betalinkeddata.cbs.nl/def/cbs#Buurt",
    label: "Buurt",
    facets: [
      "bevolking_AantalInwoners",
      "bevolking_BurgerlijkeStaat_Gehuwd-percentage",
      "bevolking_BurgerlijkeStaat_Gescheiden-percentage",
      "bevolking_BurgerlijkeStaat_Ongehuwd-percentage",
      "bevolking_GeboorteEnSterfte_GeboorteRelatief",
      "bevolking_GeboorteEnSterfte_SterfteRelatief",
      "bevolking_Geslacht_Mannen-percentage",
      "bevolking_Geslacht_Vrouwen-percentage",
      "bevolking_Leeftijdsgroepen_0Tot15Jaar",
      "bevolking_Leeftijdsgroepen_15Tot25Jaar",
      "bevolking_Leeftijdsgroepen_25Tot45Jaar",
      "bevolking_Leeftijdsgroepen_45Tot65Jaar",
      "bevolking_Leeftijdsgroepen_65JaarOfOuder",
      "bevolking_ParticuliereHuishoudens_GemiddeldeHuishoudensgrootte", //-
      "bevolking_ParticuliereHuishoudens_HuishoudensTotaal",
      "bevolking_ParticuliereHuishoudens_Eenpersoonshuishoudens-percentage",
      "bevolking_ParticuliereHuishoudens_HuishoudensMetKinderen-percentage",
      "bevolking_ParticuliereHuishoudens_HuishoudensZonderKinderen-percentage"
    ],
    classToQueryPattern: (iri: string) => `?_r rdf:type <${iri}> .`,
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        {
          <${iri}> ?p ?o .
          optional {
            <${iri}> geo:hasGeometry ?geo .
            ?geo geo:asWKT ?wkt .
          }
        } union {
          ?observation dimension:regio <${iri}> ; ?p ?o .
          ?p a qb:MeasureProperty
        }
        optional { ?p rdfs:label ?pLabel }
        optional { ?o rdfs:label ?oLabel }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  }
];
export default CLASSES;
