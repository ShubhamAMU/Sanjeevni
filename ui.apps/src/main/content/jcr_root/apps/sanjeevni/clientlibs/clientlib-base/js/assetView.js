var urlString=location.pathname;

 

if(urlString.indexOf("vaccine-progress.html")!=-1){
   // document.getElementsByClassName("container-wrap")[0].setAttribute("id", "vaccine");
   // document.getElementsByClassName("list-inline")[0].style.display='none';
}
else if(urlString.indexOf("genetic-vaccine.html")!=-1 || urlString.indexOf("viral-vector-vaccine.html")!=-1 || urlString.indexOf("protein-based-vaccine.html")!=-1 || urlString.indexOf("whole-virus-vaccine.html")!=-1){
   document.getElementsByClassName("filewrapper")[0].setAttribute("id", "genetic-vaccine");
   //document.getElementsByTagName("table")[0].setAttribute("id", "genetic-vaccine");
    document.getElementsByTagName("table")[0].style.border="1px solid #15141438";
    //document.getElementsByClassName("column")[0].setAttribute("id", "genetic-vaccine-media");

 

 

    if(urlString.indexOf("genetic-vaccine.html")!=-1) {
        document.getElementsByTagName("img")[10].style.width="12%";
        document.getElementsByTagName("img")[4].style.width="12%";
        document.getElementsByTagName("img")[5].style.width="17%";
        document.getElementsByTagName("img")[9].style.width="12%";
    }
     else if(urlString.indexOf("viral-vector-vaccine.html")!=-1) {
         document.getElementsByTagName("img")[5].style.width="20%";
         document.getElementsByTagName("img")[6].style.width="20%";
    }

 

        else if(urlString.indexOf("protein-based-vaccine.html")!=-1) {
         document.getElementsByTagName("img")[4].style.width="15%";
         document.getElementsByTagName("img")[8].style.width="12%";

 

    }

 

    else if(urlString.indexOf("whole-virus-vaccine.html")!=-1) {
         document.getElementsByTagName("img")[3].style.width="20%";
         document.getElementsByTagName("img")[4].style.width="20%";
        document.getElementsByTagName("img")[5].style.width="10%";
    }

 

 

}