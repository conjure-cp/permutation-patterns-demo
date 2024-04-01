setup();

/**
* Runs everytime the page is reloaded - resets everything
*/
function setup() {
    $('#deletepatternbtn').css("visibility", "hidden");
    setPermutationElements();
    setPatternChoices();
    setPatternType();
    setContainment();
    setPropertyChoices();
    setStatisticChoices();
    setLength();
    sessionStorage.clear();
    sessionStorage.setItem("total", 0)
    UrlToPattern();
}

/**
* Automatically fills the permutation input field if indicated by the URL
*/
function setPermutationElements() {
    var url = new URL(document.location);
    var params = url.searchParams;
    if (params.get('permutation')) { //the field needs to be filled
        var permutation = params.get('permutation').split(',')
        $('#permutation').val(permutation.length < 10 ? permutation.join('') : permutation.join(' ')); //formats the permutation appropriately 
        $('#permutationbutton').val("Visualise")
        $('#clearpattern').css("visibility", "visible");
        $('#addpatternbtn').css("visibility", "visible");

    }
    else {
        $('#permutationbutton').val("Visualise")
        $('#permutation').val("")
        $('#clearpattern').css("visibility", "hidden");
        $('#addpatternbtn').css("visibility", "hidden");

    }
}


/**
* Add a button to represent an underlying pattern that has been added 
*/
function addNewPattern(id, pattern) {
    const label = document.createElement("label");
    label.classList.add("btn");
    label.classList.add("mr-4");
    label.classList.add("mb-2");
    label.classList.add("patternbtn");
    label.setAttribute("value", id)
    label.setAttribute("id", "pattern-" + id)

    const input = document.createElement("input")
    input.classList.add("pattern-input")
    input.setAttribute("type", "checkbox")
    input.setAttribute("autocomplete", "off")
    input.setAttribute("data-toggle", "toggle")
    input.setAttribute("id", "input-" + id)

    var permutation = JSON.parse(pattern).permutation.split(",")

    const span = document.createElement("span")
    //formatting the permutation to add to the button
    span.appendChild(document.createTextNode(permutation.length < 10 ? permutation.join('') : permutation.join(' ')))


    label.appendChild(span);
    label.appendChild(input)
    document.getElementById("added-patterns-container").appendChild(label);
}

/**
* Updating the label on an added pattern button
*/
function updatePatternText(id, permutation) {
    var span = $("#pattern-" + id + " span")

    var permutation = permutation.split(",")
    var text = permutation.length < 10 ? permutation.join('') : permutation.join(' ');
    span.text(text)
}

/**
* Dynamically adding the pattern types to the selection field
*/
function setPatternChoices() {
    var representations = JSON.parse(`${environment.representation}`) //stored as a global variable
    $.each(representations, function (i, item) {
        $('#permrepresentation').append($('<option>', {
            value: i,
            text: item
        }));
    });

    var currenturl = new URL(window.location);
    if (!currenturl.searchParams.get("type")) { //automatically fills in the input if data is in the URL
        currenturl.searchParams.set('type', 1);
        window.history.pushState({}, '', currenturl);
    }

}

/**
* Automatically fills the pattern type input field if indicated by the URL
*/
function setPatternType() {
    var url = new URL(document.location);
    var params = url.searchParams;

    if (params.get('type')) {
        var representation = params.get('type')
        $('#permrepresentation').val(representation);
    }
}

/**
* Automatically fills the containment input field if indicated by the URL
*/
function setContainment() {
    var url = new URL(document.location);
    var params = url.searchParams;
    if (params.get('contain')) {
        var containment = params.get('contain')
        var selection = $('input:radio[name="containment"]') //the containment and avoidance radio buttons
        $.each(selection, function (i, item) {
            if ($(this).val() != containment) { //if its not what is indicated in the URL
                $(this).prop("checked", false)
            }
            else {
                $(this).prop("checked", true)
            }
        });
    }
}

/**
* Reset the URL parameters related to the underlying pattern section
*/
function resetParams() {
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    urlParams.delete("id")
    urlParams.delete("permutation")
    urlParams.delete("contain")
    urlParams.set('type', 1);
    window.history.pushState({}, '', url);
    dispatchEvent(new PopStateEvent('popstate', {})); //firest the pop state event
}


