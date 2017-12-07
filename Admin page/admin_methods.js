/* 
 made by EnricoGdx
 */



var xhttp, url = "/admin.php", admin = false;

function authentication() {
    var usrnm = document.getElementById("username").value;
    var psswrd = document.getElementById("password").value;

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var accepted = xhttp.responseText;
            if (accepted === "ok") {
                admin = true;
                document.getElementById("tag_or_field").style.visibility = "visible";
            } else
                document.getElementById("not_accepted").style.visibility = "visible";
        }
    };
    xhttp.open("POST", url, true);
    xhttp.send(usrnm + " " + psswrd);/* admin = true;
    document.getElementById("tag_or_field").style.visibility = "visible";*/

}

function field_or_tag() {

    var choice = document.getElementById("tag_or_field").value;
    if (choice === "tag") {
        document.getElementById("modify_tag").style.visibility = "visible";
        document.getElementById("modify_field").style.visibility = "hidden";

    } else if (choice === "field") {
        document.getElementById("modify_field").style.visibility = "visible";
        document.getElementById("modify_tag").style.visibility = "hidden";

    } else {
        document.getElementById("modify_field").style.visibility = "hidden";
        document.getElementById("modify_tag").style.visibility = "hidden";
    }
}

function table_field() {

    if (admin) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("tabella").innerHTML = xhttp.responseText;
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    } else
        document.getElementById("not_accepted").style.visibility = "visible";
}

function modify_field() {

    var operation = document.getElementById("operation_field").value;
    var field_name = document.getElementById("field_name").value;
    var answer = document.getElementById("field_answer").value;
    if (operation !== "") {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                table_field();
            }
        };
        if (operation === "remove") {
            xhttp.open("DELETE", url, true);
        } else
            xhttp.open("POST", url, true);
        xhttp.send(operation + " " + field_name + " " + answer);
    }
}

function table_tag() {

    if (admin) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("tabella").innerHTML = xhttp.responseText;
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    } else
        document.getElementById("not_accepted").style.visibility = "visible";
}

function modify_tag() {

    var operation = document.getElementById("operation_tag").value;
    var tag_name = document.getElementById("tag_name").value;
    var answer_function = document.getElementById("tag_function").value;
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    var file_in_json = "";
    var string;
    var reader = new FileReader();

    string = reader.readAsText(file);
    file_in_json = JSON.stringify(string);


    if (operation === "remove") {

        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                table_field();
            }
        };
        xhttp.open("DELETE", url, true);
        xhttp.send(operation + " " + tag_name);
    } else if (operation === "add") {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                table_field();
            }
        };
        xhttp.open("POST", url, true);
        xhttp.send(operation + " " + tag_name + answer_function + file_in_json);
    }
}


