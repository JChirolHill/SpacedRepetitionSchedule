$(document).ready(function() {
  var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  var fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  var nums = ["One", "Two", "Three", "Four", "Five"];
  var srrNums = [1, 3, 6];
  var oneClass = false;

  // hide necessary steps
  $("#step2").hide();

  // fill in each day in step 1
  $.each(days, function(dayIndex, dayName) {
    var dayHTML = '<div class="card">';
      dayHTML += '<div class="card-header" id="' + dayName.toLowerCase() + '">';
        dayHTML += '<h5 class="mb-0">';
          dayHTML += '<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse' + nums[dayIndex] + '" aria-expanded="false" aria-controls="collapse' + nums[dayIndex] + '">';
            dayHTML += dayName;
          dayHTML += '</button>';
        dayHTML += '</h5>';
      dayHTML += '</div>';
      dayHTML += '<div id="collapse' + nums[dayIndex] + '" class="collapse" aria-labelledby="' + dayName.toLowerCase() + '" data-parent="#inputClasses">';
        dayHTML += '<div class="card-body">';
          dayHTML += '<div class="currClassesList" id="' + dayName.toLowerCase() + 'CurrClassesList">Classes for ' + dayName + ':';
            dayHTML += '<ul class="list-group list-group-flush" id="' + dayName.toLowerCase() + 'CurrClasses"></ul>';
            dayHTML += '</div>';
          dayHTML += '<div class="form-group">';
            dayHTML += '<label for="className">Add a Class for ' + dayName + ':</label>';
            dayHTML += '<input type="text" class="form-control" id="' + dayName.toLowerCase() + 'ClassName" placeholder="Enter class name">';
          dayHTML += '</div>';
          dayHTML += '<label for"rememberCheckboxes">(Optional) Also add this class to:</label>';
          dayHTML += '<div class="rememberCheckboxes form-group form-check checkParent">';
            for(i=0; i<days.length; i++) {
              if(dayName != days[i]) {
                dayHTML += '<div>'
                  dayHTML += '<input type="checkbox" class="form-check-input ' + dayName.toLowerCase() + 'AddToScheduleCheckbox" id="rememberCheck' + dayIndex + i + '" data-day="' + days[i].toLowerCase() + '"/>';
                  dayHTML += '<label class="form-check-label" for="rememberCheck' + dayIndex + i + '">' + days[i] + '</label>';
                dayHTML += '</div>'
              }
            }
          dayHTML += '</div>';
          dayHTML += '<button type="submit" class="addToScheduleBtn btn colorBtn" data-day="' + dayName.toLowerCase() + '">Add to Schedule</button>';
          dayHTML += '<div class="alert alert-success" role="alert" id="' + dayName.toLowerCase() + 'successAddedMsg"></div>';
        dayHTML += '</div>';
      dayHTML += '</div>';
    dayHTML += '</div>';
    $(".accordion").append(dayHTML);
  });

  // fill in each day for step 2
  $.each(fullDays, function(dayIndex, dayName) {
    var step2DayHTML = '<div class="col-sm weekdayHeader">' + dayName + '</div>';
    $("#weekdays").append(step2DayHTML);
  })

  // cleaning up
  $('[data-target="#collapseOne"]').attr("aria-expanded", "true");
  $('[data-target="#collapseOne"]').removeClass("collapsed");
  $("#collapseOne").addClass("show");
  $(".alert").hide();
  $(".currClassesList").hide();

  // add to this and other days when click to add for a specific day
  $(".addToScheduleBtn").on("click", function() {
    var currDay = $(this).data("day");
    var className = $("#" + currDay + "ClassName").val().trim();
    if(className == "") {
      alert("Please enter a valid class name.");
    }
    else if(className.length > 9) {
      alert("Please enter a class name shorter than 9 characters.");
    }
    else {
      // add to this day
      $("#" + currDay + "CurrClasses").append('<li class="list-group-item ' + currDay + 'Class listedClass">' + className + '</li>');
      $("#" + currDay + "CurrClassesList").show();

      // add to other days
      $("." + currDay + "AddToScheduleCheckbox:checked").each(function() {
        var dayAddTo = $(this).data("day");
        $("#" + dayAddTo + "CurrClasses").append('<li class="list-group-item ' + dayAddTo + 'Class listedClass">' + className + '</li>');
        $("#" + dayAddTo + "CurrClassesList").show();
      })

      $("#" + currDay + "ClassName").val("");
      $("#" + currDay + "successAddedMsg").html("Successfully added the class \"" + className + "\" to the days selected.");
      $("#" + currDay + "successAddedMsg").fadeIn();
      setTimeout(function() {
        $("#" + currDay + "successAddedMsg").fadeOut();
      }, 3000);

      oneClass = true;
    }
  });

  // when click on a class to modify the name
  $(".list-group").on("click", ".listedClass", function () {
    var className = $(this).html();
    var $this = $(this);
    $this.html('');
    $this.removeClass("listedClass");
    $(".changeName").removeClass("changeName");
    var modifyNameHTML = '';
    modifyNameHTML += '<div class="input-group flex-nowrap">';
      modifyNameHTML += '<div class="input-group-prepend">';
        modifyNameHTML += '<span class="input-group-text removeFromList" id="addon-wrapping">X</span>';
      modifyNameHTML += '</div>';
      modifyNameHTML += '<input type="text" class="form-control changeName" value="' + className + '" aria-label="Username" aria-describedby="addon-wrapping">';
    modifyNameHTML += '</div>';
    $this.append(modifyNameHTML);

    $(".changeName").keypress(function(e) {
      if(e.which == 13) {
        var newName = $(this).val();
        if(newName.length > 9) {
          alert("Please enter a class name shorter than 9 characters.");
        }
        else {
          $this.html(newName);
          $(".changeName").remove();
          $this.addClass("listedClass");
        }
      }
    })

    $(".removeFromList").on("click", function() {
      $this.remove();
    })
  })

  //  <div class="input-group flex-nowrap">
  //   <div class="input-group-prepend">
  //     <span class="input-group-text" id="addon-wrapping">X</span>
  //   </div>
  //   <input type="text" class="form-control" value="" aria-label="Username" aria-describedby="addon-wrapping">
  // </div>

  // algorithm to generate the table
  $("#generateSRRBtn").on("click", function() {
    // alert if no classes entered
    if(!oneClass) {
      alert("Please enter at least one class before generating the schedule.");
    }
    else if($(".changeName").length > 0) {
      alert("Make sure that if you edited the name of any class, you press enter.");
    }
    else {
      // find how many rows to add
      var numRows = 0;
      $.each(days, function(dayIndex, dayName) {
        var temp = $("." + dayName.toLowerCase() + "Class").length;
        if(temp > numRows) {
          numRows = temp;
        }
      })
      numRows *= 3;

      // generate the rows and columns
      for(i=0; i<numRows; i++) {
        $("#srrListing").append('<div id="toReviewRow' + i + '" class="row"></div>');
        for(j=0; j<7; j++) {
          if(i == 0) {
            $("#toReviewRow" + i).append('<div id="toReview' + fullDays[j] + i + '" class="col-sm toReview ' + fullDays[j].toLowerCase() + 'Next" data-row="' + i + '"></div>');
          }
          else {
            $("#toReviewRow" + i).append('<div id="toReview' + fullDays[j] + i + '" class="col-sm toReview" data-row="' + i + '"></div>');
          }
          $("#toReviewRow" + i).hide();
        }
      }

      // fill each cell with class names
      $.each(srrNums, function(srrIndex, srrNum) {
        $.each(days, function(dayIndex, dayName) {
          $("." + dayName.toLowerCase() + "Class").each(function() {
            var className = $(this).html();
            $("." + fullDays[(dayIndex+srrNum)%7].toLowerCase() + "Next").html(className);
            $("." + fullDays[(dayIndex+srrNum)%7].toLowerCase() + "Next").addClass("toReview" + srrNum);
            var currRow = $("." + fullDays[(dayIndex+srrNum)%7].toLowerCase() + "Next").data("row");
            $("#toReviewRow" + currRow).show();
            $("." + fullDays[(dayIndex+srrNum)%7].toLowerCase() + "Next").removeClass(fullDays[(dayIndex+srrNum)%7].toLowerCase() + "Next");
            $("#toReview" + fullDays[(dayIndex+srrNum)%7] + (currRow+1)).addClass(fullDays[(dayIndex+srrNum)%7].toLowerCase() + "Next");
          })
        })
      })

      $("#step1").hide();
      $("#step2").show();
    }
  })

  // display form
  $('#emailListBtn').on('click', function() {

  });
})
