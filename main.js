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
      return $('<div class="day-wrapper"><p class="day" id="' + 
        (dateID.add(1,'d').format("YYYYMMDD")) +'">' + day + '</p></div>');
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
    for (var item in appointments){
      for (var i=0; i<appointments[item].length; i++){
        $('[id='+item+']')
        .not('.populated')
        .after('<p class="item">' + appointments[item][i] + '</p>');
      }
      $('[id='+item+']')
      .addClass('populated');
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

  var createForm = function(){
    return $(".item-form:first").clone();
  };

  var createEditForm = function(){
    return $(".item-form-edit:first").clone();
  };

  var appendForm = function(day, formType){
    form = formType();
    day.after(form);
    form.show();
    form.find(".item-textarea").focus();
  };

  var createItem = function(data){
    var newItem = $('<p class="item"></p>');
    newItem.append(data);
    return newItem;
  };

  var updateItem = function(item, data){
    item.html(data);
    item.show();

  };

  var updateLocalStorage = function(day, item, data){

      if (appointments[day.attr('id')].length <= 1){
        appointments[day.attr('id')][0] = data;
      }

      else if ( appointments[day.attr('id')].length > 1 ){
        var flag = false;
          for (var i = 0; i < appointments[day.attr('id')].length; i++){
            if (appointments[day.attr('id')][i] == item && !flag){
              appointments[day.attr('id')][i] = data;
              flag = true;
            }        
        }
      }
    localStorage.setItem("appts", JSON.stringify(appointments));
  };


  var addToLocalStorage = function(day, item){
    if (!appointments[day.attr('id')]){
      appointments[day.attr('id')] = [];
      appointments[day.attr('id')].unshift(item.html());
    }
    else {
      appointments[day.attr('id')].unshift(item.html());
    }
    console.log("appointments:",appointments);
    // appointments[day.attr('id')] = item.html();
    localStorage.setItem("appts", JSON.stringify(appointments));
    day.addClass('populated');
  };
  
  var appendItem = function(dayWrapper, item){
    dayWrapper.append(item);
  };

  // Open up an add item form
  $(".wrapper").on("click",".day",function(e){
    var clicked = $(this);
    var dayWrapper = $(this).parent();

    appendForm(clicked,createForm);

  });

  // Submit an agenda item
  $('.wrapper').on('click', '.item-submit', function(event){

    event.preventDefault();

    var data = $(this).parent().siblings('.item-textarea').val();
    var day = $(this).closest('form').siblings('.day');
    var dayWrapper = day.parent();
    var form = $(this).closest('form');

    console.log(data);
    var item = createItem(data);
    addToLocalStorage(day, item);
    appendItem(dayWrapper, item);

    form.remove();
  });

  //Update agenda item 
  $('.wrapper').on('click', '.item-edit', function(event){

    event.preventDefault();

    var data = $(this).parent().siblings('.item-textarea').val();
    var day = $(this).closest('form').siblings('.day');
    var dayWrapper = day.parent();
    var form = $(this).closest('form');

    console.log(data);
    var oldItem =  $(this).closest('form').prev('.item');
    console.log("oldItem,",oldItem);

    updateLocalStorage(day, oldItem.html(), data);
    updateItem(oldItem,data);

    form.remove();
  });


  // Edit agenda item
  $(".wrapper").on("click",".item",function(){
    console.log("Clicked edit an item");

    var clicked = $(this);
    var dayWrapper = $(this).parent();
 
    appendForm(clicked,createEditForm);
    clicked.hide();

    // Fill the form up
    var textarea = $(this).siblings('.item-form-edit').find(".item-textarea");
    textarea.val(clicked.text()).focus();

  });


  // Delete agenda item
  $('.wrapper').on('click','.item-delete',function(e){
    e.preventDefault();
    var clicked = $(this).closest('form').prev('.item');
    var day = $(this).closest('form').siblings('.day');
    var form = $(this).closest('form');
    console.log("day,",day.attr('id'));
    console.log("clicked,",clicked);

    if(appointments[day.attr('id')]){

      if (appointments[day.attr('id')].length <= 1){
        delete appointments[day.attr('id')];
      }

      else if ( appointments[day.attr('id')].length > 1 ){
        var flag = false;
          for (var i = 0; i < appointments[day.attr('id')].length; i++){
            if (appointments[day.attr('id')][i] == clicked.html() && !flag){
              appointments[day.attr('id')].splice(i,1);
              flag = true;
            }        
        }
      }
    }

    // Delete from local storage
    localStorage.setItem("appts", JSON.stringify(appointments));

    clicked.remove();
    form.remove();
  });

  
});