/**
* Handles if the pattern type changes
*/
$(document).on('change', '#permrepresentation', function () {
    var currenturl = new URL(window.location);
    currenturl.searchParams.set('type', $('#permrepresentation').find("option:selected").attr('value'));
    window.history.pushState({}, '', currenturl); //update the url

    dispatchEvent(new PopStateEvent('popstate', {}));
}
);

/**
* Handles if the containment choice changes
*/
$(document).on('change', '#include', function () {
    var currenturl = new URL(window.location);
    currenturl.searchParams.set("contain", $('#include input:checked').attr("value"));
    window.history.pushState({}, '', currenturl);
    dispatchEvent(new PopStateEvent('popstate', {}));
}
);

/**
* Handles if the length input changes
*/
$(document).on('change', '#length', function () {
    var currenturl = new URL(window.location);
    currenturl.searchParams.set("length", $(this).val());
    if ($(this).val() == "") { //if no length is entered
        currenturl.searchParams.delete("length")
    }
    window.history.pushState({}, '', currenturl);
}
);

/**
* Automatically fills the length input field if indicated by the URL
*/
function setLength() {
    var currenturl = new URL(window.location);
    if (currenturl.searchParams.get("length")) {
        $("#length").val(currenturl.searchParams.get("length"))
    }
}

/**
* Handles if there is a change in the URL relating to the underlying pattern inputs 
*/
window.addEventListener('popstate', function (event) {
    setPermutationElements();
    setPatternType();
    setContainment();
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    if (urlParams.get("id")) {
        $('#addpatternbtn').val("update")
        $('#addpatternbtn').text("Update Pattern")
        $('#deletepatternbtn').css("visibility", "visible");
    }

    else {
        $('#addpatternbtn').val("add")
        $('#addpatternbtn').text("Submit Pattern")
        $('#deletepatternbtn').css("visibility", "hidden");
    }



});

/**
* Handles adding and updating an underlying pattern
*/
$(document).on('click', '#addpatternbtn', function () {
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    //gets the data relating to the pattern
    var permutation = urlParams.get('permutation');
    var patterntype = urlParams.get('type')
    var containment = $('input:radio[name="containment"]:checked').val();

    var permutationlength = permutation.split(",").length

    var array = []

    //intialises an empty 2d array the size of the grid
    for (let i = 0; i < permutationlength + 1; i++) {
        var temp = []
        for (let j = 0; j < permutationlength + 1; j++) {
            temp[j] = 0
        }
        array[i] = temp
    }

    var grid = d3.select("#grid")

    //gets the shaded pattern
    grid.selectAll(".square").each(function (d) {
        if (d3.select(this).style("fill") != "rgb(255, 255, 255)") {
            array[d.row][d.column] = 1
        }
    })

    //formats the data
    var pattern = JSON.stringify({ permutation: permutation, patterntype: patterntype, containment: containment, pattern: array })

    //if a new pattern is being added
    if ($(this).text().trim() === "Submit Pattern") {
        var patternnumber = sessionStorage.getItem("total")
        //makes sure the maximum number of patterns hasn't been reached
        if (patternnumber >= `${environment.max_patterns}`) {
            $('#maxPatterns').modal('show'); //show popup alert
        }
        else { //store the new pattern
            sessionStorage.setItem(
                patternnumber,
                pattern
            );
            addNewPattern(patternnumber, pattern); //creates the button

        }
    }
    //if a pattern is being updated
    else {
        var patternnumber = urlParams.get("id")
        deletePatternUrl(JSON.parse(sessionStorage.getItem(patternnumber))) //remove the pattern's information from the URL
        sessionStorage.setItem( //updates the stored data relating to the pattern
            patternnumber,
            pattern
        );
        updatePatternText(patternnumber, permutation) //updates the text displayed on the button representing the pattern
        $($("#pattern-" + patternnumber)).removeClass("selected-pattern") //deselect the pattern
        $("#input-" + patternnumber).prop("checked", false)
    }
    var count = sessionStorage.getItem("total");
    count = parseInt(count) + 1;
    sessionStorage.setItem("total", count) //updates the total number of patterns

    patternToUrl(JSON.parse(pattern)) //adds the pattern information to the URL
    resetParams(url, urlParams);

});

