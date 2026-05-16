// Build the scrollable date strip at the top
function buildDateStrip() {
  var today    = new Date();
  var months   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var days     = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var strip    = document.getElementById('dateStrip');

  document.getElementById('currentMonth').innerHTML = months[today.getMonth()] + ' ' + today.getFullYear();

  var html = '';
  for (var i = 0; i < 14; i++) {
    var d = new Date(today);
    d.setDate(today.getDate() + i);
    var todayClass = (i === 0) ? 'today' : '';
    html += '<div class="date-item ' + todayClass + '">';
    html += '<div class="date-num">' + d.getDate() + '</div>';
    html += '<div class="date-day">' + days[d.getDay()] + '</div>';
    html += '</div>';
  }
  strip.innerHTML = html;
}

// Load events from Flask and display as cards
function loadEvents() {
  fetch('/api/events')
    .then(function(response) { return response.json(); })
    .then(function(list) {
      var container = document.getElementById('eventsContainer');
      var html = '';

      for (var i = 0; i < list.length; i++) {
        html += '<div class="event-card">';
        html += '<div class="event-name">' + list[i].name + '</div>';
        html += '<div class="event-date">' + list[i].date + '</div>';
        html += '<div class="event-desc">' + list[i].description + '</div>';
        html += '</div>';
      }

      if (html === '') { html = '<div class="no-data-text">No upcoming events scheduled.</div>'; }
      container.innerHTML = html;
    });
}

buildDateStrip();
loadEvents();