var express = require('express')
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.set('view engine', 'jade');

app.use(express.static('public')); //тут усі статичні файли, як-то: favicon, javascripts, style.css etc




app.use(bodyParser.urlencoded({'extended': 'true'})); //без цього не хотіло читати дані POST :) Очевидно!
app.use(bodyParser.json());
app.use(cookieParser());

var fs= require('fs');
//------------------------------------------------------

//var
	//H= 10, //->chunks
	//W= 10, //->chunks
tick= 500;
t= 7*60*1000;

/*var*/ //O= JSON.parse(fs.readFileSync('O.txt'));
var O= JSON.parse(fs.readFileSync('chunks.txt'));
H= O.H;
W= O.W;
Q= O.Q;
console.log(O);
var dispH= H;
var dispW= 15;

var survivors= JSON.parse(fs.readFileSync("survivors-list.txt"));
console.log(survivors);




app.get('/', function (req, res) { //start
	res.render('index.jade');
	//console.log("Cookies: ", req.cookies);//x
});

app.get('/world', function (req, res) { //start

	res.render('world.jade', { dispH: dispH, dispW: dispW});
});


app.get('/api/start-param', function(req,res) { //забрати нафіг!
	console.log("Cookies: ", req.cookies);//x
	S= JSON.parse(fs.readFileSync("S-"+req.cookies.sname+".txt"));
	console.log(S); //x

	//завантажувати відповідно до координати
	//O= JSON.parse(fs.readFileSync("O.txt"));
	//var O= JSON.parse(fs.readFileSync("chunks.txt"));//!?

	res.json({  dispH,  dispW,  tick/*, O: O, S: S*/,S });//?
});


//-----------------------s-q-u-a-r-e---t-r-i-g-o-n-o-m-e-t-r-y-----------------(
var squared= require("./squared.js");
/*/example
var rrr=3;
for (var s= 0; s<2*squared.PI*(rrr); s++) { //прохдимо по дузі
		var fi= s/(rrr);//?
		var i= squared.y(fi,(rrr)), j= squared.x(fi,(rrr));
		console.log("r("+rrr+")",s,fi,"<",j,i,">");
}
// */
//-----------------------s-q-u-a-r-e---t-r-i-g-o-n-o-m-e-t-r-y-----------------)

//-------------------------------m-a-n-i-p-u-l-a-t-e---------------------------(
var things= require("./things.js");
console.log(things);//x

function manipulate(i,j,n) {

	var rel= relative(j,W,Q); //!
	console.log(j+"|"+i+": ["+S.I[n]+"] -> ["+O[rel.q][i][rel.J]+"]");//x

	var thing= things[ O[rel.q][i][rel.J] ], tool= S.I[n];
	if ( tool in thing ) {
		console.log("p="+thing[tool][0]);//x

		if ( Math.random()<thing[tool][0] ) {
			O[rel.q][i][rel.J]= thing[tool][1]; //thing[tool].inWorld;
			S.I[n]= thing[tool][2]; //thing[tool].inHands;

		}

		//тут прописати ймовірність поломки інструмента

	}
	S.fullness-= 1;//?
	S.manipulate= "";//?
}
//-------------------------------m-a-n-i-p-u-l-a-t-e---------------------------)



function selfAction(n) {


	var tool= S.I[n];
	console.log("self: ",tool);//x
	var tool_ =tool;
	switch (tool) {
		//eat
		case "*": tool_=" "; S.fullness+=30; /*if (S.fullness>100) S.fullness= 100;*/ break;

		default: ;

	}

	S.I[n]= tool_;
	S.selfAction= "";
}

function healhAndFullness() {

	if ( S.fullness<1 || S.fullness>99 ) {
		S.health-= 1*tick/1000;
	} else if ( S.fullness>=50 && S.fullness<=90 ) {
		S.health+= 1*tick/1000;
	}



	if (S.health>100) {
		S.health= 100;
	}
	if (S.health<0) {
		S.health= 0;
		//DEATH
	}



	//move discharge:
	if (S.dy===1) S.fullness-= 0.3;
	if (S.dy===-1) S.fullness-= 0.1;
	if ( S.dx===1 || S.dx===-1 ) S.fullness-= 0.08;


	//self discharge:
	S.fullness-= S.fullness/2500*tick/1000;
	//if (S.fullness>100) {
	//	S.fullness= 100;
	//}
	if (S.fullness<0) {
		S.fullness= 0;
	}

	//S.I[n]= tool_;
	//S.selfAction= "";

}

