/* 
 made by EnricoGdx
 */



var xhttp, urlpar = "https://deasybot.herokuapp.com/api/parameters", urlint = "https://deasybot.herokuapp.com/api/intents", admin = false;
var lines, newArr;

function authentication() {
    var usrnm = document.getElementById("username").value;
    var psswrd = document.getElementById("password").value;

    if (usrnm === "easy_name" && psswrd === "easy_password") {
        admin = true;
        document.getElementById("not_accepted").style.visibility = "hidden";
        document.getElementById("parameters_or_intent").style.visibility = "visible";
    } else
        document.getElementById("not_accepted").style.visibility = "visible";

}

function intent_or_parameters() {

    var choice = document.getElementById("parameters_or_intent").value;

    if (choice === "parameters") {
        document.getElementById("modify_parameters").style.visibility = "visible";
        document.getElementById("modify_intent").style.visibility = "hidden";
        table(urlpar);

    } else if (choice === "intent") {
        document.getElementById("modify_intent").style.visibility = "visible";
        document.getElementById("modify_parameters").style.visibility = "hidden";
        table(urlint);

    } else {
        document.getElementById("modify_intent").style.visibility = "hidden";
        document.getElementById("modify_parameters").style.visibility = "hidden";
        document.getElementById("tabella").innerHTML = "";
    }
}

function table(url) {

    var elements;
    if (admin) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                elements = JSON.parse(xhttp.responseText);
                var table = "<table>";
                for (i = 0; i < elements.length; i++) {
                    console.log();
                    table += "<tr><td>" + elements[i].key + "</td><td>" + elements[i].value + "</td></tr>";
                }
                table += "</table>";
                document.getElementById("tabella").innerHTML = table;
            }
        };
        xhttp.open("GET", url, true);

        xhttp.send()
    } else
        document.getElementById("not_accepted").style.visibility = "visible";
}

function modify_intent() {

    var operation = document.getElementById("operation_intent").value;
    var intent_name = document.getElementById("intent_name").value;
    var intent_answer = document.getElementById("intent_answer").value;
    var answer = [];

    if (operation !== "") {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                table(urlint);
            }
        };
        if (operation === "remove") {
            xhttp.open("DELETE", urlint, true);
            answer.push(intent_name);

        } else {
            xhttp.open("POST", urlint, true);
            answer.push({key: intent_name, value: intent_answer});
        }

        xhttp.setRequestHeader("Content-type", "Application/json");
        json_answer = JSON.stringify(answer);
        xhttp.send(json_answer);
    }
}

function modify_parameters() {

    var operation = document.getElementById("operation_parameters").value;
    var parameters_name = document.getElementById("parameters_name").value;
    var parameters_answer = document.getElementById("parameters_function").value;
    var answer = [], file_loaded = false;

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            table(urlpar);
        }
    };

    if (loadFile) {
        if (parameters_name !== "")
            document.getElementById("errore_parameters").style.visibility = "visible";
        else {
            xhttp.open("POST", urlpar, true); console.log("entered in json request");
            xhttp.setRequestHeader("Content-type", "Application/json");
            json_answer = JSON.stringify(newArr); console.log(json_answer); console.log(newArr);
            xhttp.send(newArr);
        }

    } else {
        if (operation === "remove") {
            xhttp.open("DELETE", urlpar, true);
            answer.push(parameters_name);

        } else {
            if (parameters_name !== "") {
                document.getElementById("errore_parameters").style.visibility = "hidden";
                xhttp.open("POST", urlpar, true);
                answer.push({key: parameters_name, value: parameters_answer});
            }
        }

        xhttp.setRequestHeader("Content-type", "Application/json");
        json_answer = JSON.stringify(answer);
        xhttp.send(json_answer);
    }
}

function loadFile() {
    var input, file, fr, worked = false;

    if (typeof window.FileReader !== 'function') {
        console.log("The file API isn't supported on this browser yet.");
        return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
        console.log("Um, couldn't find the fileinput element.");
    } else if (!input.files) {
        console.log("This browser doesn't seem to support the `files` property of file inputs.");
    } else if (!input.files[0]) {
        console.log("Please select a file before clicking 'Load'");
    } else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;console.log(fr.onload); console.log(fr);
        fr.readAsText(file); console.log(fr.readAsText(file));
        worked = true;
    }

    function receivedText(e) {
        lines = e.target.result; console.log(e.target.result);
        newArr = JSON.parse(lines); console.log(newArr);
    }

    return (worked);
}


