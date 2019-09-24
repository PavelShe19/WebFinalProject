firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){

      var email_id = user.email;
      document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;

    }

  } else {
    // No user is signed in.
    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";

  }
});

function signUp(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    window.alert("Error : " + errorMessage);
  });
}


function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);
        // ...
  });
}

function logout(){
  firebase.auth().signOut();
}

function backToMainPage(){
  window.location.href = "file:///C:/Users/galpa/Desktop/%D7%9E%D7%93%D7%A2%D7%99%20%D7%94%D7%9E%D7%97%D7%A9%D7%91/%D7%AA%D7%A7%D7%99%D7%95%D7%AA%20%D7%9C%D7%99%D7%9E%D7%95%D7%93%D7%99%D7%9D/%D7%A9%D7%A0%D7%94%20%D7%A8%D7%91%D7%99%D7%A2%D7%99%D7%AA%20%D7%A1%D7%99%D7%9E%D7%A1%D7%98%D7%A8%20%D7%91/%D7%AA%D7%9B%D7%A0%D7%95%D7%AA%20web/BubbleTravel/MainPage.html";
}

