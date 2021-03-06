//=================="INITIALIZATION"==================


if (window.location.pathname.search("senate_data") > 0) {
	var url = "https://api.propublica.org/congress/v1/113/senate/members.json";
} else if (window.location.pathname.search("house_data") > 0) {
	var url = "https://api.propublica.org/congress/v1/113/house/members.json";
}

fetch(url, {
	headers: {
		"X-API-Key": "GVSt316Hr1vco2tWp8JOQlQ2PT79fFL1p1pEW2PZ"
	}
}).then(function (response) {
	if (response.ok) {
		return response.json();
	}
	throw new Error(response.statusText);
}).then(function (value) {
	var members = value.results[0].members;
	generateStates(members);
	createTable(members);
	eventListenerFetch(members);
	document.getElementById("loader").classList.add("loaderVisible");
//	document.getElementById("contentNoVisible").classList.add("contentVisible");

}).catch(function (err) {
	alert(err)
});


var visibilityDivRojo = document.getElementById('noMatch');
visibilityDivRojo.style.display = 'none';


//jQuery('a.gallery').colorbox();
//$(a.gallery).colorbox();

//=================="EVENTLISTENERS IN PLACE TO TRACK ANY FILTER CHANGES"==================

//====Three eventListener for each checkbox that will trigger "partyFilters()"====
function eventListenerFetch(mem) {
	document.getElementById("republican").addEventListener("click", function () {
		createTable(compare(merge(partyFilters(), stateFilters(mem)), mem));
		visibilityDivRojo.style.display = 'none';
		if (compare(merge(partyFilters(), stateFilters(mem)), mem).length === 0) {
			visibilityDivRojo.style.display = 'block';
		}
		console.log('Ordered array: ' + merge(stateFilters(mem), partyFilters()).sort());
	});
	document.getElementById("democrat").addEventListener("click", function () {
		createTable(compare(merge(partyFilters(), stateFilters(mem)), mem));
		visibilityDivRojo.style.display = 'none';
		if (compare(merge(partyFilters(), stateFilters(mem)), mem).length === 0) {
			visibilityDivRojo.style.display = 'block';
		}
		console.log('Ordered array: ' + merge(stateFilters(mem), partyFilters()).sort());
	});
	document.getElementById("independent").addEventListener("click", function () {
		createTable(compare(merge(partyFilters(), stateFilters(mem)), mem));
		visibilityDivRojo.style.display = 'none';
		if (compare(merge(partyFilters(), stateFilters(mem)), mem).length === 0) {
			visibilityDivRojo.style.display = 'block';
		}
		console.log('Ordered array: ' + merge(stateFilters(mem), partyFilters()).sort());
	});

	//====One eventListener for the DropDown Menu that will trigger "stateFilters(mem)"====
	document.getElementById("selectDropDown").addEventListener("change", function () {
		createTable(compare(merge(partyFilters(), stateFilters(mem)), mem));
		visibilityDivRojo.style.display = 'none';
		if (compare(merge(partyFilters(), stateFilters(mem)), mem).length === 0) {
			visibilityDivRojo.style.display = 'block';
		}
		console.log('Ordered array: ' + merge(stateFilters(mem), partyFilters()).sort());
	});
}



//=================="PRINT DATA INTO THE TABLE - NACHO METHOD"==================

function createTable(arrTable) {
	var tbody = document.getElementById("extract-data");
	tbody.innerHTML = "";
	for (var i = 0; i < arrTable.length; i++) {
		//Creating HTML elements I need...
		var link = document.createElement("a");
		var row = document.createElement("tr");
		var tdName = document.createElement("td");
		var tdParty = document.createElement("td");
		var tdState = document.createElement("td");
		var tdSeniority = document.createElement("td");
		var tdPercentage = document.createElement("td");

		//Filling up each HTML element with the correspondent value extracted from the JSON data

		link.innerHTML = arrTable[i].first_name + " " + (arrTable[i].middle_name || "") + " " + arrTable[i].last_name;
		link.setAttribute("href", arrTable[i].url);
		tdParty.innerHTML = arrTable[i].party;
		tdState.innerHTML = arrTable[i].state;
		tdSeniority.innerHTML = arrTable[i].seniority;
		tdPercentage.innerHTML = arrTable[i].votes_with_party_pct + " %";

		//appending each element to the HTML page

		tdName.append(link);
		tdName.setAttribute("class", "danger");
		row.append(tdName, tdParty, tdState, tdSeniority, tdPercentage);
		tbody.append(row);

	}
}


//=================="GENERATE ITEMS FOR THE STATE DROPDOWN FILTER"==================

function generateStates(arrStates) {
	var select = document.getElementById("selectDropDown");
	var allStates = [];
	for (var i = 0; i < arrStates.length; i++) {
		var opt = document.createElement("option");
		if (allStates.indexOf(arrStates[i].state) < 0) {
			allStates.push(arrStates[i].state);
			opt.innerHTML = arrStates[i].state;
			opt.setAttribute("value", arrStates[i].state);
			select.append(opt);
		}
	}
	return allStates;
	//	console.log(allStates);
}


//=================="CHECKBOXES FILTERS (PARTY)"==================

function partyFilters() {
	//	console.log(this.value);
	var filteredParty = [];
	if (document.querySelectorAll('input[value=R]:checked').length == 1) {
		filteredParty.push('R');
	}
	if (document.querySelectorAll('input[value=D]:checked').length == 1) {
		filteredParty.push('D');
	}
	if (document.querySelectorAll('input[value=I]:checked').length == 1) {
		filteredParty.push('I');
	}
	//	console.log('El output de la funcion partyFilters() es: ' + filteredParty);
	return filteredParty;
}


//=================="DROPDOWN MENU FILTERS (STATE)"==================


function stateFilters(mem) {
	var filteredState = [];

	if (document.querySelectorAll('#selectDropDown option:checked').length == 0 || (document.querySelectorAll('#selectDropDown option:checked')[0].value === 'all')) {
		filteredState = generateStates(mem);
	} else {
		filteredState = Array.from(document.querySelectorAll('#selectDropDown option:checked')).map(opt => opt.value);
	}
	//	console.log('El output de la funcion stateFilters() es: ' + filteredState);
	return filteredState;
}


//=================="MERGING [filteredParty] and [filteredState] INTO [arr_comp] AND COMPARING THIS ARRAY TO [mem] TO GENERATE A NEW ARRAY [memebersFiltered] WHICH CONTAIS THE POSITIONS THAT MATCH THE BOTH FILTERS "==================

function merge(arr1, arr2) {
	var arr_comp = arr2.concat(arr1);
	return arr_comp;
}


function compare(arrMerged, mem) {


	var membersFiltered = [];
	//	var redDiv = document.getElementById('noMatch');
	//	redDiv.style.display = 'none';
	for (var i = 0; i < mem.length; i++) {
		if ((arrMerged.includes(mem[i].party)) && (arrMerged.includes(mem[i].state))) {
			membersFiltered.push(mem[i]);
		}
	}
	//	console.log('El banner ROJO esta en modo: ' + redDiv.style.display);
	//	console.log('El array "membersFiltered" is: ' + membersFiltered);
	return membersFiltered;
}
