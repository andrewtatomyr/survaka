var things= {
	//space (put into all the things what can be layed out):
	" ": {
		name: "space",
		space: 1,

		"+": [1,"|"," "],
		"g": [1,"G"," "],
		"r": [1,"R"," "],

		"h": [1,"H"," "],
		"*": [1,"*"," "],
		"w": [1,"W"," "],
		"@": [1,"@"," "],


		"*Δ": [1,"*","Δ"],
		"@Δ": [1,"@","Δ"],

		//"&": [0.3,"&"," "],

		"P": [1,"P"," "],
		"T": [1,"T"," "],
		"D": [1,"D"," "],
		"/": [1,"/"," "]


	},
	"~ ??": {
		name: "water",
		space: 1,

		"+": [1,"+"," "],
		"g": [1,"g"," "],
		"h": [1,"h"," "],
		"*": [1,"*"," "],
		"w": [1,"w"," "],
		"@": [1,"@"," "],


		"P": [1,"P"," "],
		"T": [1,"T"," "],
		"D": [1,"D"," "],
		"/": [1,"/"," "]

	},
	"&": {
		name: "fire",
		space: 1,

		"&": [1,"&"," "],
		"+": [1,"&"," "],
		"g": [1,"G"," "],
		"h": [1,"&"," "],
		"*": [1,"&","?"],
		"w": [1,"&","&"],
		"@": [1,"&"," "],

		"P": [1,"&"," "],
		"T": [1,"&"," "],
		"D": [0.3," ","D"],
		"/": [1,"&","&"]

	},
	"?": {
		name: "temporarily not defined things",
		space: 1
	},
	//tools:
	"/": {
		name: "cane?",
		flat: 1,
		breakageProbablity: 0.01,

		" ": [1," ","/"]
	},
	"P": {
		name: "ax",
		flat: 1,
		breakageProbablity: 0.01,

		" ": [1," ","P"]
	},
	"T": {
		name: "pickaxe",
		flat: 1,
		breakageProbablity: 0.01,

		" ": [1," ","T"]
	},
	"D": {
		name: "shovel",
		flat: 1,
		breakageProbablity: 0.01,

		" ": [1," ","D"]
	},
	//objects:
	"G": {
		name: "ground",
		volumetric: 1,
		adhesive: { "G": 0.99 },


		"D": [1,"g","D"],
		"/": [0.5,"g","/"],
		" ": [0.2," ","g"]
	},
	"g": {
		name: "piece of ground",
		flat: 1,

		//adhesive: { },

		" ": [1," ","g"]
	},
	"R": {
		name: "rock",
		volumetric: 1,
		//adhesive: { },


		"T": [0.5,"r","T"],
		"D": [0.1," "," "],
		"/": [0.1,"r"," "]
	},
	"r": {
		name: "piece of rock",
		flat: 1,

		" ": [1," ","r"]
	},
	"H": {
		name: "ladder",
		flat: 1,
		fixed: 1, //?
		hold: 1,

		"P": [1,"h","P"],
		"/": [0.5,"h","/"],

		"T": [0.1," ","T"], //x
		" ": [0.3," ","h"]
	},
	"h": {
		name: "uninstalled ladder",
		flat: 1,

		" ": [1," ","h"]
	},

	//door:
	"|": {
		name: "vertical door",
		verticalDoor: 1,
		fixed: 1, //?

		"P": [0.3,"+","P"],
		"/": [0.1,"+","/"],

		"T": [0.1," ","T"], //x
		" ": [1,"-"," "] //? maybe it`s needed a key? somethigs like a password to open for each player. but how to know who is the owner of this door? :) looks like it`s need to have an some kind of LOCK at least at one side (outer) of door
	},
	//"lock:key" : {  },
	//":key" : {  },
	"-": {
		name: "horizontal door",
		horizontalDoor: 1,
		fixed: 1, //?

		"P": [0.3,"+","P"],
		"/": [0.1,"+","/"],

		"T": [0.1," ","T"], //x
		" ": [1,"|"," "]
	},
	"+": {
		name: "uninstalled door",
		flat: 1,

		" ": [1," ","+"]
	},

	//botany:
	"@": {
		name: "banyan leaves (a plenty of leaf)",
		flat: 1,
		adhesive: { "@": 0.9999, "Y": 0.9999 },
		energyValue: 20,

		live: { "gener": "Y??????", "generic": "*" }, //?????????

		//"P": [1," ","P"],
		//"/": [0.5," ","/"],
		"Δ": [1," ","@Δ"],
		" ": [1," ","@"]
	},
	"@Δ": {
		name: "banyan leaves (a plenty of leaf) in animal teeth",
		//flat: 1,
		//adhesive: { "@": 0.9999, "Y": 0.9999 },
		energyValue: 20,

		//live: { "gener": "Y??????", "generic": "*" }, //?????????

		//"P": [1," ","P"],
		//"/": [0.5," ","/"],
		//" ": [1,"@","teeth"]
	},
	"*": {
		name: "banyan",
		flat: 1, //spase: 1, //?
		adhesive: { "@": 0.9995 },
		energyValue: 10,

		"Δ": [1," ","*Δ"],
		" ": [1," ","*"]
	},
	"*Δ": {
		name: "banyan in animal teeth",
		//flat: 1, //spase: 1, //?
		//adhesive: { "@": 0.9995 },
		energyValue: 30,

		//"teeth": [1," ","*inTeeth"],
		//" ": [1,"*","teeth"]
	},
	"Y": {
		name: "banyan three",
		flat: 1,
		energyValue: { animal: 15 },

		live: { "geners": "W", "generic": "b" }, //?????????

		"&": [0.3,"&"," "], //"&": [0.3,"Y&"," "],

		"P": [1,"w","P"],
		"/": [0.5,"w","/"],
		" ": [0.2," ","w"]
	},
	"W": {
		name: "wood plank",
		volumetric: 1,
		fixed: 1,

		//"&": [0.3,"&"," "],

		"P": [1,"w","P"],
		"/": [0.5,"w","/"],
		"&": [1,"&"," "],
		" ": [0.2," ","w"]
	},
	"w": {
		name: "uninstalled wood plank",
		flat: 1,

		"&": [1,"&"," "],
		" ": [1," ","w"]
	},



	//adminium:
	"0": { name: "adminium", fixed: 1, volumetric: 1, },
	"1": { name: "adminium", fixed: 1, volumetric: 1, },
	"2": { name: "adminium", fixed: 1, volumetric: 1, },
	"3": { name: "adminium", fixed: 1, volumetric: 1, },
	"4": { name: "adminium", fixed: 1, volumetric: 1, },
	"5": { name: "adminium", fixed: 1, volumetric: 1, },
	"6": { name: "adminium", fixed: 1, volumetric: 1, },
	"7": { name: "adminium", fixed: 1, volumetric: 1, },
	"8": { name: "adminium", fixed: 1, volumetric: 1, },
	"9": { name: "adminium", fixed: 1, volumetric: 1, },



	//template:
	"": {
		name: "",

		space: 1, //xor; do not support sobjects nor objects - allow rewiew -
		flat: 1, //xor; support if space or door above - allow rewiew -
		volumetric: 1, //xor; always support - disallow review -
		verticalDoor: 1, //xor; pass vertical -
		horizontalDoor: 1, //xor; pass horizontal -

		hold: 1, //утримує (ladder)
		fixed: 1, //object does not fall but attached in any place //предмет не падає, а навпаки - кріпиться до будь-чого

		breakageProbablity: 0.01, //~for tools


		adhesive: { "": 0.9 },	//lateral adhesivity to specified object with specified probability //бічнa (lateral) напів-підтримкa (прилипання) - вказати, до чого цей блок може "прилипати" (можливо, вказати ймовірність прилипання)

		energyValue: { human: 10, animal: 10 }, //харчова цінність - вказати для кого

		"tool": ["probabilityOfInteraction","inWorld","inHands"], //what the specified tool do with the object and with himself
		" ": [1,"inWorld","inHands"]
	}
}





module.exports= things;
