/*
Psuedo Coding
===============

# Form ID
  * trainName
  * trainDestination
  * firstTrainTime
  * trainFrequency
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
  * when trainArrival function is called, push updated tArrival, tMinutes into firebase database and on the related child -- HOW?
  * need to know how to access specific td in tr of a dynamically created table to change it's value
  * 

# Try adding `update` and `remove` buttons for each train. Let the user edit the row's elements-- 
  allow them to change a train's Name, Destination and Arrival Time (and then, by relation, minutes to arrival).


# authentication


*/

$(document).ready(function() {

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
  // Declare database variable as database in firebase
  var database = firebase.database();


  // Run Clock  
  setInterval(function(){
    $('#time-part').html("Current Time: " + moment().format('hh:mm:ss A'))
  }, 1000);
      
  // Run Train Scheduler
  trainScheduler();

  // TrainScheduler function
  function trainScheduler() {
    // Declare Variables
    var editKey = ''; // variable to store reference key to firebase for editing correspond data
    var now = moment();
    var nextTrainTime; // next arrival time

    $('#submit').on('click', function(evt) {
      evt.preventDefault();

      // Grab input values
      var trainName = $('#trainName').val().trim();
      var trainDestination = $('#trainDestination').val().trim();
      var firstTrainTime = moment($('#firstTrainTime').val().trim(), "HH:mm").format("X");
      var frequency = $('#trainFrequency').val().trim();
      
      // Using conditional statement to prevent data to be pushed to the database when not every form is filled
      if (trainName != '' && trainDestination != '' && firstTrainTime != '' && frequency != '') {
        // Clear form data
        $('#trainName').val('');
        $('#trainDestination').val('');
        $('#firstTrainTime').val('');
        $('#trainFrequency').val('');

        now = moment().format("X");
        // Push to firebase
        if (editKey == '') { // If there is no editKey value
          database.ref().child('trains').push({ // push the variables to the database in a child named 'trains'
            trainName: trainName,
            trainDestination: trainDestination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            currentTime: now,
          })
        } else if (editKey !== '') { // If there is editKey value
          database.ref('trains/' + editKey).update({ // locate database with provided editKey value as it's unique key in 'trains' path and update database
            trainName: trainName,
            trainDestination:trainDestination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            currentTime: now,
          })
          editKey = ''; // empty the editKey value once else if conditional is met and database is updated
        } 
      }
    })

  }

});


