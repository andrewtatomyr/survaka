var express = require('express')
var app = express();

var bodyParser = require('body-parser');
var http= require("http");
var url= require("url");


app.set('view engine', 'jade');

app.use(express.static('public')); //тут усі статичні файли, як-то: favicon, javascripts, style.css etc




app.use(bodyParser.urlencoded({'extended': 'true'})); //без цього не хотіло читати дані POST :) Очевидно!
app.use(bodyParser.json());

var fs= require('fs');
//------------------------------------------------------

//var
	//H= 10, //->chunks
	//W= 10, //->chunks
tick= 400;
t= 7*60*1000;

/*var*/ //O= JSON.parse(fs.readFileSync('O.txt'));
var O= JSON.parse(fs.readFileSync('chunks.txt'));
H= O.H;
W= O.W;
Q= O.Q;
console.log(O);
var dispH= H;
var dispW= 15;

var survivors= JSON.parse(fs.readFileSync("live.txt"));
console.log(survivors);




app.get('/', function (req, res) { //start
	res.render('index.jade');
	var sname = url.parse(req.url, true).query.sname;
	console.log("index | sname: ", sname);//x
});

app.get('/world', function (req, res) { //start

	res.render('world.jade', { dispH: dispH, dispW: dispW});
});

app.get('/live', function (req, res) { //start
	console.log("start live");//x
	res.render('live.jade', { ok: "ok" } );
});


