	// data source for either Senate and House.
	// Note that the HTML needs script loading either "pro-congress-113-senate" or "pro-congress-113-house"
	var members = data.results[0].members;
	//We sort members by loyalty in ascending order so that we can pick the beginning of this array to be displayed on the HTML
	var membersLoyaltyAscendent = Array.from(members).sort(function (a, b) {
		return a.votes_with_party_pct - b.votes_with_party_pct;
	});
	var membersLoyaltyDescendent = Array.from(membersLoyaltyAscendent).reverse();


	// Object holding all fields for req'd statistics
	var statistics = {
		'num_dem': 0,
		'num_rep': 0,
		'num_ind': 0,
		'num_tot': 0,
		'per_dem': 0,
		'per_rep': 0,
		'per_ind': 0,
		'per_tot': 0,
	}
	// Generation of three lists (three arrays) within the Senate. One for each party in the Senate.
	var senateRepList = generatePartyList('R');
	var senateDemList = generatePartyList('D');
	var senateIndList = generatePartyList('I');


	// Updating the array "statistics".
	statistics.num_dem = senateDemList.length;
	statistics.num_rep = senateRepList.length;
	statistics.num_ind = senateIndList.length;
	// IF statement shorthand syntax:  condition ? exprTrue : exprFalse 
	((statistics.num_dem + statistics.num_rep + statistics.num_ind) != members.length) ? statistics.num_tot = "discrepancy error": statistics.num_tot = members.length;
	statistics.per_dem = votedWithParty(senateDemList);
	statistics.per_rep = votedWithParty(senateRepList);
	statistics.per_ind = votedWithParty(senateIndList);
	statistics.per_tot = votedWithParty(members);

	//	console.log(statistics);
	//	console.log('El array "members" antes de ordenar es: ' + JSON.stringify(members))

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





	// ************************************** Below To be overwritten ******************************
	// Nth Least loyal members array. Note the arr has to be sorted in ASCENDENT!! order prior to be passed to the function.
	//	function NthLeastLoyal(arr, perc) {
	//		var NthLeastL = [];
	//		index = parseInt((perc * arr.length) / 100);
	//		for (var i = 0; i < arr.length; i++) {
	//			if (i <= index) {
	//				NthLeastL.push(arr[i]);
	//			} else if (arr[i] === arr[i - 1]) {
	//				NthLeastL.push(arr[i]);
	//			} else {
	//				break;
	//			}
	//		}
	//		return NthLeastL;
	//	}
	//
	//	// Nth Most loyal members array. Note the arr has to be sorted in DESCENDENT!! order prior to be passed to the function.
	//	function NthMostLoyal(arr, perc) {
	//		var NthMostL = [];
	//		index = parseInt((perc * arr.length) / 100);
	//		for (var i = 0; i < arr.length; i++) {
	//			if (i <= index) {
	//				NthMostL.push(arr[i]);
	//			} else if (arr[i] === arr[i - 1]) {
	//				NthMostL.push(arr[i]);
	//			} else {
	//				break;
	//			}
	//		}
	//		return NthMostL;
	//	}
	// ************************************** Above To be overwritten ******************************





	// Function to get the desired percentage ("perc") depending on the array passed to the function (e.g. Ascendent or Descendent)  
	function desiredPercentage(arr, perc) {
		var output = [];
		index = parseInt((perc * arr.length) / 100);
		for (var i = 0; i < arr.length; i++) {
			if (i <= index) {
				output.push(arr[i]);
			} else if (arr[i] === arr[i - 1]) {
				output.push(arr[i]);
			} else {
				break;
			}
		}
		return output;
	}

	function printarr(arr) {
		for (var i = 0; i < arr.length; i++) {
			console.log(arr[i].votes_with_party_pct);
		}
	}




	//printarr(membersLoyaltyAscendent);
	//console.log('*******************************************');
	//printarr(membersLoyaltyDescendent);
	//console.log('*******************************************');
	//console.log('*******************************************');
	//console.log('*******************************************');
	printarr(desiredPercentage(membersLoyaltyAscendent, 10));
	console.log('*******************************************');
	printarr(desiredPercentage(membersLoyaltyDescendent, 10));
