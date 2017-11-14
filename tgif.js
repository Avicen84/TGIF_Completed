$(function () {

  var houseUrl = "https://nytimes-ubiqum.herokuapp.com/congress/113/house";
  var senateUrl = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate";
  var url;

  switch (window.location.pathname.includes("house")) {

    case true:

      url = houseUrl;
      $.getJSON(url, function (data) {
        var members = data.results[0].members;
        createTable(members);
        filldropdown(members);
      });

      break;

    case false:
      url = senateUrl;
      $.getJSON(url, function (data) {
        var members = data.results[0].members;
        createTable(members);
        filldropdown(members);
      });


  };

  var dropdown = document.getElementById("dropstate");


  function createTable(members) {

    var members = data.results[0].members;
    var tbl = document.getElementById("myTable");
    tbl.innerHTML = ""; // Clear table 


    for (var i = 0; i < members.length; i++) {

      var member = members[i];

      if (isVisible(member)) {

        var row = document.createElement("tr");


        if (members[i].middle_name == null) {

          var fullname = members[i].first_name + " " + members[i].last_name;
        } else {
          var fullname = members[i].first_name + " " + members[i].middle_name + " " + members[i].last_name;
        }


        row.insertCell().innerHTML = fullname;
        row.insertCell().innerHTML = members[i].party;
        row.insertCell().innerHTML = members[i].state;
        row.insertCell().innerHTML = members[i].seniority;
        row.insertCell().innerHTML = members[i].votes_with_party_pct;

        tbl.append(row);
      }
    }
  }

  document.getElementById("republican").onclick = createTable;
  document.getElementById("democrat").onclick = createTable;
  document.getElementById("independent").onclick = createTable;
  document.getElementById("dropstate").onchange = createTable;

  function isVisible(member) {


    var party = member.party;
    var state = member.state;

    var rep = document.getElementById("republican").checked;
    var dem = document.getElementById("democrat").checked;
    var ind = document.getElementById("independent").checked;


    var partyArray = [];


    if (rep) {
      partyArray.push("R");
    }
    if (dem) {
      partyArray.push("D");
    }
    if (ind) {
      partyArray.push("I");
    }
    if (!rep && !dem && !ind) {
      partyArray.push("R");
      partyArray.push("D");
      partyArray.push("I");
    }

    var valor1 = true;
    var valor2 = true;

    if (partyArray.indexOf(party) != -1) {
      valor1 = true;
    } else {
      valor1 = false;
    }
    if (document.getElementById("dropstate").value == state || document.getElementById("dropstate").value == "all") {
      valor2 = true;
    } else {
      valor2 = false;
    }

    return valor1 && valor2;
  }



  function filldropdown(members) {

    var repeatArray = [];

    for (var i = 0; i < data.results[0].members.length; i++) {
      var state = data.results[0].members[i].state;
      if (repeatArray.indexOf(state) == -1) {
        repeatArray.push(state);
      }
    }

    repeatArray.sort();

    for (var i = 0; i < repeatArray.length; i++) {
      var option = document.createElement("option");
      option.innerHTML = repeatArray[i];
      dropdown.append(option);
    }


  }
});
