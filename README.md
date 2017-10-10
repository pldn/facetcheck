### Configuration

The facetcheck configuration is stored in `/src/facetConf.ts` (called conf file from now on). Feel free to use this as a boilerplate. If you'd like to add facets or change the config, feel free to send me snippets of the below config.

#### Configure available classes
The configuration object for classes (called `CLASSES` in the conf file) is an object of class configurations. One class configuration has these properties:
```
/*
this class is checked on page-load. There can only be one class that has this set;
*/
default: boolean

/*
Class IRI
*/
iri: string

/*
label of the class
*/
label: string

/*
an array of facet identifiers (see below on how to configure these
*/
facets: string[]

/*
The construct query that retrieves the triples we'd like to render for a particular IRI. Common prefixes are appended automatically
*/
resourceDescriptionQuery: (iri: string) => string
```

An example class configuration:

```
var CLASSES = {
  'https://cultureelerfgoed.nl/vocab/Monument': {
    default: true,
    iri: "https://cultureelerfgoed.nl/vocab/Monument",
    label: "Monument",
    facets: ["https://cultureelerfgoed.nl/vocab/province"],
    resourceDescriptionQuery: function(iri) {
      return `CONSTRUCT { <${iri}> ?p ?o } WHERE { ${iri} ?p ?o } `;
    }
  }
}
```

#### Configure facets
The configuration object for facets (called `FACETS` in the conf file) is an object of facet configurations. The key of a facet configuration is the 'facet id' that is referenced from the class config. One facet configuration has these properties:

```
/*
Facet IRI
*/
iri: string;

/*
Facet label. If unset, facetchecks tries to query for the label
*/
label?: string;

/*
A string identifying the widget. Possible values: 'slider' | 'nlProvinces' | 'multiselect'
*/
facetType: string;

/*
Return the query to fetch the facet values. If this is a multi-select, use a ?_value and ?_valueLabel variable for the different multi-select values.
If this is a slider, select ?_min and ?_max
*/
getFacetValuesQuery?: (iri: string) => string;

/*
If you know the values beforehand, you might want to set these directly instead of specifying the query above.
If this is a multi-select, you can set an array of objects with the shape `{value: <value>, label: <label>}`
If this is a slider, you can set an object with keys: {min:<min>, max:<max>}
*/
facetValues?: {} | [{}]
/*

*/
Return a BGP query that allows us to find the IRIs that match the currently selected facet values.
An important query variable is ?_r. This variable denotes the IRI that we'd like to retrieve.
Arguments to this function are:
facetIri: the IRI of the facet
values: the selected facet values (this variable has the same shape as the facetValues from above)
*/
facetToQueryPatterns: (facetIri:string, values:{} | [{}]) => string
```

An example facets configuration:
```
var FACETS = {
  "https://data.pdok.nl/cbs/vocab/stedelijkheid": {
    iri: "https://data.pdok.nl/cbs/vocab/stedelijkheid",
    label: "Stedelijkheid",
    facetType: "multiselect",
    getFacetValuesQuery: iri => {
      return `
      SELECT DISTINCT ?_value ?_valueLabel WHERE {
        GRAPH <https://data.pdok.nl/cbs/id/graph/2015>  {
          ?_r <${iri}> ?_value.
        }
        OPTIONAL {
          ?_value rdfs:label ?_valueLabel
        }
      } LIMIT 100`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> ${v.value} .`).join('} UNION {')
      }
    }
  }
}
```
