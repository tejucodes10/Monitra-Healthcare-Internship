
  
  function ECGData(iRentalID, callback) {
  
    console.log("Getting Data")
  
    var vRentalID = iRentalID.toString();
      var http = new XMLHttpRequest();
          var url = "insert API here"+vRentalID+"&DurationSec=120";
          var method = "GET";
          let myJSON;
          console.log(url);
          http.open(method,url,false);
          
         http.onreadystatechange = ()=> {
          if(http.readyState === XMLHttpRequest.DONE && http.status === 200) {
            myJSON = JSON.parse(http.responseText)
         
       } else if (http.readyState === XMLHttpRequest.DONE && http.status !== 200) {
          //console.log("Error!");
       }
      };
      
          http.send();
          return myJSON;
          callback();
  }