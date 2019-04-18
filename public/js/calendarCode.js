
      //for getting today's date

      var d = new Date();

      var month = d.getMonth()+1;
      var day = d.getDate();

      var output = d.getFullYear() + '-' +
          (month<10 ? '0' : '') + month + '-' +
          (day<10 ? '0' : '') + day;

          //for keeping track of selected date
          var currentDate;
          function checkDates(startTime, endTime){
              var returnBoolean = true;
              for(var i = 0; i < startTime.length; i++)
              {
                 if(((new Date(endTime.start)) >= (new Date(startTime[i].start)) && (new Date(endTime.start)) <= (new Date(startTime[i].end))) || ((new Date(endTime.end)) >= (new Date(startTime[i].start)) && (new Date(endTime.end)) <= (new Date(startTime[i].end))))
                 {
                     returnBoolean = false;
                     break;
                 }
              }
              return returnBoolean;
          }
          function openForm() {
            document.getElementById("myForm").style.display = "block";
          }

          function closeForm() {
            document.getElementById("myForm").style.display = "none";
          }


          function add(date){

            var startTime = document.getElementById("start").value;
            var endTime = document.getElementById("end").value;
            var title = document.getElementById("title").value;
            var date = currentDate;
            startTime = date + "T" + startTime + ":00";
            endTime = date + "T" + endTime + ":00";

            var obj = {
              title : title,
              start : startTime,
              end : endTime
            };

            // adding title title, start and end time to that variable(the date and start/end time need to be in the same variable)


            //checking if date is valid
            if (checkDates(startTime, endTime)) {
              //adding the event variable to the eventsArray

              $("#calendar").fullCalendar('renderEvent', obj, true);
              eventsArray.push(obj);
            } else {
              alert('Invalid Date');
            }

            closeForm();
          }



      $(function() {
        //for all the buttons at the top
        $('#calendar').fullCalendar({
          header: {
            left: 'month, agendaWeek, agendaDay',
            center: 'title, addNew',
            right: 'addEventButton, prevYear, prev, next, nextYear'
          },

          //text for buttons at top
          buttonText: {
            prevYear : new moment().year() - 1,
            nextYear : new moment().year() + 1
          },
          unselectAuto : false,
          //not sure
          viewRender: function (view){
            var y = moment($('#calendar').fullCalendar('getDate')).year();
            $('.fc-prevYear-button').text(y - 1);
            $('.fc-nextYear-button').text(y + 1);
          },

          //for themes
          themeSystem : 'bootstrap4',

          //loading events from array in calendarEvents.js
          events: function( start, end, timezone, callback ) {
            callback(eventsArray);
          },

          dayClick:  function(date, jsEvent, view){
            currentDate = date.format();

          },

          //enables selecting dates
          selectable: true,

          // code for add event button
          customButtons: {
            addEventButton: {
              text: 'Add new event',
              click: function () {
                openForm();
              }
            }
          },

          //calendar starts with todays date
          defaultDate: output,

          navLinks: true, // can click day/week names to navigate views

          //lets you drag events to different dates
          editable: true,


          eventLimit: true,
          //week starts with monday  change to 0 for sunday
          firstDay: 1,

          //clicking on an event
          eventClick: function(calEvent, jsEvent, view){
            $("#calendar").fullCalendar('removeEvents', 1);
            alert('Event: ' + calEvent.title);

          },

          //for button icons
          bootstrapFontAwesome:{
            prev: 'chevron-left',
            next: 'chevron-right'
          },
          height: 900,


        })

        });
