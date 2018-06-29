import { FacetConfig, toEntity } from "@triply/facetcheck/build/src/facetConfUtils";
import * as _ from "lodash";
const FACETS: { [property: string]: FacetConfig } = {
  "pdok-approved": {
    facetType: "multiselect",
    label: "PDOK approved",
    facetValues: [
      {
        value: "true",
        label: "✓"
      },
      {
        value: "false",
        label: "❌"
      }
    ],
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        //no need to apply pattern. should be either true or false
        if (values.length === 2) {
          return;
        }
        const val = values[0];
        if (val.value === "true") {
          return `
            graph <https://data.pdok.nl/bier> {
              ?_r foaf:depiction ?picture
            }`;
        } else if (val.value === "false") {
          return `
            graph <https://data.pdok.nl/bier> {
              ?_r a <http://dbeerpedia.com/def#Beer>
              filter not exists {
                ?_r foaf:depiction ?picture
              }
            }`;
        }
      }
    }
  },
  "http://dbeerpedia.com/def#alcoholpercentage": {
    facetType: "slider",
    label: "Alcoholpercentage",
    getFacetValuesQuery: iri => {
      return `
        select (min(?value) as ?_min) (max(?value) as ?_max) {
          ?_r <${iri}> ?value .
        }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `
            ?_r <${iri}> ?count1_ .
            bind(xsd:integer(?count1_) as ?count1)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?count1 >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?count1 <= ${values.max}) `;
        }
        return pattern;
      }
    }
  },
  "http://dbeerpedia.com/def#categorie": {
    label: "Categorie",
    facetType: "multiselect",
    facetValues: [
      {
        value: "http://dbeerpedia.com/def#Brouwerijhuurder",
        label: "Brouwerij huurder"
      },
      {
        value: "http://dbeerpedia.com/def#Bierbrouwerij",
        label: "Bierbrouwerij"
      },
      {
        value: "http://dbeerpedia.com/def#Brouwerijverhuurder",
        label: "Brouwerij verhuurder"
      }
    ],
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> <${v.value}>`).join("} union {");
      }
    }
  },
  "http://dbeerpedia.com/def#opgericht": {
    facetType: "slider",
    label: "Oprichtingsjaar",
    getFacetValuesQuery: iri => {
      return `
        select (min(?value) as ?_min) (max(?value) as ?_max) {
          ?_r <${iri}> ?value .
        }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `
            ?_r <${iri}> ?count_ .
            bind(xsd:integer(?count_) as ?count)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?count >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?count <= ${values.max}) `;
        }
        return pattern;
      }
    }
  },
  "http://dbeerpedia.com/def#provincie": {
    label: "Provincie",
    facetType: "nlProvinces",
    facetValues: {
      drenthe: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Drenthe",
        label: "Drenthe"
      },
      flevoland: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Flevoland",
        label: "Flevoland"
      },
      friesland: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Friesland",
        label: "Friesland"
      },
      gelderland: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Gelderland",
        label: "Gelderland"
      },
      limburg: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Limburg",
        label: "Limburg"
      },
      "n-brabant": {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Noord-Brabant",
        label: "Noord-Brabant"
      },
      "n-holland": {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Noord-Holland",
        label: "Noord-Holland"
      },
      overijssel: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Overijssel",
        label: "Overijssel"
      },
      zeeland: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Zeeland",
        label: "Zeeland"
      },
      "z-holland": {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Zuid-Holland",
        label: "Zuid-holland"
      },
      utrecht: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Utrecht",
        label: "Utrecht"
      },
      groningen: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Groningen",
        label: "Groningen"
      }
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> "${v.label}"^^xsd:string .`).join("} union {");
      }
    }
  },
  "http://dbeerpedia.com/def#minSchenkTemperatuur": {
    label: "🌡 Min. schenktemperatuur (℃)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
        select (min(?minTemp) as ?_min) (max(?minTemp) as ?_max) {
          ?_r <${iri}> ?minTemp .
        }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?minTemp .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?minTemp >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?minTemp <= ${values.max}) `;
        }
        return pattern;
      }
    }
  },
  "http://dbeerpedia.com/def#maxSchenkTemperatuur": {
    label: "🌡 Max. schenktemperatuur (℃)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
        select (min(?maxTemp) as ?_min) (max(?maxTemp) as ?_max) {
          ?_r <${iri}> ?maxTemp .
          filter(str(?maxTemp) != 'C')
        }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `
          ?_r <${iri}> ?maxTemp .
          filter(str(?maxTemp) != 'C')`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?maxTemp >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?maxTemp <= ${values.max}) `;
        }
        return pattern;
      }
    }
  },
  "http://dbeerpedia.com/def#stamwortgehalte": {
    label: "Stamwortgehalte (°P)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
        select (min(?stamwort) as ?_min) (max(?stamwort) as ?_max) {
          ?_r <${iri}> ?stamwort .
        }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?stamwort .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?stamwort >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?stamwort <= ${values.max}) `;
        }
        return pattern;
      }
    }
  },
  "http://dbeerpedia.com/def#style": {
    facetType: "multiselect",
    label: "Bierstijl",
    getFacetValuesQuery: iri => {
      return `
        select ?_value ?_valueLabel ?n {
          {
            select ?_value (count(?_r) as ?n) {
              ?_r <${iri}> ?_value .
            }
            group by ?_value
            order by desc(?n)
            limit 12
          }
          bind(concat(str(?_value),' (',str(?n),')') as ?_valueLabel)
        }
        order by desc(?n)`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> ${toEntity(v)} . `).join("} union {");
      }
    }
  }
};
export default FACETS;
