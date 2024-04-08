const form = document.getElementById('form');
var array = []

function isValidPermutation(permutation) {
    if (!isNaN(permutation.replace(/\s/g, ''))) {
        if (/\s/g.test(permutation)) {
            var permutation = permutation.split(" ");
            array = permutation.slice()

            permutation.sort((a, b) => a - b);
            var largest = (permutation.slice(-1).pop())
        }

        else {
            var largest = 0;

            for (var i = 0; i < permutation.length; i++) {
                if (permutation.charAt(i) > largest) {
                    largest = permutation.charAt(i)
                }
            }

            array = permutation.split("")
        }
        var uniqueNumbers = new Set(permutation).size == permutation.length;

        return uniqueNumbers && (largest == permutation.length) && permutation != []
    }

    return false;

}

$(document).on('click', '#permutationbutton', function () {
    var permutation = document.getElementById("permutation").value
    if (
        !isValidPermutation(permutation)

    ) {
        document.getElementById("permutation").classList.add('is-invalid')
    }

    else {
        document.getElementById("permutation").classList.remove('is-invalid')
        var currenturl = new URL(window.location);
        currenturl.searchParams.set('permutation', array);
        window.history.pushState({}, '', currenturl);
        dispatchEvent(new PopStateEvent('popstate', {}));
        $('#permutationbutton').val("Visualise")
        $('#clearpattern').removeAttr('hidden')
        $('#addpatternbtn').removeAttr('hidden')
    }

});