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

# Form Input
  ## On click submit button
    * get the value of the form: $("#id").val().trim();
    * push the value to firebase database: database.ref().push({});

# On child_added, 
  * snapshot = a picture of data at a particular database reference at a single point in time
  * snapshot on child_added in ref(/user) is the data at (/user) when new child to the (/user) is added.
  * snapshot.val() returns object representation of the data
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


