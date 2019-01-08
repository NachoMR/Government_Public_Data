//=================="INITIALIZATION"==================

if (window.location.pathname.search("senate") > 0) {
	var url = "https://api.propublica.org/congress/v1/113/senate/members.json";
} else if (window.location.pathname.search("house") > 0) {
	var url = "https://api.propublica.org/congress/v1/113/house/members.json";
}

//========= VUE VAR DECLARATION - START //=========
var myVue = new Vue({
	el: "#app",
	data: {
		loaderVisible: true,
		contentVisible: false,
		warningVisible: false,
		members: [],
		partyFilter: ["R", "I", "D"],
		statesFilter: ["all"],
		stateList: [],
		glance: [
			{
				"identifier": "Democrats",
				"NoReps": 0,
				"PercVotedWithParty": 0
												},
			{
				"identifier": "Republicans",
				"NoReps": 0,
				"PercVotedWithParty": 0
												},
			{
				"identifier": "Independents",
				"NoReps": 0,
				"PercVotedWithParty": 0
												},
			{
				"identifier": "Total",
				"NoReps": 0,
				"PercVotedWithParty": 0
												}
					]
	},
	methods: {
		getData: function () {
			fetch(url, {
				method: 'GET',
				headers: {
					"X-API-Key": "GVSt316Hr1vco2tWp8JOQlQ2PT79fFL1p1pEW2PZ"
				}
			}).then(function (response) {
				if (response.ok) {
					return response.json();
				}
				throw new Error(response.statusText);
			}).then(function (value) {
				myVue.members = value.results[0].members;
				myVue.loaderVisible = false;
				myVue.contentVisible = true;
			}).catch(function (err) {
				alert(err);
			});
		}
	},
	computed: {
		generateStates: function () {
			for (var i = 0; i < this.members.length; i++) {
				if (this.stateList.indexOf(this.members[i].state) < 0) {
					this.stateList.push(this.members[i].state);
				}
			}
			return this.stateList;
		},
		filteredMembers: function () {
			var arrOutput = [];
			this.warningVisible = false;
			var arrMerged = this.partyFilter.concat(this.statesFilter);
			for (var i = 0; i < this.members.length; i++) {
				((arrMerged.includes(this.members[i].party)) && ((arrMerged.includes(this.members[i].state)) || (arrMerged.includes("all")))) ? arrOutput.push(this.members[i]): null;
			}
			(arrOutput.length == 0) ? this.warningVisible = true: null;
			console.log(arrMerged);
			console.log(arrOutput.length);
			console.log(this.warningVisible);
			return arrOutput;
		},
		leastLoyal: function () {
			return desiredPercentage(arrayAscendingBy(this.members, 'votes_with_party_pct'), 'votes_with_party_pct', 10);
		},
		mostLoyal: function () {
			return desiredPercentage(Array.from(arrayAscendingBy(this.members, 'votes_with_party_pct')).reverse(), 'votes_with_party_pct', 10);
		},
		leastEngaged: function () {
			return desiredPercentage(Array.from(arrayAscendingBy(this.members, 'missed_votes_pct')).reverse(), 'missed_votes_pct', 10);
		},
		mostEngaged: function () {
			return desiredPercentage(arrayAscendingBy(this.members, 'missed_votes_pct'), 'missed_votes_pct', 10);
		},
		glanceTable: function () {
			this.glance = [
				{
					"identifier": "Democrats",
					"NoReps": generatePartyList(this.members, "D").length,
					"PercVotedWithParty": parseFloat(votedWithParty(generatePartyList(this.members, "D"))).toFixed(2)
							},
				{
					"identifier": "Republicans",
					"NoReps": generatePartyList(this.members, "R").length,
					"PercVotedWithParty": parseFloat(votedWithParty(generatePartyList(this.members, "R"))).toFixed(2)
							},
				{
					"identifier": "Independents",
					"NoReps": generatePartyList(this.members, "I").length,
					"PercVotedWithParty": parseFloat(votedWithParty(generatePartyList(this.members, "I"))).toFixed(2)
							},
				{
					"identifier": "Total",
					"NoReps": this.members.length,
					"PercVotedWithParty": parseFloat(votedWithParty(this.members)).toFixed(2)
							}
						];
			return this.glance;
		}
	}
});
//========= VUE VAR DECLARATION - END //=========

if ((window.location.pathname.search("senate") > 0) || (window.location.pathname.search("house") > 0)) {
	myVue.getData();
}
//myVue.getData();

// ====================== FUNCTIONS ======================


function generatePartyList(arr, par) {
	var arr2 = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].party === par) {
			arr2.push(arr[i]);
		}
	}
	return arr2;
}

function votedWithParty(arr) {
	var add = 0;
	if (arr.length > 0) {
		for (var i = 0; i < arr.length; i++) {
			add += arr[i].votes_with_party_pct;
		}
		var perc = add / arr.length;
		return perc;
	} else {
		return 0;
	}
}

