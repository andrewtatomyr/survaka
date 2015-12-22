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
var
	H= 10,
	W= 10,
	tick= 500,
	t= 7*60*1000;

/*var*/ O= JSON.parse(fs.readFileSync('O.txt'));
console.log(O);


var survivors= JSON.parse(fs.readFileSync("survivors-list.txt"));
console.log(survivors);




app.get('/', function (req, res) { //start
	res.render('index.jade');
	//console.log("Cookies: ", req.cookies);//x
});

app.get('/world', function (req, res) { //start
	res.render('world.jade', { H: H, W: W});
});


app.get('/api/start-param', function(req,res) { //
	console.log("Cookies: ", req.cookies);//x
	O= JSON.parse(fs.readFileSync("O.txt"));
	S= JSON.parse(fs.readFileSync("S-"+req.cookies.sname+".txt"));
	console.log(S); //x
	res.json({ H: H, W: W, tick: tick, O: O, S: S });
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

var things= require("./things.js");
console.log(things);//x

function manipulate(i,j,n/*S,O*/) {
	console.log(j+"|"+i+": ["+S.I[n]+"] -> ["+O[i][j]+"]");//x

	var thing= things[ O[i][j] ], tool= S.I[n];
	if ( tool in thing ) {
		console.log("p="+thing[tool][0]);//x

		if ( Math.random()<thing[tool][0] ) {
			O[i][j]= thing[tool][1]; //thing[tool].inWorld;
			S.I[n]= thing[tool][2]; //thing[tool].inHands;

		}

		//тут прописати ймовірність поломки інструмента

	}
	S.fullness-= 1;
	S.manipulate= "";//?
}


/*
function manipulate(i,j,n) {
	var t_o= S.I[n]+O[i][j];
	console.log(">",t_o);//x
	var t_o_=t_o;
	switch (t_o) {
		//change
		case " -": t_o_= " |"; S.fullness-= 0.5; break;
		case " |": t_o_= " -"; S.fullness-= 0.5; break;
		//take&put
		case " G": t_o_= "g "; S.fullness-= 3; break;
		case "g ": t_o_= " G"; S.fullness-= 3; break;
		case "h ": t_o_= " H"; S.fullness-= 2; break;
		case " H": t_o_= "h "; S.fullness-= 2; break;
		case "+ ": t_o_= " |"; S.fullness-= 2; break;
		//crush
		case "TG": t_o_= "Tg"; S.fullness-= 0.7; break;
		case "P-": t_o_= "P+"; S.fullness-= 0.5; break;
		case "P|": t_o_= "P+"; S.fullness-= 0.5; break;
		case "PH": t_o_= "Ph"; S.fullness-= 0.5; break;
		//drop
		case "P ": t_o_= " P"; S.fullness-= 3; break;
		case "T ": t_o_= " T"; S.fullness-= 3; break;
		case "* ": t_o_= " *"; S.fullness-= 3; break;
		//pick up
		case " +": t_o_= "+ "; S.fullness-= 0.7; break;
		case " h": t_o_= "h "; S.fullness-= 0.5; break;
		case " g": t_o_= "g "; S.fullness-= 1.2; break;
		case " *": t_o_= "* "; S.fullness-= 0.3; break;
		case " P": t_o_= "P "; S.fullness-= 0.3; break;
		case " T": t_o_= "T "; S.fullness-= 0.3; break;
		default: ;//x
	}
	//console.log(t_o_);//x
	S.I[n]= t_o_[0];
	O[i][j]= t_o_[1];
	S.manipulate= "";
}
*/

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

//-------------------------------r-e-f-r-e-s-h---------------------------------(
app.post('/api/refresh', function(req,res) { //refresh situation

	S= JSON.parse(fs.readFileSync("S-"+req.cookies.sname+".txt")); //S= JSON.parse(fs.readFileSync('S.txt'));

	S.dy= 1*req.body.dy;
	S.dx= 1*req.body.dx;
	S.I[0]= 1*req.body.n;

	O= JSON.parse(fs.readFileSync('O.txt'));

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







	var //!
		passHorizontal= " -HPT+*",
		passVertical= " |HPT+*",
		support= "G-H0123456789", //doNotSupport= " |",
		hold= "H";

	if ( passVertical.indexOf(O[S.y+S.dy][S.x])>-1 && ( support.indexOf(O[S.y-1][S.x])>-1 || hold.indexOf(O[S.y][S.x])>-1 ) ) { //doNotSupport.indexOf(O[S.y-1][S.x])===-1
		S.y+= S.dy;
	}
	if ( passHorizontal.indexOf(O[S.y][S.x+S.dx])>-1 ) {
		S.x+= S.dx;
	}

	if ( S.dx || S.dy ) console.log("dy:",S.dy,"dx:",S.dx);
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


	var allowReview= ' HPTD+*hg'; //!
	var reviewRange= 9;//yet
	//var PI= 4;

	var reviewMask= actionMask;

	for (var s= 0; s<2*squared.PI*reviewRange; s++) { //прохдимо по дузі
		for (var r= 2; r<=reviewRange; r++) { //проходимо по променю
			var fi= s/reviewRange;//?
			var i= squared.y(fi,r), j= squared.x(fi,r);
			var i_prev= squared.y(fi,r-1), j_prev= squared.x(fi,r-1);



			var doorLooking= ""; //d
			/*
			if ( Math.abs(i-i_prev)===1 ) doorLooking= "|";//
			if ( Math.abs(j-j_prev)===1 ) doorLooking= "-";//
			if (doorLooking==="|-") doorLooking= "";//
			*/
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
			// */


		}

	}

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

	res.json({ /*H: H, W: W,*/ O: O, S: S, actionMask: actionMask, reviewMask: reviewMask, others: others, t: t });

	//----------------------------------f-a-l-l----------------------------------(


	///var doNotSupport= ' |'; //!
	if ( hold.indexOf(O[S.y][S.x])===-1 && support.indexOf(O[S.y-1][S.x])===-1 ) { //falling //doNotSupport.indexOf(O[S.y-1][S.x])>-1
		S.y--;
		//fs.writeFileSync('S.txt', JSON.stringify(S));//?
		console.log("fall down");
	}


	fs.writeFileSync("S-"+req.cookies.sname+".txt", JSON.stringify(S));//?
	fs.writeFileSync('O.txt', JSON.stringify(O));//?

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


	if (survivorsCount) {//if at least one S is active

		//console.log(survivorsCount);//x

		O= JSON.parse(fs.readFileSync('O.txt'));
		for (var i= 1; i<H; i++) {
			for (var j= 0; j<W; j++) {
				//зробити універсальним
				if ( O[i][j]==="G" && O[i-1][j]===" " ) {
					var p_G= 0.5; //ймовірність впасти
					if ( O[i][j-1]==="G" && O[i-1][j-1]==="G" || O[i][j+1]==="G" && O[i-1][j+1]==="G" ) {
						p_G= 0.001;
					}
					if (Math.random()<=p_G) {
						console.log("v",j,i);//x
						O[i-1][j]= O[i][j];
						O[i][j]= " ";
					}

				}
			}
		}
		fs.writeFileSync('O.txt', JSON.stringify(O));//?
	}
	//fs.writeFileSync('S.txt', JSON.stringify(S));//?

	//console.log(t);


}, tick);
//----------------------p-a-s-s-i-v-e---r-e-f-r-e-s-h--------------------------)













app.set('port', (process.env.PORT || 3000));//
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
