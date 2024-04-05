var containerWidth = 0;
var width = 0;
var height = 0;
var num = 0;

var clientWidth = 0;

var grid;
var data;

var evidence_count = 0;


// idea: edit loadGrid to accept pattern and permutation. 
loadGrid(getPattern(), getPermutation(), "grid")

/**
* Sets up the data associated with the grid within solution svg
*/
function gridData(i, n) {
    var grid = document.getElementById("grid");
    var data = new Array();

    if ( i == 0){ // Input page 
        var cs = getComputedStyle(grid.parentElement);
        this.clientWidth = grid.clientWidth
        this.containerWidth = (clientWidth - parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) - 5) * 0.65;
        var number = num + 1
    } else { // Results page
        this.clientWidth = 250;
        this.containerWidth = 200;
        var number = n + 1          // from perm length 
    }

    var xpos = (clientWidth - this.containerWidth) / 2 ;
    var ypos = 5;
    this.width = this.containerWidth / number - 1 ;
    this.height = this.width;
    var click = 0;
        
    // iterate for rows	
    for (var row = 0; row < number; row++) {
        data.push(new Array());

        // iterate for cells/columns inside rows
        for (var column = 0; column < number; column++) { //each square has this information
            data[row].push({
                row: row,
                column: column,
                x: xpos,
                y: ypos,
                width: this.width,
                height: this.height,
                click: click
            })
            // increment the x position. I.e. move it over by 50 (width variable)
            xpos += this.width;
        }
        // reset the x position after a row is complete
        xpos = (this.clientWidth - this.containerWidth) / 2;
        // increment the y position for the next row. Move it down 50 (height variable)
        ypos += this.height;
    }

    evidence_count = 0

    return data;

}

/**
* Loads the grid used to represent a permutation
* @param pattern the shaded cells on the grid for input, and evidence on solutions
*/
function loadGrid(pattern, permutation, grid_id) {            // pattern from getPattern() loaded from URL
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    data = gridData(url.toString().includes("result"), permutation.length)
    grid = d3.select("#" + grid_id)

    grid.attr("height", containerWidth + 5);

    // need extra row - eg. if permutation has length 4 the grid is 5*5
    var row = grid.selectAll(".row")
        .data(data)
        .enter().append("g")
        .attr("class", "row align-items-center");

    var column = row.selectAll(".square")
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("class", function (d) { return "square row_" + d.row + " column_" + d.column; })
        .attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y; })
        .attr("width", function (d) { return d.width; })
        .attr("height", function (d) { return d.height; })
        .style("fill", "#FFFFFF")
        .style("stroke", "#222")

    permutation.forEach(function(val, index) { // note - index is x , val is y
        createDot(val, index, (permutation.length < 11 ? 10 - (permutation.length) : 15 - 8 * 1), "black", "black");
    })  

    function createDot(value, index, rad, fill_colour, stroke_colour) {
        var xpos = (this.clientWidth - this.containerWidth) / 2;
        grid.append("circle")
            .attr("cx", ((index + 1) * width) + xpos)
            .attr("cy", (permutation.length - value + 1) * height + 5)
            .attr("r", rad)
            .style("fill", fill_colour)
            .style("stroke", stroke_colour);
    }

    function plotEvidence(type, patterns){ // patterns - specified on input
        pattern.get(type).forEach(function(evidence, i){ // uses pattern map function to find corresponding evidence
            var colour = colour_id[evidence_count]
            var evidence_x = evidence;

            var evidence_y = evidence.map(function(x) {
                return permutation[x-1] 
            });

            evidence_x.forEach(function(x, j) {
                createDot(evidence_y[j], x - 1, 10 + 5*evidence_count, "none", colour)
            });

            if (type == "vinc-cont"){
                var bar_param = patterns[i][1];   // gives bars corresponding to evidence set.
                bar_param.forEach(function(x){ // bar_param specifies shaded bars in vinc- pattern
                        
                grid.selectAll(".square").each(function (d) {
                    
                // Modify - should only shade n columns for n shaded bars.
                    if (d.column == evidence[x] - 1) { //if the cell is meant to be shaded then display it as such
                        d3.select(this).style("fill", colour)
                        .attr('fill-opacity', 0.2)
                        // console.log(bar_param[1], evidence, d)
                    }
                })
            })
            }

            // Methods to be extended for other pattern types. 

            grid.append("text")
                .attr("x", 1.6*containerWidth)
                .attr("y", containerWidth / 10 + 30 * evidence_count)
                .attr("text-anchor", "middle")
                .text("Evidence for  " + JSON.stringify(patterns[i])) 
                .style("fill", colour)
                .style("font-size", 15)

            evidence_count++;
        })
        
    }

    // If on solutions, pattern = evidence
    if (url.toString().includes("result") && pattern !== null){

        // Retrieve patterns from input
        input_patterns = JSON.parse(localStorage["lastSubmitData"]);

        classic_cont_pattern = input_patterns.classic_containment;
        if (classic_cont_pattern.length > 0){
            plotEvidence("cl-cont", classic_cont_pattern)
        }

        vincular_cont_pattern = input_patterns.vincular_containment;
        if (vincular_cont_pattern.length > 0){
            plotEvidence("vinc-cont", vincular_cont_pattern)
        }

        // To be extended to other patterns on modification of the Essence models. 

    } else {

        if (pattern) { //if there are already shaded cells on the grid
            grid.selectAll(".square").each(function (d) {
                if (pattern[d.row][d.column] == 1) { //if the cell is meant to be shaded then display it as such
                    d.click++;
                    d3.select(this).style("fill", "#AEAEAE")
                }
            })
        }
    
        // All the methods below are dynamic methods dedicated to shading on click / input
        var representation = urlParams.get('type');
    
        if (representation == 2 || representation == 3) { //vincular or bivincular pattern
            column.on('click', function (d) {
                data.forEach(function (value) { //clicking a cell shades the entire column
                    value.forEach(function (item) {
                        if (item.column == d.column) {
                            item.click++;
                        }
                    })
    
                })
    
                if ((d.click) % 2 == 0) { //if the shading needs to be removed
                    row.selectAll(".column_" + d.column).style("fill", "#FFFFFF");
    
                    if (representation == 3) {
                        grid.selectAll(".square").each(function (square) {
                            if (!(square.row == 0 || square.row == permutation.length)) { //all rows but the boundary rows
                                d3.select(this).style("fill", "#FFFFFF")
                            }
                        })
                    }
                }
                if ((d.click) % 2 == 1) { //if shading needs to be added to the cell
                    row.selectAll(".column_" + d.column).style("fill", "#AEAEAE");
                    if (representation == 3) {
                        grid.selectAll(".square").each(function (square) { //all rows but the boundary rows
                            if (!(square.row == 0 || square.row == permutation.length)) {
                                d3.select(this).style("fill", "#AEAEAE")
                            }
                        })
                    }
                }
    
            });
        }
    
        else if (representation == 4) { //mesh pattern
            column.on('click', function (d) { //any cell can be clicked
                d.click++;
                if ((d.click) % 2 == 0) {
                    d3.select(this).style("fill", "#fff"); //remove shading
                }
                if ((d.click) % 2 == 1) {
                    d3.select(this).style("fill", "#AEAEAE"); //add shading
                }
            });
    
        }
    
        else if (representation == 5) { //boxed mesh 
            grid.selectAll(".square").each(function (d) { //shade all cells but the boundary ones
                if ((!(d.row == 0 || d.row == permutation.length)) && !(d.column == 0 || d.column == permutation.length)) {
                    d3.select(this).style("fill", "#AEAEAE")
                }
            })
        }
    
        else if (representation == 6) { //consecutive pattern
            grid.selectAll(".square").each(function (d) { //all columns but the boundary ones
                if (!(d.column == 0 || d.column == permutation.length)) {
                    d3.select(this).style("fill", "#AEAEAE")
                }
            })
        }
    

    }

}

