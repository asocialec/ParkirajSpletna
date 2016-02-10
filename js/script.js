// ==========================================================================================
// Get JSON from API
function getData(){
	$.ajax({
	  	type: 'GET',
	  	url: 'http://localhost:8080/ParkirajWeb/web/V1_web',
	  	success: function(data) {
	  		//JSONdata = data;
	  		// showTable(data);
            //   showChart(data);
	  		//console.log(data.locations);
	  		var jsonData = JSON.parse(data);
	  		showTable(jsonData);
        showChart(jsonData);

  		},
  		error: function(){
              //showTable(); // for testing only
              //showChart();
  			alert("Napaka pri prikazovanju podatkov!");
  		}
	});
	
}

// ==========================================================================================
// Show table
function showTable (data) {
    // just for testing
    //data = {"locations":[{"parkingID":57,"latitude":46.0447325,"longitude":14.4882217,"address":"Tr?a?ka cesta 31, 1000 Ljubljana","startParking":"13:24:18, 1.2.2016"},{"parkingID":56,"latitude":46.0500918,"longitude":14.4879261,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"16:29:04, 21.1.2016","endTime":"16:29:58, 21.1.2016"},{"parkingID":55,"latitude":46.0500696,"longitude":14.4879438,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"16:27:42, 21.1.2016"},{"parkingID":54,"latitude":46.050054,"longitude":14.4879437,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"16:25:37, 21.1.2016"},{"parkingID":49,"latitude":46.0445845,"longitude":14.4888807,"address":"Tr?a?ka cesta 31, 1000 Ljubljana","startParking":"10:23:06, 20.1.2016","endTime":"10:23:31, 20.1.2016"},{"parkingID":48,"latitude":46.0445899,"longitude":14.488904,"address":"Tr?a?ka cesta 25, 1000 Ljubljana","startParking":"10:22:22, 20.1.2016","endTime":"10:22:59, 20.1.2016"},{"parkingID":43,"latitude":46.0500509,"longitude":14.4880253,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"18:09:02, 19.1.2016","endTime":"18:09:10, 19.1.2016"},{"parkingID":42,"latitude":46.0500591,"longitude":14.4879478,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"17:55:28, 19.1.2016","endTime":"18:08:46, 19.1.2016"},{"parkingID":41,"latitude":46.0473171,"longitude":14.4885017,"address":"Oslavijska ulica 9, 1000 Ljubljana","startParking":"16:44:01, 19.1.2016"},{"parkingID":39,"latitude":46.0500475,"longitude":14.4881284,"address":"?krab?eva ulica 19a, 1000 Ljubljana","startParking":"17:56:21, 18.1.2016"},{"parkingID":38,"latitude":46.0500523,"longitude":14.4879745,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"17:02:42, 18.1.2016"},{"parkingID":37,"latitude":46.0500173,"longitude":14.4880554,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"13:37:12, 18.1.2016"},{"parkingID":36,"latitude":46.0500181,"longitude":14.4880478,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"13:37:00, 18.1.2016"}]};
	var tempItems = [];
    var tempStartParking;
    var tempEndParking;
    // parse, clean, convert ...
    $.each(data.locations, function(i, item){
        var tempObj = {};
        tempObj.parkingID = item.parkingID;
        tempObj.latitude = item.latitude;
        tempObj.longitude = item.longitude;
        tempObj.address = item.address;
        // reformat start parking
        var StartDatePart = item.startParking.split(/[^0-9]/) // regex: vse, razen stevil
        tempObj.startParking = StartDatePart[4] + ". " + StartDatePart[5] + ". " + StartDatePart[6] + " - " + StartDatePart[0] + ":" + StartDatePart[1];
        console.log(tempObj.startParking);
        
        // check if endTime exist
        // calculate time diff
        if (item['endTime']) {
            var EndDatePart = item.endTime.split(/[^0-9]/) // regex: vse, razen stevil
            // 0: hour, 1: min, 2: sec, 3: / 4: day, 5: month, 6: year
            var tempStartParking = (new Date(StartDatePart[6] + "/" + StartDatePart[5] + "/" + StartDatePart[4] + " " + StartDatePart[0] + ":" + StartDatePart[1] + ":" + StartDatePart[2])).getTime();
            var tempEndParking = (new Date(EndDatePart[6] + "/" + EndDatePart[5] + "/" + EndDatePart[4] + " " + EndDatePart[0] + ":" + EndDatePart[1] + ":" + EndDatePart[2])).getTime();
            //    console.log("tempStartParking: " + tempStartParking);
            //    console.log("tempEndparking: " + tempEndParking);
            var timeDiff = tempEndParking-tempStartParking;
            var diffSeconds = timeDiff / 1000 % 60;
            var diffMinutes = Math.round(timeDiff / (60 * 1000) % 60);
            var diffHours = Math.round(timeDiff / (60 * 60 * 1000) % 24);
            tempObj.duration = diffHours.pad(2) + ":" + diffMinutes.pad(2);
        }
        else{
            tempObj.duration = "/";
        }
        tempItems.push(tempObj);
    });
    // console.log(JSON.stringify(tempItems));
    
    var items = [];
	$.each(tempItems, function (i, item) {
		items.push("<tr><td>" + item.address + "</td>" + 
			"<td>" + item.startParking + "</td>" + 
			"<td>" + item.duration + "</td>" +
            "<td><span class='glyphicon glyphicon-trash' data-toggle='modal' data-target='#myModal' onclick='deleteModal(\""+ item.parkingID + "\")'></span></td>" +  
			"</tr>");
	});
    $("[data-toggle=tooltip]").tooltip();
	$("#tabela table tbody").html(items.join(" "));
	//console.log(data);
}


