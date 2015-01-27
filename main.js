$(document).on('ready', function() {





  // SET UP FIRST WEEK //////////////////////////////////////

  var now = moment();
  var thisMonth = now.format("MMMM");

  var wrapper = $('.calendar');
  wrapper.append('<p class="month">' + thisMonth + '</p>');

  // Helper function for creating an array of the next 7 days
  var nextWeek = function(){
    var newWeek = [ now.add(1,'d').format("D"), 
                        now.add(1,'d').format("D"), 
                        now.add(1,'d').format("D"),
                        now.add(1,'d').format("D"), 
                        now.add(1,'d').format("D"), 
                        now.add(1,'d').format("D"),
                        now.add(1,'d').format("D")   
                  ];
    return newWeek;
  };

  // Helper function for splicing in textual months to a list of 
  // running numerical days
  var spliceInMonths = function(days){
    for (var i=0; i<days.length; i++){
      var j = i + 1;
      if (days[j] === undefined){
        break;
      }
      if (days[j] < days[i]){
        days.splice(j,0, now.format("MMMM"));
        i++;
      }
    }
    return days;
  };

  // Helper function for injecting HTML into day/month formatting
  var formatMonth = function(day){
    var reg = /^\d+$/;
    if (reg.test(day))
      return $('<p>' + day + '</p>');
    else 
      return $('<p class="month">' + day + '</p>');
  };                    
  

  wrapper.append('<p>Today</p>');
  var numericalDays = nextWeek();
  numericalDays = spliceInMonths(numericalDays).map(formatMonth);
  wrapper.append(numericalDays);

  $(".calendar").append(monthWrapper);


  // PAGINATE, YO /////////////////////////////////////////////////////////////

  $(window).scroll(function(){
    if  ($(window).scrollTop() == $(document).height() - $(window).height()){
          // run our call for pagination
    }
  }); 

  
});