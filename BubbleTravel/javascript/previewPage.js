var data_array = [];
var selectedOrder = -1;
var userID;
var currentCity;
var prevCity;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.

        document.getElementById("user_div").style.display = "block";
        document.getElementById("login_div").style.display = "none";

        // document.getElementById("packages").style.display = "block";
        //document.getElementById("location_and_weather").style.display = "block";

        var user = firebase.auth().currentUser;

        if (user != null) {

            var email_id = user.email;
            userID = user.uid;
            document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;

            getDataFromFirebase();
        }

    } else {
        // No user is signed in.
        document.getElementById("user_div").style.display = "none";
        document.getElementById("login_div").style.display = "block";
        // document.getElementById("packages").style.display = "invisible";
        //document.getElementById("location_and_weather").style.display = "none";
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

function goToOrderPage() {
    window.location.href = "orderPage.html";
}

function getDataFromFirebase() {
    var db = firebase.firestore();
    var list = "orderList";
    if (window.data_array.length != 0) {
        window.data_array = [];
    }
    db.collection("orders").where("user", "==", window.userID)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                window.data_array.push(doc.data());
            });
            clearList(list);
            putDataInListExp(list, window.data_array);
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
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
        containerDiv.setAttribute("class", "container");
        // //img
        // var img = document.createElement("IMG"); 
        // img.setAttribute("src", element.image);
        // img.setAttribute("class","img-thumbnail");
        // img.setAttribute("style","width:50%");
        //div row location
        var nameDiv = document.createElement("DIV");
        nameDiv.setAttribute("class", "row");
        var textnode = document.createTextNode(element.location.toUpperCase() + ": " + element.date_from + " - " + element.date_to);
        nameDiv.appendChild(textnode);
        //div row price
        let flightPrice = 0;
        if(element.flight != null) {
            flightPrice = element.flight.price;
        }
        let hotelPrice = 0;
        if(element.hotel != null) {
            hotelPrice = element.hotel.price;
        }
        let carPrice = 0;
        if(element.car != null) {
            carPrice = element.car.price;
        }
        var price = flightPrice + element.num_of_nights * (hotelPrice + carPrice);
        var priceDiv = document.createElement("DIV");
        priceDiv.setAttribute("class", "row");
        var textnode = document.createTextNode(price + '$');
        priceDiv.appendChild(textnode);
        // button
        var selectButton = document.createElement("BUTTON");
        selectButton.setAttribute("id", "btn" + node.id);
        selectButton.setAttribute("onClick", "clickListener(this.id)");
        var textnode = document.createTextNode("SELECT");
        selectButton.appendChild(textnode);

        // containerDiv.appendChild(img);
        containerDiv.appendChild(nameDiv);
        containerDiv.appendChild(priceDiv);
        containerDiv.appendChild(selectButton);

        node.appendChild(containerDiv);

        document.getElementById(listName).appendChild(node);

        index = index + 1;
    });
    console.log("done loading: " + listName);
}

function clearList(listName) {
    while (document.getElementById(listName).firstChild) {
        document.getElementById(listName).removeChild(document.getElementById(listName).firstChild);
    }
}

function clickListener(id) {
    //$("#"+ id.substring(3)).toggleClass('active').siblings().removeClass('active');
    let thenum = id.match(/\d+/)[0] - 1;
    console.log(thenum);
    console.log(window.data_array[thenum].orderID);
    window.selectedOrder = thenum;
    clearList("chatList");
    document.getElementById("chatInputBox").setAttribute("style","visibility:visible");
    showOrderPage(window.data_array[thenum]);
    chatListener(window.data_array[thenum].location);
}

