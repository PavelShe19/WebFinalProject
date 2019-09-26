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

        }

    } else {
        // No user is signed in.
        document.getElementById("user_div").style.display = "none";
        document.getElementById("login_div").style.display = "block";
        // document.getElementById("packages").style.display = "invisible";
        //document.getElementById("location_and_weather").style.display = "none";
    }
});