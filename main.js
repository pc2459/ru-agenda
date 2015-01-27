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
      if(Number(days[i]) === 1){
         days.splice(i,0, now.format("MMMM"));
         i++;
       }
    }
    return days;
  };

  // Helper function for injecting HTML into day/month formatting
  var formatMonth = function(day){
    var reg = /^\d+$/;
    if (reg.test(day))
      return $('<div class="day-wrapper"><p class="day">' + day + '</p></div>');
    else 
      return $('<p class="month">' + day + '</p>');
  };

  // Helper function to append a new week
  var appendAWeek = function(div){
    var numericalDays = nextWeek();
    numericalDays = spliceInMonths(numericalDays).map(formatMonth);
    div.append(numericalDays);
  };               
  

  wrapper.append('<div class="day-wrapper"><p class="day">Today</p></div>');
  appendAWeek(wrapper);
  $(".calendar").append(wrapper);


  // Show more button to append more weeks
  $("#show-more").on('click',function(){
    appendAWeek(wrapper);  

    // Hide the show more button once infinite scroll kicks in
    if ($(".wrapper").height() > $(window).height()){
      $("#show-more").hide();
    }

  });



  // PAGINATE, YO /////////////////////////////////////////////////////////////

  $(window).scroll(function(){
    if  ($(window).scrollTop() == $(document).height() - $(window).height()){
          
          appendAWeek(wrapper);
    }
  }); 


  // EDIT INLINE FORM /////////////////////////////////////////////////////////

  $(".item-form").hide();

  $(".wrapper").on("click",".day",function(e){
    console.log("Clicked on a day");
    var clicked = $(this);

    var form = $(".item-form").clone();
    form.show();
    
    clicked.parent().append(form);

    var textarea = form.find(".item-textarea");

    textarea.focus();

    form.find(".item-submit").on('click',function(e){
      e.preventDefault();

      var newItem = $('<p class="item"></p>');
      newItem.append(textarea.val());
      clicked.parent().append(newItem);

      form.remove();
    });

  });

  
});