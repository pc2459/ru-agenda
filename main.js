$(document).on('ready', function() {


  // SET UP VARIABLES /////////////////////////////////////////////////////////

  var wrapper = $('.calendar');
  var now = moment();

  // localStorage.removeItem("appts");
  // Convert appointments back from the stringified JSON 
  var appointments = JSON.parse(localStorage.getItem("appts"));
  var dateID = moment();

  appointments = appointments || {};

  // SET UP FUNCTIONS /////////////////////////////////////////////////////////
  
  // Create an array of the next 7 days
  var genDays = function(){
    var newWeek = [];
    for(var i=0; i<7; i++){
      newWeek.push(now.add(1,'d').format("D"));
    }
    return newWeek;
  };

  // Splice in text month names to an array of numerical days
  var spliceInMonths = function(days){
    for (var i=0; i<days.length; i++){
      if(Number(days[i]) === 1){
         days.splice(i,0, now.format("MMMM"));
         i++;
       }
    }
    return days;
  };

  // Helper function to inject HTML into day/month formatting
  var formatMonth = function(day){
    var reg = /^\d+$/;
    if (reg.test(day))
      return $('<div class="day-wrapper"><p class="day" id="' + (dateID.add(1,'d').format("YYYYMMDD")) +'">' + day + '</p></div>');
    else 
      return $('<p class="month">' + day + '</p>');
  };

  // Create a new week 
  var newWeek = function(){
    var week = genDays();
    week = spliceInMonths(week).map(formatMonth);
    return week;
  };        

  var repopulateAppointments = function(){
    console.log("WTF", $("p").length);
    for (var item in appointments){
      $('[id='+item+']').not('.populated').addClass('populated').after('<p class="item">' + appointments[item] + '</p>');
    }
  };      

  
  // APPEND TO DOM ////////////////////////////////////////////////////////////

  wrapper.append('<p class="month">' + now.format("MMMM") + '</p>')
          .append('<div class="day-wrapper"><p class="day" id="'+ dateID.format("YYYYMMDD") +'">Today</p></div>')
          .append(newWeek());
  $(".calendar").append(wrapper);
  repopulateAppointments();

  // Show more button to append more weeks
  $("#show-more").on('click',function(){
    wrapper.append(newWeek);  
    // Hide the show more button once infinite scroll kicks in
    if ($(".wrapper").height() > $(window).height()){
      $("#show-more").hide();
    }
  });



  // PAGINATE, YO /////////////////////////////////////////////////////////////

  $(window).scroll(function(){
    if  ($(window).scrollTop() == $(document).height() - $(window).height()){
          
      wrapper.append(newWeek);
      repopulateAppointments();
    }
  }); 


  // EDIT INLINE FORM /////////////////////////////////////////////////////////

  $(".item-form").hide();
  

  // Add agenda item
  $(".wrapper").on("click",".day",function(e){

    var clicked = $(this);
    var form = $(".item-form:first").clone();

    console.log("Clicked on a day.");
    
    // Append the form   
    clicked.parent().append(form);
    form.show();  
    var textarea = form.find(".item-textarea");
    textarea.focus();

    // Handle form submits
    form.find(".item-submit").on('click',function(e){
      e.preventDefault();

      var newItem = $('<p class="item"></p>');
      newItem.append(textarea.val());
      appointments[clicked.attr('id')] = newItem.html();
      localStorage.setItem("appts", JSON.stringify(appointments));
      clicked.parent().append(newItem);
      clicked.addClass('populated');

      form.remove();
    });

  });

  // Edit agenda item
  $(".wrapper").on("click",".item",function(){
    console.log("Clicked edit an item");

    var clicked = $(this);
    var form = $(".item-form:first").clone();

    form.show();    
    clicked.hide();
    clicked.parent().append(form);   

    var textarea = form.find(".item-textarea");
    textarea.val(clicked.text()).focus();

    // Handle form submits
    form.find(".item-submit").on('click',function(e){
      e.preventDefault();

      var updatedItem = clicked.text(textarea.val());
      appointments[clicked.attr('id')] = updatedItem.html();
      localStorage.setItem("appts", JSON.stringify(appointments));

      form.remove();
      clicked.show();
    });

    // Handle form deletions
    form.find(".item-delete").on('click',function(e){
      e.preventDefault();

      clicked.remove();
      form.remove();
    });


  });

  
});