/*

  // on click function when submit button is clicked: get value from the form and push it to firebase database's user reference
  $('#submit').on("click", function(event) {
    event.preventDefault();

    var trainName = $('#train-name-input').val().trim();
    var destination = $('#destination-input').val().trim();
    // change the time input string value as moment.js time format (milliseconds from unix epoch without years)
    // why is it subtracting 10 years?
    // var firstTrainTime = moment($('#time-input').val().trim(), "HH:mm").subtract(10, "years").format("X");
    var firstTrainTime = moment($('#time-input').val().trim(), "HH:mm").format("X");
    var frequency = $('#frequency-input').val().trim();
    var now = moment().format();
    console.log("now: " + now);
    // push the value of the form to firebase database  
    database.ref("/train-info").push({
      train: trainName,
      destination: destination,
      firstTime: firstTrainTime,
      frequency: frequency,
      dataAdded: firebase.database.ServerValue.TIMESTAMP,
    });

  });

  // database.ref("/train-info").on("value", function(snapshot) {
  //   console.log("snaaaaapSHOT", snapshot.val())
  //   //in this method, we need to update 
  // });

  // Firebase watcher .on("child_added")
  database.ref("/train-info").on("child_added", function(snapshot) {
    var sv = snapshot.val();
    console.log(sv);
    var name = sv.train;
    console.log("train: " + name);
    var destination = sv.destination;
    console.log("destination: " + destination);
    var firstTime = sv.firstTime;
    console.log("firstTime String: " + firstTime); // not an integer
    // converting from unix epoch time to date and time
    console.log("firstTime HH:mm: " + moment.unix(firstTime).format("MMMM Do YYYY, h:mm:ss a"));
    var frequency = sv.frequency; // not an integer
    console.log("frequency String: " + frequency);

    // IS THERE A WAY TO RUN RESULT? IN SET INTEVERL?
    var result = trainArrival(firstTime, frequency);
  
    var minutesAway = result.tMinutes;
    var nextArrival = result.tArrival;
    
    renderTable(name, destination, nextArrival, frequency, minutesAway);


  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code)
  });



  // function updateTime(nextArrival, minutesAway) {
  //   // A post entry.
  //   var postData = {
  //     nextArrival: nextArrival,
  //     minutesAway: minutesAway,
  //   };
  //   console.log("updateTime Data: " + postData);

  //   // Get a key for a new Post.
  //   // var newPostKey = firebase.database().ref().child('user').push().key;
  //   var newPostKey = database.ref("/user").push().key;
  //   console.log("newPostKey: " + newPostKey);

  //   // Write the new post's data simultaneously in the posts list and the user's post list.
  //   var updates = {};
  //   updates['/user/' + newPostKey] = postData;
  //   // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  //   console.log("updates: " + updates);

  //   return database.ref("/user").update(updates);
  // }

  // updateTime();



  function renderTable(name, destination, nextArrival, frequency, minutesAway) {

    $('#train-table tbody').append(`
    <tr>
      <td>${name}</td>
      <td>${destination}</td>
      <td>${frequency}</td>
      <td>${nextArrival}</td>
      <td>${minutesAway}</td>
    </tr>
  `);

  }


  function trainArrival(firstTime, frequency) {

    // Calculate the minutes until arrival using hardcore math
    // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
    // and find the modulus between the difference and the frequency.
    var timeArr = firstTime.split(":");
    console.log("First Time Split in Array: " + timeArr);
    console.log("first time Array HH:mm : " + moment.unix(timeArr).format("MMMM Do YYYY, h:mm:ss a"));
    var trainTime = moment()
    .hours(timeArr[0])
    .minutes(timeArr[1]);
    console.log("Train Time: " + trainTime);
    console.log("train time in HH:mm : " + moment.unix(trainTime).format("MMMM Do YYYY, h:mm:ss a"));
    // difference between current time (moment()) and trainTime in minutes 
    var differenceTimes = moment().diff(trainTime, "minutes");
    console.log("Delta of current time and first train time: " + differenceTimes);
    // the minutes away without the frequency
    var tRemainder = differenceTimes % frequency;
    console.log("Minutes Away without the frequency: " + tRemainder);
    tMinutes = frequency - tRemainder;
    console.log("Minutes Away: " + tMinutes);
    // To calculate the arrival time, add the tMinutes to the current time
    var tArrival = moment()
      .add(tMinutes, "m")
      .format("hh:mm A");
    
    // console.log("Schedule Data: " + JSON.stringify(scheduleData));

    return { tArrival, tMinutes }

  }

  function updateTable(name, destination, frequency, scheduleData) {

    $('#train-table tbody').html(`
    <tr>
      <td>${name}</td>
      <td>${destination}</td>
      <td>${frequency}</td>
      <td>${scheduleData.nextArrival}</td>
      <td>${scheduleData.minuteAway}</td>
    </tr>
  `);
  }



*/

