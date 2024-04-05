var url = new URL(document.location);
var urlParams = url.searchParams;
var serverid = urlParams.get("serverid")
var patterns = JSON.parse(localStorage["lastSubmitData"]);

var colour_id = []

$('#new-btn').css("visibility", "hidden");
$('#edit-btn').css("visibility", "hidden");

console.log(localStorage["lastSubmitData"])

getResult();

function getResult() {
    var solverDone = false;

    if (!solverDone) {
        fetch("https://conjure-aas.cs.st-andrews.ac.uk/get", {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ jobid: serverid, appName: "permutation-patterns" })
        }).then(response => response.json())
            .then(json => {
                if (json.status == "wait") {
                    setTimeout(getResult, 2000);
                    document.getElementById("result-container").textContent = "Loading";
                }
                else {
                    solverDone = true;
                    if (json.status == "ok") {
                        document.getElementById("result-container").textContent = "";
                        showResults(json);
                    }
                    else {
                        document.getElementById("result-container").textContent = JSON.stringify(json, undefined, 2);
                    }
                    if (localStorage.getItem(serverid)) {
                        $('#edit-btn').css("visibility", "visible");
                    }
                    $('#new-btn').css("visibility", "visible");

                }

            })
    }

}

function showResults(results) {
    var url = new URL(document.location);
    var urlParams = url.searchParams;
    var stats = urlParams.get("stats")

    if (stats) {
        stats = stats.split(",")
    }

    // Creates array of a colour for each pattern input for whole solution set. Accessed in grid.js
    for (var i = 0; i < patterns.length; i++){
        colour_id[i] = getColour()
    }

    localStorage.setItem('colour_id', JSON.stringify(colour_id));

    $.each(results.solution, function (i, sol) {
        showSolution(sol, stats)
    });
    $('#total').append(document.createTextNode(" " + results.solution.length));
}

function showSolution(solution, stats) {
    var statistics = JSON.parse(`${environment.statistics}`)
    var div = document.createElement("div")
    div.classList.add("my-3")

    var li = document.createElement("li")
    var permutation = solution.perm
    permutation = permutation.length < 10 ? permutation.join('') : permutation.join(' ')
    li.appendChild(document.createTextNode("Permutation: " + permutation))

    div.appendChild(li)

    // Record evidence relevant to each solution
    var evidence_map = new Map()
    if (patterns.classic_containment.length > 0){
        evidence_map.set("cl-cont", solution.classic_containment_evidence)
    }
    if (patterns.vincular_containment.length > 0){
        evidence_map.set("vinc-cont",solution.vincular_containment_evidence)
    }

    if (stats) {
        for (var i = 0; i < stats.length; i++) {
            var label = document.createElement("label")
            var statdiv = document.createElement("div")
            label.appendChild(document.createTextNode(statistics["stat_" + stats[i]] + ": " + solution[stats[i]]))
            statdiv.appendChild(label)
            div.appendChild(statdiv)
        }
    }
    $('#solutioncontainer').append(div);

    // Restrict permutation plotting for permutations smaller than 10 to prevent crowding
    if (permutation.length < 10) {
        var grid_id = "grid" + permutation.toString()

        var grid = d3.select("#solutioncontainer").append("svg")
        .attr("id", grid_id)  
        .attr("width", 300*permutation.length)      // Container for whole grid svg.
        .attr("height", permutation.length * 50 );

        loadGrid(evidence_map, Array.from(String(permutation), Number), grid_id) 
    }
         
}

function getColour(){
    var rgbVal = [];
    for (let i = 0; i < 3; i++) {
        rgbVal.push((Math.floor(Math.random() * 256)).toString(16).padStart(2, '0'));
    }
    var hexColour = '#' + rgbVal[0] + rgbVal[1] + rgbVal[2]
    return hexColour;
}

$(document).on('click', '#edit-btn', function () {
    if (localStorage.getItem(serverid)) {
        window.location.assign(localStorage.getItem(serverid))
    }
});

$(document).on('click', '#new-btn', function () {
    var url = new URL(document.location);
    url.searchParams.delete("serverid");
    url.searchParams.delete("patterns");
    url.searchParams.delete("length");
    window.history.pushState({}, '', url);
    window.location.href = window.location.href.replace(window.location.pathname.split('/').pop(), '')

})