function relative(j,W,Q) { //відносна координата по горизонталі
	var q= Math.floor(j/W);
	var J= j-q*W;
	q= (q%Q+Q)%Q;
	jNew= q*W+J;
	return { J:J, q:q, j:jNew };
}


//-------------------------------r-e-f-r-e-s-h---------------------------------(
app.post('/api/refresh', function(req,res) { //refresh situation

	S= JSON.parse(fs.readFileSync("S-"+req.cookies.sname+".txt")); //S= JSON.parse(fs.readFileSync('S.txt'));

	S.dy= 1*req.body.dy;
	S.dx= 1*req.body.dx;
	S.I[0]= 1*req.body.n;

	/*
	O= JSON.parse(fs.readFileSync('O.txt'));
	*/
	 O= JSON.parse(fs.readFileSync("chunks.txt"));
	//O= chunks



	if (req.body.cell) { //manipulate
		manipulate( req.body.cell.i , req.body.cell.j , S.I[0] );
	}

	if (req.body.selfAction) { //self action
		selfAction( S.I[0] );
	}

	healhAndFullness();



	//-----------------------------------m-o-v-e---------------------------------(


	/*
	//allowAction is always when passVertical || passHorizontal?
	var things= {
		space: {
			iconInstalled: " ",
			iconLaying: " ",
			passVertical: "+",
			passHorizontal: "+",
			support: "",
			hold: "",
			allowAction: "+"
		},
		ground: {
			iconInstalled: "G",
			iconLaying: "g",
			passVertical: "",
			passHorizontal: "",
			support: "+",
			hold: "",
			allowAction: ""
		},
	}
	*/




	var rel= relative(S.x,W,Q);
	//console.log(rel,O);//x

	if ( things[ O[rel.q][S.y+S.dy][rel.J] ].passVertical && ( things[ O[rel.q][S.y-1][rel.J] ].support || things[ O[rel.q][S.y][rel.J] ].hold ) ) { //?
	//if ( things[ O[S.y+S.dy][S.x] ].passVertical && ( things[ O[S.y-1][S.x] ].support || things[ O[S.y][S.x] ].hold ) ) { //?
		S.y+= S.dy;
	}

	var	lateral= relative(S.x+S.dx,W,Q);

	if ( things[ O[lateral.q][S.y][lateral.J] ].passHorizontal ) { //?
	//if ( things[ O[S.y][S.x+S.dx] ].passHorizontal ) { //?
		S.x= lateral.j;
		S.q= lateral.q;
		//S.x+= S.dx;
	}

	if ( S.dx || S.dy ) console.log("q:",S.q,"dy:",S.dy,"dx:",S.dx);//x
	//at last:
	S.dy= 0;
	S.dx= 0;
	//-----------------------------------m-o-v-e---------------------------------)






	//---------------------------a-c-t-i-o-n---m-a-s-k---------------------------(

	//у які координати це перевести???????????

	//var allowAction= " H"; //' -|H'; //! //таки дозволю ламати ,,закриті'' блоки по діагоналі- по аналогії як у reviewMask
	var actionMask= '['+(S.y)+'|'+(S.x-1)+']'
		+'['+(S.y)+'|'+(S.x+1)+']'
		+'['+(S.y+1)+'|'+(S.x)+']'
		+'['+(S.y-1)+'|'+(S.x)+']';
	//if ( allowAction.indexOf(O[S.y][S.x-1])>-1 || allowAction.indexOf(O[S.y-1][S.x])>-1 )
		actionMask+= '['+(S.y-1)+'|'+(S.x-1)+']';
	//if ( allowAction.indexOf(O[S.y][S.x+1])>-1 || allowAction.indexOf(O[S.y-1][S.x])>-1 )
		actionMask+= '['+(S.y-1)+'|'+(S.x+1)+']';
	//if ( allowAction.indexOf(O[S.y][S.x-1])>-1 || allowAction.indexOf(O[S.y+1][S.x])>-1 )
		actionMask+= '['+(S.y+1)+'|'+(S.x-1)+']';
	//if ( allowAction.indexOf(O[S.y][S.x+1])>-1 || allowAction.indexOf(O[S.y+1][S.x])>-1 )
		actionMask+= '['+(S.y+1)+'|'+(S.x+1)+']';
	//---------------------------a-c-t-i-o-n---m-a-s-k---------------------------)


	//---------------------------r-e-v-i-e-w---m-a-s-k---------------------------(

	var allowReview= ' HPTD+*hg'; //!
	var reviewRange= 9;//yet

	var reviewMask= actionMask;
	/* //потім доробити. можливо, навіть зробити як я думав - видимість як замкнута фігура.

	for (var s= 0; s<2*squared.PI*reviewRange; s++) { //прохдимо по дузі
		for (var r= 2; r<=reviewRange; r++) { //проходимо по променю
			var fi= s/reviewRange;//?
			var i= squared.y(fi,r), j= squared.x(fi,r);
			var i_prev= squared.y(fi,r-1), j_prev= squared.x(fi,r-1);



			var doorLooking= ""; //d

			if ( fi===0 || fi===squared.PI ) doorLooking= "-"; //d
			if ( fi===squared.PI/2 || fi===3*squared.PI/2 ) doorLooking= "|"; //d




			if ( S.y+i>=0 && S.y+i<H && S.x+j>=0 && S.x+j<W ) { //щоб не вийти за межі...
				if (
					reviewMask.indexOf("["+(S.y+i_prev)+"|"+(S.x+j_prev)+"]")>-1
					&& ( allowReview.indexOf(O[S.y+i_prev][S.x+j_prev])>-1 || doorLooking.indexOf(O[S.y+i_prev][S.x+j_prev])>-1 )
				) {
					reviewMask+= "["+(S.y+i)+"|"+(S.x+j)+"]";
				}
			}

			//щось іще не симетрично...
			//
			//REVERSE2:
			fi= (2*squared.PI*reviewRange-s)/reviewRange;
			var i= squared.y(fi,r), j= squared.x(fi,r);
			var i_prev= squared.y(fi,r-1), j_prev= squared.x(fi,r-1);
			if ( S.y+i>=0 && S.y+i<H && S.x+j>=0 && S.x+j<W ) { //щоб не вийти за межі...
				if (
					reviewMask.indexOf("["+(S.y+i_prev)+"|"+(S.x+j_prev)+"]")>-1
					&& ( allowReview.indexOf(O[S.y+i_prev][S.x+j_prev])>-1  )
				) {
					reviewMask+= "["+(S.y+i)+"|"+(S.x+j)+"]";
				}
			}
			//:REVERSE2
			//


		}

	}
	*/
	//---------------------------r-e-v-i-e-w---m-a-s-k---------------------------)






	//-------------------------o-t-h-e-r-s-&-o-n-l-i-n-e-------------------------(


	var survivors= JSON.parse(fs.readFileSync("survivors-list.txt")); //S= JSON.parse(fs.readFileSync('S.txt'));
	var sname= req.cookies.sname;

	survivors[sname]= 10; //задаємо маркер присутності (він з кожним тиком буде зменшуватися)
	fs.writeFileSync('survivors-list.txt', JSON.stringify(survivors)); //зберігаємо маркер соєї присутності

	var others= {}; //інші виживаки
	for (var key in survivors) { //перебираємо інших виживак
		if ( key==sname ) { //якщо це Я
			//nop
		} else if ( survivors[key] ) { //якщо це не Я і якщо виживака online
			//console.log(key);

			S_other= JSON.parse(fs.readFileSync("S-"+key+".txt")); //S= JSON.parse(fs.readFileSync('S.txt'));

			others[key]= {
				"face": S_other.face,
				"y": S_other.y,
				"x": S_other.x,
				"tool": S_other.I[S_other.I[0]]

			}
		}
	}
	//-------------------------o-t-h-e-r-s-&-o-n-l-i-n-e-------------------------)





	//console.log( Math.round(t/1000) );//x

	res.json({      O,  S,  actionMask,  reviewMask,  others,  t });

	//----------------------------------f-a-l-l----------------------------------(

	var rel= relative(S.x,W,Q);//!?
	///var doNotSupport= ' |'; //!
	if ( things[ O[rel.q][S.y][rel.J] ].hold || things[ O[rel.q][S.y-1][rel.J] ].support ) {
		//nop
	} else {//falling //doNotSupport.indexOf(O[S.y-1][S.x])>-1
		//if ( hold.indexOf(O[S.y][S.x])===-1 && support.indexOf(O[S.y-1][S.x])===-1 ) { //falling //doNotSupport.indexOf(O[S.y-1][S.x])>-1
		console.log("fall down" );//x
		S.y--;
		//fs.writeFileSync('S.txt', JSON.stringify(S));//?
	}


	fs.writeFileSync("S-"+req.cookies.sname+".txt", JSON.stringify(S));//?
	//fs.writeFileSync('O.txt', JSON.stringify(O));//?
	fs.writeFileSync('chunks.txt', JSON.stringify(O));//?

	//fs.writeFile("S.txt", JSON.stringify(S), function() {	});//?
	//fs.writeFile("O.txt", JSON.stringify(O), function() {	});//?


	//-----------------------------------f-a-l-l---------------------------------)


});
//-------------------------------r-e-f-r-e-s-h---------------------------------)

