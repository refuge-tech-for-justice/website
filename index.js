var dataBase=new Firebase("https://refuge.firebaseio.com/");
var data=null;
var map, heatmap;
var defaultzoom = 4;
var defaultcentre = new google.maps.LatLng(39.404989, 22.349621);
var booths_loaded = false;


dataBase.on("value", function(snapshot) {
  data=snapshot.val();
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


$(document).ready(function(){
  $(".navbar a, footer a[href='#main']").on('click', function(event) {
    var hash = this.hash;

    // Using jQuery's animate() method to add smooth page scroll
    // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
    $('html, body').animate({
      scrollTop: $(hash).offset().top-80
    }, 900, function(){
   
      // Add hash (#) to URL when done scrolling (default click behavior)
      window.location.hash = hash;
    });
  });
});



function initialize() {
  var mapOptions = {
    zoom: defaultzoom,
    center: defaultcentre,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map'),
      mapOptions);
	  
  manager = new MarkerManager(map);
  infowindow = new google.maps.InfoWindow({ content: "holding..."});
}

function graphMap(t){
    var d={};
    for(i in data['data']['reqs']){
        if (data['data']['reqs'][i]['type']==t){
            var location=data['data']['reqs'][i]['loc'];
            console.log(location);
            if (location in d){
                d[location]+=1;
            }
            else{
                d[location]=1;
            }
        }
    }
    
    
}