//the choices for pattern types
var representation = JSON.stringify({
  "1": "Classical",
  "2": "Vincular",
  "3": "Bivincular",
  "4": "Mesh",
  "5": "Boxed Mesh",
  "6": "Consecutive Patterns",
});

//the properties that have been implemented and can be selected
var property = JSON.stringify({
  "prop_simple": "Simple",
  "prop_block_wise_simple": "Block-wise Simple",
  "prop_plus_decomposable": "Plus Decomposable",
  "prop_mins_decomposable": "Minus Decomposable",
  "prop_involution": "Involution",
  "prop_derangement": "Derangement",
  "prop_non_derangement": "Non-derangement",
  "prop_parity": "Parity",
  "prop_non_parity": "Non-parity"
})

//the pattern types and their corresponding parameter label 
var pattern_names = JSON.stringify({
  "Classical": "classic_",
  "Vincular": "vincular_",
  "Bivincular": "bivincular_",
  "Mesh": "mesh_",
  "Boxed Mesh": "boxed_mesh_",
  "Consecutive Patterns": "consecutive_",
})

//the statistic choices
var statistic = JSON.stringify({
  "stat_ascentCount": "Ascent Count",
  "stat_descentCount": "Descent Count",
  "stat_excedanceCount": "Excedance Count",
  "stat_inversionCount": "Inversion Count",
  "stat_majorIndex": "Major Index",
})

//the possible patterns that can be input (each pattern type can have avoidance and containment) 

// all patterns are combination of pattern_names and concatenated with av / cont 
var patterns = JSON.stringify({
  "classic_avoidance": [],
  "classic_containment": [],
  "vincular_containment": [],
  "vincular_avoidance": [],
  "bivincular_containment": [],
  "bivincular_avoidance": [],
  "mesh_containment": [],
  "mesh_avoidance": [],
  "boxed_mesh_containment": [],
  "boxed_mesh_avoidance": [],
  "consecutive_containment": [],
  "consecutive_avoidance": [],
})



var environment = {
  "representation": representation,
  "properties": property,
  "max_patterns": 5, //the maximum number of underlying patterns that can added as part of a permutation problem
  "pattern_types": patterns,
  "pattern_names":pattern_names,
  "statistics" : statistic,
}