function arrayAscendingBy(arr, key) {
	return Array.from(arr).sort(function (a, b) {
		return a[key] - b[key];
	});
}

function desiredPercentage(arr, key, perc) {
	var output = [];
	var index = parseInt((perc * arr.length) / 100);
	for (var i = 0; i < arr.length; i++) {
		if (i <= index) {
			output.push(arr[i]);
		} else if (arr[i][key] === arr[i - 1][key]) {
			output.push(arr[i]);
		} else {
			break;
		}
	}
	return output;
}


function readMoreLess(button_Id) {
	var moreText = document.getElementById(button_Id+"Div").getElementsByClassName("demo");
	var dots = document.getElementById(button_Id+"_dots");
	var btnText = document.getElementById(button_Id);	
	if (dots.style.display === "none") {
		dots.style.display = "inline";
		btnText.innerHTML = "Read More";
		for (i = 0; i < moreText.length; i++) {
			moreText[i].style.display = "none";
		}
	} else {
		dots.style.display = "none";
		btnText.innerHTML = "Read Less";
		for (i = 0; i < moreText.length; i++) {
			if (moreText[i].tagName === "SPAN") {
				moreText[i].style.display = "inline";
			} else if (moreText[i].tagName === "P") {
				moreText[i].style.display = "block";
			}
		}
	}
}


// ********** ONE BUTTON CODE WORKING WELL **********
//function readFunction() {
//	var dots = document.getElementById("dots");
//	var btnText = document.getElementById("myBtn");
//	var moreText = document.getElementsByClassName("demo");
////	console.log(moreText);
//	if (dots.style.display === "none") {
//		dots.style.display = "inline";
//		btnText.innerHTML = "Read More";
//		for (i = 0; i < moreText.length; i++) {
//			moreText[i].style.display = "none";
//		}
//	} else {
//		dots.style.display = "none";
//		btnText.innerHTML = "Read Less";
//		for (i = 0; i < moreText.length; i++) {
//			if (moreText[i].tagName === "SPAN") {
//				moreText[i].style.display = "inline";
//			}
//			else if (moreText[i].tagName === "P") {
//				moreText[i].style.display = "block";
//			}
//		}
//	}
//}
// ********** ONE BUTTON CODE WORKING WELL **********








//function compare(arrMerged, mem) {
//
//
//	var membersFiltered = [];
//	//	var redDiv = document.getElementById('noMatch');
//	//	redDiv.style.display = 'none';
//	for (var i = 0; i < mem.length; i++) {
//		if ((arrMerged.includes(mem[i].party)) && (arrMerged.includes(mem[i].state))) {
//			membersFiltered.push(mem[i]);
//		}
//	}
//	//	console.log('El banner ROJO esta en modo: ' + redDiv.style.display);
//	//	console.log('El array "membersFiltered" is: ' + membersFiltered);
//	return membersFiltered;
//}


//=================="DROPDOWN MENU FILTERS (STATE)"==================



//var visibilityDivRojo = document.getElementById('noMatch');
//visibilityDivRojo.style.display = 'none';




//================== EVENTLISTENERS START ==================

//====Three eventListener for each checkbox that will trigger "partyFilters()"====

//function eventListenerFetch(mem) {
//	document.getElementById("republican").addEventListener("click", function () {
//		createTable(compare(merge(partyFilters(), stateFilters(mem)), mem));
//		visibilityDivRojo.style.display = 'none';
//		if (compare(merge(partyFilters(), stateFilters(mem)), mem).length === 0) {
//			visibilityDivRojo.style.display = 'block';
//		}
//		console.log('Ordered array: ' + merge(stateFilters(mem), partyFilters()).sort());
//	});
//	document.getElementById("democrat").addEventListener("click", function () {
//		createTable(compare(merge(partyFilters(), stateFilters(mem)), mem));
//		visibilityDivRojo.style.display = 'none';
//		if (compare(merge(partyFilters(), stateFilters(mem)), mem).length === 0) {
//			visibilityDivRojo.style.display = 'block';
//		}
//		console.log('Ordered array: ' + merge(stateFilters(mem), partyFilters()).sort());
//	});
//	document.getElementById("independent").addEventListener("click", function () {
//		createTable(compare(merge(partyFilters(), stateFilters(mem)), mem));
//		visibilityDivRojo.style.display = 'none';
//		if (compare(merge(partyFilters(), stateFilters(mem)), mem).length === 0) {
//			visibilityDivRojo.style.display = 'block';
//		}
//		console.log('Ordered array: ' + merge(stateFilters(mem), partyFilters()).sort());
//	});
//
//	//====One eventListener for the DropDown Menu that will trigger "stateFilters(mem)"====
//	document.getElementById("selectDropDown").addEventListener("change", function () {
//		createTable(compare(merge(partyFilters(), stateFilters(mem)), mem));
//		visibilityDivRojo.style.display = 'none';
//		if (compare(merge(partyFilters(), stateFilters(mem)), mem).length === 0) {
//			visibilityDivRojo.style.display = 'block';
//		}
//		console.log('Ordered array: ' + merge(stateFilters(mem), partyFilters()).sort());
//	});
//}
//================== EVENTLISTENERS END ==================



