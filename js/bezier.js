function casteljau(tab, t){

	var X = [[0],[1],[2],[3]];
	var Y = [[0],[1],[2],[3]];

	for (var j = 0; j < tab.length; j++) {
		X[j][0] = tab[j][0];
		Y[j][0] = tab[j][1];
	};

	for (var i = 1; i < tab.length; i++) {
		for (var j = 0; j < tab.length - i; j++) {
			X[j][i] = (1-t)*X[j][i-1] + t*X[j+1][i-1]; 
			Y[j][i] = (1-t)*Y[j][i-1] + t*Y[j+1][i-1]; 
		};
	};

	var p = {};
  		p.x = X[0][3];
  		p.y = Y[0][3];

  	return p;
};

function bezier (points){

	// Graphic Context

	// var canvas = document.getElementById("board");
	// var context = canvas.getContext("2d");

	var c = document.getElementById("board_js");
	var ctx = c.getContext("2d");

	// BEZIER CURVES - JS FUNCTION

	// context.beginPath();
	// context.moveTo(points[0][0],points[0][1]);
	// context.bezierCurveTo(points[1][0],points[1][1],points[2][0],points[2][1],points[3][0],points[3][1]);
	// context.stroke();

	// POLYGON

	for (var i = 0; i < points.length-1; i++) {
		// drawSegment(points,i,context);
		drawSegment(points,i,ctx);
	};

	function drawSegment(tab, ind, ctx){
		ctx.moveTo(tab[i][0], tab[i][1]);
		ctx.lineTo(tab[i+1][0], tab[i+1][1]);
		ctx.stroke();
	};

	// De Casteljau's Algorythm

	var accuracy = 0.01;

	ctx.moveTo(points[0][0], points[0][1]);

	for (var i = 0; i < 1; i+=accuracy) {
		var p = casteljau(points, i);
		console.log(p.x, p.y);
		ctx.lineTo(p.x, p.y);
		ctx.stroke();
	};
};