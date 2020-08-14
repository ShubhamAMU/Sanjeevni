var map;

function initMapNearby(position) {
    var urlString=location.pathname;
    if(urlString.indexOf("nearby.html")!=-1){
    console.log(position);
    // Create the map.
    if(position !== undefined){

		var pyrmont = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
        };}
    else {
        var pyrmont = {
        lat: 12.9083215,
        lng: 77.6050777
    };
    }
             console.log(pyrmont);
map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 17
    });

    var contentString="You are here";
	 var infoWindow = new google.maps.InfoWindow({
   			 		content: contentString
  		});

     var marker = new google.maps.Marker({
			position: pyrmont,
            map: map,
 			title: 'You are here',
         	animation: google.maps.Animation.DROP,
         	draggable: true
	});
	infoWindow.open(map, marker);

    const onChangeHandlerMode = function() {
           setUserCookie("nearbyService",document.getElementById("nearbyService").value,5);
			window.location.reload();
        };
    const setUserCookie = function (cname, cvalue, exdays) {
		let d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		const expires = "expires=" + d.toGMTString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

    const  getCookie = function (cname){
  	var name = cname + "=";
  	var decodedCookie = decodeURIComponent(document.cookie);
  	var ca = decodedCookie.split(';');
	  for(var i = 0; i <ca.length; i++) {
   		 var c = ca[i];
   		 while (c.charAt(0) == ' ') {
  		    c = c.substring(1);
   		 }
  		  if (c.indexOf(name) == 0) {
   		   return c.substring(name.length, c.length);
  		  }
 		 }
		  return "";
	  }

    let valueService= getCookie("nearbyService");

    if(valueService!==""){
             var selectElement = document.getElementById("nearbyService");
   			 var selectOptions = selectElement.options;
   			 for (var opt, j = 0; opt = selectOptions[j]; j++) {
     			   if (opt.value ==valueService ) {
      			      selectElement.selectedIndex = j;
     			       break;
      			  }
   			 }
        }

    

    // Create the places service.
    var service = new google.maps.places.PlacesService(map);
	const nearbyService = document.getElementById("nearbyService").value;

	//Display "More Details" button conditionally
	var hospitalButton = document.getElementById('hospital-button');
            if(nearbyService==='hospital'){
                    hospitalButton.innerHTML='<button class="button-zone" ><a href="/content/sanjeevni/nearby/hospitals.html"><span>More Details</span></a></button>';
                }
            else{
    			 hospitalButton.innerHTML="";
            };

    // Perform a nearby search.
    service.nearbySearch({
            location: pyrmont,
            radius: 2000,
        keyword: nearbyService
        },
        function(results, status, pagination) {
            if (status !== 'OK') return;

            createMarkers(results);
            getNextPage = pagination.hasNextPage && function() {
                pagination.nextPage();
            };
        });
    }
}

function createMarkers(places) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
        var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
        });
        bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
}

function getMyLocation() {
 		 if (navigator.geolocation) {
   		 navigator.geolocation.getCurrentPosition(showMyPosition);
		  } else {
 		   x.innerHTML = "Geolocation is not supported by this browser.";
 		 }
		}

	function showMyPosition(position) {
		console.log("calling initMap method");

		initMapNearby(position);
	}