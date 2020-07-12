// TODO: 
//       - prevent multiple clicks by showing a spinner
//       - about page
//       - footer layout
//       - alertify position    
// 

//const API_BASE = "http://localhost:8080"
const API_BASE = "https://vcs-backend.herokuapp.com"

$(document).ready(function (e) {

    //$("#result_section").hide();

    $("#upload-form").on('submit', (function (e) {
        e.preventDefault();
        $.ajax({
            url: API_BASE + "/upload",
            type: "POST",
            data: new FormData(this),
            contentType: false,
            processData: false,
            beforeSend: function () {
                reset_results();
            },
            success: function (res) {
                if (res == "invalid") {
                    // invalid file format.
                    alertify.error("<b>Error</b>: invalid data.");
                }
                else {
                    display_results(res);
                }
            },
            error: function (err) {
                display_errors(err);
            }
        });
    }));
});


$(document).ready(function (e) {
    $("#url-form").on('submit', (function (e) {
        e.preventDefault();
    }));
});



function send_url(elem) {

    if (elem == "custom") {
        // custom URL has been provided
        // retrieve its value
        elem = $("#url-input").val();
    }
    $.ajax({
        url: API_BASE + "/upload_url",
        type: "POST",
        data: {url: elem},
        beforeSend: function() {
            reset_results();
        },
        success: function(res) {
            if (res.status == "ok") {
                display_results(res);
            }
        },
        error: function(err) {
            display_errors(err);
            
        }
    });
};


// show only filename in fileupload form
$(".custom-file-input").on("change", function() {
  var fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

function reset_results() {
    $("#result-section").fadeOut();
    $("#faces-result-section").fadeOut();
    $("#card-collector").empty();
}

function display_results(res) {
    $("#processed-img").attr("src", res.result.processed)
    $("#upload-form")[0].reset();
    $("#file-input-name").html("Choose file...");
    $("#result-section").fadeIn();
    $("#faces-result-section").fadeIn();
    document.getElementById("result-section").scrollIntoView({ behavior: "smooth" });

    add_faces(res.result.faces)
}

function display_errors(err) {
    if (err.responseJSON != undefined) {
        alertify.error("<b>Error</b>: " + err.responseJSON.message);
    } else {
        alertify.error("<b>Error</b>: could not reach API server.")
    }
}

// adds the cropped faces
function add_faces(faces) {
    for (var i = 0; i < faces.length; i++) {
        
        var card_html = ""

        image_src = faces[i].face;
        image_prob = faces[i].probability;
        image_mask = faces[i].mask == true ? "Yes!" : "No!";

        card_html += '<div class="col-lg-3 col-md-6 card-container">'
        card_html += '<div class="card shadow rounded p-3">'
        card_html += '<img class="card-img-top rounded" src="' + image_src + '" alt="Card image cap">'
        
        //card_html += '<div class="card-body"><h5 class="card-title">Face ' + (i + 1) + '</h5></div>'
        
        card_html += '<ul class="list-group list-group-flush" style="text-align: left;">'
        card_html += '<li class="list-group-item">Wearing mask: <code>'+ image_mask + '</code></li>'
        card_html += '<li class="list-group-item">Probability: <code>'+ image_prob + '</code></li>'
        card_html += '</ul>'
        card_html += '</div>'
        card_html += '</div>'

        $("#card-collector").append($(card_html));
    }

}