/**
* Gets the permutation that the grid is meant to be representing - PERM NEVER IN URL
*/
function getPermutation() { 
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    if (urlParams.get('permutation')) { //if there is a permutation 
        var permutation = urlParams.get('permutation').split(',') //format the elements
        num = permutation.length //get the length of the permutation
        sessionStorage.setItem('num', num);
    }

    else { //if there is no permutation
        var permutation = []
        var storedNum = sessionStorage.getItem('num');
        if (storedNum) {
            num = parseInt(storedNum);
        }
        else {
            num = 3; //default value if no stored value is found
        }
    }

    return permutation
}

/**
* Clears the pattern shown on the grid
*/
$(document).on('click', '#clearpattern', function () {
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    //only if its a pattern that can be input by the user
    if (urlParams.get("type") == 2 || urlParams.get("type") == 3 || urlParams.get("type") == 4) {
        clearSquares();
    }

});

/**
* Resets all the cells in the grid
*/
function clearSquares() {
    grid.selectAll(".square")
        .style('fill', "#FFFFFF")

    data.forEach(function (value) {
        value.forEach(resetClicks)
    })
}

/**
* Resets the value of clicks for a cell in the grid
*/
function resetClicks(value) {
    value.click = 0;
}

/**
* Gets the cells that should be shaded on the grid
*/
function getPattern() {                     // stored in URL corresponds to each underlying pattern
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    var id = urlParams.get("id")

    var pattern = null
    if (id) {
        pattern = (JSON.parse(sessionStorage.getItem(id))).pattern;

    }

    return pattern
}

/**
* Listens for a change in the URL -indicates that the permutation inputs have changed 
*/
window.addEventListener('popstate', function (event) {
    grid.selectAll(".row").remove()
    grid.selectAll("circle").remove()

    loadGrid(getPattern(), getPermutation(), "grid")
});

/**
* If a button representing an added pattern is clicked
*/
$(document).on('click', '.pattern-input', function (e) {
    var url = new URL(document.location);
    var urlParams = url.searchParams;
    var patternid = $(this).parent().attr("value");
    var pattern = JSON.parse(sessionStorage.getItem(patternid)); //gets its information


    if ($(this).is(":checked")) { //if it is selected
        urlParams.set('id', patternid);
        urlParams.set('permutation', pattern.permutation)
        urlParams.set('type', pattern.patterntype)
        urlParams.set('contain', pattern.containment)

        window.history.pushState({}, '', url); //to show the information relating to the pattern that needs to be displayed


        $(".pattern-input").prop("checked", false) //untoggles all the other buttons 
        $(this).prop("checked", true)

        $(".patternbtn").removeClass("selected-pattern")
        $(this).parent().addClass("selected-pattern")
        grid.selectAll(".row").remove()
        grid.selectAll("circle").remove()
        loadGrid(pattern.pattern, getPermutation(), "grid")

        dispatchEvent(new PopStateEvent('popstate', {}));

    }

    else { //if it is deselected
        urlParams.delete("permutation")
        urlParams.delete("id")
        urlParams.delete("contain")
        $(this).parent().removeClass("selected-pattern")
        $(this).prop("checked", false)

        window.history.pushState({}, '', url);

        dispatchEvent(new PopStateEvent('popstate', {}));


    }



});