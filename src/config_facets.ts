import {FacetConfig,toEntity} from './facetConfUtils'
import * as _ from 'lodash'
const FACETS: { [property: string]: FacetConfig } = {
  "http://data.labs.pdok.nl/dataset/windstats/def#Ashoogte": {
    label: "As hoogte (m)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
        select (min(?asHoogte) as ?_min) (max(?asHoogte) as ?_max) {
          ?_r <${iri}> ?asHoogte .
        }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?asHoogte .`;
        if (_.isFinite(values.min)) pattern += `filter(?asHoogte >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?asHoogte <= ${values.max}) `;
        return pattern;
      }
    }
  },
  "http://bgt.basisregistraties.overheid.nl/def/bgt#bronhouder": {
    facetType: "multiselect",
    label: "Bronhouder",
    getFacetValuesQuery: iri => { return `
      select ?_value ?_valueLabel {
        {
          select ?_value ?label (count(?_r) as ?n) {
            ?_r foaf:isPrimaryTopicOf/<${iri}> ?_value .
            ?_value rdfs:label ?label .
          }
          order by desc(?n)
          limit 8
        }
        bind (concat(str(?label),' (',replace(?n,"[0-9](?=(?:[0-9]{3})+(?![0-9]))","$0."),')') as ?_valueLabel)
      }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r foaf:isPrimaryTopicOf/<${iri}> ${toEntity(v)} . `).join('} union {')
      }
    }
  },
  "http://data.labs.pdok.nl/dataset/windstats/def#Diameter": {
    label: "Diameter (m)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
        select (min(?diameter) as ?_min) (max(?diameter) as ?_max) {
          ?_r <${iri}> ?diameter .
        }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?diameter .`;
        if (_.isFinite(values.min)) pattern += `filter(?diameter >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?diameter <= ${values.max}) `;
        return pattern;
      }
    }
  },
  "http://bgt.basisregistraties.overheid.nl/def/bgt#eindRegistratie": {
    label: "Eind registratie",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select ?_min ?_minLabel ?_max ?_maxLabel {
        {
          select (min(?dateTime) as ?_min) (max(?dateTime) as ?_max) {
            ?_r foaf:isPrimaryTopicOf/<${iri}> ?dateTime ;
                a bgt:Pand .
          }
          limit 1
        }
        bind (concat(year(?_min),'-',month(?_min),'-',day(?_min)) as ?_minLabel)
        bind (concat(year(?_max),'-',month(?_max),'-',day(?_max)) as ?_maxLabel)
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (!_.isNil(values.min) || !_.isNil(values.max)) {
        var pattern = `?_r foaf:isPrimaryTopicOf/<${iri}> ?dateTime1 .`;
        if (!_.isNil(values.min)) pattern += `filter(?dateTime1 >= ${toEntity(values.min)}) `;
        if (!_.isNil(values.max)) pattern += `filter(?dateTime1 <= ${toEntity(values.max)}) `;
        return pattern;
      }
    }
  },
  "http://data.labs.pdok.nl/dataset/windstats/def#Fabrikant": {
    label: "Fabrikant",
    facetType: "multiselect",
    getFacetValuesQuery: iri => { return `
      select ?_value ?_valueLabel ?n {
        {
          select ?_value (count(?_r) as ?n) {
            ?_r <${iri}> ?_value .
          }
          order by desc(?n)
          limit 5
        }
        bind (concat(str(?_value),' (',?n,')') as ?_valueLabel)
      }
      order by desc(?n)`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> ${toEntity(v)} . `).join('} union {')
      }
    }
  },
  "http://bgt.basisregistraties.overheid.nl/def/bgt#objectBegintijd": {
    label: "Object begintijd",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select ?_minLabel ?_min ?_maxLabel ?_max {
        {
          select (min(?dateTime) as ?_min) (max(?dateTime) as ?_max) {
            ?_r foaf:isPrimaryTopicOf/<${iri}> ?dateTime ;
                a bgt:Pand .
          }
          limit 1
        }
        bind (concat(year(?_min),'-',month(?_min),'-',day(?_min)) as ?_minLabel)
        bind (concat(year(?_max),'-',month(?_max),'-',day(?_max)) as ?_maxLabel)
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (!_.isNil(values.min) || !_.isNil(values.max)) {
        var pattern = `?_r foaf:isPrimaryTopicOf/<${iri}> ?dateTime2 .`;
        if (!_.isNil(values.min)) pattern += `filter(?dateTime2 >= ${toEntity(values.min)}) `;
        if (!_.isNil(values.max)) pattern += `filter(?dateTime2 <= ${toEntity(values.max)}) `;
        return pattern;
      }
    }
  },
  "http://bgt.basisregistraties.overheid.nl/def/bgt#objectEindtijd": {
    label: "Object eindtijd",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select ?_minLabel ?_min ?_maxLabel ?_max {
        {
          select (min(?dateTime) as ?_min) (max(?dateTime) as ?_max) {
            ?_r foaf:isPrimaryTopicOf/<${iri}> ?dateTime ;
                a bgt:Pand .
          }
          limit 1
        }
        bind (concat(year(?_min),'-',month(?_min),'-',day(?_min)) as ?_minLabel)
        bind (concat(year(?_max),'-',month(?_max),'-',day(?_max)) as ?_maxLabel)
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (!_.isNil(values.min) || !_.isNil(values.max)) {
        var pattern = `?_r foaf:isPrimaryTopicOf/<${iri}> ?dateTime3 .`;
        if (!_.isNil(values.min)) pattern += `filter(?dateTime3 >= ${toEntity(values.min)}) `;
        if (!_.isNil(values.max)) pattern += `filter(?dateTime3 <= ${toEntity(values.max)}) `;
        return pattern;
      }
    }
  },
  "http://bgt.basisregistraties.overheid.nl/def/bgt#opTalud": {
    label: "Op talud",
    facetType: "multiselect",
    getFacetValuesQuery: iri => { return `
      select ?_value ?_valueLabel {
        values (?_value ?_valueLabel) {
          ("false"^^xsd:boolean "❌")
          ("true"^^xsd:boolean "✓")
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> ${toEntity(v)} .`).join('} union {')
      }
    }
  },
  "http://data.labs.pdok.nl/dataset/windstats/def#Productie": {
    label: "Productie",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
        select (min(?productie) as ?_min) (max(?productie) as ?_max) {
          ?_r <${iri}> ?productie ;
        }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min !== undefined || values.max !== undefined) {
        var pattern = `?_r <${iri}> ?productie .`;
        if (values.min !== undefined) pattern += `filter(?productie >= ${toEntity(values.min)}) `;
        if (values.max !== undefined) pattern += `filter(?productie <= ${toEntity(values.max)}) `;
        return pattern;
      }
    }
  },
  "http://data.labs.pdok.nl/dataset/windstats/def#Provincie": {
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
        label: "Fryslân"
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
      "utrecht": {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Utrecht",
        label: "Utrecht"
      },
      "groningen": {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Groningen",
        label: "Groningen"
      },
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> "${v.label}"^^xsd:string .`).join('} union {')
      }
    }
  },
  "http://bgt.basisregistraties.overheid.nl/def/bgt#publicatiedatumLandelijkeVoorziening": {
    label: "Publicatied. landelijke voorz.",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
        select ?_minLabel ?_min ?_maxLabel ?_max {
          {
            select (min(?dateTime) as ?_min) (max(?dateTime) as ?_max) {
              ?_r foaf:isPrimaryTopicOf/<${iri}> ?dateTime ;
                  a bgt:Pand .
            }
            limit 1
          }
          bind (concat(year(?_min),'-',month(?_min),'-',day(?_min)) as ?_minLabel)
          bind (concat(year(?_max),'-',month(?_max),'-',day(?_max)) as ?_maxLabel)
        }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (!_.isNil(values.min) || !_.isNil(values.max)) {
        var pattern = `?_r foaf:isPrimaryTopicOf/<${iri}> ?dateTime4 .`;
        if (!_.isNil(values.min)) pattern += `filter(?dateTime4 >= ${toEntity(values.min)}) `;
        if (!_.isNil(values.max)) pattern += `filter(?dateTime4 <= ${toEntity(values.max)}) `;
        return pattern;
      }
    }
  },
  "http://bgt.basisregistraties.overheid.nl/def/bgt#relatieveHoogteligging": {
    label: "Hoogteligging",
    facetType: "multiselect",
    getFacetValuesQuery: iri => { return `
      select distinct ?_value {
        ?_r <${iri}> ?_value
      }
      order by asc(?_value)`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> ${toEntity(v)} .`).join('} union {')
      }
    }
  },
  "http://data.labs.pdok.nl/dataset/windstats/def#Startjaar": {
    label: "Startjaar",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
        select (min(?start) as ?_min) (max(?start) as ?_max) {
          ?_r <${iri}> ?start .
        }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min !== undefined || values.max !== undefined) {
        var pattern = `?_r <${iri}> ?start .`;
        if (values.min !== undefined) pattern += `filter(?start >= ${toEntity(values.min)}) `;
        if (values.max !== undefined) pattern += `filter(?start <= ${toEntity(values.max)}) `;
        return pattern;
      }
    }
  },
  "http://bgt.basisregistraties.overheid.nl/def/bgt#status": {
    label: "Status",
    facetType: "multiselect",
    facetValues: {
      "bestaand": {
        "value": "http://bgt.basisregistraties.overheid.nl/bgt/id/begrip/bestaand_Status",
        "label": "Bestaand"
      }
    },
    facetToQueryPatterns: (iri,values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> <${v.value}> .`).join('} union {')
      }
    }
  },
  "http://bgt.basisregistraties.overheid.nl/def/bgt#tijdstipRegistratie": {
    label: "Tijdstip registratie",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select ?_minLabel ?_min ?_maxLabel ?_max {
        {
          select (min(?dateTime) as ?_min) (max(?dateTime) as ?_max) {
            ?_r foaf:isPrimaryTopicOf/<${iri}> ?dateTime ;
                a bgt:Pand .
          }
          limit 1
        }
        bind (concat(year(?_min),'-',month(?_min),'-',day(?_min)) as ?_minLabel)
        bind (concat(year(?_max),'-',month(?_max),'-',day(?_max)) as ?_maxLabel)
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (!_.isNil(values.min) || !_.isNil(values.max)) {
        var pattern = `?_r foaf:isPrimaryTopicOf/<${iri}> ?dateTime5 .`;
        if (!_.isNil(values.min)) pattern += `filter(?dateTime5 >= ${toEntity(values.min)}) `;
        if (!_.isNil(values.max)) pattern += `filter(?dateTime5 <= ${toEntity(values.max)}) `;
        return pattern;
      }
    }
  },
  "http://data.labs.pdok.nl/dataset/windstats/def#Type": {
    label: "Type",
    facetType: "multiselect",
    getFacetValuesQuery: iri => { return `
      select ?_value ?_valueLabel ?n {
        {
          select ?_value (count(?_r) as ?n) {
            ?_r <${iri}> ?_value .
          }
          order by desc(?n)
          limit 5
        }
        bind (concat(str(?_value),' (',?n,')') as ?_valueLabel)
      }
      order by desc(?n)`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> ${toEntity(v)} . `).join('} union {')
      }
    }
  },
  "http://data.labs.pdok.nl/dataset/windstats/def#Vermogen": {
    label: "🗲 Vermogen (kW)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
        select (min(?vermogen) as ?_min) (max(?vermogen) as ?_max) {
          ?_r <${iri}> ?vermogen .
        }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?vermogen .`;
        if (_.isFinite(values.min)) pattern += `filter(?vermogen >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?vermogen <= ${values.max}) `;
        return pattern;
      }
    }
  },
  "http://data.labs.pdok.nl/dataset/windstats/def#Windpark": {
    label: "Windpark",
    facetType: "multiselect",
    getFacetValuesQuery: iri => { return `
      select ?_value ?_valueLabel ?n {
        {
          select ?_value (count(?_r) as ?n) {
            ?_r <${iri}> ?_value .
          }
          order by desc(?n)
          limit 5
        }
        bind (concat(str(?_value),' (',?n,')') as ?_valueLabel)
      }
      order by desc(?n)`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> ${toEntity(v)} . `).join('} union {')
      }
    }
  }
};
export default FACETS;
