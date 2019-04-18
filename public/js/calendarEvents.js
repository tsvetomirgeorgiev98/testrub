
function addToArray(event){
  var obj = {
    title: event.title,
    start: event.start,
    end: event.end
  }

  eventsArray[1] =  obj;
}
var eventsArray = [
  {
    id: 1,
    title: "test",
    start: "2019-04-05T16:00:00",
    end: "2019-04-05T17:00:00"
  }
]
