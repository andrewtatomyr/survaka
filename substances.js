




var substances= {
	//space (put into all the things what can be layed out):
	" ": {
		name: "space",
		passVertical: 1,
		passHorizontal: 1,
		allowReview: 1,

		"+": [1,"|"," "],
		"g": [1,"G"," "],
		"h": [1,"H"," "],
		"*": [1,"*"," "],

		"P": [1,"P"," "],
		"T": [1,"T"," "],
		"D": [1,"D"," "],
		"/": [1,"/"," "],

	},
	//tools:
	"/": {
		name: "stick/cane?",
		passVertical: 1,
		passHorizontal: 1,
		allowReview: 1,
		breakageProbablity: 0.01,

		" ": [1," ","/"]
	},
	"P": {
		name: "ax",
		passVertical: 1,
		passHorizontal: 1,
		allowReview: 1,
		breakageProbablity: 0.01,

		" ": [1," ","P"]
	},
	"T": {
		name: "pickaxe",
		passVertical: 1,
		passHorizontal: 1,
		allowReview: 1,
		breakageProbablity: 0.01,

		" ": [1," ","T"]
	},
	"D": {
		name: "shovel",
		passVertical: 1,
		passHorizontal: 1,
		allowReview: 1,
		breakageProbablity: 0.01,

		" ": [1," ","D"]
	},
	//objects:
	"G": {
		name: "ground",
		support: 1,

		"D": [1,"g","D"],
		"/": [0.5,"g","/"],
		" ": [0.2," ","g"]
	},
	"g": {
		name: "piece of ground",
		passVertical: 1,
		passHorizontal: 1,
		probOfTake: 1,
		allowReview: 1,

		" ": [1," ","g"]
	},
	"|": {
		name: "vertical door",
		fixed: 1, //?
		passVertical: 1,

		"P": [1,"+","P"],
		"/": [0.5,"+","/"],

		"T": [0.1," ","T"], //x
		" ": [1,"-"," "]
	},
	"-": {
		name: "horizontal door",
		fixed: 1, //?
		passHorizontal: 1,
		support: 1,

		"P": [1,"+","P"],
		"/": [0.5,"+","/"],

		"T": [0.1," ","T"], //x
		" ": [1,"|"," "]
	},
	"+": {
		name: "uninstalled door",
		passVertical: 1,
		passHorizontal: 1,
		allowReview: 1,

		" ": [1," ","+"]

	},
	"H": {
		name: "ladder",
		fixed: 1, //?
		passVertical: 1,
		passHorizontal: 1,
		support: 1,
		hold: 1,
		allowReview: 1,

		"P": [1,"h","P"],
		"/": [0.5,"h","/"],

		"T": [0.1," ","T"], //x
		" ": [0.5," ","h"]
	},
	"h": {
		name: "uninstalled ladder",
		passVertical: 1,
		passHorizontal: 1,
		allowReview: 1,

		" ": [1," ","h"]
	},
	"*": {
		name: "piece of food",
		passVertical: 1,
		passHorizontal: 1,
		allowReview: 1,
		energyValue: 30,

		" ": [1," ","*"]
	},

	//adminium:
	"0": { fixed: 1 },
	"1": { fixed: 1 },
	"2": { fixed: 1 },
	"3": { fixed: 1 },
	"4": { fixed: 1 },
	"5": { fixed: 1 },
	"6": { fixed: 1 },
	"7": { fixed: 1 },
	"8": { fixed: 1 },
	"9": { fixed: 1 },



	//template:
	"": {
		name: "",
		fixed: 1,
		passVertical: 1,
		passHorizontal: 1,
		support: 1, //це дуже важливий параметр - він визначає не лише підтримку згори,
								//а й бічну (lateral) напів-підтримку (прилипання),
								//а також чи сам цей блок може "прилипати" (до інших з параметром support)
		hold: 1,
		allowReview: 1,
		energyValue: 30,

		"tool": ["probabilityOfInteraction","inWorld","inHands"],
		" ": [1,"inWorld","inHands"]
	}
}

/*
var
	passHorizontal= " -H+*PTD",
	passVertical= " |H+*PTD",
	support= "G-H0123456789",
	hold= "H",
	allowReview= " HPT+*"
;
*/




module.exports= things;
