$(document).on('ready',function() {

  /* appointments  = { Day : [Appointment, Appointment, Appointment], 
   *                   ... }
   *
   *
   */

  $(".item-form").hide();
  var dateID = moment();
  var appointments = appointments || {};
  
  // Load localStorage data object
  var loadLocalStorage = function(obj){
    return JSON.parse(localStorage.getItem(obj));
  };

  // Store data into a localStorage object
  var saveLocalStorage = function(data, obj){
    localStorage.setItem(obj, JSON.stringify(data));
  };

  // Helper function to inject HTML into day/month formatting
  var formatMonth = function(day){
    var reg = /^\d+$/;
    if (reg.test(day)){
      return $('<div class="day-wrapper"><p class="day" id="' + (dateID.add(1,'d').format("YYYYMMDD")) +'">' + day + '</p></div>');
    }
    else {
      return $('<p class="month">' + day + '</p>');
    }
  };

  // Generate a new week
  var generateWeek = function(){
    var now = moment();
    var newWeek = [];

    for(var i=0; i<7; i++){
      newWeek.push(now.add(1,'d').format("D"));
    }

    for (var j=0; j<newWeek.length; j++){
      if(Number(newWeek[j]) === 1){
         newWeek.splice(j,0, now.format("MMMM"));
         j++;
       }
    }
    return newWeek.map(formatMonth);
  };

  // Append a week to the calendar
  var appendWeek = function(){
    $('.calendar').append(generateWeek);
  };

  // Create appointment form 
  var createForm = function(val){
    var form = $('<form class="item-form">');
    var formInput = $('<textarea class="item-textarea">Add an appointment...</textarea>');
    formInput.val(val || "Add an appointment...");
    form.append(formInput)
        .append('<div class="submit-btns">')
        .append('<input type="submit" class="item-submit" value="">')
        .append('<input type="submit" class="item-delete" value="">');

    return form;
  };


  $('.wrapper').on('click','.day',function dayClickHandler(e) {
    var clicked = $(this);
    var form = createForm();

    clicked.parent().append(form);
    console.log("Appended a form");
    form.find(".item-textarea").focus();

  });

  $('.wrapper').on('submit','.item-form', function appointmentSubmitHandler(e){
    e.preventDefault();
    

    var day = $(this).closest('.day');
    var date = $(this).closest('.day').attr('id');

    var newItem = $('<p class="item populated"></p>');
    newItem.append($('.item-textarea').val());

    day.append(newItem);

    $(this).hide();


  });

  var addAppointment = function(date,data){


  };






  $('.calendar').append('<p class="month">' + moment().format("MMMM") + '</p>');
  appendWeek();
     


}); //end document ready