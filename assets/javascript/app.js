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
          database.ref('trains/' + editKey).update({ // Locate database with provided editKey value as it's unique key in 'trains' path and update database
            trainName: trainName,
            trainDestination:trainDestination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            currentTime: now,
          })
          editKey = ''; // Empty the editKey value once else if conditional is met and database is updated
        } 
      }
    }); // on click submit function end

    // Update minutes away by triggering change in firebase children
    function timeUpdate() {
      database.ref().child('trains').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

          now = moment().format('X');
          database.ref('trains/' + childSnapshot.key).update({
            currentTime: now,
          })
        })
      })
    };

    setInterval(timeUpdate, 1000);

    // Reference Firebase when page loads and train added
    database.ref().child('trains').on('value', function(snapshot) {
      $('tbody').empty(); // empty table

      snapshot.forEach(function(childSnapshot) {
        var trainClass = childSnapshot.key;
        var trainId = childSnapshot.val();
        var firstTimeUnix = moment.unix(trainId.firstTrainTime);
        var timeDiff = moment().diff(moment(firstTimeUnix, 'HH:mm'), 'minutes');
        var timeDiffCalc = timeDiff % parseInt(trainId.frequency);
        var timeDiffTotal = parseInt(trainId.frequency) - timeDiffCalc; // this is minutes away

        if (timeDiff >= 0) { // If current time is more future or at the same time of the first train time,
          nextTrainTime = null; // set nextTrainTime's value as null
          nextTrainTime = moment().add(timeDiffTotal, 'minutes').format('hh:mm A'); // current time + minutes away is next train time
        } else {
          nextTrainTime = null;
          nextTrainTime = firstTimeUnix.format("hh:mm A");
          timeDiffTotal = Math.abs(timeDiff - 1);
        }

        $('tbody').append(`
          <tr class="${trainClass}">
            <td>${trainId.trainName}</td>
            <td>${trainId.trainDestination}</td>
            <td>${trainId.frequency}</td>
            <td>${nextTrainTime}</td>
            <td>${timeDiffTotal}</td>
            <td><button class='edit btn' data-train="${trainClass}"><i class="fas fa-stream"></i></button></td>
            <td><button class='delete btn' data-train="${trainClass}"><i class="fas fa-window-close"></i></i></button></td>
          </tr>
        `)
      })

    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    // Reference firebase when children are updated
    database.ref().child('trains').on('child_changed', function(childSnapshot) {

      var trainClass = childSnapshot.key;
      var trainId = childSnapshot.val();
      var firstTimeUnix = moment.unix(trainId.firstTrainTime);
      var timeDiff = moment().diff(moment(firstTimeUnix, 'HH:mm'), 'minutes');
      var timeDiffCalc = timeDiff % parseInt(trainId.frequency);
      var timeDiffTotal = parseInt(trainId.frequency) - timeDiffCalc; // this is minutes away

      if (timeDiff >= 0) { // I think this has to be >= 0 since when currentt time is next train time, I want to show the next train time in future.
        // Add min away to current time if curren time is at the same time or in the future compared to first train time to show next train arrival time
        nextTrainTime = moment().add(timeDiffTotal, 'minutes').format("hh:mm A"); 
      } else {
        nextTrainTime = firstTimeUnix.format("hh:mm A"); // next train time is in the future, show the next train time.
        timeDiffTotal = Math.abs(timeDiff - 1);
      }
      // Select table row with the corresponding trainclass as it's class and change it's table data.
      $('.' + trainClass).html(`          
          <td>${trainId.trainName}</td>
          <td>${trainId.trainDestination}</td>
          <td>${trainId.frequency}</td>
          <td>${nextTrainTime}</td>
          <td>${timeDiffTotal}</td>
          <td><button class='edit btn' data-train="${trainClass}"><i class='glyphicon glyphicon-pencil'></i></button></td>
          <td><button class='delete btn' data-train="${trainClass}"><i class='glyphicon glyphicon-remove'></i></button></td>
        `)
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    // need to add function for edit and remove buttons
    // document.onclick because it is dynamically generated button
    $(document).on('click', '.edit', function() {
      // grab data-train attribute of clicked button, which is childSnapshot.key of the data and set it as the value to editKey
      editKey = $(this).attr('data-train');
      // From the database, retrieve related data of the train in the same row as the button, locate the data by using the editKey and display them on the form.
      database.ref('trains/' + editKey).once('value').then(function(childSnapshot) {
        var trainId = childSnapshot.val();
        $('#trainName').val(trainId.trainName);
        $('#trainDestination').val(trainId.trainDestination);
        $('#firstTrainTime').val(moment.unix(trainId.firstTrainTime).format('HH:mm'));
        $('#trainFrequency').val(trainId.frequency);

      })
    })

    $(document).on('click', '.delete', function() {
      var editKey = $(this).attr('data-train');
      database.ref('trains/' + editKey).remove();
      $('.' + editKey).remove();

    })



  } // Trainscheduler end

}); // Document.ready end