/**
* Handles deleting an underlying pattern
*/
$(document).on('click', '#deletepatternbtn', function () {
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    var id = urlParams.get("id");
    var pattern = JSON.parse(sessionStorage.getItem(id));
    sessionStorage.removeItem(id) //remove the data from stoarge
    $("#pattern-" + id).remove(); //removes the button representing the button

    deletePatternUrl(pattern) //removes the pattern information from the URL

    resetParams()

});

/**
* Handles removing the pattern information from the URL
*/
function deletePatternUrl(pattern) {
    var url = new URL(document.location);
    var urlParams = url.searchParams;
    var allpatterns = urlParams.get("patterns").split("-").filter(item => item.trim().length > 0) //get all the pattern info stored in the URL
    var toRemove = pattern.permutation.split(",").concat([pattern.patterntype, pattern.containment]) //the data that needs to be removed
    var index = null;

    $.each(allpatterns, function (i, item) { //iterates through each pattern
        if (JSON.stringify(item.split(",").filter(item => item.trim().length > 0)) === JSON.stringify(toRemove)) { //if it is the correct pattern
            index = i; //store the index
        }
        allpatterns[i] = "-" + allpatterns[i] + "," //ensure the data is formatted correctly
    });
    if (index != null) { //if the pattern to be deleted was found
        allpatterns.splice(index) //remove it from the array of pattern information 
        if (index == 0 && allpatterns.length == 1) { //if there are no added patterns now
            urlParams.delete("patterns")
        }
        else {
            urlParams.set("patterns", allpatterns)
        }
    }


    sessionStorage.setItem("total", sessionStorage.getItem("total") - 1) //updates the total number of patterns

    window.history.pushState({}, '', url); //updates the URL
}

