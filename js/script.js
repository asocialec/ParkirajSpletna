// ==========================================================================================
// Get JSON from API
function getData(){
	$.ajax({
	  	type: 'GET',
	  	url: 'http://localhost:8080/ParkirajWeb/web/V1_web',
	  	success: function(data) {
	  		//JSONdata = data;
	  		// showTable(data);
	  		//console.log(data.locations);
	  		var jsonData = JSON.parse(data);
	  		showTable(jsonData);

  		},
  		error: function(){
              showTable(); // for testing only
  			// alert("Napaka pri prikazovanju podatkov!");
  		}
	});
	
}

// ==========================================================================================
// Show table
function showTable (data) {
    // just for testing
    data = {"locations":[{"parkingID":33,"latitude":46.0500278,"longitude":14.488073,"address":"&Scaron;krab&#x10d;eva ulica 21a, 1000 Ljubljana","startParking":"2016-01-18 12:35:09.0"},{"parkingID":34,"latitude":46.0500301,"longitude":14.488074,"address":"&Scaron;krab&#x10d;eva ulica 21a, 1000 Ljubljana","startParking":"2016-01-18 12:39:36.0"},{"parkingID":35,"latitude":46.0500213,"longitude":14.4879432,"address":"&Scaron;krab&#x10d;eva ulica 21a, 1000 Ljubljana","startParking":"2016-01-18 13:02:29.0"},{"parkingID":36,"latitude":46.0500181,"longitude":14.4880478,"address":"&Scaron;krab&#x10d;eva ulica 21a, 1000 Ljubljana","startParking":"2016-01-18 13:37:00.0"},{"parkingID":37,"latitude":46.0500173,"longitude":14.4880554,"address":"&Scaron;krab&#x10d;eva ulica 21a, 1000 Ljubljana","startParking":"2016-01-18 13:37:12.0"},{"parkingID":38,"latitude":46.0500523,"longitude":14.4879745,"address":"&Scaron;krab&#x10d;eva ulica 21a, 1000 Ljubljana","startParking":"2016-01-18 17:02:42.0"},{"parkingID":39,"latitude":46.0500475,"longitude":14.4881284,"address":"&Scaron;krab&#x10d;eva ulica 19a, 1000 Ljubljana","startParking":"2016-01-18 17:56:21.0"}]};
	var items = [];
	$.each(data.locations, function (i, item) {
		items.push("<tr><td>" + item.address + "</td>" + 
			"<td>" + item.startParking + "</td>" + 
			"<td>" + "1:25" + "</td>" +
			"<td><span class = 'glyphicon glyphicon-remove' onClick='izbrisi(\"" + item.parkingID + "\")'></span></td>" +
			// "<td><span class = 'glyphicon glyphicon-edit' data-toggle='modal' data-target='#myModal' onClick='uredi(\"" + item + "\")'></span></td>" +
            "<td><span class='glyphicon glyphicon-trash' data-toggle='modal' data-target='#delete' onClick='izbrisi(\"" + item.parkingID + "\")'></span></td>" +
			"</tr>");
		// return data;
	});
    $("[data-toggle=tooltip]").tooltip();
	$("#tabela table tbody").html(items.join(" "));
	//console.log(data);
}

// ==========================================================================================
// Delete item
function izbrisi(id){
	$.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/ParkirajWeb/web/V1_web/parkingID='+id,
        success: function() {
            getData();
            }
        });
    }


// ==========================================================================================
// Edit item
// TODO:
    // Open new google maps instance in bootstrap modal.
    // Enable marker editing
    // Reverse geocoder to get address from marker position
function uredi(item){
    $.ajax({})
	// alert(item.id);
}


// ==========================================================================================
// Show google maps inside iFrame
function showMapsIFrame() {
      // TO-DO: GET JSON from somewhere (ajax)
  // http://rest.learncode.academy/api/jernejm/lokacije

   locations = {"locations":[{"parkingID":33,"latitude":46.0500278,"longitude":14.488073,"address":"&Scaron;krab&#x10d;eva ulica 21a, 1000 Ljubljana","startParking":"2016-01-18 12:35:09.0"},{"parkingID":34,"latitude":46.0500301,"longitude":14.488074,"address":"&Scaron;krab&#x10d;eva ulica 21a, 1000 Ljubljana","startParking":"2016-01-18 12:39:36.0"},{"parkingID":35,"latitude":46.0500213,"longitude":14.4879432,"address":"&Scaron;krab&#x10d;eva ulica 21a, 1000 Ljubljana","startParking":"2016-01-18 13:02:29.0"},{"parkingID":36,"latitude":46.0500181,"longitude":14.4880478,"address":"&Scaron;krab&#x10d;eva ulica 21a, 1000 Ljubljana","startParking":"2016-01-18 13:37:00.0"},{"parkingID":37,"latitude":46.0500173,"longitude":14.4880554,"address":"&Scaron;krab&#x10d;eva ulica 21a, 1000 Ljubljana","startParking":"2016-01-18 13:37:12.0"},{"parkingID":38,"latitude":46.0500523,"longitude":14.4879745,"address":"&Scaron;krab&#x10d;eva ulica 21a, 1000 Ljubljana","startParking":"2016-01-18 17:02:42.0"},{"parkingID":39,"latitude":46.0500475,"longitude":14.4881284,"address":"&Scaron;krab&#x10d;eva ulica 19a, 1000 Ljubljana","startParking":"2016-01-18 17:56:21.0"}]};

   var locations;
   var items = [];

  $.ajax({
      type: 'GET',
      url: 'http://localhost:8080/ParkirajWeb/web/V1_web',
      success: function(data) {

        locations = JSON.parse(data);
        $.each(locations.locations, function(key, item){
            //console.log(item.address);
            items.push(item.latitude, item.longitude, item.address);
          });
        drawMap(items);
      },
      error: function(){
          console.log("Error. Go to drawmap().");
          console.log(locations.locations);
          $.each(locations.locations, function(key, item){
              //console.log(item.address);
              items.push(item.latitude, item.longitude, item.address);
              });
            drawMap(items);
        //   alert("Napaka pri prikazovanju podatkov!");
      }
  });

function drawMap(items){

    console.log(items);
    console.log(items[0], items[1], items[2]);

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12, // TO-DO: auto zoom using latlngbound.center
      center: new google.maps.LatLng(items[0], items[1]),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    // gMaps bounds
    var latlngbounds = new google.maps.LatLngBounds();
    // Markers
    var marker, i;
    for (i = 0; i < items.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(items[i], items[i+1]),
        map: map
      })
      
      // bounds
      {
        // latlngbounds.extend(new google.maps.latlng(locations[i].latitude, locations[i].longitude));
      }

      ;

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(items[i+2]);
          infowindow.open(map, marker);
        }
      })(marker, i));
      i++;
    }
}
}