function showOrderPage(order) {
    clearList("order");
    //create location title
    let location = document.createElement("DIV");
    let textnode = document.createTextNode(order.location.toUpperCase());
    location.appendChild(textnode);
    document.getElementById("order").appendChild(location);
    //create date range
    let dateRange = document.createElement("DIV");
    textnode = document.createTextNode(order.date_from + " - " + order.date_to);
    dateRange.appendChild(textnode);
    document.getElementById("order").appendChild(dateRange);
    let flightPrice = 0;
    let hotelPrice = 0;
    let carPrice = 0;
    if(order.flight != null) {
        let flight = createPartialInfo(order.flight,0);
        document.getElementById("order").appendChild(flight);
        flightPrice = order.flight.price;
    }
    if(order.hotel != null) {
        //create hotel info
        let hotel = createPartialInfo(order.hotel,order.num_of_nights);
        document.getElementById("order").appendChild(hotel);
        hotelPrice = order.hotel.price;
    }
    if(order.car != null) {
        //create car info
        let car = createPartialInfo(order.car,order.num_of_nights);
        document.getElementById("order").appendChild(car);
        carPrice = order.car.price;
    }
    //total cost
    let totalCost = document.createElement("DIV");
    let price = flightPrice + order.num_of_nights * (hotelPrice + carPrice);
    textnode = document.createTextNode("TOTAL PACKAGE PRICE: " + price);
    totalCost.appendChild(textnode);
    document.getElementById("order").appendChild(totalCost);
    //cancel button
    let cancelButton = document.createElement("BUTTON");
    cancelButton.setAttribute("id","btnCancel");
    cancelButton.setAttribute("onClick","cancelOrder()");
    textnode = document.createTextNode("CANCEL ORDER");
    cancelButton.appendChild(textnode);

    document.getElementById("order").appendChild(cancelButton);
}

function createPartialInfo(orderPart, numOfNights) {
    //create partial info
    let partDiv = document.createElement("DIV");
    //img
    let img = document.createElement("IMG"); 
    img.setAttribute("src", orderPart.image);
    img.setAttribute("class","img-thumbnail");
    img.setAttribute("style","width:50%;float:left");
    partDiv.appendChild(img);
    // name
    let partName = document.createElement("DIV");
    textnode = document.createTextNode(orderPart.name);
    partName.appendChild(textnode);
    partDiv.appendChild(partName);
    // cost
    let partPrice = document.createElement("DIV");
    textnode = document.createTextNode("PRICE: " + orderPart.price + '$');
    partPrice.appendChild(textnode);
    partDiv.appendChild(partPrice);
    // if numOfNights>0, create total price based on num of nights
    if(numOfNights>0) {
        let partTotal = document.createElement("DIV");
        textnode = document.createTextNode("TOTAL PRICE: " + orderPart.price*numOfNights + '$');
        partTotal.appendChild(textnode);
        partDiv.appendChild(partTotal);
    }
    return partDiv;
}

function clearList(listName) {
    while (document.getElementById(listName).firstChild) {
        document.getElementById(listName).removeChild(document.getElementById(listName).firstChild);
    }
}

function cancelOrder() {
    let order = window.data_array[selectedOrder];
    var db = firebase.firestore();
    var order_query = db.collection('orders').where('orderID','==',order.orderID);
    order_query.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.delete();
        });
        getDataFromFirebase();
        clearList("order");
        clearList("chatList");
    document.getElementById("chatInputBox").setAttribute("style","visibility:hidden");
    });
}

function chatListener(cityLocation) {
    var chatRef = firebase.database().ref().child(cityLocation.toLowerCase().replace(" ","_"));
    chatRef.on('child_added', function(snapshot) {
        updateChat(snapshot.val());
    });
}

function updateChat(snapshot) {
    let chatLine = document.createElement("DIV");
    let date = new Date(snapshot.created);
    //let dateString = date.format("DD/MM/YY'T'HH:MM").toString();
    //let textnode = document.createTextNode(snapshot.user + "(" + dateString + "): " + snapshot.content);
    let textnode = document.createTextNode(snapshot.userName.split("@")[0] + ": " + snapshot.content);
    chatLine.appendChild(textnode);
    document.getElementById("chatList").appendChild(chatLine);
}

function sendChatMsg() {
    let text = document.getElementById("inputChat").value;
    document.getElementById("inputChat").value = "";
    if(text != null && text != "") {
        firebase.database().ref(window.currentCity.toLowerCase().replace(" ","_")).push({
            content: text,
            created: new Date().getTime(),
            userName: firebase.auth().currentUser.email.split("@")[0]
        });
    }
}