app.get('/api/start-param', function(req,res) { //забрати нафіг!
	var sname = url.parse(req.url, true).query.sname;
	console.log("start | sname: ", sname);//x
	S= JSON.parse(fs.readFileSync("S-"+sname+".txt"));
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

function manipulate(i,j,n,sname) {

	var rel= relative(j,W,Q); //!
	console.log(sname,": ",j+"|"+i+": ["+S.I[n]+"] -> ["+O[rel.q][i][rel.J]+"]");//x

	var thing= things[ O[rel.q][i][rel.J] ], tool= S.I[n];
	if ( tool in thing ) {
		console.log(sname,": ","p="+thing[tool][0]);//x

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



function selfAction(n,sname) {


	var tool= S.I[n];
	console.log(sname,": self: ",tool);//x
	var tool_ =tool;
	switch (tool) {
		//eat
		case "*": tool_= " "; S.fullness+= things[tool].energyValue; break;
		case "*inTeeth": tool_= "teeth"; S.fullness+= things[tool].energyValue; break;

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
	var sname = url.parse(req.url, true).query.sname;

	S= JSON.parse(fs.readFileSync("S-"+sname+".txt")); //якщо цього не робити, то файли S для різних суб'єквів почнуть змішуватися один з одним

	S.dy= 1*req.body.dy;
	S.dx= 1*req.body.dx;
	S.I[0]= 1*req.body.n;

	oldS= S; //old

	O= JSON.parse(fs.readFileSync("chunks.txt")); //зчитуємо світ

	if (req.body.cell) { //manipulate
		manipulate( req.body.cell.i , req.body.cell.j , S.I[0] , sname );
	}

	if (req.body.selfAction) { //self action
		selfAction( S.I[0] , sname );
	}

	healhAndFullness();



	//-----------------------------------m-o-v-e---------------------------------(


	var rel= relative(S.x,W,Q); //горизонтальна координата в чанку

	if (
		(
			things[ O[rel.q][S.y+S.dy][rel.J] ].space
			|| things[ O[rel.q][S.y+S.dy][rel.J] ].flat
			|| things[ O[rel.q][S.y+S.dy][rel.J] ].verticalDoor
		)
		&& (
			(
				things[ O[rel.q][S.y-1][rel.J] ].volumetric
				|| things[ O[rel.q][S.y-1][rel.J] ].horizontalDoor
				|| things[ O[rel.q][S.y][rel.J] ].hold
			)
			|| (
				things[ O[rel.q][S.y-1][rel.J] ].flat
				&& ( things[ O[rel.q][S.y][rel.J] ].space || things[ O[rel.q][S.y][rel.J] ].verticalDoor || things[ O[rel.q][S.y][rel.J] ].horizontalDoor )
			)
		)
		&& !S.justFell //it prevents suspension
	) {
		S.y+= S.dy;
	}

	var	lateral= relative(S.x+S.dx,W,Q);  //бічна горизонтальна координата в чанку в напрямку потенційного руху

	if (
		things[ O[lateral.q][S.y][lateral.J] ].flat
		|| things[ O[lateral.q][S.y][lateral.J] ].space
		|| things[ O[lateral.q][S.y][lateral.J] ].horizontalDoor
	) { //?
		S.x= lateral.j;
		S.q= lateral.q;
		//S.x+= S.dx;
	}

	if ( S.dx || S.dy ) console.log(sname,": ","dy:",S.dy,"dx:",S.dx," (q="+S.q+")");//x
	//at last:
	S.dy= 0;
	S.dx= 0;
	//-----------------------------------m-o-v-e---------------------------------)






	//---------------------------a-c-t-i-o-n---m-a-s-k---------------------------(


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

	//var reviewRange= 9;//це буде задаватися нейронною моделлю в S-sname або A-aname

	var reviewMask= actionMask; //це той мінімум, який обов'язково повинен бачити суб'єкт - 8 клітинок навколо себе
	/* оптика //потім доробити. можливо, навіть зробити як я думав - видимість як замкнута фігура.

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


	var survivors= JSON.parse(fs.readFileSync("live.txt")); //S= JSON.parse(fs.readFileSync('S.txt'));

	survivors[sname]= 10; //задаємо маркер присутності (він з кожним тиком буде зменшуватися)
	fs.writeFileSync('live.txt', JSON.stringify(survivors)); //зберігаємо маркер соєї присутності

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

	S.dHealth= S.health-oldS.health;
	S.dFullness= S.fullness-oldS.fullness;


	res.json({      O,  S,  actionMask,  reviewMask,  others,  t });

	//----------------------------------f-a-l-l----------------------------------(

	var rel= relative(S.x,W,Q);//!?
	if (
		things[ O[rel.q][S.y][rel.J] ].hold
		|| things[ O[rel.q][S.y-1][rel.J] ].volumetric
		|| things[ O[rel.q][S.y-1][rel.J] ].horizontalDoor
		|| things[ O[rel.q][S.y-1][rel.J] ].flat && ( things[ O[rel.q][S.y][rel.J] ].space || things[ O[rel.q][S.y][rel.J] ].verticalDoor || things[ O[rel.q][S.y][rel.J] ].horizontalDoor )
	) {
		//nop
		S.justFell= 0; //очищаємо флаг падіння
	} else {
		console.log(sname,": ","fall down" );//x
		S.y--;
		S.justFell= 1; //задаємо флаг падіння
	}

	//-----------------------------------f-a-l-l---------------------------------)


	fs.writeFileSync("S-"+sname+".txt", JSON.stringify(S));//?
	fs.writeFileSync('chunks.txt', JSON.stringify(O));//?





});
//-------------------------------r-e-f-r-e-s-h---------------------------------)

//----------------------p-a-s-s-i-v-e---r-e-f-r-e-s-h--------------------------(

setInterval(function() {
	t+= tick;


	var survivors= JSON.parse(fs.readFileSync("live.txt")); //S= JSON.parse(fs.readFileSync('S.txt'));
	var survivorsCount= 0;
	for (var key in survivors) {
		survivors[key]--;
		if (survivors[key]<0) survivors[key]= 0;
		survivorsCount+= (survivors[key]>0)? 1: 0;
	}
	fs.writeFileSync('live.txt', JSON.stringify(survivors)); //записуємо нові значення онлайну

	/* World background processing */
	if (survivorsCount) {//if at least one S is active

		//console.log(survivorsCount);//x

		var O= JSON.parse(fs.readFileSync('chunks.txt'));

		//тут треба вибрати активні чанки

		for (var q=0; q<Q; q++) { //для всіх (поки що) чанків

			//-----------------------p-y-r-o-t-e-c-h-n-i-k-s-------------------------(

			//"&"


			//-----------------------p-y-r-o-t-e-c-h-n-i-k-s-------------------------)

			//-------------------------b-o-t-a-n-y-----------------------------------(

			var i= Math.floor( 1 + Math.random()*(H-2) ), j= Math.floor(Math.random()*W);//? поіде для біології

			//var thing= things[ O[q][i][j] ];
			if (O[q][i][j]===" ") { // " "-> @ or *
				var _left= relative(q*W+j-1,W,Q), _right= relative(q*W+j+1,W,Q);
				//console.log(q,"space",j,i);//x

				if (
					O[q][i-1][j]==="@"
					&& i>2
					&& ( O[q][i-2][j]==="G" || O[q][i-2][j]==="Y" )
				) {
					//grow up
					O[q][i][j]= (Math.random()<0.7)? "@": "*";
					console.log(q,"grow up",	O[q][i][j],j,i);//x
				} else if (
					(
						O[_left.q][i][_left.J]==="@"
						&& ( O[_left.q][i-1][_left.J]==="G" || O[_left.q][i-1][_left.J]==="Y" )
					)
					|| (
						O[_right.q][i][_right.J]==="@"
						&& ( O[_right.q][i-1][_right.J]==="G" || O[_right.q][i-1][_right.J]==="Y" )
					)
				) {
					//grow up
					O[q][i][j]= (Math.random()<0.7)? "*": "@";
					console.log(q,"grow up",	O[q][i][j],j,i);//x
				} else if (
					(	O[_left.q][i][_left.J]==="@" || O[_right.q][i][_right.J]==="@" )
					&& O[q][i-1][j]===" " //?
				) {
					//grow up
					O[q][i][j]= (Math.random()<0.5)? "*": "@";
					console.log(q,"grow up",	O[q][i][j],j,i);//x
				} else if (
					O[q][i+1][j]==="@"
					&& i>2
					&& (
						O[_left.q][i+1][_left.J]==="Y" || O[_left.q][i+1][_left.J]==="@"
						|| O[_right.q][i+1][_right.J]==="Y" || O[_right.q][i+1][_right.J]==="@"
					)
				) {
					//grow up
					O[q][i][j]= (Math.random()<0.7)? "@": "*";
					console.log(q,"grow up",	O[q][i][j],j,i);//x
				}

			}



			if (O[q][i][j]==="@") { // @->Y
				if (Math.random()<0.01) { //доємо  шанс засохнути
					O[q][i][j]= "/";
				} else if (
					(O[q][i-1][j]==="G" || O[q][i-1][j]==="Y")
					&& O[q][i+1][j]==="@" //якщо це не вершина дерева (вершину треба би залишити для продовження росту, бо щось не хочуть вверх рости)
				) {
					console.log(q,"grow @ to Y",j,i);//x
					O[q][i][j]= "Y";
				}
			}

			if (O[q][i][j]==="Y") { // Y->W
				if ( O[q][i-1][j]==="G" || O[q][i-1][j]==="Y" ) {
					if ( O[q][i-1][j]==="G" ) O[q][i][j]= (Math.random()<0.001)? "w": "Y"; //x - тимчасово даємо можливість дереву засохнути від кореня
				} else {
					console.log(q,"shrink Y to w",j,i);//x
					O[q][i][j]= "w";
				}
			}


			if (O[q][i][j]==="*") { // '*'->' '
				//console.log(q,"banyan",j,i);//x
				O[q][i][j]= (Math.random()<0.03)? " ": "*"; //банан згнив
			}


			//-------------------------b-o-t-a-n-y-----------------------------------)


			//-------------------------s-t-a-t-i-c-s---------------------------------(

			for (var i= H-1; i>1; i--) { //ТАКИ ТРЕБА ПРОХОДИТИ ВСІ КЛІТИНКИ ДЛЯ СТАТИКИ
				for (var j= 0; j<W; j++) {
					var thing= things[ O[q][i][j] ];

					if ( thing.space || thing.fixed || !things[ O[q][i-1][j] ].space ) {
						//блок залишається на місці
					} else { //шукаємо можливі адгезивні зв'язки

						var _left= relative(q*W+j-1,W,Q), _right= relative(q*W+j+1,W,Q);
						//console.log("------->",q,j,i);
						if (
							thing.adhesive
							&&	(
								thing.adhesive[ O[_left.q][i][_left.J] ] && ( things[ O[_left.q][i][_left.J] ].fixed || !things[ O[_left.q][i-1][_left.J] ].space ) //left "semi-support"
								|| thing.adhesive[ O[_right.q][i][_right.J] ] && ( things[ O[_right.q][i][_right.J] ].fixed || !things[ O[_right.q][i-1][_right.J] ].space ) //right "semi-support"
							)
						) { //lateral semi-support
							var pAdhL= ( thing.adhesive[ O[_left.q][i][_left.J] ] )? thing.adhesive[ O[_left.q][i][_left.J] ]: 0;
							var pAdhR= ( thing.adhesive[ O[_right.q][i][_right.J] ] )? thing.adhesive[ O[_right.q][i][_right.J] ]: 0;
							var pFall= (1-pAdhL)*(1-pAdhR); //0.001; //ймовірність впасти


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
			//-------------------------s-t-a-t-i-c-s---------------------------------)

			//fs.writeFileSync('chunks.txt', JSON.stringify(O));//? це треба якось динамічно писати в БД

		}
		fs.writeFileSync('chunks.txt', JSON.stringify(O));//? це треба якось динамічно писати в БД
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
