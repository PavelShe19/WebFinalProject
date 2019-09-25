var flight_data = [];
var hotel_data = [];
var car_data = [];

var flight_selected_index = -1;
var hotel_selected_index = -1;
var car_selected_index = -1;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.

        document.getElementById("user_div").style.display = "block";
        document.getElementById("login_div").style.display = "none";

        // document.getElementById("packages").style.display = "block";
        document.getElementById("location_and_weather").style.display = "block";

        var user = firebase.auth().currentUser;

        if (user != null) {

            var email_id = user.email;
            document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;

        }

    } else {
        // No user is signed in.
        document.getElementById("user_div").style.display = "none";
        document.getElementById("login_div").style.display = "block";
        // document.getElementById("packages").style.display = "invisible";
        document.getElementById("location_and_weather").style.display = "none";
    }
});

function signUp() {

    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        window.alert("Error : " + errorMessage);
    });
}


function login() {
    //console.log("DEBUG: IN: login()");
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;
    //console.log("DEBUG: EMAIL: %s", userEmail);
    //console.log("DEBUG: PASS: %s", userPass);
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {

        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert("Error : " + errorMessage);
        // ...
    });
}

function logout() {
    firebase.auth().signOut();
}

function backToMainPage() {
    window.location.href = "../html/MainPage.html";
}

function scheduleA(event) {
    if (this.selectedIndex != 0) {
        //alert(this.options[this.selectedIndex].text);
        var location = this.options[this.selectedIndex].text;
        myFunc_v2(location);
        location = location.toLowerCase();
        location = location.replace(" ", "_");
        getDataFromFirebase(location,"flight_data","destination","flightList", window.flight_data);
        getDataFromFirebase(location,"hotel_data","location","hotelList", window.hotel_data);
        getDataFromFirebase(location,"car_data","car","carList", window.car_data);
    }

}

function getDataFromFirebase(location, collection, fieldName, list, data_array) {
    var db = firebase.firestore();
    if(data_array.length != 0) {
        data_array = [];
    }
    if(collection != "car_data") {
        db.collection(collection).where(fieldName, "==", location)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                    data_array.push(doc.data());
                });
                clearList(list);
                putDataInListExp(list, data_array.sort(compareBuyable));
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    } else {
        db.collection(collection)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                data_array.push(doc.data());
            });
            clearList(list);
            putDataInListExp(list, data_array);
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
    }
}

function putDataInList(listName, data_array) {
    var index = 1;
    data_array.forEach(element => {
        var node = document.createElement("LI");
        node.setAttribute("id", listName.concat("_", index.toString()));
        index = index + 1;
        node.setAttribute("class", "list-group-item");
        var textnode = document.createTextNode(element.name);         // Create a text node
        node.appendChild(textnode);                              // Append the text to <li>
        document.getElementById(listName).appendChild(node);     // Append <li> to <ul> with id="myList" 
    });
}

function putDataInListExp(listName, data_array) {

    var index = 1;

    data_array.forEach(element => {
        //main element - li
        var node = document.createElement("LI");
        node.setAttribute("id", listName.concat("_", index.toString()));
        node.setAttribute("class", "list-group-item");
        //div container
        var containerDiv = document.createElement("DIV");
        containerDiv.setAttribute("class","container");
        //img
        var img = document.createElement("IMG"); 
        img.setAttribute("src", element.image);
        img.setAttribute("class","img-thumbnail");
        img.setAttribute("style","width:50%");
        //div row name
        var nameDiv = document.createElement("DIV");
        nameDiv.setAttribute("class","row");
        var textnode = document.createTextNode(element.name);
        nameDiv.appendChild(textnode);
        //div row price
        var priceDiv = document.createElement("DIV");
        priceDiv.setAttribute("class","row");
        var textnode = document.createTextNode(element.price+'$');
        priceDiv.appendChild(textnode);
        // button
        var selectButton = document.createElement("BUTTON");
        selectButton.setAttribute("id","btn"+node.id);
        selectButton.setAttribute("onClick","clickListener(this.id)");
        var textnode = document.createTextNode("SELECT");
        selectButton.appendChild(textnode);

        containerDiv.appendChild(img);
        containerDiv.appendChild(nameDiv);
        containerDiv.appendChild(priceDiv);
        containerDiv.appendChild(selectButton);

        node.appendChild(containerDiv);

        document.getElementById(listName).appendChild(node);

        index = index + 1;
    });
    console.log("done loading: " + listName);
}

function clickListener(id) {
    $("#"+ id.substring(3)).toggleClass('active').siblings().removeClass('active');
    thenum = id.match(/\d+/)[0];
    if($("#"+ id.substring(3)).hasClass('active')) {
        if(id.search("flight")>-1) {
            window.flight_selected_index = thenum-1;
        }
        if(id.search("hotel")>-1) {
            window.hotel_selected_index = thenum-1;
        }
        if(id.search("car")>-1) {
            window.car_selected_index = thenum-1;
        }   
    } else {
        if(id.search("flight")>-1) {
            window.flight_selected_index = -1;
        }
        if(id.search("hotel")>-1) {
            window.hotel_selected_index = -1;
        }
        if(id.search("car")>-1) {
            window.car_selected_index = -1;
        }
    }
    updateCosts();
}

function compareBuyable( a, b ) {
    if ( parseInt(a.price) < parseInt(b.price) ){
      return -1;
    }
    if ( parseInt(a.price) > parseInt(b.price) ){
      return 1;
    }
    return 0;
  }

function clearList(listName) {
    while (document.getElementById(listName).firstChild) {
        document.getElementById(listName).removeChild(document.getElementById(listName).firstChild);
    }
}

function updateCosts() {
    if(flight_selected_index > -1) {
        var flightCost = flight_data[flight_selected_index].price;
    } else {
        var flightCost = 0;
    }
    if(hotel_selected_index > -1) {
        var hotelCost = hotel_data[hotel_selected_index].price*numOfDays;
    } else {
        var hotelCost = 0;
    }
    if(car_selected_index > -1) {
        var carCost = car_data[car_selected_index].price*numOfDays;
    } else {
        var carCost = 0;
    }
    
    
    document.getElementById("flightCost").innerHTML = "FLIGHT COST: " + flightCost;
    document.getElementById("hotelCost").innerHTML = "HOTEL COST: " + hotelCost;
    document.getElementById("carCost").innerHTML = "CAR COST: " + carCost;

    var totalCost = flightCost + hotelCost + carCost;
    document.getElementById("totalCost").innerHTML = "TOTAL COST: " + totalCost;
}