/* 
 made by EnricoGdx
 */



var xhttp, urlpar = "https://deasybot.herokuapp.com/api/parameters", urlint = "https://deasybot.herokuapp.com/api/intents", admin = false;

function authentication() {
    var usrnm = document.getElementById("username").value;
    var psswrd = document.getElementById("password").value;

    if (usrnm === "easy_name" && psswrd === "easy_password") {
        admin = true;
        document.getElementById("not_accepted").style.visibility = "hidden";
        document.getElementById("parameters_or_intent").style.visibility = "visible";
    } else
        document.getElementById("not_accepted").style.visibility = "visible";
        document.getElementById("parameters_or_intent").style.visibility = "hidden";
        document.getElementById("modify_intent").style.visibility = "hidden";
        document.getElementById("modify_parameters").style.visibility = "hidden";
        document.getElementById("tabella").innerHTML = "";
        //admin = false;
}
/* admin = true;
 document.getElementById("parameters_or_intent").style.visibility = "visible";*/



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
    var answer = []; 
     /*var error = false;
     var fileInput = document.getElementById('fileInput');     da corregere il bug
     var file = fileInput.files[0];
     var file_in_json = "", string = "";
     var reader = new FileReader();
     
     var file_exists = (fileInput.files.length > 0);
     if (file_exists) {
     string = reader.readAsText(file);
     file_in_json = JSON.stringify(string);
     }
     
     if (file_exists && parameters_name !== "" && operation !== "remove") {
     document.getElementById("errore_parameters").style.visibility = "visible";
     error = true;
     }*/

    // if (!error) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
           table(urlpar);
        }
    };

    if (operation === "remove") {
        xhttp.open("DELETE", urlpar, true);
        answer.push(parameters_name);

    } else {
        if (parameters_name !== "") {
            document.getElementById("errore_parameters").style.visibility = "hidden";
            xhttp.open("POST", urlpar, true);
            answer.push({key: parameters_name, value: parameters_answer});
        } /*else {
         document.getElementById("errore_parameters").style.visibility = "hidden";
         xhttp.open("POST", urlpar, true);
         answer.push({key: +parameters_name, value: file_in_json});
         }*/
    }

    xhttp.setRequestHeader("Content-type", "Application/json");
    json_answer = JSON.stringify(answer);
    xhttp.send(json_answer);
    // }
}


