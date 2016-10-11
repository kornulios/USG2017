// Schlosser generator

var cupTeam = [{
  name: 'Динамо',
  skill: 4
}, {
  name: 'Шахтер',
  skill: 4
}, {
  name: 'Днепр',
  skill: 3
}, {
  name: 'Заря',
  skill: 3
}, {
  name: 'Ворскла',
  skill: 2
}, {
  name: 'Александрия',
  skill: 2
}, {
  name: 'Карпаты',
  skill: 2
}, {
  name: 'Сталь Д',
  skill: 1
}, {
  name: 'Олимпик Д',
  skill: 1
}, {
  name: 'Металлист',
  skill: 1
}, {
  name: 'Черноморец',
  skill: 0
}, {
  name: 'Волынь',
  skill: 0
}, {
  name: 'Говерла',
  skill: 0
}, {
  name: 'Металлург З',
  skill: 0
}];

var league = {
  name: "League 1",
  team: [],
  match: []
};

var matchCount = 182;
var matchDays = 0;
var nextMatch = 0;
var currentDay = 1;

function generateSchedule() {
  //starting function, generate league fixtures
  for (var i = 0; i < cupTeam.length; i++) {
    league.team[i] = cupTeam[i];
    league.team[i].wins = 0;
    league.team[i].draws = 0;
    league.team[i].losses = 0;
    league.team[i].GI = 0;
    league.team[i].GO = 0;
    league.team[i].points = function() {
      return (this.wins * 3) + this.draws;
    }
    league.team[i].GD = function() {
      return this.GI - this.GO;
    }
    league.team[i].gamesPlayed = function() {
      return this.wins + this.draws + this.losses;
    }
  }

  var a = 0;
  var matchNum = 0;
  var matchDay = 0;
  var fix2 = [];
  while (a < cupTeam.length) {
    fix2[a] = a;
    a++;
  }

  shuffleArray(fix2);
  console.log(fix2);

  for (var j = 0; j < cupTeam.length; j++) {
    matchDay++;
    for (var i = 0; i < cupTeam.length; i++) {
      if (i !== fix2[i]) {
        league.match.push(new Object());
        league.match[matchNum].t1 = i;
        league.match[matchNum].t2 = fix2[i];
        league.match[matchNum].day = matchDay;
        league.match[matchNum].result = [null, null];
        matchNum++;
      }
    }
    //shift fix2 by 1 up
    nextInArray(fix2);
  }

  matchDays = matchDay;
  matchCount = league.match.length;
  //console.log("Schedule generated. Match count: " + league.match.length);
  showTable();
}

function showTable() {
  var divMain = document.getElementById('main');
  var elemUL = document.createElement('ol');
  var tempTeam = [];
  //clean up main DIV
  divMain.innerHTML = "";

  //pass values to tempteam
  for (var g = 0; g < league.team.length; g++) {
    tempTeam[g] = {
      name: league.team[g].name,
      games: league.team[g].gamesPlayed(),
      wins: league.team[g].wins,
      losses: league.team[g].losses,
      draws: league.team[g].draws,
      GI: league.team[g].GI,
      GO: league.team[g].GO,
      points: league.team[g].points()
    };
  }

  //sort tempTeam array
  tempTeam.sort(function(a, b) {
    if (a.points > b.points) {
      return -1;
    }
    if (a.points < b.points) {
      return 1;
    }
    if (a.GI - a.GO > b.GI - b.GO) {
      return -1;
    }
    if (a.GI - a.GO < b.GI - b.GO) {
      return 1;
    }
  });

  //display elements
  for (var i = 0; i < cupTeam.length; i++) {
    var elemLI = document.createElement('li');
    var strPoints = tempTeam[i].games + " " + tempTeam[i].wins + " " + tempTeam[i].draws + " " + tempTeam[i].losses + " " + tempTeam[i].GI + "-" + tempTeam[i].GO + " " + tempTeam[i].points;
    elemLI.innerHTML = tempTeam[i].name + "<span class='points'>" + strPoints + "</span>";
    elemUL.appendChild(elemLI);
  }

  divMain.appendChild(elemUL);

}

function showSchedule() {
  var divMain = document.getElementById('main');
  clearMainDiv();

  for (var i = 1; i <= matchDays; i++) {
    var elemDay = document.createElement('h3');
    var elemMatches = document.createElement('ul');
    elemDay.innerHTML = "Day " + i;
    divMain.appendChild(elemDay);
    var j = 0;
    while (j < matchCount) {
      if (league.match[j].day == i) {
        var elemMatch = document.createElement('li');
        var res;
        var teamStr = league.team[league.match[j].t1].name + " : " + league.team[league.match[j].t2].name;

        if (league.match[j].result[0] !== null && league.match[j].result[1] !== null) {
          res = league.match[j].result[0] + ":" + league.match[j].result[1];
          teamStr = teamStr + "<span class='results'>" + res + "</span>";
        }
        elemMatch.innerHTML = teamStr;
        elemMatches.appendChild(elemMatch);
      }
      j++;
    }
    divMain.appendChild(elemMatches);
  }
}

