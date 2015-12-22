




var things= {
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

	},
	//tools:
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
		" ": [0.3," ","g"]
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
		passVertical: 1,

		"P": [0.3,"+","P"],
		"T": [0.1," ","T"], //x
		" ": [1,"-"," "]
	},
	"-": {
		name: "horizontal door",
		passHorizontal: 1,
		support: 1,

		"P": [0.3,"+","P"],
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
		passVertical: 1,
		passHorizontal: 1,
		support: 1,
		hold: 1,
		allowReview: 1,

		"P": [1,"h","P"],
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



	//template:
	"": {
		name: "",
		passVertical: 1,
		passHorizontal: 1,
		support: 1,
		hold: 1,
		allowReview: 1,
		energyValue: 30,

		"tool": ["probablityOfInteraction","inWorld","inHands"],
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
