$(function () {

  var houseUrl = "https://nytimes-ubiqum.herokuapp.com/congress/113/house";
  var senateUrl = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate";
  var url;

  switch (window.location.pathname.includes("house")) {

    case true:

      url = houseUrl;
      $.getJSON(url, function (data) {
        var members = data.results[0].members;
        calcRep(members);
        fillVotesTbl("up", members);
        fillVotesTbl("down", members);
      });

      break;

    case false:
      url = senateUrl;
      $.getJSON(url, function (data) {
        var members = data.results[0].members;
        calcRep(members);
        fillVotesTbl("up", members);
        fillVotesTbl("down", members);
      });


  };

  var repArray = [];
  var demArray = [];
  var indArray = [];
  var votesRep = [];
  var votesDem = [];
  var votesInd = [];
  var sumRep = 0;
  var sumDem = 0;
  var sumInd = 0;

  var statistics = {
    nRep: 0,
    nDem: 0,
    nInd: 0
  };

  function calcRep(members) {
    for (var i = 0; i < members.length; i++) {

      var member = members[i];

      if (members[i].party == "R") {
        repArray.push(member);
        votesRep.push(member.votes_with_party_pct);
        sumRep += parseFloat(votesRep);
      }
      if (members[i].party == "D") {
        demArray.push(member);
        votesDem.push(member.votes_with_party_pct);
        sumDem += parseFloat(votesDem);
      }
      if (members[i].party == "I") {
        indArray.push(member);
        votesInd.push(member.votes_with_party_pct);
        sumInd += parseFloat(votesInd);
      }
    }

    statistics.nRep = repArray.length;
    statistics.nDem = demArray.length;
    statistics.nInd = indArray.length;

    document.getElementById("demNum").innerHTML = statistics.nDem;
    document.getElementById("repNum").innerHTML = statistics.nRep;
    document.getElementById("indNum").innerHTML = statistics.nInd;
    document.getElementById("totalReprs").innerHTML = statistics.nDem + statistics.nRep + statistics.nInd;


    var totalrepvotes = sumRep / votesRep.length;
    var totaldemvotes = sumDem / votesDem.length;
    var totalindvotes = sumInd / votesInd.length;


    document.getElementById("demVotes").innerHTML = totaldemvotes.toFixed(2);
    document.getElementById("repVotes").innerHTML = totalrepvotes.toFixed(2);
    document.getElementById("indVotes").innerHTML = totalindvotes.toFixed(2);

    document.getElementById("totalVotes").innerHTML = ((sumDem + sumInd + sumRep) / (demArray.length + indArray.length + repArray.length)).toFixed(2)
  }

  function fillVotesTbl(order, members) {

    if (order == "up") {

      members.sort(function (a, b) {
        return parseFloat(b.missed_votes_pct) - parseFloat(a.missed_votes_pct);
      });
      var tbl = document.getElementById("table2");

    } else {
      members.sort(function (a, b) {
        return parseFloat(a.missed_votes_pct) - parseFloat(b.missed_votes_pct);
      });
      var tbl = document.getElementById("table1");

    }

    for (var i = 0; i < members.length * 0.1; i++) {

      if (members[i].middle_name == null) {

        var fullname = members[i].first_name + " " + members[i].last_name;
      } else {
        var fullname = members[i].first_name + " " + members[i].middle_name + " " + members[i].last_name;
      }

      var row = document.createElement("tr");

      row.insertCell().innerHTML = fullname;
      row.insertCell().innerHTML = members[i].missed_votes;
      row.insertCell().innerHTML = members[i].missed_votes_pct;

      tbl.append(row);

    }

    var lastIndex = i - 1;

    while (members[lastIndex].votes_with_party_pct == members[lastIndex + 1].votes_with_party_pct) {

      if (members[lastIndex + 1].middle_name == null) {

        var fullname = members[lastIndex + 1].first_name + " " + members[lastIndex + 1].last_name;
      } else {
        var fullname = members[lastIndex + 1].first_name + " " + members[lastIndex + 1].middle_name + " " + members[lastIndex + 1].last_name;
      }

      var numPartyVotes = members[lastIndex + 1].total_votes - members[lastIndex + 1].missed_votes;

      var row = document.createElement("tr");

      row.insertCell().innerHTML = fullname;
      row.insertCell().innerHTML = numPartyVotes;
      row.insertCell().innerHTML = (members[lastIndex + 1].votes_with_party_pct - members[lastIndex + 1].missed_votes_pct).toFixed(2);


      tbl.append(row);

      lastIndex = lastIndex + 1;
    }

  }

})
