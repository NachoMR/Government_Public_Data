// ====================== GLOBAL VARIABLES ======================

if (window.location.pathname.search("senate") > 0) {
	var url = "https://api.propublica.org/congress/v1/113/senate/members.json";
} else if (window.location.pathname.search("house") > 0) {
	var url = "https://api.propublica.org/congress/v1/113/house/members.json"
}

var myVue = new Vue({
	el: "#app",
	data: {
		loaderVisible: true,
		contentVisible: false,
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
			],
		leastLoyal: [],
		mostLoyal: [],
		leastEngaged: [],
		mostEngaged: []
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

					var members = value.results[0].members;

					myVue.glance = [
						{
							"identifier": "Democrats",
							"NoReps": generatePartyList(members, "D").length,
							"PercVotedWithParty": parseFloat(votedWithParty(generatePartyList(members, "D"))).toFixed(2)
		},
						{
							"identifier": "Republicans",
							"NoReps": generatePartyList(members, "R").length,
							"PercVotedWithParty": parseFloat(votedWithParty(generatePartyList(members, "R"))).toFixed(2)
		},
						{
							"identifier": "Independents",
							"NoReps": generatePartyList(members, "I").length,
							"PercVotedWithParty": parseFloat(votedWithParty(generatePartyList(members, "I"))).toFixed(2)
		},
						{
							"identifier": "Total",
							"NoReps": members.length,
							"PercVotedWithParty": parseFloat(votedWithParty(members)).toFixed(2)
		}
	];
					myVue.leastLoyal = desiredPercentage(Array.from(members).sort(function (a, b) {
						return a.votes_with_party_pct - b.votes_with_party_pct;
					}), 'votes_with_party_pct', 10);
					myVue.mostLoyal = desiredPercentage(Array.from(Array.from(members).sort(function (a, b) {
						return a.votes_with_party_pct - b.votes_with_party_pct;
					})).reverse(), 'votes_with_party_pct', 10);
					myVue.leastEngaged = desiredPercentage(Array.from(Array.from(members).sort(function (a, b) {
						return a.missed_votes_pct - b.missed_votes_pct;
					})).reverse(), 'missed_votes_pct', 10);
					myVue.mostEngaged = desiredPercentage(Array.from(members).sort(function (a, b) {
						return a.missed_votes_pct - b.missed_votes_pct;
					}), 'missed_votes_pct', 10);
					myVue.loaderVisible = false;
					myVue.contentVisible = true;
				})
				.catch(function (err) {
					alert(err);
				});
		}
	}
});

myVue.getData();


//  ********** FETCH ********** Sourcing data...

// ********* FETCH END *********



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
