# Train-Scheduler

## Overview

**Train-Scheduler** is a web application that takes in user input about a train (train name, destination, first train time, and frequency)and displays the following information about the train: train name, destination, frequency, next arrival, minutes away. Next arrival and minutes away are automatically calculated as current time passes and up-to-date information is displayed without having to refresh the page.


## How To Use the App

### When the website is loaded.
  * Following forms will be displayed for the users to input the train data that will be stored in the database
    * Train Name
    * Destination
    * First Train Time
    * Frequency
  * A Table showing the train informations if there is data in the firebase database about a train that was stored previously

### To add additional infomration about a train
  * Fill out the forms
  * click submit button to push the input into firebase database and display the inputted data in the table
  * Following informations about the train will be displayed
    * Train Name
    * Destination
    * Frequency (min)
    * Next Arrival
    * Minutes Away
  * Buttons to edit and remove the information about a train will be dynamically created within the same row in the table

### To edit existing information about a train
  * Click the button under **Edit** 
  * Once user click on edit button, the information regarding the train will be displayed in the form
  * Modify the information user wants to change
  * Click submit button to save the change
  * The newly inputted information will update the existing data in the database instead of adding new set of data
  * The changes will be displayed in the table upon clicking submit button

## To remove existing information about a train
  * Click the button under **Remove**
  

## Real time data update
  * The current time will be updated to the database every one second.
  * The current time is used to calculate the next arrival time and minutes away
  * Since current time always changes and will be updated to the database every one second, the next train arrival time and minutes away are also updated and displayed in the table with the up-to-date information every one second.