function showFixture() {
  var mainDiv = clearMainDiv();
  var strTable = "<table class='fixture'>";
  var endTable = "</table>";
  var innTable = "";
  
  for (var i=0; i<league.team.length; i++) {
    innTable += "<tr><td class='left_col1'>"+league.team[i].name+"</td>";
    for (var j=0; j<league.team.length; j++) {
      if(i===j) {
        innTable += "<td class='cell gray'><p>"+j+"</p></td>";
      } else {
        innTable += "<td class='cell'><p class='upper' id='cell_in_" + i + "_" + j + "'></p>";
        innTable += "<p class='bottom' id='cell_out_" + i + "_" + j + "'></p></td>";
      }
    }

    innTable += "<td class='cell'><p>"+league.team[i].gamesPlayed()+"</p></td>";
    innTable += "<td class='cell'><p>"+league.team[i].wins+"</p></td>";
    innTable += "<td class='cell'><p>"+league.team[i].draws+"</p></td>";
    innTable += "<td class='cell'><p>"+league.team[i].losses+"</p></td>";
    innTable += "<td class='cell'><p>"+league.team[i].GD()+"</p></td>";
    innTable += "<td class='cell'><p>"+league.team[i].points()+"</p></td>";

    innTable += "</tr>";
  }
      
  mainDiv.innerHTML = strTable + innTable + endTable;
  
  //results display
  for (var i=0; i<matchCount; i++) {
    var cell_in = document.getElementById('cell_in_' + league.match[i].t1 + "_" + league.match[i].t2);
    var cell_out = document.getElementById('cell_out_' + league.match[i].t2 + "_" + league.match[i].t1);
    
    var span_in;
    var span_out;
    
    if (league.match[i].result[0] !== null && league.match[i].result[1] !== null) {
      span_in = league.match[i].result[0] + ":" + league.match[i].result[1];
      span_out = league.match[i].result[1] + ":" + league.match[i].result[0];
      console.log(cell_in.innerHTML);
    } else {
      span_in = "-";
      span_out = "-";
    }
    
    cell_in.innerHTML = span_in;
    cell_out.innerHTML = span_out;
  }
  
}

function playAll() {
  while (nextMatch < matchCount) {
    playNext();
  }
}

//main game engi
function playNext() {
  var baseChance = 36;
  var baseGoal = 9;
  var overtime = 0;

  var index1 = league.match[nextMatch].t1;
  var index2 = league.match[nextMatch].t2;
  var player1 = {
    name: league.team[index1].name,
    goals: 0,
    skill: league.team[index1].skill
  };
  var player2 = {
    name: league.team[index2].name,
    goals: 0,
    skill: league.team[index2].skill
  };

  if (player1.skill > player2.skill) {
    overtime = player1.skill
  } else {
    overtime = player2.skill
  }

  for (var i = 0; i < (5 + overtime); i++) {
    //turn player 1
    if (i < (player1.skill + 5)) {
      var rnd = Math.random();
      if (rnd < (baseGoal / baseChance)) {
        player1.goals++;
        baseGoal--;
      }
      baseChance--;
    }
    //turn player 2
    if (i < (player2.skill + 5)) {
      var rnd = Math.random();
      if (rnd < (baseGoal / baseChance)) {
        player2.goals++;
        baseGoal--;
      }
      baseChance--;
    }
  }
  //end of match
  if (player1.goals > player2.goals) {
    league.team[index1].wins++;
    league.team[index2].losses++;
  } else if (player1.goals < player2.goals) {
    league.team[index2].wins++;
    league.team[index1].losses++;
  } else {
    league.team[index1].draws++;
    league.team[index2].draws++;
  }
  league.team[index1].GI += player1.goals;
  league.team[index1].GO += player2.goals;
  league.team[index2].GI += player2.goals;
  league.team[index2].GO += player1.goals;

  league.match[nextMatch].result = [player1.goals, player2.goals];

  //console.log("["+player1.skill+"]"+player1.name  + " vs " + "["+player2.skill+"]"+player2.name);
  //console.log(player1.goals + ":" + player2.goals + " overtime:" + overtime);
  showNext(player1.goals, player2.goals);
  nextMatch++;
  currentDay = league.match[nextMatch];

  diplayCurrentView();
}

function showNext(g1, g2) { //populates the last/next match section
  var strHTML = "";
  var divNext = document.getElementById('next');
  if (league.match[nextMatch] !== undefined && league.match[nextMatch] !== undefined) {
    strHTML = "<p>Last match: ";
    strHTML += league.team[league.match[nextMatch].t1].name + " : " + league.team[league.match[nextMatch].t2].name;
    strHTML += "<span class=results>" + g1 + ":" + g2 + "</span></p>";
  }

  if (league.match[nextMatch + 1] !== undefined && league.match[nextMatch + 1] !== undefined) {
    strHTML += "<p>Next match: ";
    strHTML += league.team[league.match[nextMatch + 1].t1].name + " : " + league.team[league.match[nextMatch + 1].t2].name;
    strHTML += "</p>";
  }

  divNext.innerHTML = strHTML;
}

//private functions (not called from ui)
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function nextInArray(array) {
  var temp = array.splice(0, 1);
  array.push(temp[0]);
  return array;
}

function clearMainDiv() {
  var mainDiv = document.getElementById('main');
  mainDiv.innerHTML = "";
  return mainDiv;
}

var curView;

function diplayCurrentView(newView) {
  if (newView !== undefined) {
    curView = newView;
  }
  console.log(curView);
  switch(curView) {
    case "table":
      showTable();
      break;
    case "schedule":
      showSchedule();
      break;
    case "fixture":
      showFixture();
      break;
    default:
      console.log("Trying to display unknown view");
  }
}
// ///////////////////////////////////////