

function setNameAndStart() {
	var sname= $("#sname").val();
	console.log(1,sname);//x
	$.cookie('sname', sname, { expires: 7, path: '/'});

	window.location= "world"
}

(function() {
	var sname= $.cookie("sname");
	console.log(2,sname);//x
	$("#sname").val(sname);

})();
