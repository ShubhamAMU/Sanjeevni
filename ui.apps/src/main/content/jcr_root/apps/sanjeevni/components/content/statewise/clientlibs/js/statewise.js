$(document).ready(function() {
 
	   const section = document.querySelector('tbody');
	   var svgStates = document.querySelectorAll("#states > *");
	   var wordStates;

		
		function checkUndefined(val){
			
			if (typeof val === "undefined"){
				return "-";
			}
			return numberformat(val);
			
		}
		
		function mapColorCase(val){
			if(val>100000){
				return "red";
			}else if (val<100000 && val >10000){
				return "#fc7703"
			}
			else if(val<10000 && val>1000){
				return "#fcba03";
			}
			else if(val<1000){
				return "#CCF043";
			}
			
			
		}
		
		
		function sortByProperty(property){
		   return function(a,b){
			return b[property] - a[property];
			 /* if(a[property] > b[property])
				 return 1;
			  else if(a[property] < b[property])
				 return -1;

			  return 0;  */
		   }
		}


		async function fetchCovidReports2() {

			    const stateresponse = await fetch('https://api.covid19india.org/data.json');
                const mainResponse = await stateresponse.json();
                const stateWiseInfo = mainResponse.statewise;


				stateWiseInfo.sort(sortByProperty("confirmed"));



                const response = await fetch('https://api.covid19india.org/v5/min/data.min.json');
                const recordSet = await response.json();
				let data="";

				for (var key in stateWiseInfo) {

					rowClass="odd";
					if(key%2){
						rowClass="even";
					}
					if(stateWiseInfo[key].statecode=="TT" ){
						document.querySelector('.confirmed').innerHTML=numberformat(stateWiseInfo[0].confirmed);
						document.querySelector('.active').innerHTML=numberformat(stateWiseInfo[0].active);
						document.querySelector('.recovered').innerHTML=numberformat(stateWiseInfo[0].recovered);
						document.querySelector('.deceased').innerHTML=numberformat(stateWiseInfo[0].deaths);
					}
					else if(stateWiseInfo[key].statecode=="UN" || stateWiseInfo[key].statecode=="LD"){
						//
					}
					else {
						if(document.getElementById( "IN-"+stateWiseInfo[key].statecode )!==null){
						document.getElementById( "IN-"+stateWiseInfo[key].statecode ).setAttribute("fill", mapColorCase(stateWiseInfo[key].confirmed));
						}

						data +="<tr class=\"clickable js-tabularinfo-toggle cursor-pointer list-of-states state-filter "+rowClass+" \" data-state=\"IN-"+stateWiseInfo[key].statecode+"\" data-toggle=\"collapse\"   id="+stateWiseInfo[key].statecode+ " data-target=."+stateWiseInfo[key].statecode+"><td width=\"20%\"><strong>"+stateWiseInfo[key].state+"</strong></td><td width=\"20%\">"+checkUndefined(stateWiseInfo[key].confirmed)+"</td><td width=\"20%\">"+checkUndefined(stateWiseInfo[key].deaths)+"</td><td width=\"20%\">"+checkUndefined(stateWiseInfo[key].recovered)+"</td><td width=\"20%\">"+checkUndefined(stateWiseInfo[key].active)+"</td></tr>";
						if(stateWiseInfo[key].confirmed!=0) {
							data+="<tr  class=\"tabularinfo__subblock collapse "+stateWiseInfo[key].statecode+"\"><td colspan=\"5\" ><table id=\"\" class=\"tabularinfo tabularinfo--child list-of-states \" data-state=\"IN-"+stateWiseInfo[key].statecode+"\" data-detail-view=\"\" data-set=\""+stateWiseInfo[key].state+"-"+numberformat(stateWiseInfo[key].confirmed)+"-"+numberformat(stateWiseInfo[key].deaths)+"-"+numberformat(stateWiseInfo[key].recovered)+"\"><thead><tr><th data-field=\"\" class=\"pl-2\" >District</th><th class=\"pl-2\" data-field=\"\">Confirmed</th><th data-field=\"\" class=\"pl-2\" >Deceased</th><th data-field=\"\" class=\"pl-2\">Recovered</th><th data-field=\"\" class=\"pl-2\">Active</th></tr></thead><tbody>";
							for (var distKey in recordSet[stateWiseInfo[key].statecode].districts){

								data +="<tr class=\"subrow1\" data-href=\"#\"><td width=\"20%\"><strong>"+distKey+"</strong></td><td width=\"20%\">"+checkUndefined(recordSet[stateWiseInfo[key].statecode].districts[distKey].total.confirmed)+"</td><td width=\"20%\">"+checkUndefined(recordSet[stateWiseInfo[key].statecode].districts[distKey].total.deceased)+"</td><td width=\"20%\">"+checkUndefined(recordSet[stateWiseInfo[key].statecode].districts[distKey].total.recovered)+"</td><td width=\"20%\">"+getActive(recordSet[stateWiseInfo[key].statecode].districts[distKey].total.confirmed,recordSet[stateWiseInfo[key].statecode].districts[distKey].total.recovered,recordSet[stateWiseInfo[key].statecode].districts[distKey].total.deceased)+"</td></tr>";
							}
							data +="</tbody></table></td></tr>";
						}
					}

				}




				document.querySelector('#covidData').innerHTML=data;
				wordStates = document.querySelectorAll(".list-of-states");
				wordStates.forEach(function(el) {
				el.addEventListener("mouseenter", function(e) {

				addOnFromList(el,e,"table");
				});
				el.addEventListener("mouseleave", function() {
				removeAllOn();
				});

				el.addEventListener("touchstart", function(e) {
				removeAllOn();
				addOnFromList(el,e,"table");
				});
				});
				svgStates.forEach(function(el) {
				el.addEventListener("mouseenter", function(e) {
				addOnFromState(el,e);
				});
				el.addEventListener("mouseleave", function() {
				removeAllOn();
				});

				el.addEventListener("touchstart", function() {
				removeAllOn();
				addOnFromState(el,e);
				});
				});



				}


 fetchCovidReports2();




function removeAllOn() {
  wordStates.forEach(function(el) {
    el.classList.remove("on");
  });
  svgStates.forEach(function(el) {
    el.classList.remove("on");
	el.classList.remove("activecase");
	el.classList.remove("moderatecase");
	el.classList.remove("medium");
	el.classList.remove("mild");
  });

   $('.info_panel').remove();
}

function addOnFromList(el,e,eventType) {

 var childs=el.childNodes;
 let stateName;
 let confirmCase;
 let recoverCase;
 let deceaseCase;
 var stateCode = el.getAttribute("data-state");
 if(childs.length==2){
	stateData=el.getAttribute("data-set").split("-");
	stateName=stateData[0];
	confirmCase=stateData[1];
	recoverCase=stateData[2];
	deceaseCase=stateData[3];
 }
 else {
	stateName=childs[0].innerHTML;
	confirmCase=childs[1].innerHTML;
	recoverCase=childs[2].innerHTML;
	deceaseCase=childs[3].innerHTML;
 }


  var svgState = document.querySelector("#" + stateCode);
  //el.classList.add("on");




  svgState.classList.add("on");


  $('<div class="info_panel"><strong>State:</strong>'+stateName+'<br><strong>Confirmed</strong>:'+confirmCase+'<br><strong>Deceased</strong>:'+recoverCase+'<br><strong>Recovered</strong>:'+deceaseCase+'</div>').appendTo('body');
//  console.log(stateName);
 if(eventType=="map"){
	   $('.info_panel').css({
            top: e.clientY,
            left: e.clientX
   });
 }
 else
 {
	 var bbox=document.querySelector("#" + stateCode).getBBox();

		middleX = "17%";
		middleY = "40%" ;

	   $('.info_panel').css({
            top: middleY,
            right: middleX
   });
 }



}




function addOnFromState(el,e) {
  var stateId = el.getAttribute("id");


  var wordState = document.querySelector("[data-state='" + stateId + "']");
  addOnFromList(wordState,e,"map");

  el.classList.add("on");
  //wordState.classList.add("on");
}

function numberformat(val){

	nfObject = new Intl.NumberFormat('en-US');
	return nfObject.format(val);
}

function getNumberFormat(val){
	if (typeof val === "undefined"){
				return 0;
			}
	return val;
}


function getActive(active,recover,deceased){
	return numberformat(getNumberFormat(active)-getNumberFormat(recover)-getNumberFormat(deceased));

}




		$("#myInput").on("keyup", function(){
			 // Declare variables
			var input, filter, table, tr, td, i, txtValue;
			input = document.getElementById("myInput");
			filter = input.value.toUpperCase();
			table = document.getElementById("covidData");
			//tr = table.getElementsByTagName("tr");
			tr =document.querySelectorAll(".state-filter");
			var dynamic=0;
			// Loop through all table rows, and hide those who don't match the search query
			for (i = 0; i < tr.length; i++) {
				td = tr[i].getElementsByTagName("td")[0];
				if (td) {
				txtValue = td.textContent || td.innerText;
				if (txtValue.toUpperCase().indexOf(filter) > -1) {
					if(dynamic==0)
					{
						tr[i].style.backgroundColor="lightgray";
						dynamic=1;

					}
					else if(dynamic==1){
						tr[i].style.backgroundColor="#ffffff";
						dynamic=0;
					}





				tr[i].style.display = "";
				} else {
				tr[i].style.display = "none";
				}
				}
			}

		});


	 $('.js-tabularinfo').bootstrapTable({
        escape: false,
        showHeader: false
      });





	

    
});

