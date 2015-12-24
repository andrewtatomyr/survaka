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


		"T": [0.5,"r","D"],
		"D": [0.1," "," "],
		"/": [0.1,"r"," "]
	},
	"g": {
		name: "piece of rock",
		flat: 1,

		" ": [1," ","r"]
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

		"P": [1,"+","P"],
		"/": [0.5,"+","/"],

		"T": [0.1," ","T"], //x
		" ": [1,"-"," "]
	},
	"-": {
		name: "horizontal door",
		horizontalDoor: 1,
		fixed: 1, //?

		"P": [1,"+","P"],
		"/": [0.5,"+","/"],

		"T": [0.1," ","T"], //x
		" ": [1,"|"," "]
	},
	"+": {
		name: "uninstalled door",
		flat: 1,

		" ": [1," ","+"]
	},
	//live:
	"@": {
		name: "banyan leaves (a plenty of leaf)",
		flat: 1,
		adhesive: { "@": 0.9999, "Y": 0.9999 },
		energyValue: { animal: 20 },

		live: { "gener": "Y??????", "generic": "*" }, //?????????

		//"P": [1," ","P"],
		//"/": [0.5," ","/"],
		" ": [1," ","@"]
	},
	"*": {
		name: "banyan",
		flat: 1,
		adhesive: { "@": 0.9995 },
		energyValue: { human: 15, animal: 30 },

		" ": [1," ","*"]
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