//================== PRINT DATA INTO THE TABLE ==================

//function createTable(arrTable) {
//	var tbody = document.getElementById("extract-data");
//	tbody.innerHTML = "";
//	for (var i = 0; i < arrTable.length; i++) {
//		//Creating HTML elements I need...
//		var link = document.createElement("a");
//		var row = document.createElement("tr");
//		var tdName = document.createElement("td");
//		var tdParty = document.createElement("td");
//		var tdState = document.createElement("td");
//		var tdSeniority = document.createElement("td");
//		var tdPercentage = document.createElement("td");
//
//		//Filling up each HTML element with the correspondent value extracted from the JSON data
//
//		link.innerHTML = arrTable[i].first_name + " " + (arrTable[i].middle_name || "") + " " + arrTable[i].last_name;
//		link.setAttribute("href", arrTable[i].url);
//		tdParty.innerHTML = arrTable[i].party;
//		tdState.innerHTML = arrTable[i].state;
//		tdSeniority.innerHTML = arrTable[i].seniority;
//		tdPercentage.innerHTML = arrTable[i].votes_with_party_pct + " %";
//
//		//appending each element to the HTML page
//
//		tdName.append(link);
//		tdName.setAttribute("class", "danger");
//		row.append(tdName, tdParty, tdState, tdSeniority, tdPercentage);
//		tbody.append(row);
//
//	}
//}


//=================="GENERATE ITEMS FOR THE STATE DROPDOWN FILTER"==================

//function generateStates(arrStates) {
//	var select = document.getElementById("selectDropDown");
//	var allStates = [];
//	for (var i = 0; i < arrStates.length; i++) {
//		var opt = document.createElement("option");
//		if (allStates.indexOf(arrStates[i].state) < 0) {
//			allStates.push(arrStates[i].state);
//			opt.innerHTML = arrStates[i].state;
//			opt.setAttribute("value", arrStates[i].state);
//			select.append(opt);
//		}
//	}
//	console.log(allStates);
//	return allStates;
//	//	console.log(allStates);
//}


//=================="CHECKBOXES FILTERS (PARTY)"==================

//function partyFilters() {
//	//	console.log(this.value);
//	var filteredParty = [];
//	if (document.querySelectorAll('input[value=R]:checked').length == 1) {
//		filteredParty.push('R');
//	}
//	if (document.querySelectorAll('input[value=D]:checked').length == 1) {
//		filteredParty.push('D');
//	}
//	if (document.querySelectorAll('input[value=I]:checked').length == 1) {
//		filteredParty.push('I');
//	}
//	//	console.log('El output de la funcion partyFilters() es: ' + filteredParty);
//	return filteredParty;
//}


//=================="DROPDOWN MENU FILTERS (STATE)"==================


//function stateFilters(mem) {
//	var filteredState = [];
//
//	if (document.querySelectorAll('#selectDropDown option:checked').length == 0 || (document.querySelectorAll('#selectDropDown option:checked')[0].value === 'all')) {
//		filteredState = generateStates(mem);
//	} else {
//		filteredState = Array.from(document.querySelectorAll('#selectDropDown option:checked')).map(opt => opt.value);
//	}
//	//	console.log('El output de la funcion stateFilters() es: ' + filteredState);
//	return filteredState;
//}


//=================="MERGING [filteredParty] and [filteredState] INTO [arr_comp] AND COMPARING THIS ARRAY TO [mem] TO GENERATE A NEW ARRAY [memebersFiltered] WHICH CONTAIS THE POSITIONS THAT MATCH THE BOTH FILTERS "==================

//function merge(arr1, arr2) {
//	var arr_comp = arr2.concat(arr1);
//	return arr_comp;
//}


//function compare(arrMerged, mem) {
//
//
//	var membersFiltered = [];
//	//	var redDiv = document.getElementById('noMatch');
//	//	redDiv.style.display = 'none';
//	for (var i = 0; i < mem.length; i++) {
//		if ((arrMerged.includes(mem[i].party)) && (arrMerged.includes(mem[i].state))) {
//			membersFiltered.push(mem[i]);
//		}
//	}
//	//	console.log('El banner ROJO esta en modo: ' + redDiv.style.display);
//	//	console.log('El array "membersFiltered" is: ' + membersFiltered);
//	return membersFiltered;
//}