/**
* Handles solving the permutation problem 
*/
$(document).on('click', '#solvebtn', function () {
    var numberPatterns = sessionStorage.getItem("total");
    let patterns = []
    for (let i = 0; i < numberPatterns; i++) { //gets all the added patterns
        patterns[i] = JSON.parse(sessionStorage.getItem(i));
    }
    if (patterns.length == 0) { //can't run the solver if no patterns have been added
        $('#noPatterns').modal('show');
    }
    else {
        var length = document.getElementById("length").value
        if (!isValidLength(patterns, length)) { //validate the length
            document.getElementById("length").classList.add('is-invalid')
        }

        else {
            //gets the search state inputs
            var props = getCheckedBoxes(JSON.parse(`${environment.properties}`), null, "property");
            var statistics = getCheckedBoxes(JSON.parse(`${environment.statistics}`), "#all-statistic", "statistic");
            var underlying = getPatterns(patterns);


            var inputs = $.extend({ length: parseInt(length) }, props, underlying) //stores all the data for the problem in one object
            fetch("empty.json") //fetch all the parameters that must be passed into the computation model 
                .then(response => response.json())
                .then(json => {
                    var emptyData = json
                    fetch('combined.essence') //fetch the computational model
                        .then(response => response.text())
                        .then((data) => {

                            localStorage["lastSubmitData"] = data

                            var details = {
                                model: data,
                                data: JSON.stringify(Object.assign(emptyData, inputs)), //all the required parameters have values
                                solver: "minion",
                                conjure_options: ["--number-of-solutions", "10000"],
                                appName: "permutation-patterns"
                            }
                            fetch("https://conjure-aas.cs.st-andrews.ac.uk/submit", { //access the conjure backend
                                method: 'POST', headers: {
                                    'Content-Type': 'application/json'
                                }, body: JSON.stringify(details)
                            })
                                .then(response => response.json())
                                .then(json => {
                                    sessionStorage.clear();
                                    localStorage.setItem(json.jobid, new URL(document.location));
                                    getResult(json.jobid, statistics);
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
                        })
                });
        }
    }
});

/**
* Redirects the user to the results page
*/
function getResult(id, statistics) {

    var stats = []
    for (var stat in statistics) {
        if (statistics[stat]) {
            stats.push(stat.split("_")[1]) //gets the selected statistic choices
        }
    }

    var url = "result.html?id=" + id //job id from the solver


    if (stats.length > 0) {
        url += "&stats=" + stats
    }
    window.location.assign(url);

}

/**
* Dynamically adds the property choices that can be selected
*/
function setPropertyChoices() {
    var properties = JSON.parse(`${environment.properties}`) //stored in a global variable
    $.each(properties, function (i, item) {

        var input = document.createElement("input")
        input.classList.add("form-check-input")
        input.setAttribute("type", "checkbox")
        input.setAttribute("name", "property")
        input.setAttribute("id", i)
        input.setAttribute("value", i)

        var label = document.createElement("label")
        label.classList.add("form-check-label")
        label.appendChild(input)
        label.appendChild(document.createTextNode(item))

        var div = document.createElement("div")
        div.classList.add("form-check-inline")
        div.appendChild(label)
        $('#property_choices').append(div);

    });

    var url = new URL(document.location);
    var chosen = url.searchParams.get("property")

    //automatically fills in the input if data is in the URL 
    if (chosen) {
        chosen = chosen.split(",").filter(item => item.trim().length > 0)
        $.each(chosen, function (i, item) {
            $("#" + item).prop("checked", true)
        });
    }

}

/**
* Dynamically adds the stastic choices that can be selected
*/
function setStatisticChoices() {
    var statistics = JSON.parse(`${environment.statistics}`)
    $.each(statistics, function (i, item) {

        var input = document.createElement("input")
        input.classList.add("form-check-input")
        input.setAttribute("type", "checkbox")
        input.setAttribute("name", "property")
        input.setAttribute("id", i)
        input.setAttribute("value", i)

        var label = document.createElement("label")
        label.classList.add("form-check-label")
        label.appendChild(input)
        label.appendChild(document.createTextNode(item))

        var div = document.createElement("div")
        div.classList.add("form-check-inline")
        div.appendChild(label)
        $('#statistic_choices').append(div);

    });

}

/**
* Handles if a checkbox is checked or unchecked
*/
$(document).on('change', ':checkbox', function () {
    if ($(this).attr("id") === "all-statistic") { //if it is the all checkbox
        var check = false;
        if ($("#all-statistic").is(':checked')) { //if it has been checked
            check = true;
        }
        $('input:checkbox[id^="stat_"]').each(function () {
            $(this).prop('checked', check); //checks or unchecks all the statistic checkboxes
        });
    }

    //if all the statistic checkboxes except for the "all" checkbox is checked
    else if ($('input:checkbox[id^="stat_"]').length === $('input:checkbox[id^="stat_"]:checked').length && !$("#all-statistic").is(':checked')) {
        $("#all-statistic").prop('checked', true) //also check the "all" checkbox
    }

    else if ($(this).not(':checked')) {
        var id = $(this).attr("id")
        if (id.includes("stat")) {
            $("#all-statistic").prop('checked', false);
        }


    }

    var id = $(this).attr("id") + ","

    var currenturl = new URL(window.location);
    //stores the selected property choices in the URL
    if (id.includes("prop")) {
        if (!$(this).prop("checked")) { //if it gets unchecked
            id = currenturl.searchParams.get("property").split(",").filter(item => item.trim().length > 0)
            id = id.filter(item => item !== $(this).attr("id")) //remove it from the URL
        }
        else {
            if (currenturl.searchParams.get("property")) { //if it is checked add it to the URL
                id = currenturl.searchParams.get("property").split(",").filter(item => item.trim().length > 0).concat(id)
            }
        }

        if (id.length == 0) {
            currenturl.searchParams.delete('property'); //remove the parameter from the URL if empty
        }
        else {
            currenturl.searchParams.set('property', id); //update the URL
        }
        window.history.pushState({}, '', currenturl);
    }
}
);

/**
* Gets all the checkboxes that have been checked for a certain input field
* @param list   all the checkboxes for that input field
* @param all    the all checkbox if it exists for that input field
* @param id     which input field it is
*/
function getCheckedBoxes(list, all, id) {
    var checked = false;
    if (all) {
        if ($(all).is(':checked')) {
            checked = true;
        }
    }

    $.each(list, function (i, item) {
        list[i] = checked;
    });

    var selection = 'input:checkbox[id^="prop_"]:checked'
    if (id === "statistic") {
        selection = 'input:checkbox[id^="stat_"]:checked'
    }

    $(selection).each(function () {
        list[$(this).attr("id")] = true;
    });

    return list;
}

/**
* Formats all the added underlying patterns appropriately
* @param patterns   the underlying patterns
*/
function getPatterns(patterns) {
    var pattern_types = JSON.parse(`${environment.pattern_types}`)
    var representation = JSON.parse(`${environment.representation}`)
    var names = JSON.parse(`${environment.pattern_names}`)


    patterns.forEach((element, index) => {
        //whether it is a containment or avoidance pattern
        var containment = "containment";
        if (element.containment === "false") {
            containment = "avoidance";
        }

        //formats the permutation
        var perm = element.permutation.split(",");
        perm.forEach((e, i) => {
            perm[i] = parseInt(e);
        })
        patterns[index].permutation = perm

        var representation_name = representation[element.patterntype] //gets the approriate pattern name
        var grid_pattern = getGridPattern(representation_name, element) //gets the appropriate shaded pattern 

        var pattern = perm
        if (grid_pattern) {
            pattern = [perm, grid_pattern]
        }

        pattern_types[names[representation_name] + containment].push(pattern); //adds the pattern to the correct paramter

    });

    return pattern_types
}

function getGridPattern(name, pattern) {
    switch (name) {
        case "Vincular":
            return getColumns(pattern.pattern)
        case "Bivincular":
            return getColumns(pattern.pattern)
        case "Mesh":
            return getCells(pattern.pattern)

    }
}


function getColumns(grid) {
    var columns = []
    for (var col = 0; col < grid[0].length; col++) {
        if (grid[0][col] == 1) {
            columns.push(col)
        }
    }

    return columns;
}

function getCells(grid) {
    var cells = []
    for (var col = 0; col < grid.length; col++) {
        for (var row = 0; row < grid[col].length; row++) {
            if (grid[col][row] == 1) {
                cells.push([row, grid.length - 1 - col])
            }
        }
    }
    return cells;
}

function patternToUrl(pattern) {
    var currenturl = new URL(window.location);
    var array = ["-", pattern.permutation, pattern.patterntype, pattern.containment]

    if (currenturl.searchParams.get("patterns")) {
        array = currenturl.searchParams.get("patterns").concat(array)
    }

    currenturl.searchParams.set('patterns', array);
    window.history.pushState({}, '', currenturl);

}

function UrlToPattern() {
    var currenturl = new URL(window.location);
    var patterns = currenturl.searchParams.get("patterns");

    var count = 0;

    if (patterns) {
        patterns = patterns.split("-").filter(item => item.trim().length > 0)

        $.each(patterns, function (i, item) {

            var temp = item.split(",").filter(item => item.trim().length > 0)
            var array = []

            for (let i = 0; i < temp.slice(0, -2).length + 1; i++) {
                var arr = []
                for (let j = 0; j < temp.slice(0, -2).length + 1; j++) {
                    arr[j] = 0
                }
                array[i] = arr
            }
            var pattern = JSON.stringify({ permutation: temp.slice(0, -2).toString(), patterntype: temp.slice(-2, -1).toString(), containment: temp.slice(-1).toString(), pattern: array })
            sessionStorage.setItem(
                i,
                pattern
            )
            count++;

            addNewPattern(i, pattern);
        });
    }
    sessionStorage.setItem("total", count)

}

function isValidLength(patterns, length) {
    var arr = [];

    $.each(patterns, function (i, item) {
        arr[i] = item.permutation
    });

    var min = (arr.reduce((a, b) => a.length <= b.length ? a : b)).split(",").length
    return min < length


}

window.addEventListener("pageshow", function (event) {
    var perfEntries = performance.getEntriesByType("navigation");

    if (perfEntries[0].type === "back_forward") {
        location.reload();
    }
});