//----------------------p-a-s-s-i-v-e---r-e-f-r-e-s-h--------------------------(

setInterval(function() {
	t+= tick;


	var survivors= JSON.parse(fs.readFileSync("survivors-list.txt")); //S= JSON.parse(fs.readFileSync('S.txt'));
	var survivorsCount= 0;
	for (var key in survivors) {
		survivors[key]--;
		if (survivors[key]<0) survivors[key]= 0;
		survivorsCount+= (survivors[key]>0)? 1: 0;
	}
	fs.writeFileSync('survivors-list.txt', JSON.stringify(survivors));

	/* */
	if (survivorsCount) {//if at least one S is active

		//console.log(survivorsCount);//x

		var O= JSON.parse(fs.readFileSync('chunks.txt'));

		//тут треба вибрати активні чанки

		for (var q=0; q<Q; q++) { //для всіх (поки що) чанків
			for (var i= 1; i<H; i++) {
				//for (var j= 1; j<9; j++) {//x
				for (var j= 0; j<W; j++) {
					//зробити універсальним

					var thing= things[ O[q][i][j] ];
					//if (thing===" ") continue; //якщо повітря - пропускаємо
					if ( O[q][i][j]===" " || thing.fixed || things[ O[q][i-1][j] ].support || things[ O[q][i-1][j] ].fixed ) {
						//блок залишається на місці
					} else {

						var relL= relative(q*W+j-1,W,Q),
				 			relR= relative(q*W+j+1,W,Q);

						if (
							thing.adhesive //block has own adhesive property
							&& (
							 	things[ O[relL.q][i][relL.J] ].adhesive && ( things[ O[relL.q][i][relL.J] ].fixed || things[ O[relL.q][i-1][relL.J] ].support || things[ O[relL.q][i-1][relL.J] ].fixed ) //left "semi-support"
								|| things[ O[relR.q][i][relR.J] ].adhesive && ( things[ O[relR.q][i][relR.J] ].fixed || things[ O[relR.q][i-1][relR.J] ].support || things[ O[relR.q][i-1][relR.J] ].fixed ) //right "semi-support"
								//|| (things[ O[i][j+1] ].fixed || things[ O[i][j+1] ].support && things[ O[i-1][j+1] ].support) //right "semi-support" //O[i][j+1]==="G" && O[i-1][j+1]==="G"
							)
						) { //lateral semi-support
							pFall= 0.001; //ймовірність впасти

							if (Math.random()<=pFall) { //no any kind of support
								console.log(pFall,O[q][i][j],"↓",j,(i-1),O[q][i-1][j] );//x
								O[q][i-1][j]= O[q][i][j];
								O[q][i][j]= " ";
							}

						} else { //certain fall
							console.log("certain",O[q][i][j],"↓",j,(i-1),O[q][i-1][j] );//x
							O[q][i-1][j]= O[q][i][j];
							O[q][i][j]= " ";
						}


					}
				}
			}
			fs.writeFileSync('chunks.txt', JSON.stringify(O));//?
		}

	}
	//fs.writeFileSync('S.txt', JSON.stringify(S));//?

	//console.log(t);
	/* */

}, tick);
//----------------------p-a-s-s-i-v-e---r-e-f-r-e-s-h--------------------------)













app.set('port', (process.env.PORT || 3000));//
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
