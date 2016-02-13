var dataBase=new Firebase("https://refuge.firebaseio.com/");
var data=null;
var map;
var heat;
var defaultzoom = 6;
var defaultcentre = new google.maps.LatLng(39.404989, 22.349621);
var infoWindow, manager;
var latLng=null;
var d={};
$.getJSON("data.json",function(locs){
    latLng=locs;
});


dataBase.on("value", function(snapshot) {
  data=snapshot.val();
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


$(document).ready(function(){
  $(".navbar a, footer a[href='#home']").on('click', function(event) {
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
})


function initialize() {
  var mapOptions = {
    zoom: defaultzoom,
    center: defaultcentre,
	scrollwheel:false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map'),
      mapOptions);
	  
  manager = new MarkerManager(map);
  infoWindow = new google.maps.InfoWindow({ content: "holding..."});
  google.maps.event.addListener(map, 'zoom_changed', displayMarkers);
}

function graphMap(t){
    d={};
    var max=0;
    for(i in data['data']['reqs']){
        if (data['data']['reqs'][i]['type']==t){
            var location=data['data']['reqs'][i]['loc'];
            if (location in d){
                d[location]+=1;
                if (max<d[location]){
                    max=d[location];
                }
            }
            else{
                d[location]=1;
            }
        }
    }
    var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ];
    var individualLocs=[];
    for(i in d){
        try {
            var l = {location: new google.maps.LatLng(latLng[i][0], latLng[i][1]), weight: d[i]};
            individualLocs.push(l);
        }
        catch(err){
        }
        
    }
    if(heat!=null){
        heat.setMap(null);
    }
    heat= new google.maps.visualization.HeatmapLayer({
	   data: individualLocs ,
       opactity: 0.9,
	   maxIntensity: max,
	   radius: 20,
	   gradient: gradient,
	   dissipating: true 
	});
    
    heat.setMap(map);
    displayMarkers();
}


function displayMarkers(){
    if (map.getZoom()>10){
        for(i in d){
            try {
                var whtml =  "<div class='info'><h3>"+ i + "</h3><h4>" + d[i] +" request(s)</h4></div>";
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(latLng[i][0], latLng[i][1]),
                    title : i,
                    html : whtml
                        });
                google.maps.event.addListener(marker, 'click', function(){
                    infoWindow.setContent(this.html);
                    infoWindow.open(map, this);
                });
                manager.addMarker(marker,0);
            }
            catch(err){
            }
        }
         manager.refresh();    
    }
    else{
        manager.clearMarkers();
    }
    
}
    



    $(window).load(function() {
    $(".slideanim").each(function(){
      var pos = $(this).offset().top;

      var winTop = $(window).scrollTop();
        if (pos < winTop + 600) {
          $(this).addClass("slide");
        }
    });
  
 
    $('#tagline').hide();
    $('#tagline').fadeIn('slow');

});

google.maps.event.addDomListener(window, 'load', initialize);

$('#waterIcon').click(function(){
    graphMap('water')});
$('#foodIcon').click(function(){
    graphMap('food')});
$('#shelterIcon').click(function(){
    graphMap('shelter')});