/*

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
  // change the time input string value as moment.js time format (milliseconds from unix epoch without years)
  var firstTrainTime = moment($('#time-input').val().trim(), "HH:mm").subtract(10, "years").format("X");
  console.log("THISISfirstTrainTime: " + firstTrainTime);
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
  var name = sv.train;
  console.log("train: " + name);
  var destination = sv.destination;
  console.log("destination: " + destination);
  var firstTime = sv.firstTime;
  console.log("firstTime String: " + firstTime);
  var frequency = sv.frequency;
  console.log("frequency String: " + frequency);

  var nextArrival = trainArrival(firstTime, frequency);

  renderTable(name, destination, frequency, nextArrival);

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code)
});

// dynamically display table with the parameter used.
// IT DOES NOT SEEM LIKE I NEED TO WIRTE PARAMETER INSIDE THE FUNCTION'S PARENTHESIS FOR NAME?
// Is it because name was the only parameter? The code was broken once I try to include destination and other parameters.
function renderTable(name, destination, frequency, nextArrival ) {

  $('#train-table tbody').append(`
  <tr>
    <td>${name}</td>
    <td>${destination}</td>
    <td>${frequency}</td>
    <td>${nextArrival}</td>
    
    
    
  </tr>
`);

}

// A = first train time , B = current time, C = frequency
// Convert first train time into unix millisecond timestamp
// Convert current time into unix millisecond timestamp
// convert frequency into millisecond.
// while A < B, A += C until A is no longer less than B.
// if A < B || A === B, A+=C
// if? while? for? first Train time is before current time, add frequency till the train time is after current time and display it as a next train time.
// Then it will always show the NEXT train time.

//LETS CHANGE EVERY FORM VALUE INTO NUMBER?


// WHY IS THIS ONLY ADDING FREQUENCY TO FIRST TRAIN TIME ONCE? 
function trainArrival(firstTime, frequency) {



}




  // var now = moment().subtract(10, "years").format("X");
  // console.log("Now: " + now);
  // var delta = now - firstTime;
  // console.log("delta: " + delta);
  // while (delta - frequency > 0) {
  //   delta = delta - frequency;
  //   var eta = moment([now + delta], "HH:mm").format("hh:mm A");
  //   console.log("ETA: " + eta);
  //   return eta;
  // }

  // let delta = currentTime- firstTime; // min
  // while (delta - frequency > 0) {
    
  //   delta  = delta - frequency

  // }


  // var freqNum = frequency;
  // console.log("frequency Number: " + freqNum);

  // var freqMs = (freqNum * 60000);
  // console.log("Frequency in MS: " + freqMs)
  
  // var ftUnixMs = moment(parseInt(firstTime), 'HH:mm');
  // console.log("First Train time in Ms: " + ftUnixMs);

  // var ctUnixMs = moment();
  // console.log("Current Time in Ms: " + ctUnixMs);

  // var ct = moment().format("HH:mm");
  // console.log("Current Time: " + ct);

  // var ft = moment(firstTime, 'HH:mm').format("HH:mm");
  // console.log("First Train Time: " + ft);

  // var freq = moment(frequency, 'mm').format("mm");
  // console.log("frequency: " + freq);


  // if (ftUnixMs < ctUnixMs || ftUnixMs === ctUnixMs) {
    // var nextArrivalTime = moment(ftUnixMs += freqMs).format("HH:mm");
    // console.log("Next ETA: " + nextArrivalTime);
    // return nextArrivalTime;
    
    // return moment(ftUnixMs += freqMs).format("HH:mm");
  
  
  // while (firstTrainTime <= currentTime) {
  //   // var nextETA = firstTrainTime
  //   nextETA += frequency;
    
  //   console.log("Next ETA: " + nextETA);
  //   console.log("Next ETA in Time format: " + moment(nextETA).format("HH:mm"));
  //   return moment(nextETA).format("hh:mm A");
  // }
  // var nextETA = ftUnixMs
  // while (nextETA + freqMs <= ctUnixMs) { 
  //   nextETA += freqMs;
  //   console.log("Next ETA: " + nextETA);
  //   console.log("Next ETA in Time format: " + moment(nextETA).format("HH:mm"));
  //   return moment(nextETA).format("hh:mm A");

  


  // let delta = ct - ft; 
  // console.log("delta: " + delta);
  // while ()




  

  // let delta = currentTime- firstTime; // min
  // while (delta - frequency > 0) {
    
  //   delta  = delta - frequency

  // }

  // delta will be equal to a number less than then frequency at the end and that should be the time to the next train



  // trainArrival();

  // var minLeft = ftUnixMs.diff(ctUnixMs, "hours") + ' hrs, ' + (ftUnixMs.diff(ctUnixMs, "minutes") % 60) + ' mins'
  // console.log("Min Away: " + minLeft);

  // var nextETA = moment(firstTime, 'HH:mm').add(frequency, 'minutes').format("HH:mm");
  // console.log("next ETA: " + nextETA);



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

*/

