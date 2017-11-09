import {ClassConfig} from 'facetConfUtils'
const CLASSES: { [className: string]: ClassConfig } = {
  // cbs:Gemeente
  "https://data.pdok.nl/cbs/vocab/Gemeente": {
    default: true,
    iri: "https://data.pdok.nl/cbs/vocab/Gemeente",
    label: "Gemeente",
    facets: [
      "https://cultureelerfgoed.nl/vocab/provincie",
      "krimpgebied",
      "https://data.pdok.nl/cbs/vocab/stedelijkheid",
      //"https://data.pdok.nl/cbs/vocab/afstandCafé",
      "https://data.pdok.nl/cbs/vocab/antillianen",
      "https://data.pdok.nl/cbs/vocab/attractieAfstand",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingen",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenA",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenBF",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenGI",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenHJ",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenKL",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenMN",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenRU",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsmotorvoertuigen",
      "https://data.pdok.nl/cbs/vocab/bevolkingsdichtheid",
      //"https://data.pdok.nl/cbs/vocab/bibliotheek",
      //"https://data.pdok.nl/cbs/vocab/bioscoopAfstand",
      "https://data.pdok.nl/cbs/vocab/bouwklasse-1999",
      "https://data.pdok.nl/cbs/vocab/bouwklasse2000+",
      "https://data.pdok.nl/cbs/vocab/brandweer",
      //"https://data.pdok.nl/cbs/vocab/buitenpolikliniekAfstand",
      "https://data.pdok.nl/cbs/vocab/buitenschoolseopvangAfstand",
      //"https://data.pdok.nl/cbs/vocab/cafetariumAfstand",
      //"https://data.pdok.nl/cbs/vocab/ééngezinswoningen",
      //"https://data.pdok.nl/cbs/vocab/éénpersoonsHuishoudens",
      //"https://data.pdok.nl/cbs/vocab/geboorte",
      "https://data.pdok.nl/cbs/vocab/geboortePercentage",
      "https://data.pdok.nl/cbs/vocab/gehuwd",
      "https://data.pdok.nl/cbs/vocab/gescheiden",
      //"https://data.pdok.nl/cbs/vocab/hotelAfstand",
      //"https://data.pdok.nl/cbs/vocab/huishoudenGrootte",
      //"https://data.pdok.nl/cbs/vocab/huishoudens",
      "https://data.pdok.nl/cbs/vocab/huishoudensMetKinderen",
      "https://data.pdok.nl/cbs/vocab/huishoudensZonderKinderen",
      //"https://data.pdok.nl/cbs/vocab/ijsbaan",
      "https://data.pdok.nl/cbs/vocab/inwoners",
      "https://data.pdok.nl/cbs/vocab/inwoners0-14",
      "https://data.pdok.nl/cbs/vocab/inwoners15-24",
      "https://data.pdok.nl/cbs/vocab/inwoners25-44",
      "https://data.pdok.nl/cbs/vocab/inwoners45-64",
      "https://data.pdok.nl/cbs/vocab/inwoners65+",
      "https://data.pdok.nl/cbs/vocab/kinderdagverblijfAfstand",
      "https://data.pdok.nl/cbs/vocab/mannen",
      "https://data.pdok.nl/cbs/vocab/mannen-procent",
      //"https://data.pdok.nl/cbs/vocab/marokkanen",
      "https://data.pdok.nl/cbs/vocab/meergezinswoningen",
      "https://data.pdok.nl/cbs/vocab/motortweewielers",
      //"https://data.pdok.nl/cbs/vocab/nietwesterseAllochtonen",
      //"https://data.pdok.nl/cbs/vocab/omgevingsadressendichtheid",
      "https://data.pdok.nl/cbs/vocab/ongehuwd",
      "https://data.pdok.nl/cbs/vocab/oppervlakte",
      "https://data.pdok.nl/cbs/vocab/oppervlakteLand",
      "https://data.pdok.nl/cbs/vocab/oppervlakteWater",
      //"https://data.pdok.nl/cbs/vocab/oprit",
      //"https://data.pdok.nl/cbs/vocab/overigeNietwesterseAllochtonen",
      //"https://data.pdok.nl/cbs/vocab/overigeWinkelsAfstand",
      //"https://data.pdok.nl/cbs/vocab/overstapstation",
      //"https://data.pdok.nl/cbs/vocab/personenautos",
      "https://data.pdok.nl/cbs/vocab/personenautos0-5",
      "https://data.pdok.nl/cbs/vocab/personenautos6+",
      //"https://data.pdok.nl/cbs/vocab/personenautosBenzine",
      //"https://data.pdok.nl/cbs/vocab/personenautosBrandstofOverig",
      //"https://data.pdok.nl/cbs/vocab/personenautosNaarOppervlakte",
      //"https://data.pdok.nl/cbs/vocab/personenautosPerHuishouden",
      //"https://data.pdok.nl/cbs/vocab/restaurantAfstand",
      //"https://data.pdok.nl/cbs/vocab/sauna",
      //"https://data.pdok.nl/cbs/vocab/sterftePercentage",
      //"https://data.pdok.nl/cbs/vocab/supermarktAfstand",
      //"https://data.pdok.nl/cbs/vocab/surinamers",
      //"https://data.pdok.nl/cbs/vocab/treinstation",
      //"https://data.pdok.nl/cbs/vocab/turken",
      //"https://data.pdok.nl/cbs/vocab/verweduwd",
      "https://data.pdok.nl/cbs/vocab/vrouwen",
      "https://data.pdok.nl/cbs/vocab/vrouwen-procent",
      //"https://data.pdok.nl/cbs/vocab/warenhuisAfstand",
      //"https://data.pdok.nl/cbs/vocab/water",
      //"https://data.pdok.nl/cbs/vocab/westerseAllochtonen",
      //"https://data.pdok.nl/cbs/vocab/woningen",
      "https://data.pdok.nl/cbs/vocab/woz",
      //"https://data.pdok.nl/cbs/vocab/ziekenhuisAfstand",
      //"https://data.pdok.nl/cbs/vocab/zonnebank",
      //"https://data.pdok.nl/cbs/vocab/zwembad"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        <${iri}> ?p ?o
        optional { ?p rdfs:label ?pLabel }
        optional { ?o rdfs:label ?oLabel }
        optional {
          <${iri}> geo:hasGeometry ?geo .
          ?geo geo:asWKT ?wkt
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  // cbs:Wijk
  "https://data.pdok.nl/cbs/vocab/Wijk": {
    default: false,
    iri: "https://data.pdok.nl/cbs/vocab/Wijk",
    label: "Wijk",
    facets: [
      "https://cultureelerfgoed.nl/vocab/provincie",
      "https://data.pdok.nl/cbs/vocab/stedelijkheid",
      //"https://data.pdok.nl/cbs/vocab/afstandCafé",
      "https://data.pdok.nl/cbs/vocab/antillianen",
      "https://data.pdok.nl/cbs/vocab/attractieAfstand",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingen",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenA",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenBF",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenGI",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenHJ",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenKL",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenMN",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenRU",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsmotorvoertuigen",
      "https://data.pdok.nl/cbs/vocab/bevolkingsdichtheid",
      //"https://data.pdok.nl/cbs/vocab/bibliotheek",
      //"https://data.pdok.nl/cbs/vocab/bioscoopAfstand",
      "https://data.pdok.nl/cbs/vocab/bouwklasse-1999",
      "https://data.pdok.nl/cbs/vocab/bouwklasse2000+",
      "https://data.pdok.nl/cbs/vocab/brandweer",
      //"https://data.pdok.nl/cbs/vocab/buitenpolikliniekAfstand",
      "https://data.pdok.nl/cbs/vocab/buitenschoolseopvangAfstand",
      //"https://data.pdok.nl/cbs/vocab/cafetariumAfstand",
      //"https://data.pdok.nl/cbs/vocab/ééngezinswoningen",
      //"https://data.pdok.nl/cbs/vocab/éénpersoonsHuishoudens",
      //"https://data.pdok.nl/cbs/vocab/geboorte",
      "https://data.pdok.nl/cbs/vocab/geboortePercentage",
      "https://data.pdok.nl/cbs/vocab/gehuwd",
      "https://data.pdok.nl/cbs/vocab/gescheiden",
      //"https://data.pdok.nl/cbs/vocab/hotelAfstand",
      //"https://data.pdok.nl/cbs/vocab/huishoudenGrootte",
      //"https://data.pdok.nl/cbs/vocab/huishoudens",
      "https://data.pdok.nl/cbs/vocab/huishoudensMetKinderen",
      "https://data.pdok.nl/cbs/vocab/huishoudensZonderKinderen",
      //"https://data.pdok.nl/cbs/vocab/ijsbaan",
      "https://data.pdok.nl/cbs/vocab/inwoners",
      "https://data.pdok.nl/cbs/vocab/inwoners0-14",
      "https://data.pdok.nl/cbs/vocab/inwoners15-24",
      "https://data.pdok.nl/cbs/vocab/inwoners25-44",
      "https://data.pdok.nl/cbs/vocab/inwoners45-64",
      "https://data.pdok.nl/cbs/vocab/inwoners65+",
      "https://data.pdok.nl/cbs/vocab/kinderdagverblijfAfstand",
      "https://data.pdok.nl/cbs/vocab/mannen",
      //"https://data.pdok.nl/cbs/vocab/marokkanen",
      "https://data.pdok.nl/cbs/vocab/meergezinswoningen",
      "https://data.pdok.nl/cbs/vocab/motortweewielers",
      //"https://data.pdok.nl/cbs/vocab/nietwesterseAllochtonen",
      //"https://data.pdok.nl/cbs/vocab/omgevingsadressendichtheid",
      "https://data.pdok.nl/cbs/vocab/ongehuwd",
      "https://data.pdok.nl/cbs/vocab/oppervlakte",
      "https://data.pdok.nl/cbs/vocab/oppervlakteLand",
      "https://data.pdok.nl/cbs/vocab/oppervlakteWater",
      //"https://data.pdok.nl/cbs/vocab/oprit",
      //"https://data.pdok.nl/cbs/vocab/overigeNietwesterseAllochtonen",
      //"https://data.pdok.nl/cbs/vocab/overigeWinkelsAfstand",
      //"https://data.pdok.nl/cbs/vocab/overstapstation",
      //"https://data.pdok.nl/cbs/vocab/personenautos",
      "https://data.pdok.nl/cbs/vocab/personenautos0-5",
      "https://data.pdok.nl/cbs/vocab/personenautos6+",
      //"https://data.pdok.nl/cbs/vocab/personenautosBenzine",
      //"https://data.pdok.nl/cbs/vocab/personenautosBrandstofOverig",
      //"https://data.pdok.nl/cbs/vocab/personenautosNaarOppervlakte",
      //"https://data.pdok.nl/cbs/vocab/personenautosPerHuishouden",
      //"https://data.pdok.nl/cbs/vocab/restaurantAfstand",
      //"https://data.pdok.nl/cbs/vocab/sauna",
      //"https://data.pdok.nl/cbs/vocab/sterftePercentage",
      //"https://data.pdok.nl/cbs/vocab/supermarktAfstand",
      //"https://data.pdok.nl/cbs/vocab/surinamers",
      //"https://data.pdok.nl/cbs/vocab/treinstation",
      //"https://data.pdok.nl/cbs/vocab/turken",
      //"https://data.pdok.nl/cbs/vocab/verweduwd",
      "https://data.pdok.nl/cbs/vocab/vrouwen",
      //"https://data.pdok.nl/cbs/vocab/warenhuisAfstand",
      //"https://data.pdok.nl/cbs/vocab/water",
      //"https://data.pdok.nl/cbs/vocab/westerseAllochtonen",
      //"https://data.pdok.nl/cbs/vocab/woningen",
      "https://data.pdok.nl/cbs/vocab/woz",
      //"https://data.pdok.nl/cbs/vocab/ziekenhuisAfstand",
      //"https://data.pdok.nl/cbs/vocab/zonnebank",
      //"https://data.pdok.nl/cbs/vocab/zwembad"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        <${iri}> ?p ?o
        optional { ?p rdfs:label ?pLabel }
        optional { ?o rdfs:label ?oLabel }
        optional {
          <${iri}> geo:hasGeometry ?geo .
          ?geo geo:asWKT ?wkt
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  // cbs:Buurt
  "https://data.pdok.nl/cbs/vocab/Buurt": {
    default: false,
    iri: "https://data.pdok.nl/cbs/vocab/Buurt",
    label: "Buurt",
    facets: [
      "https://cultureelerfgoed.nl/vocab/provincie",
      "https://data.pdok.nl/cbs/vocab/stedelijkheid",
      //"https://data.pdok.nl/cbs/vocab/afstandCafé",
      "https://data.pdok.nl/cbs/vocab/antillianen",
      "https://data.pdok.nl/cbs/vocab/attractieAfstand",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingen",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenA",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenBF",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenGI",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenHJ",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenKL",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenMN",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenRU",
      //"https://data.pdok.nl/cbs/vocab/bedrijfsmotorvoertuigen",
      "https://data.pdok.nl/cbs/vocab/bevolkingsdichtheid",
      //"https://data.pdok.nl/cbs/vocab/bibliotheek",
      //"https://data.pdok.nl/cbs/vocab/bioscoopAfstand",
      "https://data.pdok.nl/cbs/vocab/bouwklasse-1999",
      "https://data.pdok.nl/cbs/vocab/bouwklasse2000+",
      "https://data.pdok.nl/cbs/vocab/brandweer",
      //"https://data.pdok.nl/cbs/vocab/buitenpolikliniekAfstand",
      "https://data.pdok.nl/cbs/vocab/buitenschoolseopvangAfstand",
      //"https://data.pdok.nl/cbs/vocab/cafetariumAfstand",
      //"https://data.pdok.nl/cbs/vocab/ééngezinswoningen",
      //"https://data.pdok.nl/cbs/vocab/éénpersoonsHuishoudens",
      //"https://data.pdok.nl/cbs/vocab/geboorte",
      "https://data.pdok.nl/cbs/vocab/geboortePercentage",
      "https://data.pdok.nl/cbs/vocab/gehuwd",
      "https://data.pdok.nl/cbs/vocab/gescheiden",
      //"https://data.pdok.nl/cbs/vocab/hotelAfstand",
      //"https://data.pdok.nl/cbs/vocab/huishoudenGrootte",
      //"https://data.pdok.nl/cbs/vocab/huishoudens",
      "https://data.pdok.nl/cbs/vocab/huishoudensMetKinderen",
      "https://data.pdok.nl/cbs/vocab/huishoudensZonderKinderen",
      //"https://data.pdok.nl/cbs/vocab/ijsbaan",
      "https://data.pdok.nl/cbs/vocab/inwoners",
      "https://data.pdok.nl/cbs/vocab/inwoners0-14",
      "https://data.pdok.nl/cbs/vocab/inwoners15-24",
      "https://data.pdok.nl/cbs/vocab/inwoners25-44",
      "https://data.pdok.nl/cbs/vocab/inwoners45-64",
      "https://data.pdok.nl/cbs/vocab/inwoners65+",
      "https://data.pdok.nl/cbs/vocab/kinderdagverblijfAfstand",
      "https://data.pdok.nl/cbs/vocab/mannen",
      //"https://data.pdok.nl/cbs/vocab/marokkanen",
      "https://data.pdok.nl/cbs/vocab/meergezinswoningen",
      "https://data.pdok.nl/cbs/vocab/motortweewielers",
      //"https://data.pdok.nl/cbs/vocab/nietwesterseAllochtonen",
      //"https://data.pdok.nl/cbs/vocab/omgevingsadressendichtheid",
      "https://data.pdok.nl/cbs/vocab/ongehuwd",
      "https://data.pdok.nl/cbs/vocab/oppervlakte",
      "https://data.pdok.nl/cbs/vocab/oppervlakteLand",
      "https://data.pdok.nl/cbs/vocab/oppervlakteWater",
      //"https://data.pdok.nl/cbs/vocab/oprit",
      //"https://data.pdok.nl/cbs/vocab/overigeNietwesterseAllochtonen",
      //"https://data.pdok.nl/cbs/vocab/overigeWinkelsAfstand",
      //"https://data.pdok.nl/cbs/vocab/overstapstation",
      //"https://data.pdok.nl/cbs/vocab/personenautos",
      "https://data.pdok.nl/cbs/vocab/personenautos0-5",
      "https://data.pdok.nl/cbs/vocab/personenautos6+",
      //"https://data.pdok.nl/cbs/vocab/personenautosBenzine",
      //"https://data.pdok.nl/cbs/vocab/personenautosBrandstofOverig",
      //"https://data.pdok.nl/cbs/vocab/personenautosNaarOppervlakte",
      //"https://data.pdok.nl/cbs/vocab/personenautosPerHuishouden",
      //"https://data.pdok.nl/cbs/vocab/restaurantAfstand",
      //"https://data.pdok.nl/cbs/vocab/sauna",
      //"https://data.pdok.nl/cbs/vocab/sterftePercentage",
      //"https://data.pdok.nl/cbs/vocab/supermarktAfstand",
      //"https://data.pdok.nl/cbs/vocab/surinamers",
      //"https://data.pdok.nl/cbs/vocab/treinstation",
      //"https://data.pdok.nl/cbs/vocab/turken",
      //"https://data.pdok.nl/cbs/vocab/verweduwd",
      "https://data.pdok.nl/cbs/vocab/vrouwen",
      //"https://data.pdok.nl/cbs/vocab/warenhuisAfstand",
      //"https://data.pdok.nl/cbs/vocab/water",
      //"https://data.pdok.nl/cbs/vocab/westerseAllochtonen",
      //"https://data.pdok.nl/cbs/vocab/woningen",
      "https://data.pdok.nl/cbs/vocab/woz",
      //"https://data.pdok.nl/cbs/vocab/ziekenhuisAfstand",
      //"https://data.pdok.nl/cbs/vocab/zonnebank",
      //"https://data.pdok.nl/cbs/vocab/zwembad"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        <${iri}> ?p ?o
        optional { ?p rdfs:label ?pLabel }
        optional { ?o rdfs:label ?oLabel }
        optional {
          <${iri}> geo:hasGeometry ?geo .
          ?geo geo:asWKT ?wkt
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  // iisg:Land
  "https://triply.cc/ontology/TemporalSlice": {
    default: false,
    iri: "https://triply.cc/ontology/TemporalSlice",
    label: "Land (historisch)",
    facets: [
      "https://iisg.amsterdam/vocab/area",
      "https://iisg.amsterdam/vocab/cowEnd",
      "https://iisg.amsterdam/vocab/cowStart"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .
        ?geo geo:asWKT ?wkt .`
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
