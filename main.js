$(document).on('ready', function() {

  var month = [];
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";

  var now = new Date();

  var thisMonth = $('<div class="month-wrapper"></div>');
  thisMonth.append('<p class="month">' + month[now.getMonth()] + '</p>');

  var thisWeek = $('<p>Today</p>')
      .append('<p>Tomorrow</p>');

  var numericalDays = [ now.getDate()+2, now.getDate()+3, now.getDate()+4 ];
  var numericalDaysEls = numericalDays.map(function(days){
    return $('<p>' + days + '</p>');
  });

  thisWeek.append(numericalDaysEls);
  thisMonth.append(thisWeek);

  $(".calendar").append(thisMonth);

  
});