# FacetCheck

A faceted browser for navigating Linked Data.

## Install & run FacetCheck

One-time installation:

```sh
npm install
```

Startup:

```sh
npm run dev
```

## Configuration of FacetCheck

FacetCheck delivers a good out of the box browsing experience that
works on any standard-compliant SPARQL endpoint.  In addition to that,
FacetCheck can also be configured in order to deliver a *great*
browsing experience.  This section explains how configurations are
constructed.

FacetCheck configuration files are stored in `/src/config_*.ts`

### Configuration of a class in FacetCheck

The configuration file for classes (`/src/config_classes.ts`) is an
object of class configurations.  A class configuration has the
following properties:

  - `default: boolean`

    Optionally denotes whether the class is automatically selected
    when the page is loaded.  The default value is `false`.  At most
    one class in a FacetCheck configuration can have this property set
    to `true`.

  - `iri: string`

    The IRI that denotes the class in the data.

  - `label: string`

    The optional human-readable label that is used to denote the class
    in the UI.  If this option is not set, FacetCheck tries to
    retrieve the label from the data (e.g., from an `rdfs:label`
    statement).  If no label can be found, the IRI that denotes the
    class is used as a last resolt.

  - `facets: string[]`

    An array of facet names.

  - `resourceDescriptionQuery: (iri: string) => string`

    The SPARQL construct query that retrieves the rendering graph for
    a particular IRI.  Common prefixes are appended automatically.

Here is an example of such a class configuration object:

```javascript
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

### Configuration of a facet in FacetCheck

The configuration object for facets (`/src/config_facets.ts`) is an
object of facet configurations.  The key of a facet configuration is
the facet ID that is referenced from the class configuration (see
above).  A facet configuration contains the following properties:

  - `label: string`

    Optional label that is used to name the facet in the UI.  If no
    label is given, the value of the `rdfs:label` property is used
    instead.

  - `facetType: string`

    A string identifying the type of widget that is used.  Possible
    values are `"slider"`, `"nlProvinces"`, and `"multiselect"`.

  - `getFacetValuesQuery?: (iri: string) => string;`

    Optional query that returns facet values.  For multi-select
    facets, the variables `?_value` and `?_valueLabel` are bound to
    the multi-select values.  For slider facets, the variables `?_min`
    and `?_max` are bound to the outer limits of the slider.

  - `facetValues?: {} | [{}]`

    If the values for a facet are known beforehand, they can be
    supplies directly (without requiring a query lookup).  For
    multi-select facets, this must be an array of JSON objects of the
    following form: `{"value": $(VALUE), "label": $(STRING)}`.  For
    slider facets, this must be an object of the following form::
    `{"min": $(INT), "max": $(INT)}`.

  - `facetToQueryPatterns: (facetIri:string, values:{} | [{}]) => string`

    Returns the SPARQL BGP that retrieves the IRIs that match the
    currently selected facet values.  The query variable `?_r` is
    bound to the IRIs that match the given facet-indiced restrictions.
    This functions takes the following arguments:

      - `facetIri`

         The IRI of the facet.

      - `values`

        The selected facet values (see the documentation for the
        `facetValues` property above).

An example of a facet configuration:

```javascript
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

# Supported facets

## multiselect

A collection of checkboxes, denoting a disjuctive set of values (e.g.,
select things that are X, Y, or Z).

## slider

A double slider selecting things that have at least MIN and at most MAX
value.

## nlProvinces

A map of the Netherlands selecting things located in either of the selected provinces.

## multiselectText

Do not use this one, it does not work yet.
