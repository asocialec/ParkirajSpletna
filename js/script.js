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
  			alert("Napaka pri prikazovanju podatkov!");
  		}
	});
	
}

function showTable (data) {
	var items = [];
	/*data = [
{"parkingID":33,"latitude":46.0530278,"longitude":14.488073,"address":"&Scaron;krab&#x10d;eva ulica 21a, 1000 Ljubljana","startParking":"2016-01-18 12:35:09"},
{"parkingID":34,"latitude":46.0500301,"longitude":14.508074,"address":"Jamova ulica 10, 1000 Ljubljana","startParking":"2016-01-18 12:39:36"},
{"parkingID":35,"latitude":46.3800213,"longitude":14.4879432,"address":"&Scaron;krab&#x10d;eva ulica 21a, 1000 Ljubljana","startParking":"2016-01-18 13:02:29"},
{"parkingID":36,"latitude":46.0350181,"longitude":14.4580478,"address":"Dunajska 65, 1000 Ljubljana","startParking":"2016-01-18 13:37:00"},
{"parkingID":37,"latitude":46.0500173,"longitude":14.4880554,"address":"Ločnikarjeva 1, 1000 Ljubljana","startParking":"2016-01-18 13:37:12"},
{"parkingID":38,"latitude":46.0800523,"longitude":14.4879745,"address":"Pod brezami 23, 1000 Ljubljana","startParking":"2016-01-18 17:02:42"},
{"parkingID":39,"latitude":46.0500475,"longitude":14.5581284,"address":"Bobenčkova, 1000 Ljubljana","startParking":"2016-01-18 17:56:21"}];*/
	$.each(data.locations, function (i, item) {
		items.push("<tr><td>" + item.address + "</td>" + 
			"<td>" + item.startParking + "</td>" + 
			"<td>" + "1:25" + "</td>" +
			"<td><span class = 'glyphicon glyphicon-remove' onClick='izbrisi(\"" + item.parkingID + "\")'></span></td>" +
			"<td><span class = 'glyphicon glyphicon-edit' data-toggle='modal' data-target='#myModal' onClick='uredi(\"" + item.parkingID + "\")'></span></td>" +
			"</tr>");
		// return data;
	});
	$("#tabela table tbody").html(items.join(" "));
	//console.log(data);
}


function izbrisi(id){
	$.ajax({
  type: 'DELETE',
  url: 'http://localhost:8080/ParkirajWeb/web/V1_web/parkingID='+id,
  success: function() {
    getData();
  }
});

}

function uredi(id){

	alert(id);
}