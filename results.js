var url = new URL(document.location);
var urlParams = url.searchParams;
var id = urlParams.get("id")

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

    if (stats) {
        stats = stats.split(",")
    }

    $.each(results.solution, function (i, item) {
        showSolution(item, stats)
    });
    $('#total').append(document.createTextNode(" " + results.solution.length));

}

function showSolution(solution, stats) {
    var statistics = JSON.parse(`${environment.statistics}`)

    var li = document.createElement("li")
    var permutation = solution.perm
    permutation = permutation.length < 10 ? permutation.join('') : permutation.join(' ')
    li.appendChild(document.createTextNode("Permutation: " + permutation))

    var div = document.createElement("div")
    div.classList.add("mb-3")
    div.appendChild(li)

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