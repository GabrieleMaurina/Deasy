/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var xhttp, url;

function authentication() {
    var admin = false;
    var usrnm = document.getElementById("username").value;
    var psswrd = document.getElementById("password").value;

    /*xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function () {
     if (this.readyState == 4 && this.status == 200) {
     var accepted = xhttp.responseText;
     if (accepted === "ok")
     admin = true;
     tabes();
     else
     document.getElementById("not_accepted").style.visibility = "visible";
     }
     };
     xhttp.open("POST", url, true);
     xhttp.send(usrnm + " " + psswrd);*/ admin = true;
    tables(admin);
}

function tables(admin) {

    if (admin) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("modify_table").style.visibility = "visible";
                document.getElementById("tabella").innerHTML = xhttp.responseText;
            }
        };
        xhttp.open("GET", "http://localhost:8084/IngSoft2_prog/admin.php", true);
        xhttp.send();
    } else
        document.getElementById("not_accepted").style.visibility = "visible";
}

function modify() {

    var operation = document.getElementById("operation").value;
    var field_name = document.getElementById("field_name").value;
    var answer = document.getElementById("answer").value;
    if (operation !== "") {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                tables(true);
            }
        };
        xhttp.open("POST", url, true);
        xhttp.send(operation + " " + field_name + " " + answer);
    }
}

