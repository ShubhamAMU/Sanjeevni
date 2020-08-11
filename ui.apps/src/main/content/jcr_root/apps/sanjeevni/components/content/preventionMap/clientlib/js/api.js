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

	const getLocation = function () {
 		 if (navigator.geolocation) {
   		 navigator.geolocation.getCurrentPosition(showPosition);
		  } else {
 		   x.innerHTML = "Geolocation is not supported by this browser.";
 		 }
		}

	function showPosition(position) {
             getCovidAreacheck(position);
	}

	const getCovidAreacheck = function (position) {
    let url = 'https://www.covidhotspots.in/covid/city/BLR/hotspot/'+position.coords.latitude+','+position.coords.longitude;

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200 ) {
            areadata = JSON.parse(this.responseText);
				x.innerHTML = "Latitude: " + position.coords.latitude +
 			 "<br>Longitude: " + position.coords.longitude  +
              "<br>Your area is under "+ areadata.zone+" zone.";
			 getContainmentListsCircle(areadata.city,position.coords.latitude,position.coords.longitude);
    	}
    }
    xhttp.open('GET',url,true);
    xhttp.setRequestHeader('Content-Type','application/json;charset=UTF-8');
    xhttp.send();
	}


  const getContainmentListsCircle = function (citycode,latitude,longitude) {
    var json_airport='[{"IATA_code":"AMD","ICAO_code":"VAAH","airport_name":"Ahmedabad Airport","city_name":"Ahmedabad"},{"IATA_code":"AGR","ICAO_code":"VIAG","airport_name":"Kheria Airport","city_name":"Agra"},{"IATA_code":"BLR","ICAO_code":"VOBG","airport_name":"Bengaluru International Airport","city_name":"Bangalore"},{"IATA_code":"BHO","ICAO_code":"VABP","airport_name":"Bhopal Airport","city_name":"Bhopal"},{"IATA_code":"IXC","ICAO_code":"VICG","airport_name":"Chandigarh Airport","city_name":"Chandigarh"},{"IATA_code":"MAA","ICAO_code":"VOMM","airport_name":"Chennai International Airport","city_name":"Chennai"},{"IATA_code":"CJB","ICAO_code":"VOCB","airport_name":"Peelamedu Airport","city_name":"Coimbatore"},{"IATA_code":"DEL","ICAO_code":"VIDP","airport_name":"Indira Gandhi International Airport","city_name":"New Delhi"},{"IATA_code":"HYD","ICAO_code":"VOHY","airport_name":"Hyderabad International Airport","city_name":"Hyderabad"},{"IATA_code":"IDR","ICAO_code":"VAID","airport_name":"Devi Ahilyabai Holkar Airport","city_name":"Indore"},{"IATA_code":"JLR","ICAO_code":"VAJB","airport_name":"Jabalpur Airport","city_name":"Jabalpur"},{"IATA_code":"JAI","ICAO_code":"VIJP","airport_name":"Sanganeer Airport","city_name":"Jaipur"},{"IATA_code":"IXJ","ICAO_code":"VIJU","airport_name":"Satwari Airport","city_name":"Jammu"},{"IATA_code":"KNL","ICAO_code":"KNL","airport_name":"Karnool Airport","city_name":"Karnool"},{"IATA_code":"CCU","ICAO_code":"VECC","airport_name":"Netaji Subhash Chandra Bose International Airport","city_name":"Kolkata"},{"IATA_code":"LUH","ICAO_code":"VILD","airport_name":"Amritsar Airport","city_name":"Ludhiana"},{"IATA_code":"IXM","ICAO_code":"VOMD","airport_name":"Madurai Airport","city_name":"Madurai"},{"IATA_code":"BOM","ICAO_code":"VABB","airport_name":"Chhatrapati Shivaji International Airport","city_name":"Mumbai"},{"IATA_code":"MYQ","ICAO_code":"VOMY","airport_name":"Mysore Airport","city_name":"Mysore"},{"IATA_code":"PAT","ICAO_code":"VEPT","airport_name":"Patna Airport","city_name":"Patna"},{"IATA_code":"PNQ","ICAO_code":"VAPO","airport_name":"Lohegaon Airport","city_name":"Pune"},{"IATA_code":"IXR","ICAO_code":"VERC","airport_name":"Birsa Munda International Airport","city_name":"Ranchi"},{"IATA_code":"SXR","ICAO_code":"VISR","airport_name":"Srinagar Airport","city_name":"Srinagar"},{"IATA_code":"STV","ICAO_code":"VASU","airport_name":"Surat Airport","city_name":"Surat"},{"IATA_code":"UDR","ICAO_code":"VAUD","airport_name":"Dabok Airport","city_name":"Udaipur"},{"IATA_code":"BDQ","ICAO_code":"VABO","airport_name":"Vadodara Airport","city_name":"Vadodara"},{"IATA_code":"VTZ","ICAO_code":"VEVZ","airport_name":"Vishakhapatnam Airport","city_name":"Vishakhapatnam"}]';
    var json_response=  JSON.parse(json_airport);
      for(var i=0;i<json_response.length;i++){
          if(json_response[i].IATA_code===citycode){
			 url = 'https://www.covidhotspots.in/covid/city/'+json_response[i].city_name+'/hotspots';
			  var zone=document.getElementById("containment-zone");
              zone.innerHTML='<label class="zones_label" >Containment zones</label> <select id="containment" class="selecting-zone" value="none" onchange="getCityListsCircle(this.options[this.selectedIndex].text)"> <option value="AMD">Agra</option> <option value="AGR">Ahmedabad</option> <option value="BLR">Bangalore</option> <option value="BHO">Bhopal</option> <option value="IXC">Chandigarh</option> <option value="MAA">Chennai</option> <option value="CJB">Coimbatore</option> <option value="DEL">Delhi</option> <option value="HYD">Hyderabad</option> <option value="IDR">Indore</option> <option value="JLR">Jabalpur</option> <option value="JAI">Jaipur</option> <option value="IXJ">Jammu</option> <option value="KNL">Karnool</option> <option value="CCU">Kolkata</option> <option value="LUH">Ludhiana</option> <option value="IXM">Madurai</option> <option value="BOM">Mumbai</option> <option value="MYQ">Mysore</option> <option value="PAT">Patna</option> <option value="PNQ">Pune</option> <option value="IXR">Ranchi</option> <option value="SXR">Srinagar</option> <option value="STV">Surat</option> <option value="UDR">Udaipur</option> <option value="BDQ">Vadodara</option> <option value="VTZ">Vishakhapatnam</option> </select>';
             var selectElement = document.getElementById("containment");

   			 var selectOptions = selectElement.options;
   			 for (var opt, j = 0; opt = selectOptions[j]; j++) {
     			   if (opt.value ==citycode ) {
      			      selectElement.selectedIndex = j;
     			       break;
      			  }
   			 }
          }
      }

     const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 12,
          center: {
             lat: latitude,
            lng: longitude
          },
          mapTypeId: "terrain"
        });

     var contentString="You are here";
	 var window = new google.maps.InfoWindow({
   			 		content: contentString
  		});
      var pin={};
      pin.lat=latitude;
      pin.lng=longitude;

     var marker = new google.maps.Marker({
			position: pin,
            map: map,
 			title: 'Info',
         	animation: google.maps.Animation.DROP,
         	draggable: true
	});
	window.open(map, marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200 ) {
            var containmentlist = JSON.parse(this.responseText);
            if(typeof containmentlist !== "undefined" && containmentlist != null && containmentlist.length != null && containmentlist.length > 0   ){
              for(var i=0;i<containmentlist.length;i++){
                var place=containmentlist[i].geocord;
                var center={};
                var placeArray=[];
                placeArray=place.split(",");
                center.lat=Number(placeArray[0]);
                center.lng=Number(placeArray[1]);
               const cityCircle = new google.maps.Circle({
            		strokeColor: "#FF0000",
            		strokeOpacity: 0.8,
           			strokeWeight: 2,
           			fillColor: "#FF0000",
            		fillOpacity: 0.35,
            		map,
            		center: center,
					radius:50
          		});
              }
            }else{
			alert("Sorry containment details is not found!");
            }
        }
    }
    xhttp.open('GET',url,true);
    xhttp.setRequestHeader('Content-Type','application/json;charset=UTF-8');
    xhttp.send();
	}

  const getCityListsCircle = function (city) {
      var latitude=null;
      var longitude=null;
	   const geocoder = new google.maps.Geocoder();
     promise_city = new Promise(function(resolve, reject) {
		 geocoder.geocode(
          {
            address: city
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

	Promise.all([promise_city]).then(values => {

     placeArray=values[0].split(",");
     latitude=Number(placeArray[0]);
     longitude=Number(placeArray[1]);

       url = 'https://www.covidhotspots.in/covid/city/'+city+'/hotspots';
     const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 12,
          center: {
             lat: latitude,
            lng: longitude
          },
          mapTypeId: "terrain"
        });

	var contentString="You searched for: "+city;
	 var window = new google.maps.InfoWindow({
   			 		content: contentString
  		});
      var pin={};
      pin.lat=latitude;
      pin.lng=longitude;

     var marker = new google.maps.Marker({
			position: pin,
            map: map,
 			title: 'Info',
         	animation: google.maps.Animation.DROP,
         	draggable: true
	});
	window.open(map, marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200 ) {
            var containmentlist = JSON.parse(this.responseText);
            if(typeof containmentlist !== "undefined" && containmentlist != null && containmentlist.length != null && containmentlist.length > 0   ){
              for(var i=0;i<containmentlist.length;i++){
                var place=containmentlist[i].geocord;
                var center={};
                var placeArray=[];
                placeArray=place.split(",");
                center.lat=Number(placeArray[0]);
                center.lng=Number(placeArray[1]);
               const cityCircle = new google.maps.Circle({
            		strokeColor: "#FF0000",
            		strokeOpacity: 0.8,
           			strokeWeight: 2,
           			fillColor: "#FF0000",
            		fillOpacity: 0.35,
            		map,
            		center: center,
					radius:50
          		});
              }
            }else{
			alert("Sorry containment details not found!");
            }
        }
    }
    xhttp.open('GET',url,true);
    xhttp.setRequestHeader('Content-Type','application/json;charset=UTF-8');
    xhttp.send();

});
}





