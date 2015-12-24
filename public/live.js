

//------------------------------o-n---r-e-a-d-y--------------------------------(
(function() {
	console.log('start live');

	var sname= getUrlVars().sname; //витягуємо змінну з url

	console.log('live | sname: '+sname);

	$.getJSON('/api/start-param/?sname='+sname, function(initData) {//це мусить тут бути. фактично, це ініціалізація входу суб'єкта S
		S= initData.S; //? //суб'єкт ... як їх зробити множинними? щоб могло ,,жити'' декілька одночасно...
		dispH= initData.dispH;
		dispW= initData.dispW;

		tick= initData.tick;
		//tick= 1000;//x

		$("#tick").text(""+tick+"⌛");

		//-----------------------------r-e-f-r-e-s-h-------------------------------(

		setInterval(function() { //just output data

			$.ajax({
				type: "POST",
				url: "/api/refresh/?sname="+sname,
				dataType: "json",
				data: {
					"dy": S.dy,
					"dx": S.dx,
					"n": S.I[0],
					"cell": S.manipulate,
					"selfAction": S.selfAction
				},
				success: function(data) {
					//get data:
					O= data.O;
					Q= O.Q;
					H= O.H;
					W= O.W;
					S= data.S;
					var actionMask= data.actionMask;
					var reviewMask= data.reviewMask;
					var others= data.others; //o
					t= data.t;
					//dispH

					//*var*/ dispX= 7; //поки що висоту відображаємо повністю //задаємо поки постійне значення вручну
					/*
					//build world:
					for (var i=0;i<dispH;i++) {
						for (var j=0;j<dispW;j++) {//!!!*2
							var cell= $('#c'+i+'-'+j);
							//cell.text(O[i][j]).removeClass("active"); //у кожну клітинку: (а) виводимо, шо в ній знаходиться; (б) видаляємо поки що ознаку ,,активності"


							var jAbs= j + S.x-dispX;
							//!
							var q= Math.floor(jAbs/W);//!
							var J= jAbs-q*W;//!
							q= (q%O.Q+O.Q)%O.Q;//!
							//!

							cell.text(O[q][i][J]).removeClass("active"); //! ~//у кожну клітинку: (а) виводимо, шо в ній знаходиться; (б) видаляємо поки що ознаку ,,активності"




							if ( actionMask.indexOf( '['+i+'|'+jAbs+']' )>-1 ) {
								/*
								cell.text(cell.text()+'.'); //помічаємо активні блоки (з якими теоретично можна взаємодіяти) крапочками
								// *
								cell.addClass( "active" ); //event вішати треба тільки ОДИН РАЗ! тому присвоюємо активним блокам відповідний клас, а уже по класу орієнтуємося в хендлері
							}
							if ( reviewMask.indexOf( '['+i+'|'+jAbs+']' )===-1 ) {
								/*
								cell.text("?"); //помічаємо блоки, які НЕ ,,бачить'' персонаж
								// *
							}
						}
					}


					//put others ☻:
					for (var key in others) {
						//if ( $('#c'+others[key].y+'-'+others[key].x).text()!=="?" ) {
						if ( $('#c'+others[key].y+'-'+(others[key].x-S.x+dispX)).text()!=="?" ) {
							$('#c'+others[key].y+'-'+(others[key].x-S.x+dispX)).html( others[key].face + "<sup>"+others[key].tool+"</sup>" ); //o
							//$('#c'+others[key].y+'-'+others[key].x).html( others[key].face + "<sup>"+others[key].tool+"</sup>" ); //o
						}
					}

					//and at last put self ☻:
					$('#c'+S.y+'-'+dispX).html( S.face + "<sup>"+S.I[S.I[0]]+"</sup>" );
					//$('#c'+S.y+'-'+S.x).html( S.face + "<sup>"+S.I[S.I[0]]+"</sup>" );
					*/
					$("#coordinates").text(S.x+"|"+S.y);

					var _str_= "{ ";
					$.each(S, function (key, val) {
						_str_+= "<li>"+key+": "+val+" </li>";
					});
					_str_+= " }";
					$("#subject").html(_str_);




					/*
					for (var n=1; n<=9; n++) {
						$("#inv"+n).text(S.I[n]);
					}
					var choosenInv= $("#inv"+S.I[0]);
					choosenInv.text("["+choosenInv.text()+"]").addClass("choosen");
					*/
					//healtg&fullness:
					$("#health").text(""+Math.round(S.health)+"♥");
					$("#fullness").text(""+Math.round(S.fullness)+"*");
					//time effects:
					var dayTime= Math.round(t/1000/60)%24;
					$("#t").text(""+dayTime+"⌚");
					/*
					var skyTimer= {
						0: "MidnightBlue",
						1: "MidnightBlue",
						2: "MidnightBlue",
						3: "DarkBlue",
						4: "DeepSkyBlue4",
						5: "Blue2",
						6: "SkyBlue",
						7: "LightSkyBlue",
						8: "LightSkyBlue",
						9: "azure",
						10: "azure",
						11: "azure",
						12: "azure",
						13: "azure",
						14: "azure",
						15: "azure",
						16: "LightSkyBlue",
						17: "LightSkyBlue",
						18: "SkyBlue",
						19: "SkyBlue",
						20: "RoyalBlue4",
						21: "DarkBlue",
						22: "Blue4",
						23: "MidnightBlue"
					}
					$(".shell").css({backgroundColor: skyTimer[dayTime]});
					//if (S.I[S.I[0]]==="⊥") $(".active").css({backgroundColor: "yellow"});*/
				}
			});


		}, tick);
		//-----------------------------r-e-f-r-e-s-h-------------------------------)



	});



})();
//------------------------------o-n---r-e-a-d-y--------------------------------)
