	console.log(window.location.pathname);


	// ====================== GLOBAL VARIABLES ======================

	// data source for either Senate and House.
	// Note that the HTML needs script loading either "pro-congress-113-senate" or "pro-congress-113-house"
	var members = data.results[0].members;
	//  sorting members by Loyalty in ASCENDING order
	var membersLoyaltyAscendent = Array.from(members).sort(function (a, b) {
		return a.votes_with_party_pct - b.votes_with_party_pct;
	});
	//  sorting members by Loyalty in DESCENDING order
	var membersLoyaltyDescendent = Array.from(membersLoyaltyAscendent).reverse();
	//  sorting members by Attendance in ASCENDING order
	var membersAttendanceAscendent = Array.from(members).sort(function (a, b) {
		return a.missed_votes_pct - b.missed_votes_pct;
	})
	//  sorting members by Attendance in DESCENDING order
	var membersAttendanceDescendent = Array.from(membersAttendanceAscendent).reverse();

	// Generation of three lists (three arrays) within the Senate. One for each party in the Senate.

	var RepList = generatePartyList('R');
	var DemList = generatePartyList('D');
	var IndList = generatePartyList('I');

	var statistics = {
		'glance': [
			{
				"identifier": "Democrats",
				"NoReps": DemList.length,
				"PercVotedWithParty": parseFloat(votedWithParty(DemList)).toFixed(2)
			},
			{
				"identifier": "Republicans",
				"NoReps": RepList.length,
				"PercVotedWithParty": parseFloat(votedWithParty(RepList)).toFixed(2)
			},
			{
				"identifier": "Independents",
				"NoReps": IndList.length,
				"PercVotedWithParty": parseFloat(votedWithParty(IndList)).toFixed(2)
			},
			{
				"identifier": "Total",
				"NoReps": members.length,
				"PercVotedWithParty": parseFloat(votedWithParty(members)).toFixed(2)
			}
		],
		'leastLoyal': desiredPercentage(membersLoyaltyAscendent, 'votes_with_party_pct', 10),
		'mostLoyal': desiredPercentage(membersLoyaltyDescendent, 'votes_with_party_pct', 10),
		'leastEngaged': desiredPercentage(membersAttendanceDescendent, 'missed_votes_pct', 10),
		'mostEngaged': desiredPercentage(membersAttendanceAscendent, 'missed_votes_pct', 10)
	}


	// ====================== CALLS TO GLOBAL VARIABLES ======================

	// calls to the actual elements in the various HTML pages
	if (window.location.pathname.search("senate_attendance") > 0) {
		createGlance(statistics.glance, "glance");
	}
	//Llamar si estamos en senate_attendance.html

	createTable(statistics.leastEngaged, "leastEngaged");
	createTable(statistics.mostEngaged, "mostEngaged");
	//Llamar si estamos en senate_loyalty.html

	createTable(statistics.leastLoyal, "leastLoyal");
	createTable(statistics.mostLoyal, "mostLoyal");


	// ====================== FUNCTIONS ======================

	function generatePartyList(par) {
		var arr = [];
		for (var i = 0; i < members.length; i++) {
			if (members[i].party === par) {
				arr.push(members[i]);
			}
		}
		return arr;
	}

	function votedWithParty(arr) {
		var add = 0;
		for (var i = 0; i < arr.length; i++) {
			add += arr[i].votes_with_party_pct;
		}
		var perc = add / arr.length;
		return perc;
	}

	// Function to extract the desired percentage of data.
	//arr: array in either Ascendent or Descendent order (depending on what you want to extract)
	//key: the object key you want to extract data from (depending on what you want to extract)
	//perc: the percentage of data you want to extract, e.g. 10(10%), 15(15%)
	function desiredPercentage(arr, key, perc) {
		var output = [];
		index = parseInt((perc * arr.length) / 100);
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

	function printArr(arr, key) {
		for (var i = 0; i < arr.length; i++) {
			console.log(arr[i][key]);
		}
	}

	function createTable(arr, idElement) {
		var tbody = document.getElementById(idElement);
		tbody.innerHTML = "";
		for (var i = 0; i < arr.length; i++) {
			//Creating HTML elements I need...
			var link = document.createElement("a");
			var row = document.createElement("tr");
			var tdName = document.createElement("td");
			var tdParty = document.createElement("td");
			var tdNoMissedVotes = document.createElement("td");
			var tdPerMissedVotes = document.createElement("td");
			//Filling up each HTML element with the correspondent value
			link.innerHTML = arr[i].first_name + ' ' + (arr[i].middle_name || "") + ' ' + arr[i].last_name;
			link.setAttribute("href", arr[i].url);
			tdParty.innerHTML = arr[i].party;
			tdNoMissedVotes.innerHTML = arr[i].missed_votes;
			tdPerMissedVotes.innerHTML = arr[i].missed_votes_pct;
			//appending each element to the HTML page
			tdName.append(link);
			row.append(tdName, tdParty, tdNoMissedVotes, tdPerMissedVotes);
			tbody.append(row);
		}
	}

	function createGlance(arr, idElement) {
		var tbody = document.getElementById(idElement);
		for (var i = 0; i < statistics.glance.length; i++) {
			//Creating HTML elements I need...
			var row = document.createElement("tr");
			var tdIdentifier = document.createElement("td");
			var tdNoReps = document.createElement("td");
			var tdPercVotedWithParty = document.createElement("td");
			//Filling up each HTML element with the correspondent value
			tdIdentifier.innerHTML = statistics.glance[i].identifier;
			tdNoReps.innerHTML = statistics.glance[i].NoReps;
			tdPercVotedWithParty.innerHTML = statistics.glance[i].PercVotedWithParty;
			//appending each element to the HTML page
			row.append(tdIdentifier, tdNoReps, tdPercVotedWithParty);
			tbody.append(row);
		}
	}




	console.log("The 'statistics' object containing all the data to be displayed is:");
	console.log(statistics);
