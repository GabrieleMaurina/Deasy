/* 
 made by EnricoGdx
 */



var xhttp, urlpar = "https://deasybot.herokuapp.com/api/parameters", urlint = "https://deasybot.herokuapp.com/api/intents", admin = false;

function authentication() {
    var usrnm = document.getElementById("username").value;
    var psswrd = document.getElementById("password").value;

    if (usrnm === "admin_deasy" && psswrd === "123") {
        admin = true;
        document.getElementById("not_accepted").style.visibility = "hidden";
        document.getElementById("parameters_or_intent").style.visibility = "visible";
    } else
        document.getElementById("not_accepted").style.visibility = "visible";
}
/* admin = true;
 document.getElementById("parameters_or_intent").style.visibility = "visible";*/



function intent_or_parameters() {

    var choice = document.getElementById("parameters_or_intent").value;
    if (choice === "parameters") {
        document.getElementById("modify_parameters").style.visibility = "visible";
        document.getElementById("modify_intent").style.visibility = "hidden";

    } else if (choice === "intent") {
        document.getElementById("modify_intent").style.visibility = "visible";
        document.getElementById("modify_parameters").style.visibility = "hidden";

    } else {
        document.getElementById("modify_intent").style.visibility = "hidden";
        document.getElementById("modify_parameters").style.visibility = "hidden";
    }
}

function table_intent() {

    if (admin) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("tabella").innerHTML = xhttp.responseText;
            }
        };
        xhttp.open("GET", urlint, true);

        xhttp.send()
    } else
        document.getElementById("not_accepted").style.visibility = "visible";
}

function modify_intent() {

    var operation = document.getElementById("operation_intent").value;
    var intent_name = document.getElementById("intent_name").value;
    var intent_answer = document.getElementById("intent_answer").value;
    var answer = [], string;

    if (operation !== "") {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("tabella").innerHTML = xhttp.responseText;
            }
        };
        if (operation === "remove") {
            xhttp.open("DELETE", urlint, true);

            answer.push(intent_name);

        } else {
            xhttp.open("POST", urlint, true);
            answer.push({key: intent_name, value: intent_answer});
        }
        json_answer = JSON.stringify(answer);
        xhttp.send(json_answer);
    }
}

function table_parameters() {

    if (admin) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("tabella").innerHTML = xhttp.responseText;
            }
        };
        xhttp.open("GET", urlpar, true);
        xhttp.send();
    } else
        document.getElementById("not_accepted").style.visibility = "visible";
}

function modify_parameters() {

    var operation = document.getElementById("operation_parameters").value;
    var parameters_name = document.getElementById("parameters_name").value;
    var parameters_answer = document.getElementById("parameters_function").value;
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    var file_in_json = "", string = "";
    var reader = new FileReader(), error = false;
    var answer = [];

    var file_exists = (fileInput.files.length > 0);
    if (file_exists) {
        string = reader.readAsText(file);
        file_in_json = JSON.stringify(string);
    }

    if (file_exists && parameters_name !== "" && operation !== "remove") {
        document.getElementById("errore_parameters").style.visibility = "visible";
        error = true;
    }

    if (!error) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("tabella").innerHTML = xhttp.responseText;
            }
        };

        if (operation === "remove") {
            xhttp.open("DELETE", urlpar, true);
            answer.push(parameters_name);

        } else {
            if (parameters_name !== "") {
                document.getElementById("errore_parameters").style.visibility = "hidden";
                xhttp.open("POST", urlpar, true);
                xhttp.setRequestHeader("Content-type","Application/json")
                answer.push({key : parameters_name, value : parameters_answer});
            } else {
                document.getElementById("errore_parameters").style.visibility = "hidden";
                xhttp.open("POST", urlpar, true);
                xhttp.setRequestHeader("Content-type","Application/json")
                answer.push({key : + parameters_name, value : file_in_json});
            }
        }
        console.log(answer);
        json_answer = JSON.stringify(answer);
        console.log(json_answer);
        xhttp.send(json_answer);
    }
}


