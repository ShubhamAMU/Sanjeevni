   "use strict";
		var payload = {};
        var resglobal={};
        var mapDuplicate=null;
      function initMap() {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        const mapObject = new google.maps.Map(document.getElementById("map"), {
          zoom: 7,
          center: {
            lat: 12.9083215,
            lng: 77.6050777
          }
        });

        mapDuplicate=mapObject;
  		directionsRenderer.setMap(mapObject);

        const onChangeHandler = function() {
              calculateAndDisplayRoute(directionsService, directionsRenderer,mapObject);
        };
        const onChangeHandlerMode = function() {
		   setUserCookie("origin",document.getElementById("searchBarPickup").value,5);
           setUserCookie("destination",document.getElementById("searchBarDrop").value,5);
           setUserCookie("mode",document.getElementById("mode").value,5);
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


        let value= getCookie("origin");
        let valueDest=getCookie("destination");
        let valueMode=getCookie("mode");
        if(value!=="" && valueDest!=="" && valueMode!==""){
             document.getElementById("searchBarPickup").value=value;
             document.getElementById("searchBarDrop").value =valueDest;



             var selectElement = document.getElementById("mode");
   			 var selectOptions = selectElement.options;
   			 for (var opt, j = 0; opt = selectOptions[j]; j++) {
     			   if (opt.value ==valueMode ) {
      			      selectElement.selectedIndex = j;
     			       break;
      			  }
   			 }

		    calculateAndDisplayRoute(directionsService, directionsRenderer,mapObject);

        }


		if(value!==""){
        document
          .getElementById("searchBarPickup")
          .addEventListener("change", onChangeHandlerMode);}

        if(valueDest!==""){
           document
          .getElementById("searchBarDrop")
          .addEventListener("change", onChangeHandlerMode);}
        document
          .getElementById("searchBarDrop")
          .addEventListener("change", onChangeHandler);


      document
          .getElementById("mode")
          .addEventListener("change", onChangeHandlerMode);



      }

      function calculateAndDisplayRoute(directionsService, directionsRenderer,mapObject) {

        directionsService.route(
          {
            origin: {
              query: document.getElementById("searchBarPickup").value
            },
            destination: {
              query: document.getElementById("searchBarDrop").value
            },
            travelMode:document.getElementById("mode").value,
           provideRouteAlternatives: true,
           unitSystem: google.maps.UnitSystem.METRIC

          },
          (response, status) => {
            if (status === "OK") {

             for (var i = 0, len = response.routes.length; i < len; i++) {
              new google.maps.DirectionsRenderer({
                     map: mapObject,
                   	 directions: response,
                   	 routeIndex: i,
                     polylineOptions: {
                   		strokeColor: "#1B77A9",
   			 			strokeOpacity: 0.8,

    				   fillColor: "#1B77A9",
   						fillOpacity: 0.35
                      }
            	});
            }
            resglobal=response;
            setLatLong(response);

            } else {
              window.alert("Directions request failed due to " + status);
            }
          }
        );
      }
      function setLatLong(response){
      	  const geocoder = new google.maps.Geocoder();
		  const searchBarPickup = document.getElementById("searchBarPickup").value;
          const searchBarDrop=document.getElementById("searchBarDrop").value;
          const points=[];
          const payload={};
          let promise_origin=null;
          let promise_destination=null;
          const paths=[];

		promise_origin = new Promise(function(resolve, reject) {
		 geocoder.geocode(
          {
            address: searchBarPickup
          },
          (results, status) => {
            if (status === "OK") {
				var value= JSON.stringify(results);
                var jsonResponse=JSON.parse(value);
				 var latandLngOrigin=jsonResponse[0].geometry.location.lat +","+jsonResponse[0].geometry.location.lng;

 					 resolve(latandLngOrigin);

            } else {
              alert(
                "Geocode was not successful for the following reason: " + status
              );
            }
          }
        );
        });

		promise_destination = new Promise(function(resolve, reject) {
         geocoder.geocode(
          {
            address: searchBarDrop
          },
          (results, status) => {
            if (status === "OK") {
    		var value= JSON.stringify(results);
                var jsonResponse=JSON.parse(value);
				 var latandLngDestination=jsonResponse[0].geometry.location.lat +","+jsonResponse[0].geometry.location.lng;
                    resolve(latandLngDestination);
            } else {
              alert(
                "Geocode was not successful for the following reason: " + status
              );
            }
          }
        );
          });



        for (let i = 0; i < response.routes.length; i++) {
                points.push(response.routes[i].overview_polyline);
       	}


		Promise.all([promise_origin, promise_destination]).then(values => {
        		const inner={};
                const element=[];

        		payload.origin=values[0];
                payload.destination=values[1];


                for(var i=0;i<points.length;i++){
                const inner={};
					inner.order=i+1;
                    inner.path=points[i];
                    element.push(inner);
                }
				payload.paths=element;


			 let url = 'https://www.covidhotspots.in/covid/directions';
			const xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function (response) {

						if (this.readyState == 4 && this.status == 200 ) {
							if (this.responseText) {
                                 var data = JSON.parse(this.responseText);
                                 var nosafe=document.getElementById("nosafe");
                                 var count=0;
                                 var count1=0;
                                var arraypaths=[];
                                arraypaths=data.paths;
                                 for(var i=0;i<arraypaths.length;i++){
								 var z=document.getElementById("route");
                                     if(arraypaths[i].pathPassesContainmentZone){
                                     	count++;
                                          z.innerHTML += "<button class='button-red' onclick=getPathInfo("+i+",'red')><span>Route "+(i+1)+"</span></button>   ";
                                          if(count===resglobal.routes.length){
											nosafe.innerHTML="No routes are Safe, we suggest not to travel.";
                                          }


                                     }else{
                                     	   count1++;
										   z.innerHTML += "<button class='button-green' onclick=getPathInfo("+i+",'green')><span>Route "+(i+1)+"</span></button>   ";
                                             if(count1===resglobal.routes.length){
													nosafe.innerHTML="All the routes are safe.";
                                             }
                                             else{
													nosafe.innerHTML="Some routes are Safe, we suggest to travel wisely.";
                                             }

                                     }
                                    }
							}
						}
					};
			xhttp.open("POST", url, true);
			xhttp.setRequestHeader("Content-Type", "application/json");
			xhttp.send(JSON.stringify(payload));


		});



      }
  	 function getPathInfo(index,color) {

      const mapObject = new google.maps.Map(document.getElementById("map"), {
          zoom: 7,
          center: {
            lat: 12.9083215,
            lng: 77.6050777
          }
        });

			 for (let i = 0; i < resglobal.routes.length; i++) {
             var count=1;
             	 var y=document.getElementById("demo1");

             	if(i===index){
				if(color==="red"){
                var length=(resglobal.routes[index].legs[0].steps.length)/2;
                var uluru=resglobal.routes[index].legs[0].steps[Math.ceil(length)].start_location;
                var contentString = '<div class="card">'+
					'<div class="card-header" style="background-color:#ff8f8f ;color:#ffffff;">'+
				    '<!--span></span> <span style="font-size:22px;margin:5px;"></span-->'+
			       '<ul class="list-inline">'+
				   '<li id="zoneDisplayed" class="list-inline-item">Travel Safely</li>'+
				   '<li class="list-inline-item" style="position:absolute;font-size:22px;top:0px;"></li>'+
			       '</ul>'+
		           '</div>'+
		         '<div class="card-body">'+
			     '<p class="card-text" style="color:#333333;font-size: 12px;">Total Distance to travel: ' +resglobal.routes[i].legs[0].distance.text +'<br>'+
                     'Time : '+resglobal.routes[i].legs[0].duration.text +'</p>'+
		         '</div>'+
	             '</div>';

                 var infowindow = new google.maps.InfoWindow({
   			 		content: contentString
  				 });

                 var marker = new google.maps.Marker({
			    		position: uluru,
                    	map: mapObject,
 				  		title: 'Info',
                        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/info-i_maps.png'

				  });
				infowindow.open(map, marker);
              	y.innerHTML = "Distance by "+document.getElementById("mode").value.toLowerCase()+": " + resglobal.routes[i].legs[0].distance.text +
 						 "<br>Time to travel: " + resglobal.routes[i].legs[0].duration.text +
             				"<br>Route "+(i+1)+" is <span class='red-zone'>NOT SAFE! &#128534;<span>";



				 new google.maps.DirectionsRenderer({
                    			 map: mapObject,
                   	 			 directions: resglobal,
                   				 routeIndex: index,
                                 polylineOptions: {
                   					strokeColor: "#FF0000",
   			 						strokeOpacity: 0.8,
   									strokeWeight: 3,
    				   				fillColor: "#FF0000",
   									fillOpacity: 0.35
                      				}


           						 });
       			}
                else{

				 var length=(resglobal.routes[index].legs[0].steps.length)/2;
                var uluru=resglobal.routes[index].legs[0].steps[Math.ceil(length)].start_location;
                var contentString = '<div class="card">'+
					'<div class="card-header" style="background-color:#21b31f ;color:#ffffff;">'+
				    '<!--span></span> <span style="font-size:22px;margin:5px;"></span-->'+
			       '<ul class="list-inline">'+
				   '<li id="zoneDisplayed" class="list-inline-item">Safe route</li>'+
				   '<li class="list-inline-item" style="position:absolute;font-size:22px;top:0px;"></li>'+
			       '</ul>'+
		           '</div>'+
		         '<div class="card-body">'+
			      '<p class="card-text" style="color:#333333;font-size: 12px;">Total Distance to travel: ' +resglobal.routes[i].legs[0].distance.text +'<br>'+
                    'Time : '+resglobal.routes[i].legs[0].duration.text +'</p>'+
		         '</div>'+
	             '</div>';

                 var infowindow = new google.maps.InfoWindow({
   			 		content: contentString
  				 });

                 var marker = new google.maps.Marker({
			    		position: uluru,
                    	map: mapObject,
 				  		title: 'Info',
                        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/info-i_maps.png'
				  });
				infowindow.open(map, marker);

                  y.innerHTML = "Distance by "+document.getElementById("mode").value.toLowerCase()+": " + resglobal.routes[i].legs[0].distance.text +
 			 "<br>Time to travel: " + resglobal.routes[i].legs[0].duration.text +
             "<br>Route "+(i+1)+" is <span class='green-zone'>SAFE! Enjoy &#128512;<span>";

 				new google.maps.DirectionsRenderer({
                    			 map: mapObject,
                   	 			 directions: resglobal,
                   				 routeIndex: index,
                                  polylineOptions: {
                   					strokeColor: "#008000",
   			 						strokeOpacity: 0.8,
   									strokeWeight: 3,
    				   				fillColor: "#FF0000",
   									fillOpacity: 0.35
                      				}
           		});
                }
            	}
            }

		}





	var x = document.getElementById("demo");

	function getLocation() {
 		 if (navigator.geolocation) {
   		 navigator.geolocation.getCurrentPosition(showPosition);
		  } else {
 		   x.innerHTML = "Geolocation is not supported by this browser.";
 		 }
		}

	function showPosition(position) {
             getCovidAreacheck(position,x);
	}

	const getCovidAreacheck = function (position,x) {
    let url = 'https://www.covidhotspots.in/covid/city/BLR/hotspot/'+position.coords.latitude+','+position.coords.longitude;

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200 ) {
            areadata = JSON.parse(this.responseText);
				x.innerHTML = "Latitude: " + position.coords.latitude +
 			 "<br>Longitude: " + position.coords.longitude  +
              "<br>Your area is under "+ areadata.zone+" zone.";
              showCircle(areadata.city);


    	}
    }
    xhttp.open('GET',url,true);
    xhttp.setRequestHeader('Content-Type','application/json;charset=UTF-8');
    xhttp.send();
	}

    function showCircle(citycode) {
    	const mapObject = new google.maps.Map(document.getElementById("map"), {
          zoom: 7,
          center: {
            lat: 12.9083215,
            lng: 77.6050777
          }
        });

	}



