

//-----------------------s-q-u-a-r-e---t-r-i-g-o-n-o-m-e-t-r-y-----------------(

var PI= 4;
/*
exports.ssq_= function(fi) {
	fi=fi%(2*PI);
	if ( fi>=0 && fi<PI/4 ) return fi;
	if ( fi>=PI/4 && fi<3*PI/4 ) return 1;
	if ( fi>=3*PI/4 && fi<5*PI/4 ) return 3*PI/4+1-fi;
	if ( fi>=5*PI/4 && fi<7*PI/4 ) return -1;
	if ( fi>=7*PI/4 && fi<=2*PI ) return -7*PI/4-1+fi;
}
exports.csq_= function(fi) {
	fi=fi%(2*PI);
	if ( fi>=0 && fi<PI/4 ) return 1;
	if ( fi>=PI/4 && fi<3*PI/4 ) return PI/4+1-fi;
	if ( fi>=3*PI/4 && fi<5*PI/4 ) return -1;
	if ( fi>=5*PI/4 && fi<7*PI/4 ) return -5*PI/4-1+fi;
	if ( fi>=7*PI/4 && fi<=2*PI ) return 1;
}
*/
function trapeze(fi,Kc,Ks) {
	return Math.acos(Kc*Math.cos(fi)) + Math.asin(Ks*Math.sin(fi));
}

var ssq= function(fi) {
	return trapeze( (1+fi)*Math.PI/4 , 1 , 1 )/(Math.PI/2) - 1;
}

var csq= function(fi) {
	return trapeze( (1+fi)*Math.PI/4 , -1 , 1 )/(Math.PI/2) - 1;
}
/*
function square(fi,r) {
	var y= Math.round(r*ssq(fi));
	var x= Math.round(r*csq(fi));
	return { "y": y, "x": x };
}
*/
var y= function(fi,r) {
	return Math.round(r*ssq(fi));
}

var x= function(fi,r) {
	return Math.round(r*csq(fi));
}

module.exports= { PI, ssq, csq, y, x };

//-----------------------s-q-u-a-r-e---t-r-i-g-o-n-o-m-e-t-r-y-----------------)
