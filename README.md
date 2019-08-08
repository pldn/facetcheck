# FacetCheck

A configurable faceted browser for browsing Linked Datasets.

## First-time installation

After cloning this repository, run the following command:

```sh
npm ci
```

## Running

After installation, FacetCheck is run with the following command:

```sh
npm run dev
```

## Debug mode

After starting the Facetcheck, facetcheck can be found standard on
your localhost:5000 To run the developer debug mode you have to
activate the menu by typing in the following statement:

```js
localStorage.setItem("FACETCHECK_DEBUG", true);
```

To deactivate the debug mode you'll just need to type in the following
statement:

```js
localStorage.setItem("FACETCHECK_DEBUG", false);
```

## Release procedure

Run the following sequence of commands in order to release a new
version:

```sh
npm version <patch|minor|major>
npm publish
git push
```

This will release a new Docker image automatically by the Triply CI
pipeline.

## Configuration

A FacetCheck configuration is stored in 3 files.

### Configuration of a browser

A FacetCheck browser is configured in file `config.ts`.

```ts
import { GlobalConfig } from "@triply/facetcheck/build/src/facetConfUtils";
const conf: GlobalConfig = { … };
export default conf;
```

The following keys can be used in this FacetCheck browser
configuration object (`{ … }`):

  - `defaultClass: string` (optional)

    The IRI that denotes the class that is selected by default when
    the FacetCheck browser starts.

    If this key is missing, the class that appears first in the class
    array in `classes.ts` is used as the default class.

  - `endpoint: object` (required)

    An object with the following keys:

    - `token: string` (optional)

      For private Triply SPARQL endpoints, the API token that gives
      the FacetCheck browser access to the SPARQL endpoint specified
      with key `endpoint`.

    - `url: string` (required)

      The URI of the SPARQL endpoint that is used for answering SPARQL
      queries generated by the FacetCheck browser.

  - `favIcon: string` (optional)

    A URI at which a square image file is hosted that acts as the web
    browser favicon for this FacetCheck browser.

    Notice that SVG favicons are (unfortunately) not supported by many
    web browsers, but PNG favicons are supported by almost all web
    browsers.

    If unspecified, the Triply square logo is used as the fallback
    favicon.

  - `geoMap: string` (optional)

    The name of the background map that is used for visualizing
    geospatial data.  The following values are supported:

    - `"osm"` for OpenStreetMap (OSM).
    - `"nlmaps"` for [Kadaster NL Maps](https://nlmaps.nl/)
      (Netherlands-only).

    If unspecified, value `"osm"` is used.

  - `logo: string` (optional)

    A URI that points to an image that is used as the logo for this
    FacetCheck browser.

    If unspecified, the Triply landscape logo is used as the fallback
    logo.

  - `prefixes: object` (optional)

    The RDF prefix declarations that can be used in SPARQL snippets in
    class and facet configuration objects.

    The keys in this object are aliases, and the values are IRI prefix
    strings.

  - `title: string` (required)

    The title of the FacetCheck browser.

The following shows an example class configuration object for
Pokémons.

```ts
{
  endpoint: {
    url: "https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql"
  },
  logo: "https://triplydb.com/imgs/avatars/d/5b9952d15cce65029ba10c25.png?v=0",
  pageSize: 12,
  prefixes: {
    pokémon: "https://triply.cc/academy/pokemon/def/",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#"
  },
  title: "Pokémon Browser",
  getDereferenceableLink: (link) => {
    console.log(link);
    if (link.indexOf('https://triply.cc/academy/pokemon/') === 0) {
      return `https://triplydb.com/academy/pokemon/browser?r=${encodeURIComponent(link)}`
    }
    return link;
  }
}
```

### Configuration of classes

Classes are defined in configuration file `classes.ts`, which has the
following structure:

```ts
import { ClassConfig } from "@triply/facetcheck/build/src/facetConfUtils";
const CLASSES: ClassConfig[] = [ … ];
export default CLASSES;
```

An arbitrary number of class configuration objects can be specified in
the indicated array (`[ … ]`).

The order in which class configuration objects appear within the array
is the order in which the corresponding class selectors are drawn in
the browser UI.

The first class configuration object in this array is the class that
is selected by default when the browser starts (unless otherwise
configured in file `config.ts`).

The following keys can be used in class configuration objects:

  - `facets: string[]` (required)

    An array of facet key names.  Each facet key name must correspond
    with a key name in the facet configuration file (`facets.ts`).

    One facet configuration can be used in more than one class
    configuration.

  - `iri: string` (required)

    The IRI that denotes the class in the data.

  - `label: string` (optional)

    The human-readable label that is used to denote the class in the
    UI.  If this option is not set, FacetCheck tries to retrieve the
    label from the data (e.g., from an `rdfs:label` statement).  If no
    label can be found, the IRI that denotes the class is used as a
    last resort.

  - `classToQueryPattern: (iri: string) => string` (optional)

    The SPARQL select query that retrieves the selected IRIs given the criteria
    set by the facets. The retrieved IRIs are then passed to the resourceDescriptionQuery.
    The argument is optional, if the user does not add the argument, the basic string
    used for the matching IRIs is:
    `?_r rdf:type <${iri}> .`
    Else it gets converted to the value implemented in the classToQueryPattern.

  - `resourceDescriptionQuery: (iri: string) => string` (TBD)

    The SPARQL construct query that retrieves the graph that describes
    IRIs that are instances of the configured class.

The following shows an example class configuration object for
Pokémons.  This object configuration specifies a display label, one
facet (`pokémon:color`).

```ts
{
  facets: ["pokémon:colour"],
  iri: "https://triply.cc/academy/pokemon/def/Pokémon",
  label: "Pokémon",
  resourceDescriptionQuery: function(iri) {
    return `construct where { <${iri}> ?p ?o. } `;
  }
}
```

### Configuration of facets

Facets are defined in configuration file `facets.ts`, which has the
following structure:

```ts
import { FacetConfig, toEntity } from "@triply/facetcheck/build/src/facetConfUtils";
import * as _ from "lodash";
const FACETS: { [property: string]: FacetConfig } = { … };
export default FACETS;
```

An arbitrary number of facet key/object-pairs can be specified within
the indicated parent object (`{ … }`).

The following keys can be used in class configuration objects:

The key of a facet configuration is the facet ID that is referenced
from the class configuration (see above).  A facet configuration
contains the following properties:

The following keys can be used in class configuration objects:

  - `facetToQueryPatterns: (facetIri: string, values: {} | [{}]) => string` (required)

    Specifies the SPARQL select query snippet that ensures that only
    instance IRIs that match the currently selected facet values are
    retrieved.  Variable `?_r` must be used to bind the matching
    instance IRIs.  This function takes the following arguments:

      - `facetIri`

         The IRI of the facet.

      - `values`

        The selected facet values (see the documentation for the
        `facetValues` property above).

  - `facetType: string` (required)

    Specifies the type of widget that is used.  The following values
    are supported:

      - `"multiselect"`

        A collection of checkboxes, denoting a disjunctive set of
        values.  (“Select instances that have values X ór Y ór Z.”)

      - `"nlProvinces"`

        A map of the Netherlands that allows the selection of a
        disjunctive set of provinces.  (“Select province X ór Y ór
        Z.”)

      - `"search"`

        A text field that allows a free text query to be specified.

      - `"slider"`

        A slider that allows a range to be specified with a minimum and
        a maximum value, selecting instances whose value falls within
        the specified range.

  - `facetValues?: {} | [{}]` (optional)

    Explicitly specifies the values of a facet, if these are known
    beforehand.  Either this key or key `getFacetValuesQuery` must be
    specified.

    This key is supported in combination with the following facet
    types:

      - `"multiselect"`

        For multi-select facets, this must be an array of JSON objects
        of the following form: `{"value": $(VALUE), "label": $(STRING)}`.

      - `"slider"`

        For slider facets, this must be an object of the following
        form:: `{"min": $(INT), "max": $(INT)}`.

  - `getFacetValuesQuery?: (iri: string) => string;` (optional)

    Specifies the SPARQL query that retrieves the values for this
    facet.  Either this key or key `facetValues` must be specified.

    This key is supported in combination with all facet types, and
    comes with the following facet type-specific requirements:

      - `"multiSelect"`

        The SPARQL projection must bind variables `?_value` and
        `?_valueLabel` to denote the individual multi-select values.

      - `"nlProvinces"`

        TBD

      - `"search"`

        TBD

      - `"slider"`

        The SPARQL projection must bind variables `?_min` and `?_max`
        to denote outer limits of the slider.

  - `label: string` (optional)

    Specifies the name of the facet, as displayed in the browser UI.

    If no label is given, the value of the `rdfs:label` property is
    used instead.

    If no label can be found, the key of the facet configuration
    object is used as a last resort.

An example of a facet configuration:

```ts
"cbs:stedelijkheid": {
  facetToQueryPatterns: (iri, values) => {
    if (values instanceof Array && values.length) {
      return values.map(v => `?_r ${iri} ${v.value}.`).join('} union {')
    }
  },
  facetType: "multiselect",
  getFacetValuesQuery: iri => {
    return `
      select distinct ?_value ?_valueLabel {
        graph graph:2015 {
          ?_r <${iri}> ?_value.
        }
        optional {
          ?_value rdfs:label ?_valueLabel
        }
      }
      limit 100`;
  },
  label: "Stedelijkheid"
}
```
