import { FacetConfig, toEntity } from "@triply/facetcheck/build/src/facetConfUtils";
import * as _ from "lodash";
const FACETS: { [property: string]: FacetConfig } = {
  bevolking_AantalInwoners: {
    label: "👪 Inwoners",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?aantal1) as ?_min) (max(?aantal1) as ?_max) {
                ?observatie1 def:bevolking_AantalInwoners ?aantal1 ;
                             dimension:regio ?_r .
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie1 def:bevolking_AantalInwoners ?aantal1 ;
                                    dimension:regio ?_r .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?aantal1 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?aantal1 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_Bevolkingsdichtheid: {
    label: "Bevolkingsdichtheid",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?dichtheid2) as ?_min) (max(?dichtheid2) as ?_max) {
                ?observatie2 def:bevolking_Bevolkingsdichtheid ?dichtheid2 ;
                             dimension:regio ?_r .
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `optional {
                         ?observatie2 def:bevolking_Bevolkingsdichtheid ?dichtheid2 ;
                                      dimension:regio ?_r .
                       }`;
        if (_.isFinite(values.min)) {
          if (_.isFinite(values.max)) {
            // both min and max
            pattern += `filter(!bound(?dichtheid2) || (?dichtheid2>=${values.min} && ?dichtheid2<=${values.max}))`;
          } else {
            // only min
            pattern += `filter(!bound(?dichtheid2) || ?dichtheid2>=${values.min})`;
          }
        } else {
          // only max
          pattern += `filter(!bound(?dichtheid2) || ?dichtheid2<=${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_BurgerlijkeStaat_Gehuwd: {
    label: "👫 Gehuwden",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?aantal3) as ?_min) (max(?aantal3) as ?_max) {
                ?observatie3 def:bevolking_BurgerlijkeStaat_Gehuwd ?aantal3 ;
                             dimension:regio ?_r .
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie3 def:bevolking_BurgerlijkeStaat_Gehuwd ?aantal3 ;
                                    dimension:regio ?_r .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?aantal3 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?aantal3 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  "bevolking_BurgerlijkeStaat_Gehuwd-percentage": {
    label: "👫 Gehuwden (%)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(xsd:byte(?percentage26)) as ?_min) (max(xsd:byte(?percentage26)) as ?_max) {
                ?observatie26a def:bevolking_AantalInwoners ?totaal26 ;
                               dimension:regio ?_r .
                ?observatie26b def:bevolking_BurgerlijkeStaat_Gehuwd ?aantal26 ;
                               dimension:regio ?_r .
                bind(if(?totaal26=0,0,xsd:byte(?aantal26/xsd:double(?totaal26)*100)) as ?percentage26)
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie26a def:bevolking_AantalInwoners ?totaal26 ;
                                      dimension:regio ?_r .
                       ?observatie26b def:bevolking_BurgerlijkeStaat_Gehuwd ?aantal26 ;
                                      dimension:regio ?_r .
                       bind(if(?totaal26=0,0,xsd:byte(?aantal26/xsd:double(?totaal26)*100)) as ?percentage26)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage26 >= "${values.min}"^^xsd:byte)`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage26 <= "${values.max}"^^xsd:byte)`;
        }
        return pattern;
      }
    }
  },
  bevolking_BurgerlijkeStaat_Gescheiden: {
    label: "⚮ Gescheiden",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?aantal4) as ?_min) (max(?aantal4) as ?_max) {
                ?observatie4 def:bevolking_BurgerlijkeStaat_Gescheiden ?aantal4 ;
                             dimension:regio ?_r .
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie4 def:bevolking_BurgerlijkeStaat_Gescheiden ?aantal4 ;
                                    dimension:regio ?_r .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?aantal4 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?aantal4 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  "bevolking_BurgerlijkeStaat_Gescheiden-percentage": {
    label: "⚮ Gescheiden (%)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(xsd:byte(?percentage27)) as ?_min) (max(xsd:byte(?percentage27)) as ?_max) {
                ?observatie27a def:bevolking_AantalInwoners ?totaal27 ;
                               dimension:regio ?_r .
                ?observatie27b def:bevolking_BurgerlijkeStaat_Gescheiden ?aantal27 ;
                               dimension:regio ?_r .
                bind(if(?totaal27=0,0,xsd:byte(?aantal27/xsd:double(?totaal27)*100)) as ?percentage27)
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie27a def:bevolking_AantalInwoners ?totaal27 ;
                                      dimension:regio ?_r .
                       ?observatie27b def:bevolking_BurgerlijkeStaat_Gescheiden ?aantal27 ;
                                      dimension:regio ?_r .
                       bind(if(?totaal27=0,0,xsd:byte(?aantal27/xsd:double(?totaal27)*100)) as ?percentage27)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage27 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage27 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_BurgerlijkeStaat_Ongehuwd: {
    label: "Ongehuwden",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?aantal5) as ?_min) (max(?aantal5) as ?_max) {
                ?observatie5 def:bevolking_BurgerlijkeStaat_Ongehuwd ?aantal5 ;
                             dimension:regio ?_r .
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie5 def:bevolking_BurgerlijkeStaat_Ongehuwd ?aantal5 ;
                                    dimension:regio ?_r .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?aantal5 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?aantal5 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  "bevolking_BurgerlijkeStaat_Ongehuwd-percentage": {
    label: "Ongehuwden (%)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(xsd:byte(?percentage28)) as ?_min) (max(xsd:byte(?percentage28)) as ?_max) {
                ?observatie28a def:bevolking_AantalInwoners ?totaal28 ;
                               dimension:regio ?_r .
                ?observatie28b def:bevolking_BurgerlijkeStaat_Ongehuwd ?aantal28 ;
                               dimension:regio ?_r .
                bind(if(?totaal28=0,0,xsd:byte(?aantal28/xsd:double(?totaal28)*100)) as ?percentage28)
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie28a def:bevolking_AantalInwoners ?totaal28 ;
                                      dimension:regio ?_r .
                       ?observatie28b def:bevolking_BurgerlijkeStaat_Ongehuwd ?aantal28 ;
                                      dimension:regio ?_r .
                       bind(if(?totaal28=0,0,xsd:byte(?aantal28/xsd:double(?totaal28)*100)) as ?percentage28)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage28 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage28 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_GeboorteEnSterfte_GeboorteRelatief: {
    label: "👶 Geboorte (%)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?percentage6) as ?_min) (max(?percentage6) as ?_max) {
                ?observatie6 def:bevolking_GeboorteEnSterfte_GeboorteRelatief ?percentage6 ;
                             dimension:regio ?_r .
        }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie6 def:bevolking_GeboorteEnSterfte_GeboorteRelatief ?percentage6 ;
                                    dimension:regio ?_r .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage6 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage6 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_GeboorteEnSterfte_SterfteRelatief: {
    label: "⛼ Relatieve sterfte",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?percentage25) as ?_min) (max(?percentage25) as ?_max) {
                ?observatie25 def:bevolking_GeboorteEnSterfte_SterfteRelatief ?percentage25 ;
                              dimension:regio ?_r .
        }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie25 def:bevolking_GeboorteEnSterfte_SterfteRelatief ?percentage25 ;
                                    dimension:regio ?_r .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage25 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage25 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_Geslacht_Mannen: {
    label: "👨 Mannen",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?aantal7) as ?_min) (max(?aantal7) as ?_max) {
                ?observatie7 def:bevolking_Geslacht_Mannen ?aantal7 ;
                             dimension:regio ?_r .
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?observatie7 def:bevolking_Geslacht_Mannen ?aantal7 ;
                                    dimension:regio ?_r .`;
        if (values.min) {
          pattern += `filter(?aantal7 >= ${values.min})`;
        }
        if (values.max) {
          pattern += `filter(?aantal7 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  "bevolking_Geslacht_Mannen-percentage": {
    label: "👨 Mannen (%)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
        select (min(xsd:byte(?percentage8)) as ?_min) (max(xsd:byte(?percentage8)) as ?_max) {
          ?observatie8a def:bevolking_Geslacht_Mannen ?aantal8 ;
                        dimension:regio ?_r .
          ?observatie8b def:bevolking_AantalInwoners ?totaal8 ;
                        dimension:regio ?_r .
          filter(?aantal8 > 5.0e0)
          bind(if(?aantal8=0,0,xsd:byte(?aantal8/xsd:double(?totaal8)*100)) as ?percentage8)
        }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie8a def:bevolking_Geslacht_Mannen ?aantal8 ;
                                     dimension:regio ?_r .
                       ?observatie8b def:bevolking_AantalInwoners ?totaal8 ;
                                     dimension:regio ?_r .
                       filter(?aantal8 > 5.0e0)
                       bind(if(?totaal8=0,0,xsd:byte(?aantal8/xsd:double(?totaal8)*100)) as ?percentage8)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage8 >= "${values.min}"^^xsd:byte)`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage8 <= "${values.max}"^^xsd:byte)`;
        }
        return pattern;
      }
    }
  },
  bevolking_Geslacht_Vrouwen: {
    label: "👩 Vrouwen",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?aantal9) as ?_min) (max(?aantal9) as ?_max) {
                ?observatie9 def:bevolking_Geslacht_Vrouwen ?aantal9 ;
                             dimension:regio ?_r .
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie9 def:bevolking_Geslacht_Vrouwen ?aantal9 ;
                                    dimension:regio ?_r .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?aantal9 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?aantal9 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  "bevolking_Geslacht_Vrouwen-percentage": {
    facetType: "slider",
    label: "👩 Vrouwen (%)",
    getFacetValuesQuery: iri => {
      return `select (min(xsd:byte(?percentage10)) as ?_min) (max(xsd:byte(?percentage10)) as ?_max) {
                ?observatie10a def:bevolking_Geslacht_Vrouwen ?aantal10 ;
                               dimension:regio ?_r .
                ?observatie10b def:bevolking_AantalInwoners ?totaal10 ;
                               dimension:regio ?_r .
                filter(?aantal10 > 5.0e0)
                bind(if(?totaal10=0,0,xsd:byte(?aantal10/xsd:double(?totaal10)*100)) as ?percentage10)
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie10a def:bevolking_Geslacht_Vrouwen ?aantal10 ;
                                      dimension:regio ?_r .
                       ?observatie10b def:bevolking_AantalInwoners ?totaal10 ;
                                      dimension:regio ?_r .
                       filter(?aantal10 > 5.0e0)
                       bind(if(?totaal10=0,0,xsd:byte(?aantal10/xsd:double(?totaal10)*100)) as ?percentage10)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage10 >= "${values.min}"^^xsd:byte)`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage10 <= "${values.max}"^^xsd:byte)`;
        }
        return pattern;
      }
    }
  },
  bevolking_Leeftijdsgroepen_0Tot15Jaar: {
    label: "Leeftijd 0-14 jaar (%)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?percentage33) as ?_min) (max(?percentage33) as ?_max) {
                ?observatie33a def:bevolking_Leeftijdsgroepen_0Tot15Jaar ?aantal33 ;
                               dimension:regio ?_r .
                ?observatie33b def:bevolking_AantalInwoners ?totaal33 ;
                               dimension:regio ?_r .
                bind(if(?totaal33=0,0,xsd:byte(?aantal33/xsd:double(?totaal33)*100)) as ?percentage33)
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie33a def:bevolking_Leeftijdsgroepen_0Tot15Jaar ?aantal33 ;
                                      dimension:regio ?_r .
                       ?observatie33b def:bevolking_AantalInwoners ?totaal33 ;
                                      dimension:regio ?_r .
                       bind(if(?totaal33=0,0,xsd:byte(?aantal33/xsd:double(?totaal33)*100)) as ?percentage33)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage33 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage33 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_Leeftijdsgroepen_15Tot25Jaar: {
    label: "Leeftijd 15-24 jaar (%)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?percentage34) as ?_min) (max(?percentage34) as ?_max) {
                ?observatie34a def:bevolking_Leeftijdsgroepen_15Tot25Jaar ?aantal34 ;
                               dimension:regio ?_r .
                ?observatie34b def:bevolking_AantalInwoners ?totaal34 ;
                               dimension:regio ?_r .
                bind(if(?totaal34=0,0,xsd:byte(?aantal34/xsd:double(?totaal34)*100)) as ?percentage34)
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie34a def:bevolking_Leeftijdsgroepen_15Tot25Jaar ?aantal34 ;
                                      dimension:regio ?_r .
                       ?observatie34b def:bevolking_AantalInwoners ?totaal34 ;
                                      dimension:regio ?_r .
                       bind(if(?totaal34=0,0,xsd:byte(?aantal34/xsd:double(?totaal34)*100)) as ?percentage34)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage34 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage34 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_Leeftijdsgroepen_25Tot45Jaar: {
    label: "Leeftijd 25-44 jaar (%)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?percentage35) as ?_min) (max(?percentage35) as ?_max) {
                ?observatie35a def:bevolking_Leeftijdsgroepen_25Tot45Jaar ?aantal35 ;
                               dimension:regio ?_r .
                ?observatie35b def:bevolking_AantalInwoners ?totaal35 ;
                               dimension:regio ?_r .
                bind(if(?totaal35=0,0,xsd:byte(?aantal35/xsd:double(?totaal35)*100)) as ?percentage35)
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie35a def:bevolking_Leeftijdsgroepen_25Tot45Jaar ?aantal35 ;
                                      dimension:regio ?_r .
                       ?observatie35b def:bevolking_AantalInwoners ?totaal35 ;
                                      dimension:regio ?_r .
                       bind(if(?totaal35=0,0,xsd:byte(?aantal35/xsd:double(?totaal35)*100)) as ?percentage35)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage35 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage35 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_Leeftijdsgroepen_45Tot65Jaar: {
    label: "Leeftijd 45-64 jaar (%)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?percentage36) as ?_min) (max(?percentage36) as ?_max) {
                ?observatie36a def:bevolking_Leeftijdsgroepen_45Tot65Jaar ?aantal36 ;
                               dimension:regio ?_r .
                ?observatie36b def:bevolking_AantalInwoners ?totaal36 ;
                               dimension:regio ?_r .
                bind(if(?totaal36=0,0,xsd:byte(?aantal36/xsd:double(?totaal36)*100)) as ?percentage36)
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie36a def:bevolking_Leeftijdsgroepen_45Tot65Jaar ?aantal36 ;
                                      dimension:regio ?_r .
                       ?observatie36b def:bevolking_AantalInwoners ?totaal36 ;
                                      dimension:regio ?_r .
                       bind(if(?totaal36=0,0,xsd:byte(?aantal36/xsd:double(?totaal36)*100)) as ?percentage36)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage36 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage36 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_Leeftijdsgroepen_65JaarOfOuder: {
    label: "Leeftijd 65 jaar en ouder (%)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?percentage37) as ?_min) (max(?percentage37) as ?_max) {
                ?observatie37a def:bevolking_Leeftijdsgroepen_65JaarOfOuder ?aantal37 ;
                               dimension:regio ?_r .
                ?observatie37b def:bevolking_AantalInwoners ?totaal37 ;
                               dimension:regio ?_r .
                bind(if(?totaal37=0,0,xsd:byte(?aantal37/xsd:double(?totaal37)*100)) as ?percentage37)
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie37a def:bevolking_Leeftijdsgroepen_65JaarOfOuder ?aantal37 ;
                                      dimension:regio ?_r .
                       ?observatie37b def:bevolking_AantalInwoners ?totaal37 ;
                                      dimension:regio ?_r .
                       bind(if(?totaal37=0,0,xsd:byte(?aantal37/xsd:double(?totaal37)*100)) as ?percentage37)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage37 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage37 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_ParticuliereHuishoudens_Eenpersoonshuishoudens: {
    label: "👪 Éénpersoons huishoudens",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?aantal31) as ?_min) (max(?aantal31) as ?_max) {
                ?observatie31 def:bevolking_ParticuliereHuishoudens_Eenpersoonshuishoudens ?aantal31 ;
                              dimension:regio ?_r .
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie31 def:bevolking_ParticuliereHuishoudens_Eenpersoonshuishoudens ?aantal31 ;
                                     dimension:regio ?_r .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?aantal31 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?aantal31 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  "bevolking_ParticuliereHuishoudens_Eenpersoonshuishoudens-percentage": {
    label: "👪 Éépersoons huishoudens (%)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(xsd:byte(?percentage32)) as ?_min) (max(xsd:byte(?percentage32)) as ?_max) {
                ?observatie32a def:bevolking_AantalInwoners ?totaal32 ;
                               dimension:regio ?_r .
                ?observatie32b def:bevolking_ParticuliereHuishoudens_Eenpersoonshuishoudens ?aantal32 ;
                               dimension:regio ?_r .
                bind(if(?totaal32=0,0,xsd:byte(?aantal32/xsd:double(?totaal32)*100)) as ?percentage32)
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie32a def:bevolking_AantalInwoners ?totaal32 ;
                                      dimension:regio ?_r .
                       ?observatie32b def:bevolking_ParticuliereHuishoudens_Eenpersoonshuishoudens ?aantal32 ;
                                      dimension:regio ?_r .
                       bind(if(?totaal32=0,0,xsd:byte(?aantal32/xsd:double(?totaal32)*100)) as ?percentage32)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage32 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage32 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_ParticuliereHuishoudens_GemiddeldeHuishoudensgrootte: {
    label: "👪 Huishouden grootte",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?omvang11) as ?_min) (max(?omvang11) as ?_max) {
                ?observatie11 def:bevolking_ParticuliereHuishoudens_GemiddeldeHuishoudensgrootte ?omvang11 ;
                              dimension:regio ?_r .
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `optional {
                         ?observatie11 def:bevolking_ParticuliereHuishoudens_GemiddeldeHuishoudensgrootte ?omvang11 ;
                                       dimension:regio ?_r .
                       }`;
        if (_.isFinite(values.min)) {
          if (_.isFinite(values.max)) {
            // both min and max
            pattern += `filter(!bound(?omvang2) || (?omvang2>=${values.min} && ?omvang2<=${values.max}))`;
          } else {
            // only min
            pattern += `filter(!bound(?omvang2) || ?omvang2>=${values.min})`;
          }
        } else {
          // only max
          pattern += `filter(!bound(?omvang2) || ?omvang2<=${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_ParticuliereHuishoudens_HuishoudensMetKinderen: {
    label: "👪 Huishoudens met kinderen",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?aantal12) as ?_min) (max(?aantal12) as ?_max) {
                ?observatie12 def:bevolking_ParticuliereHuishoudens_HuishoudensMetKinderen ?aantal12 ;
                              dimension:regio ?_r .
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie12 def:bevolking_ParticuliereHuishoudens_HuishoudensMetKinderen ?aantal12 ;
                                     dimension:regio ?_r .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?aantal12 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?aantal12 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  "bevolking_ParticuliereHuishoudens_HuishoudensMetKinderen-percentage": {
    label: "👪 Huishoudens met kinderen (%)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(xsd:byte(?percentage29)) as ?_min) (max(xsd:byte(?percentage29)) as ?_max) {
                ?observatie29a def:bevolking_AantalInwoners ?totaal29 ;
                               dimension:regio ?_r .
                ?observatie29b def:bevolking_ParticuliereHuishoudens_HuishoudensMetKinderen ?aantal29 ;
                               dimension:regio ?_r .
                bind(if(?totaal29=0,0,xsd:byte(?aantal29/xsd:double(?totaal29)*100)) as ?percentage29)
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie29a def:bevolking_AantalInwoners ?totaal29 ;
                                      dimension:regio ?_r .
                       ?observatie29b def:bevolking_ParticuliereHuishoudens_HuishoudensMetKinderen ?aantal29 ;
                                      dimension:regio ?_r .
                       bind(if(?totaal29=0,0,xsd:byte(?aantal29/xsd:double(?totaal29)*100)) as ?percentage29)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage29 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage29 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_ParticuliereHuishoudens_HuishoudensTotaal: {
    label: "👪 Aantal huishoudens",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?aantal13) as ?_min) (max(?aantal13) as ?_max) {
                ?observatie13 def:bevolking_ParticuliereHuishoudens_HuishoudensTotaal ?aantal13 ;
                              dimension:regio ?_r .
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie13 def:bevolking_ParticuliereHuishoudens_HuishoudensTotaal ?aantal13 ;
                                     dimension:regio ?_r .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?aantal13 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?aantal13 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  bevolking_ParticuliereHuishoudens_HuishoudensZonderKinderen: {
    label: "👪 Huishoudens zonder kinderen",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(?aantal14) as ?_min) (max(?aantal14) as ?_max) {
                ?observatie14 def:bevolking_ParticuliereHuishoudens_HuishoudensZonderKinderen ?aantal14 ;
                              dimension:regio ?_r .
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie14 def:bevolking_ParticuliereHuishoudens_HuishoudensZonderKinderen ?aantal14 ;
                                     dimension:regio ?_r .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?aantal14 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?aantal14 <= ${values.max})`;
        }
        return pattern;
      }
    }
  },
  "bevolking_ParticuliereHuishoudens_HuishoudensZonderKinderen-percentage": {
    label: "👪 Huishoudens zonder kinderen (%)",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `select (min(xsd:byte(?percentage30)) as ?_min) (max(xsd:byte(?percentage30)) as ?_max) {
                ?observatie30a def:bevolking_AantalInwoners ?totaal30 ;
                               dimension:regio ?_r .
                ?observatie30b def:bevolking_ParticuliereHuishoudens_HuishoudensZonderKinderen ?aantal30 ;
                               dimension:regio ?_r .
                bind(if(?totaal30=0,0,xsd:byte(?aantal30/xsd:double(?totaal30)*100)) as ?percentage30)
              }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?observatie30a def:bevolking_AantalInwoners ?totaal30 ;
                                      dimension:regio ?_r .
                       ?observatie30b def:bevolking_ParticuliereHuishoudens_HuishoudensZonderKinderen ?aantal30 ;
                                      dimension:regio ?_r .
                       bind(if(?totaal30=0,0,xsd:byte(?aantal30/xsd:double(?totaal30)*100)) as ?percentage30)`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?percentage30 >= ${values.min})`;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?percentage30 <= ${values.max})`;
        }
        return pattern;
      }
    }
  }
};
export default FACETS;
