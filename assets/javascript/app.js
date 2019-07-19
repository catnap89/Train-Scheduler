/*
Psuedo Coding
===============
# Form ID
  * train-name-input
  * destination-input
  * time-input
  * frequency-input
  * submit

# Table ID
  * train-table
  * `
    <tr>
      <td>${employee.employee}</td>
      <td>${employee.role}</td>
      <td>${employee.startdate}</td>
      <td>${month}</td>
      <td>${employee.monthlyrate}</td>
      <td>${Total}</td>
    </tr>
    `  
    append to train-table tbody

# Form Input -- DONE
  ## On click submit button -- CHECK
    * get the value of the form: $("#id").val().trim(); -- CHECK
    * push the value to firebase database: database.ref().push({});  -- CHECK

# On child_added, 
  * snapshot = a picture of data at a particular database reference at a single point in time -- CHECK
  * snapshot on child_added in ref(/user) is the data at (/user) when new child to the (/user) is added. -- CHECK
  * snapshot.val() returns object representation of the data -- CHECK
  * Use the data in the database for dynamically created tables about train schedule 

# Next Arrival & Minutes Away
  * using data inputted as first train time and frequency, calculate next arrival and minutes away by using current time
  * use Moment.js

#  updating your "minutes to arrival" and "next train time" text once every minute.

# Try adding `update` and `remove` buttons for each train. Let the user edit the row's elements-- 
  allow them to change a train's Name, Destination and Arrival Time (and then, by relation, minutes to arrival).

# authentication


*/



// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBhzeruTvl8oo5ZCK8rORRvplM1k9TACEs",
  authDomain: "train-scheduler-b4346.firebaseapp.com",
  databaseURL: "https://train-scheduler-b4346.firebaseio.com",
  projectId: "train-scheduler-b4346",
  storageBucket: "train-scheduler-b4346.appspot.com",
  messagingSenderId: "626876163024",
  appId: "1:626876163024:web:dd1b867e654cdc55"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// declare database variable as database in firebase
let database = firebase.database();

// on click function when submit button is clicked: get value from the form and push it to firebase database's user reference
$('#submit').on("click", function(event) {
  event.preventDefault();

  var trainName = $('#train-name-input').val().trim();
  var destination = $('#destination-input').val().trim();
  var firstTrainTime = $('#time-input').val().trim();
  var frequency = $('#frequency-input').val().trim();
  // push the value of the form to firebase database
  database.ref("/user").push({
    train: trainName,
    destination: destination,
    firstTime: firstTrainTime,
    frequency: frequency,
    dataAdded: firebase.database.ServerValue.TIMESTAMP,
  });
});

// Firebase watcher .on("child_added")
database.ref("/user").on("child_added", function(snapshot) {
  var sv = snapshot.val();
  console.log(sv);
  // var frequency = sv.frequency;

  var nextArrival = trainArrival(sv.firstTime, sv.frequency);
  // var minutesAway = minAway(sv.firstTime)
  // display table when pused to firebase database
  // trainArrival(sv.firstTime, sv.frequency);
  renderTable(sv, nextArrival);

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code)
});

// dynamically display table with the parameter used.
function renderTable(sv, nextArrival) {

  $('#train-table tbody').append(`
  <tr>
    <td>${sv.train}</td>
    <td>${sv.destination}</td>
    <td>${sv.frequency}</td>
    <td>${nextArrival}</td>
    
    
  </tr>
`);

}

// A = first train time , B = current time, C = frequency
// Convert first train time into unix millisecond timestamp
// Convert current time into unix millisecond timestamp
// convert frequency into millisecond.
// while A < B, A += C until A is no longer less than B.
// if A < B && A === B, A+=C
// if? while? for? first Train time is before current time, add frequency till the train time is after current time and display it as a next train time.
// Then it will always show the NEXT train time.



// var freq = moment(sv.frequency, 'mm').format("mm");
// console.log("outside scope frequency: " + freq);


console.log(moment(1563559200833).format());


var nowMilitaryTime = moment().format("HH mm ss A"); // current time in millitary time
// console.log(nowMilitaryTime);

//
function trainArrival(firstTime, frequency) {
  
  var freq = moment(frequency, 'mm').format("mm");
  console.log("frequency: " + freq);

  var freqUnixMs = moment(frequency, 'mm');
  console.log("frequencyUnixMs: " + freqUnixMs);

  var ft = moment(firstTime, 'HH:mm').format("HH:mm");
  console.log("ft: " + ft);

  var ftUnix = moment(firstTime, 'HH:mm');
  console.log("ft Unix: " + ftUnix);

  var ctUnix = moment();
  console.log(ctUnix);

  var ct = moment().format("HH:mm");
  console.log(ct);

  var minCal = ftUnix - ctUnix;
  console.log("minCal: " + minCal);

  // var calMin = moment(minCal, 'HH:mm').format("HH:mm");
  // console.log("Min Away: " + calMin);

  while (ftUnix < ctUnix) {
    ftUnix += freqUnixMs;
    // ftUnix.add(freqUnixMs).format("HH:mm");
    return;
  }

  // trainArrival();

  var minLeft = ftUnix.diff(ctUnix, "hours") + ' hrs, ' + (ftUnix.diff(ctUnix, "minutes") % 60) + ' mins'
  console.log("Min Away: " + minLeft);

  var nextETA = moment(firstTime, 'HH:mm').add(frequency, 'minutes').format("HH:mm");
  console.log("next ETA: " + nextETA);

}

// var getTimeLeft = function() {
//   var now = moment();
//   console.log("now: " + now);
//   var deadline = now.clone().hour(14).minute(0).second(0);
//   console.log("deadline: " + deadline);
//   if (now.isAfter(deadline)) {
//     var tomorrow = moment(new Date()).add(1, 'days').hour(14).minute(0).second(0);
//     console.log(tomorrow.diff(now, "hours") + ' hrs, ' + (tomorrow.diff(now, "minutes") % 60) + ' mins');
//   } else {
//     console.log(deadline.diff(now, "hours") + ' hrs, ' + (deadline.diff(now, "minutes") % 60) + ' mins');
//   }
// }
// getTimeLeft();

// var b = moment(freq, "m");
// console.log("this is freq " + b)

// var nextArrival = a.from(b);
// console.log("this is nextArrival " + nextArrival);

// nextArrival = moment().format("HH:mm");
// console.log("this is nextArrival " + nextArrival);

// convert time format into minutes
  // var x = new moment()
  // console.log(x);
  // var y = new moment([2019-07-19,"YYYY-MM-DD"])
  // console.log(y);

  //current time's minute
  // var mm = moment().minutes();
  // console.log(mm);
  // var hm = moment().hour()
  // console.log(hm);
  // var hourInMin = hm * 60;
  // console.log(hourInMin);

  // var duration = moment.duration(x.diff(y))
  // console.log(duration);
  // returns duration object with the duration between x and y



// moment.js to calculate next arrival time of the train.
// function trainArrival(next) {
//   // start time(nextArrival) += frequency
//   var next = sv.firstTime += frequency;
//   console.log(next);

//   return next;


// }

// call trainArrival function to update next arrival time when minute away reaches 0.
// minute away = next arrival time - current time



// function minAway() {
//   var eta = sv.firstTime - m;
//   console.log(eta);
// }

