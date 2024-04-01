var url = new URL(document.location);
var urlParams = url.searchParams;
var id = urlParams.get("id")

var colour_id = []

$('#new-btn').css("visibility", "hidden");
$('#edit-btn').css("visibility", "hidden");

getResult();

function getResult() {
    var solverDone = false;

    if (!solverDone) {
        fetch("https://conjure-aas.cs.st-andrews.ac.uk/get", {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            },  body: JSON.stringify({ jobid: id, appName: "permutation-patterns" })
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
                    if (localStorage.getItem(id)) {
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

    var patterns = results.solution[0].patterns

    if (stats) {
        stats = stats.split(",")
    }
// Generate colour at this level of the solution?  - create array of length (patterns), make reference (evidence[0] = pattern[0] = colour[0])
    for (var i = 0; i < patterns.length; i++){
        colour_id[i] = getColour()
    }

    $.each(results.solution, function (i, item) {
        showSolution(item, stats)
    });
    $('#total').append(document.createTextNode(" " + results.solution.length));
    // $('#patterns').append(document.createTextNode(" " + patterns.join(" ; ")))
    // work on generalising this across all .types
}

function showSolution(solution, stats) {
    var statistics = JSON.parse(`${environment.statistics}`)

    var div = document.createElement("div")
    div.classList.add("mb-3")

    var li = document.createElement("li")
    var permutation = solution.perm
    permutation = permutation.length < 10 ? permutation.join('') : permutation.join(' ')
    li.appendChild(document.createTextNode("Permutation: " + permutation))

    div.appendChild(li)
    
    grid = d3.select("#solutioncontainer").appendChild("svg")
        .attr("id", "grid")

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
    plotPermutation(solution)
}

function getColour(){
    var rgbVal = [];
    for (let i = 0; i < 3; i++) {
        rgbVal.push((Math.floor(Math.random() * 256)).toString(16).padStart(2, '0'));
    }
    var hexColour = '#' + rgbVal[0] + rgbVal[1] + rgbVal[2]
    return hexColour;
}

function plotPermutation(solution) {
    var permutation = solution.perm
    var evidence_list = solution.classic_containment_evidence

    // Create D3 grid
    var containerWidth = permutation.length * 40;
    var width = 50;
    var height = 50;
    
    var gridSize = (permutation.length + 1)*width

    var grid = d3.select("#solutioncontainer").append("svg")
        .attr("width", 4*containerWidth )
        .attr("height", permutation.length * height + 100)
        .append("g")
        .attr("id", "grid")
        .attr("transform", "translate(20,0)");

    // Add horizontal grid lines
    for (var i = 0; i <= permutation.length + 1; i++) {
        grid.append("line")
            .attr("x1", 0)
            .attr("y1", i * height)
            .attr("x2", gridSize)
            .attr("y2", i * height)
            .style("stroke", "#ccc")
            .style("stroke-width", 1);
    }

    // Add vertical grid lines
    for (var i = 0; i <= permutation.length + 1; i++) {
        grid.append("line")
            .attr("x1", i * width)
            .attr("y1", 0)
            .attr("x2", i * width)
            .attr("y2", gridSize)
            .style("stroke", "#ccc")
            .style("stroke-width", 1);
    }
    // Add permutation points
    permutation.forEach(createPermDot); //  value, index
      
    /*
    If evidence is [1,2,4,5] that means we need the 1st, 2nd, 4th an 5th element of the permutation obtained
    So the x values of evidence are [1,2,4,5], the y values are 
    */
    evidence_list.forEach(function(evidence, n) {
        var colour = colour_id[n]

        var evidence_x = evidence;
        var evidence_y = evidence.map(function(x) {
            return permutation[x - 1] 
        });
 
        evidence_x.forEach(function(x, i) {
            createEvDot(x - 1, evidence_y[i], 10 + 10 *n, colour)

        })     
                
        grid.append("text")
            .attr("x", gridSize + 150)
            .attr("y", gridSize / 2 + 30 * n)
            .attr("text-anchor", "middle")
            .text("Evidence for  " + solution.patterns[n] + " at points " + evidence_x)//.join(", ")); 
            .style("fill", colour)
            .style="font-size: 10px"  
    })

    // Function to create permutation and evidence points
    function createPermDot(value, index) {
        grid.append("circle")
            .attr("cx", (index + 1) * width)
            .attr("cy", (permutation.length - value + 1) * height)
            .attr("r", 5)
            .style("fill", "black");
    }

    function createEvDot(x, y, rad, c) {
        grid.append("circle")
        .attr("cx", (x + 1) * width)
        .attr("cy", (permutation.length - y + 1) * height)
        .attr("r", rad)
        .style("fill", "none")
        .style("stroke", c)

    }
    return grid
}

$(document).on('click', '#edit-btn', function () {
    if (localStorage.getItem(id)) {
        window.location.assign(localStorage.getItem(id))
    }
});

$(document).on('click', '#new-btn', function() {
    var url = new URL(document.location);
    url.searchParams.delete("id");
    window.history.pushState({}, '', url);
    window.location.href = window.location.href.replace(window.location.pathname.split('/').pop(), '')
    
})