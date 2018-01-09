import {ClassConfig} from 'facetConfUtils'
const CLASSES: { [className: string]: ClassConfig } = {
  // brt:Provincie
  "http://brt.basisregistraties.overheid.nl/def/top10nl#Gebouw": {
    default: true,
    iri: "http://brt.basisregistraties.overheid.nl/def/top10nl#Gebouw",
    classToQueryPattern: (iri:string) => `GRAPH <http://somegraphthatdoesntexist> {?_r rdf:type <${iri}>}`,
    label: "Gebouw",
    facets: [
      "gebouwsoort",
      "http://brt.basisregistraties.overheid.nl/def/top10nl#status"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        <${iri}> ?p ?o .
        optional { ?p rdfs:label ?pLabel . }
        optional { ?o rdfs:label ?oLabel . }
        optional {
          <${iri}> geo:hasGeometry ?geo .
          ?geo geo:asWKT ?wkt .
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  // cbs:Gemeente
  "https://triply.cc/cbs/def/Gemeente": {
    default: false,
    iri: "https://triply.cc/cbs/def/Gemeente",
    label: "Gemeente",
    facets: [
      "https://cultureelerfgoed.nl/vocab/provincie",
      "krimpgebied",
      "https://triply.cc/cbs/def/stedelijkheid",
      "https://triply.cc/cbs/def/afstandCafé",
      //"https://triply.cc/cbs/def/antillianen",
      "https://triply.cc/cbs/def/attractieAfstand",
      "https://triply.cc/cbs/def/bedrijfsvestigingen",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenA",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenBF",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenGI",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenHJ",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenKL",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenMN",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenRU",
      //"https://triply.cc/cbs/def/bedrijfsmotorvoertuigen",
      "https://triply.cc/cbs/def/bevolkingsdichtheid",
      //"https://triply.cc/cbs/def/bibliotheek",
      //"https://triply.cc/cbs/def/bioscoopAfstand",
      "https://triply.cc/cbs/def/bouwklasse-1999",
      "https://triply.cc/cbs/def/bouwklasse2000+",
      "https://triply.cc/cbs/def/brandweer",
      //"https://triply.cc/cbs/def/buitenpolikliniekAfstand",
      "https://triply.cc/cbs/def/buitenschoolseopvangAfstand",
      //"https://triply.cc/cbs/def/cafetariumAfstand",
      //"https://triply.cc/cbs/def/ééngezinswoningen",
      //"https://triply.cc/cbs/def/éénpersoonsHuishoudens",
      //"https://triply.cc/cbs/def/geboorte",
      "https://triply.cc/cbs/def/geboortePercentage",
      "https://triply.cc/cbs/def/gehuwd",
      "https://triply.cc/cbs/def/gescheiden",
      //"https://triply.cc/cbs/def/hotelAfstand",
      //"https://triply.cc/cbs/def/huishoudenGrootte",
      //"https://triply.cc/cbs/def/huishoudens",
      "https://triply.cc/cbs/def/huishoudensMetKinderen",
      "https://triply.cc/cbs/def/huishoudensZonderKinderen",
      "https://triply.cc/cbs/def/ijsbaan",
      "https://triply.cc/cbs/def/inwoners",
      "https://triply.cc/cbs/def/inwoners0-14",
      "https://triply.cc/cbs/def/inwoners15-24",
      "https://triply.cc/cbs/def/inwoners25-44",
      "https://triply.cc/cbs/def/inwoners45-64",
      "https://triply.cc/cbs/def/inwoners65+",
      "https://triply.cc/cbs/def/kinderdagverblijfAfstand",
      "https://triply.cc/cbs/def/mannen",
      "https://triply.cc/cbs/def/mannen-procent",
      //"https://triply.cc/cbs/def/marokkanen",
      "https://triply.cc/cbs/def/meergezinswoningen",
      "https://triply.cc/cbs/def/motortweewielers",
      //"https://triply.cc/cbs/def/nietwesterseAllochtonen",
      //"https://triply.cc/cbs/def/omgevingsadressendichtheid",
      "https://triply.cc/cbs/def/ongehuwd",
      "https://triply.cc/cbs/def/oppervlakte",
      "https://triply.cc/cbs/def/oppervlakteLand",
      "https://triply.cc/cbs/def/oppervlakteWater",
      //"https://triply.cc/cbs/def/oprit",
      //"https://triply.cc/cbs/def/overigeNietwesterseAllochtonen",
      //"https://triply.cc/cbs/def/overigeWinkelsAfstand",
      //"https://triply.cc/cbs/def/overstapstation",
      //"https://triply.cc/cbs/def/personenautos",
      "https://triply.cc/cbs/def/personenautos0-5",
      "https://triply.cc/cbs/def/personenautos6+",
      //"https://triply.cc/cbs/def/personenautosBenzine",
      //"https://triply.cc/cbs/def/personenautosBrandstofOverig",
      //"https://triply.cc/cbs/def/personenautosNaarOppervlakte",
      //"https://triply.cc/cbs/def/personenautosPerHuishouden",
      //"https://triply.cc/cbs/def/restaurantAfstand",
      //"https://triply.cc/cbs/def/sauna",
      //"https://triply.cc/cbs/def/sterftePercentage",
      //"https://triply.cc/cbs/def/supermarktAfstand",
      //"https://triply.cc/cbs/def/surinamers",
      "https://triply.cc/cbs/def/treinstation",
      //"https://triply.cc/cbs/def/turken",
      //"https://triply.cc/cbs/def/verweduwd",
      "https://triply.cc/cbs/def/vrouwen",
      "https://triply.cc/cbs/def/vrouwen-procent",
      //"https://triply.cc/cbs/def/warenhuisAfstand",
      //"https://triply.cc/cbs/def/water",
      //"https://triply.cc/cbs/def/westerseAllochtonen",
      //"https://triply.cc/cbs/def/woningen",
      "https://triply.cc/cbs/def/woz",
      //"https://triply.cc/cbs/def/ziekenhuisAfstand",
      //"https://triply.cc/cbs/def/zonnebank",
      //"https://triply.cc/cbs/def/zwembad"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        graph <https://triply.cc/cbs/graph/2016> {
          <${iri}> ?p ?o .
          optional { ?p rdfs:label ?pLabel . }
          optional { ?o rdfs:label ?oLabel . }
          optional {
            <${iri}> geo:hasGeometry ?geo .
            ?geo geo:asWKT ?wkt .
          }
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  // cbs:Wijk
  "https://triply.cc/cbs/def/Wijk": {
    default: false,
    iri: "https://triply.cc/cbs/def/Wijk",
    label: "Wijk",
    facets: [
      "https://cultureelerfgoed.nl/vocab/provincie",
      "https://triply.cc/cbs/def/stedelijkheid",
      "https://triply.cc/cbs/def/afstandCafé",
      //"https://triply.cc/cbs/def/antillianen",
      "https://triply.cc/cbs/def/attractieAfstand",
      "https://triply.cc/cbs/def/bedrijfsvestigingen",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenA",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenBF",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenGI",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenHJ",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenKL",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenMN",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenRU",
      //"https://triply.cc/cbs/def/bedrijfsmotorvoertuigen",
      "https://triply.cc/cbs/def/bevolkingsdichtheid",
      //"https://triply.cc/cbs/def/bibliotheek",
      //"https://triply.cc/cbs/def/bioscoopAfstand",
      "https://triply.cc/cbs/def/bouwklasse-1999",
      "https://triply.cc/cbs/def/bouwklasse2000+",
      "https://triply.cc/cbs/def/brandweer",
      //"https://triply.cc/cbs/def/buitenpolikliniekAfstand",
      "https://triply.cc/cbs/def/buitenschoolseopvangAfstand",
      //"https://triply.cc/cbs/def/cafetariumAfstand",
      //"https://triply.cc/cbs/def/ééngezinswoningen",
      //"https://triply.cc/cbs/def/éénpersoonsHuishoudens",
      //"https://triply.cc/cbs/def/geboorte",
      "https://triply.cc/cbs/def/geboortePercentage",
      "https://triply.cc/cbs/def/gehuwd",
      "https://triply.cc/cbs/def/gescheiden",
      //"https://triply.cc/cbs/def/hotelAfstand",
      //"https://triply.cc/cbs/def/huishoudenGrootte",
      //"https://triply.cc/cbs/def/huishoudens",
      "https://triply.cc/cbs/def/huishoudensMetKinderen",
      "https://triply.cc/cbs/def/huishoudensZonderKinderen",
      "https://triply.cc/cbs/def/ijsbaan",
      "https://triply.cc/cbs/def/inwoners",
      "https://triply.cc/cbs/def/inwoners0-14",
      "https://triply.cc/cbs/def/inwoners15-24",
      "https://triply.cc/cbs/def/inwoners25-44",
      "https://triply.cc/cbs/def/inwoners45-64",
      "https://triply.cc/cbs/def/inwoners65+",
      "https://triply.cc/cbs/def/kinderdagverblijfAfstand",
      "https://triply.cc/cbs/def/mannen",
      //"https://triply.cc/cbs/def/marokkanen",
      "https://triply.cc/cbs/def/meergezinswoningen",
      "https://triply.cc/cbs/def/motortweewielers",
      //"https://triply.cc/cbs/def/nietwesterseAllochtonen",
      //"https://triply.cc/cbs/def/omgevingsadressendichtheid",
      "https://triply.cc/cbs/def/ongehuwd",
      "https://triply.cc/cbs/def/oppervlakte",
      "https://triply.cc/cbs/def/oppervlakteLand",
      "https://triply.cc/cbs/def/oppervlakteWater",
      //"https://triply.cc/cbs/def/oprit",
      //"https://triply.cc/cbs/def/overigeNietwesterseAllochtonen",
      //"https://triply.cc/cbs/def/overigeWinkelsAfstand",
      //"https://triply.cc/cbs/def/overstapstation",
      //"https://triply.cc/cbs/def/personenautos",
      "https://triply.cc/cbs/def/personenautos0-5",
      "https://triply.cc/cbs/def/personenautos6+",
      //"https://triply.cc/cbs/def/personenautosBenzine",
      //"https://triply.cc/cbs/def/personenautosBrandstofOverig",
      //"https://triply.cc/cbs/def/personenautosNaarOppervlakte",
      //"https://triply.cc/cbs/def/personenautosPerHuishouden",
      //"https://triply.cc/cbs/def/restaurantAfstand",
      //"https://triply.cc/cbs/def/sauna",
      //"https://triply.cc/cbs/def/sterftePercentage",
      //"https://triply.cc/cbs/def/supermarktAfstand",
      //"https://triply.cc/cbs/def/surinamers",
      "https://triply.cc/cbs/def/treinstation",
      //"https://triply.cc/cbs/def/turken",
      //"https://triply.cc/cbs/def/verweduwd",
      "https://triply.cc/cbs/def/vrouwen",
      //"https://triply.cc/cbs/def/warenhuisAfstand",
      //"https://triply.cc/cbs/def/water",
      //"https://triply.cc/cbs/def/westerseAllochtonen",
      //"https://triply.cc/cbs/def/woningen",
      "https://triply.cc/cbs/def/woz",
      //"https://triply.cc/cbs/def/ziekenhuisAfstand",
      //"https://triply.cc/cbs/def/zonnebank",
      //"https://triply.cc/cbs/def/zwembad"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        graph <https://triply.cc/cbs/graph/2016> {
          <${iri}> ?p ?o .
          optional { ?p rdfs:label ?pLabel . }
          optional { ?o rdfs:label ?oLabel . }
          optional {
            <${iri}> geo:hasGeometry ?geo .
            ?geo geo:asWKT ?wkt .
          }
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  // cbs:Buurt
  "https://triply.cc/cbs/def/Buurt": {
    default: false,
    iri: "https://triply.cc/cbs/def/Buurt",
    label: "Buurt",
    facets: [
      "https://cultureelerfgoed.nl/vocab/provincie",
      "https://triply.cc/cbs/def/stedelijkheid",
      "https://triply.cc/cbs/def/afstandCafé",
      //"https://triply.cc/cbs/def/antillianen",
      "https://triply.cc/cbs/def/attractieAfstand",
      "https://triply.cc/cbs/def/bedrijfsvestigingen",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenA",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenBF",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenGI",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenHJ",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenKL",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenMN",
      //"https://triply.cc/cbs/def/bedrijfsvestigingenRU",
      //"https://triply.cc/cbs/def/bedrijfsmotorvoertuigen",
      "https://triply.cc/cbs/def/bevolkingsdichtheid",
      //"https://triply.cc/cbs/def/bibliotheek",
      //"https://triply.cc/cbs/def/bioscoopAfstand",
      "https://triply.cc/cbs/def/bouwklasse-1999",
      "https://triply.cc/cbs/def/bouwklasse2000+",
      "https://triply.cc/cbs/def/brandweer",
      //"https://triply.cc/cbs/def/buitenpolikliniekAfstand",
      "https://triply.cc/cbs/def/buitenschoolseopvangAfstand",
      //"https://triply.cc/cbs/def/cafetariumAfstand",
      //"https://triply.cc/cbs/def/ééngezinswoningen",
      //"https://triply.cc/cbs/def/éénpersoonsHuishoudens",
      //"https://triply.cc/cbs/def/geboorte",
      "https://triply.cc/cbs/def/geboortePercentage",
      "https://triply.cc/cbs/def/gehuwd",
      "https://triply.cc/cbs/def/gescheiden",
      //"https://triply.cc/cbs/def/hotelAfstand",
      //"https://triply.cc/cbs/def/huishoudenGrootte",
      //"https://triply.cc/cbs/def/huishoudens",
      "https://triply.cc/cbs/def/huishoudensMetKinderen",
      "https://triply.cc/cbs/def/huishoudensZonderKinderen",
      //"https://triply.cc/cbs/def/ijsbaan",
      "https://triply.cc/cbs/def/inwoners",
      "https://triply.cc/cbs/def/inwoners0-14",
      "https://triply.cc/cbs/def/inwoners15-24",
      "https://triply.cc/cbs/def/inwoners25-44",
      "https://triply.cc/cbs/def/inwoners45-64",
      "https://triply.cc/cbs/def/inwoners65+",
      "https://triply.cc/cbs/def/kinderdagverblijfAfstand",
      "https://triply.cc/cbs/def/mannen",
      //"https://triply.cc/cbs/def/marokkanen",
      "https://triply.cc/cbs/def/meergezinswoningen",
      "https://triply.cc/cbs/def/motortweewielers",
      //"https://triply.cc/cbs/def/nietwesterseAllochtonen",
      //"https://triply.cc/cbs/def/omgevingsadressendichtheid",
      "https://triply.cc/cbs/def/ongehuwd",
      "https://triply.cc/cbs/def/oppervlakte",
      "https://triply.cc/cbs/def/oppervlakteLand",
      "https://triply.cc/cbs/def/oppervlakteWater",
      //"https://triply.cc/cbs/def/oprit",
      //"https://triply.cc/cbs/def/overigeNietwesterseAllochtonen",
      //"https://triply.cc/cbs/def/overigeWinkelsAfstand",
      //"https://triply.cc/cbs/def/overstapstation",
      //"https://triply.cc/cbs/def/personenautos",
      "https://triply.cc/cbs/def/personenautos0-5",
      "https://triply.cc/cbs/def/personenautos6+",
      //"https://triply.cc/cbs/def/personenautosBenzine",
      //"https://triply.cc/cbs/def/personenautosBrandstofOverig",
      //"https://triply.cc/cbs/def/personenautosNaarOppervlakte",
      //"https://triply.cc/cbs/def/personenautosPerHuishouden",
      //"https://triply.cc/cbs/def/restaurantAfstand",
      //"https://triply.cc/cbs/def/sauna",
      //"https://triply.cc/cbs/def/sterftePercentage",
      //"https://triply.cc/cbs/def/supermarktAfstand",
      //"https://triply.cc/cbs/def/surinamers",
      "https://triply.cc/cbs/def/treinstation",
      //"https://triply.cc/cbs/def/turken",
      //"https://triply.cc/cbs/def/verweduwd",
      "https://triply.cc/cbs/def/vrouwen",
      //"https://triply.cc/cbs/def/warenhuisAfstand",
      //"https://triply.cc/cbs/def/water",
      //"https://triply.cc/cbs/def/westerseAllochtonen",
      //"https://triply.cc/cbs/def/woningen",
      "https://triply.cc/cbs/def/woz",
      //"https://triply.cc/cbs/def/ziekenhuisAfstand",
      //"https://triply.cc/cbs/def/zonnebank",
      //"https://triply.cc/cbs/def/zwembad"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        graph <https://triply.cc/cbs/graph/2016> {
          <${iri}> ?p ?o
          optional { ?p rdfs:label ?pLabel . }
          optional { ?o rdfs:label ?oLabel . }
          optional {
            <${iri}> geo:hasGeometry ?geo .
            ?geo geo:asWKT ?wkt .
          }
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  // rce:Monument
  "https://cultureelerfgoed.nl/vocab/Monument": {
    default: false,
    iri: "https://cultureelerfgoed.nl/vocab/Monument",
    label: "Monument",
    facets: [
      //"https://cultureelerfgoed.nl/vocab/provincie",
      "https://cultureelerfgoed.nl/vocab/bouwjaar",
      "https://cultureelerfgoed.nl/vocab/monumentCode"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .
        ?geo geo:asWKT ?wkt .
        <${iri}> foaf:depiction ?img .
        ?img rce:locator ?url ; rdfs:label ?imgLabel .`
      var selectPattern = `
        <${iri}> ?p ?o .
        optional { ?p rdfs:label ?pLabel . }
        optional { ?o rdfs:label ?oLabel . }
        optional {
          ?img foaf:depicts <${iri}> ; rce:locator ?url .
          optional {
            ?img rce:fotograaf ?fotograaf ;
                 dct:created ?created ;
                 dct:description ?description .
            bind (concat("“",?description,"” (",
                         ?fotograaf,", ",?created,")") as ?imgLabel)
          }
        }
        optional {
          <${iri}> geo:hasGeometry ?geo .
          ?geo geo:asWKT ?wkt .
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  }
};
export default CLASSES
