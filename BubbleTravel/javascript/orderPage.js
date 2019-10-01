var flight_data = [];
var hotel_data = [];
var car_data = [];

var flight_selected_index = -1;
var hotel_selected_index = -1;
var car_selected_index = -1;

var cityLocation;
var userID;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.

        document.getElementById("user_div").style.display = "block";
        document.getElementById("login_div").style.display = "none";
        document.getElementById("location_and_weather").style.display = "block";

        var user = firebase.auth().currentUser;

        if (user != null) {

            var email_id = user.email;
            userID = user.uid;
            document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;

        }

    } else {
        // No user is signed in.
        document.getElementById("user_div").style.display = "none";
        document.getElementById("login_div").style.display = "block";
        document.getElementById("location_and_weather").style.display = "none";
    }
});

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
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
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;
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
        var location = this.options[this.selectedIndex].text;
        window.cityLocation = location;
        //location change
        flight_data = [];
        hotel_data = [];
        car_data = [];

        flight_selected_index = -1;
        hotel_selected_index = -1;
        car_selected_index = -1;
        updateCosts();
        
        myFunc_v2(location);
        location = location.toLowerCase();
        location = location.replace(" ", "_");
        getDataFromFirebase(location,"flight_data","destination","flightList", window.flight_data, new Array("ECONOMY","BUSINESS"));
        getDataFromFirebase(location,"hotel_data","location","hotelList", window.hotel_data, new Array("3 STARS","4 STARS","5 STARS"));
        getDataFromFirebase(location,"car_data","car","carList", window.car_data, new Array("MINI","COMPACT","LUXURY"));
    }

}

function getDataFromFirebase(location, collection, fieldName, list, data_array, quality_names) {
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
                putDataInListExp(list, data_array.sort(compareBuyable),quality_names);
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
            putDataInListExp(list, data_array.sort(compareBuyable),quality_names);
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
    }
}

function putDataInListExp(listName, data_array, quality_names) {

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
        var textnode = document.createTextNode(element.name + " - " + quality_names[element.quality-1]);
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

function orderPackage() {
    if(car_selected_index == -1 && flight_selected_index == -1 && hotel_selected_index == -1) {
        alert("Please select at least one option");
        return;
    }
    if(window.date_from == null || window.date_to == null) {
        alert("Please select dates");
        return;
    }
    let db = firebase.firestore();

    let flightHash = "0";
    let hotelHash = "0";
    let carHash = "0";

    let carObj = null;
    if(car_selected_index > -1) {
        carObj = window.car_data[car_selected_index];
        carHash = carObj.name;
    }
    let hotelObj = null;
    if(hotel_selected_index > -1) {
        hotelObj = window.hotel_data[hotel_selected_index]
        hotelHash = hotelObj.name;
    }
    let flightObj = null;
    if(flight_selected_index > -1) {
        flightObj = window.flight_data[flight_selected_index]
        flightHash = flightObj.name;
    }
    let orderID = window.userID;
    orderID = orderID.concat(flightHash.hashCode());
    orderID = orderID.concat(hotelHash.hashCode());
    orderID = orderID.concat(carHash.hashCode());
    orderID = orderID.concat(window.date_from.hashCode());
    orderID = orderID.concat(window.date_to.hashCode());
    // Add a new document in collection "cities"
    console.log("orderID: ", orderID);
    db.collection("orders").add({
        car: carObj,
        date_from: window.date_from,
        date_to: window.date_to,
        flight: flightObj,
        hotel: hotelObj,
        location: window.cityLocation.toLowerCase(),
        num_of_nights: window.numOfDays.toString(),
        orderID: orderID,
        user: window.userID
    })
    .then(function() {
        console.log("Document successfully written!");
        var result = document.getElementById("done");
        result.innerHTML = "DONE";
        result.setAttribute("style","color:MediumSeaGreen");
        $("#done").fadeTo(5000,1).fadeOut(1000);
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
        var result = document.getElementById("done");
        result.innerHTML = "ERROR";
        result.setAttribute("style","color:Tomato");
        $("#done").fadeTo(5000,1).fadeOut(1000);
    });
}

String.prototype.hashCode = function() {
    let hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  function showOrders() {
    window.location.href = "previewPage.html";
  }