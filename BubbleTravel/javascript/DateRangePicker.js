/*
function getDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}
*/
var date_from;
var date_to;
var numOfDays = 1;

$(function() {
  $('input[name="daterange"]').daterangepicker({
    minDate: new Date(),
    opens: 'left'
  }, function(start, end, label) {
    console.log("A new date selection was made: " + start.format('DD/MM/YYYY') + ' to ' + end.format('DD/MM/YYYY'));
    date_from = start.format('DD/MM/YYYY');
    date_to = end.format('DD/MM/YYYY');
    numOfDays = datediff(parseDate(date_from),parseDate(date_to));
    console.log("Num of days: " + numOfDays);
  });
});

function parseDate(str) {
  var mdy = str.split('/');
  var dt = new Date(year = mdy[2], month = mdy[1]-1, day = mdy[0]);
  return dt;
}

function datediff(first, second) {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  return Math.round((second-first)/(1000*60*60*24));
}