// ==========================================================================================
// Delete item. Confirmation modal.
function deleteParking(id){
    var id = $("#temp_edit").val();
	// console.log("id iz modala: " + id);

	$.ajax({
  		type: 'DELETE',
  		url: 'http://localhost:8080/ParkirajWeb/web/V1_web?parkingID='+id,
  		success: function() {
    		console.log("Parkiranje izbrisano");
    		getData();
  		},
  		error: function(){
  			console.log("Napaka pri brisanju podatkov! ID: " + id);
  		}
  	});
}

function deleteModal(parkingID){
    console.log("funkcija deleteModal");
    console.log(parkingID);
	$("#temp_edit").val(parkingID);
}


// ==========================================================================================
// Delete item
function izbrisi(id){
	$.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/ParkirajWeb/web/V1_web?parkingID='+id,
        success: function() {
            getData();
            }
        });
    }


// ==========================================================================================
// Show google maps inside iFrame
function showMapsIFrame(data) {
      // TO-DO: GET JSON from somewhere (ajax)
  // http://rest.learncode.academy/api/jernejm/lokacije

   //locations = {"locations":[{"parkingID":57,"latitude":46.0447325,"longitude":14.4882217,"address":"Tr?a?ka cesta 31, 1000 Ljubljana","startParking":"13:24:18, 1.2.2016"},{"parkingID":56,"latitude":46.0500918,"longitude":14.4879261,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"16:29:04, 21.1.2016","endTime":"16:29:58, 21.1.2016"},{"parkingID":55,"latitude":46.0500696,"longitude":14.4879438,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"16:27:42, 21.1.2016"},{"parkingID":54,"latitude":46.050054,"longitude":14.4879437,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"16:25:37, 21.1.2016"},{"parkingID":49,"latitude":46.0445845,"longitude":14.4888807,"address":"Tr?a?ka cesta 31, 1000 Ljubljana","startParking":"10:23:06, 20.1.2016","endTime":"10:23:31, 20.1.2016"},{"parkingID":48,"latitude":46.0445899,"longitude":14.488904,"address":"Tr?a?ka cesta 25, 1000 Ljubljana","startParking":"10:22:22, 20.1.2016","endTime":"10:22:59, 20.1.2016"},{"parkingID":43,"latitude":46.0500509,"longitude":14.4880253,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"18:09:02, 19.1.2016","endTime":"18:09:10, 19.1.2016"},{"parkingID":42,"latitude":46.0500591,"longitude":14.4879478,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"17:55:28, 19.1.2016","endTime":"18:08:46, 19.1.2016"},{"parkingID":41,"latitude":46.0473171,"longitude":14.4885017,"address":"Oslavijska ulica 9, 1000 Ljubljana","startParking":"16:44:01, 19.1.2016"},{"parkingID":39,"latitude":46.0500475,"longitude":14.4881284,"address":"?krab?eva ulica 19a, 1000 Ljubljana","startParking":"17:56:21, 18.1.2016"},{"parkingID":38,"latitude":46.0500523,"longitude":14.4879745,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"17:02:42, 18.1.2016"},{"parkingID":37,"latitude":46.0500173,"longitude":14.4880554,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"13:37:12, 18.1.2016"},{"parkingID":36,"latitude":46.0500181,"longitude":14.4880478,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"13:37:00, 18.1.2016"}]};

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
        //   console.log(locations.locations);
          $.each(locations.locations, function(key, item){
              //console.log(item.address);
              items.push(item.latitude, item.longitude, item.address);
              });
            drawMap(items);
        //   alert("Napaka pri prikazovanju podatkov!");
      }
  });

