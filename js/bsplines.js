function kFunc(knots, k, t, ind){
	//console.log("generates_kFunc_START : knots=" + knots + " k=" + k + " t=" + t + " ind=" + ind);

	var pond = [];

	for (var w = 0; w < k+1; w++) {
		pond.push(0);
	};

	//console.log("generates_kFunc_INIT : pond = " + pond);

	var tmp1 = pond[0];
	var tmp2 = pond[1];

	//console.log("param 1 : " + tmp1 + " 2 : " + tmp2);

	var j, p, x, A, B;

	for (var p = 1; p <= k; p++) {

		tmp1 = pond[0];
		tmp2 = pond[1];
		x = 0;

		for (var j = ind - p + 1; j <= ind; j++) {
			console.log("param j : " + j + " p : " + p);
			x++;

			// pond[x] = Nj,p(t);

			if(p==1){
				if (knots[j]<= t && t < knots[j+1]) {
					pond[x] = 1;
				} else {
					pond[x] = 0;
				}
			} else {

				A = (t - knots[j]) / (knots[j + p -1] -  knots[j]);
				B = (knots[j+p] - t) / (knots[j + p] -  knots[j+1]);

				if((knots[j + p -1] -  knots[j])==0){
					A = 0;
				};

				if((knots[j + p] -  knots[j+1])==0){
					B = 0;
				};

				//console.log("A : " + A + " B : " + B + ' X : ' + x);

				pond[x] = A*tmp1 + B*tmp2;

				tmp1 = tmp2;
				tmp2 = pond[x+1];
			};
		};
	};

	//console.log("generates_kFunc_END : pond = " + pond);
	return pond;
}

function boorCox (pts, knots, n, k, t) {
	//console.log("generates_knots_START : pts=" + pts + " knots=" + knots + " n=" + n + " k=" + k + " t=" + t);

	// Step 4-1 - Find i (ind)

	var ind = k-1;
	for (var j = t; j > 1; j--) {
		ind++;
	};
	console.log("ind : " + ind);

	// Step 4-2 - k functions Ni,j(t) ≠ 0

	var res = kFunc(knots, k, t, ind);

	// Final step - Ponderations

	var X = new Array(pts.length);
	var Y = new Array(pts.length);

	for (var i = 0; i < X.length; i++) {
		X[i]= pts[i][0];
		Y[i]= pts[i][1];
	};

	var p = {};
		p.x = 0;
		p.y = 0;
	if(t==0){
		p.x = X[0];
		p.y = Y[0];
	} else if (t==n+1) {
		p.x = X[X.length];
		p.y = Y[Y.length];
	} else {

		for (var i = 0; i < k; i++) {
			p.x += X[ind-2+i]*res[i+1];
			p.y += Y[ind-2+i]*res[i+1];
		};

  	}

  	//console.log("generates_knots_END : p" + p.x + ":" + p.y);
	return p;
}

function generate_knots(n, k){
	//console.log("generates_knots_START : n=" + n + " k=" + k);

	var tab = [];

	for (var i = 0; i < n; i++) {
		tab.push(i);
	};

	var start = tab[0];
	var end = tab[tab.length-1];
	
	for (var i = 1; i < k; i++) {
		tab.unshift(start);
		tab.push(end);
	};

	// Test Size 
	if(tab.length != (n+k+1) ){
		console.log("ERROR : KNOTS size");
	}

	//console.log("generates_knots_END : " + tab);
	return tab;
}

function splines(pts){

 		// Graphic Context

 		var splines = document.getElementById("splines");
		var splines_ctx = splines.getContext("2d");

		// POLYGON

		for (var i = 0; i < pts.length-1; i++) {
			drawSegment(pts,i,splines_ctx);
		};

		function drawSegment(tab, ind, ctx){
			splines_ctx.moveTo(tab[i][0], tab[i][1]);
			splines_ctx.lineTo(tab[i+1][0], tab[i+1][1]);
			splines_ctx.stroke();
		};

		splines_ctx.moveTo(pts[0][0], pts[0][1]);

		// Boor-Cox Algorythm

		var k = 3;
		var n = pts.length-1; //  pts.length = n+1

		//console.log("pts : " + pts);
		//console.log("N : " + n);
		//console.log("K : " + k);

		var knots = generate_knots(n,k);

		// Algo pour un point 

		// var t = 0.4;
		// var p = boorCox(pts, knots, n, k, t); 


		// Algo pour toute la B-Spline

		var accuracy = 0.1;
		//variation de t entre k-1 et n
		for (var t = 0; t < 3; t+=accuracy) {
			var p = boorCox(pts, knots, n, k, t);
			//console.log(p.x, p.y);
			splines_ctx.lineTo(p.x, p.y);
			splines_ctx.stroke();
		};
};