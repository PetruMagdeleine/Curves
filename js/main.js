$(document).ready(function(){

	// DATA
	var points;
	var points_2;

	// Read data from JSON file
	var json = $.getJSON( "data/data.json", function(data) {
		points = data.points;
		points_2 = data.points_5;

		// Start Algo when Datas are updated
		bezier(points);
		splines(points_2);
 	});
	
});