function drawMap(items){

    // console.log(items);
    // console.log(items[0], items[1], items[2]);

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


// Show chart
function showChart(data) {
    //data = {"locations":[{"parkingID":57,"latitude":46.0447325,"longitude":14.4882217,"address":"Tr?a?ka cesta 31, 1000 Ljubljana","startParking":"13:24:18, 1.2.2016"},{"parkingID":56,"latitude":46.0500918,"longitude":14.4879261,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"16:29:04, 21.1.2016","endTime":"16:29:58, 21.1.2016"},{"parkingID":55,"latitude":46.0500696,"longitude":14.4879438,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"16:27:42, 21.1.2016"},{"parkingID":54,"latitude":46.050054,"longitude":14.4879437,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"16:25:37, 21.1.2016"},{"parkingID":49,"latitude":46.0445845,"longitude":14.4888807,"address":"Tr?a?ka cesta 31, 1000 Ljubljana","startParking":"10:23:06, 20.1.2016","endTime":"10:23:31, 20.1.2016"},{"parkingID":48,"latitude":46.0445899,"longitude":14.488904,"address":"Tr?a?ka cesta 25, 1000 Ljubljana","startParking":"10:22:22, 20.1.2016","endTime":"10:22:59, 20.1.2016"},{"parkingID":43,"latitude":46.0500509,"longitude":14.4880253,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"18:09:02, 19.1.2016","endTime":"18:09:10, 19.1.2016"},{"parkingID":42,"latitude":46.0500591,"longitude":14.4879478,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"17:55:28, 19.1.2016","endTime":"18:08:46, 19.1.2016"},{"parkingID":41,"latitude":46.0473171,"longitude":14.4885017,"address":"Oslavijska ulica 9, 1000 Ljubljana","startParking":"16:44:01, 19.1.2016"},{"parkingID":39,"latitude":46.0500475,"longitude":14.4881284,"address":"?krab?eva ulica 19a, 1000 Ljubljana","startParking":"17:56:21, 18.1.2016"},{"parkingID":38,"latitude":46.0500523,"longitude":14.4879745,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"17:02:42, 18.1.2016"},{"parkingID":37,"latitude":46.0500173,"longitude":14.4880554,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"13:37:12, 18.1.2016"},{"parkingID":36,"latitude":46.0500181,"longitude":14.4880478,"address":"?krab?eva ulica 21a, 1000 Ljubljana","startParking":"13:37:00, 18.1.2016"}]};
	var items = [];
	var i = 0;
	var j = 0;
	var $dates = [];	// bad var name :)
	var numbers = [];
    var labels = [];
	$.each(data.locations, function (i, item) {
		// Parse string to separated values
		var $datePart = item.startParking.split(/[^0-9]/) // regex: vse, razen stevil
		
        // 0: hour, 1: min, 2: sec, 3: / 4: day, 5: month, 6: year
		// console.log(i, $datePart[0], $datePart[1], $datePart[2], $datePart[4], $datePart[5], $datePart[6]);
		// Removing hours, minutes and seconds & convert to date data type.
		var $dateTimestamp = (new Date($datePart[6] + "," + $datePart[5] + "," + $datePart[4]).getTime()).toFixed(0);
		// console.log($dateTimestamp);

        // NOTE: jQuery.inArray() deluje samo na enem stolpcu in ne deluje za datume. JS Timestamp je ok.
        // JS indexOf je počasen pri več podatkih.
		// Check if exist. If not --> add. If exist --> increment.
		// $dates.push($dateTimestamp);
		// numbers[i] += 1;
		var found = $.inArray($dateTimestamp, $dates);
		// console.log("where: "+ found);
		if (found > -1){
			numbers[found] += 1;
			// console.log(numbers[found]);
		}
		else{
			$dates.push($dateTimestamp);
			numbers.push(1);
            labels.push($datePart[4] + ". " + $datePart[5] + ". " + $datePart[6]);
			// console.log(numbers[j]);
		}
	});
    // console.log(labels[0]);
	// console.log("dates: " + $dates.length);
	// console.log("numbers: " + numbers.length);
	// console.log(numbers[0] + "," + numbers[1]);
	// console.log($dates[0] + "," + $dates[1]);
    
    
    var timeSeriesData = [];
    var pieSeriesData = [];
	for (var i = 0; i <= $dates.length - 1; i++) {
		// var dataLine = {label: + $dates[i], data: numbers[i]};
        var dataLine = [$dates[i], numbers[i]];
        // dataLine.push($dates[i], numbers[i]);
        // console.log(dataLine);
        timeSeriesData.push(dataLine);
        
        var date = new Date(parseInt($dates[i]));
        var dateSi = "" + (date.getDate()+1) + "." + date.getMonth()+1 + "." + date.getFullYear();
        var dataLinePie = {label: dateSi, data: numbers[i]};
        pieSeriesData.push(dataLinePie);
        // console.log(dataLinePie);
        // console.log("Date Si: " + dateSi);
        // timeSeriesData[i] = "{"+"label: " + $dates[i] + "\"" + ",";
		// console.log("timeSeriesData: " + timeSeriesData[i]);
	};
    // console.log(JSON.stringify(timeSeriesData));
    // console.log(JSON.stringify(pieSeriesData));
    
    // Pie chart if numbers.length < 5
    if (numbers.length > 20) {
        var options = {
            xaxis: {
                mode: "time"
            }
        }
        
        $.plot($("#placeholder"),[
            {
                data: timeSeriesData
            }
        ],
        options);
            
    } else if(numbers.length >= 6) {
      $.plot($("#placeholder"), [timeSeriesData], {
          bars: {show:true, barWidth: 1000*60*60*10},
          xaxis: { mode: "time" } }
	);  
    } else {
        $.plot($('#placeholder'),pieSeriesData, {
            series: {
                pie: {
                    show: true,                
                    label: {
                        show:true,
                        radius: 0.8,
                        formatter: function (label, series) {
                            return '<div style="border:1px solid grey;font-size:8pt;text-align:center;padding:5px;color:white;">' +
                            label + ' : ' +
                            Math.round(series.percent) +
                            '%</div>';
                            },
                            background: {
                                opacity: 0.8,
                                color: '#000'
                                }
                            }
                        }
                    },
                    legend: {
                        show: false
                    },
                    grid: {
                        hoverable: true
                    }
                }); // end of plot function
            $("#placeholder").showMemo();
    } // end of else
 
    
}

// Pie chart hover
$.fn.showMemo = function () {
    $(this).bind("plothover", function (event, pos, item) {
        if (!item) { return; }
 
        var html = [];
        var percent = parseFloat(item.series.percent).toFixed(2);        
 
        html.push("<div style=\"border:1px solid grey;background-color:",
             item.series.color,
             "\">",
             "<span style=\"color:white\">",
             item.series.label,
             " število parkiranj: ",
            item.series.data[0][1],
             " [", percent, " %]",
             "</span>", 
             "</div>");
        $("#flot-memo").html(html.join(''));
    });
}

// Format hours and minutes in table
Number.prototype.pad = function(size) {
      var s = String(this);
      while (s.length < (size || 2)) {s = "0" + s;}
      return s;
    }