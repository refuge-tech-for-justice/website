var data=new Firebase("https://refuge.firebaseio.com/");

data.on("value", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});