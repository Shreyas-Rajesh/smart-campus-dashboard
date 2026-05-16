
var cellColors = ['c0','c1','c2','c3','c4','c5','c6','c7'];
var colorMap   = {};   
var colorIndex = 0;

function getCellColor(code) {
  if (!colorMap[code]) {
    colorMap[code] = cellColors[colorIndex % cellColors.length];
    colorIndex++;
  }
  return colorMap[code];
}

function loadTimetable() {
  fetch('/api/timetable')
    .then(function(response) { return response.json(); })
    .then(function(data) {
      var container = document.getElementById('timetableContainer');

      if (!data.periods || data.periods.length === 0) {
        container.innerHTML = '<div class="no-data-text">Timetable not available for your section.</div>';
        return;
      }

      var html = '<table class="tt-table"><thead><tr><th>DAY</th>';

      for (var p = 0; p < data.periods.length; p++) {
        html += '<th>' + data.periods[p] + '</th>';
      }
      html += '</tr></thead><tbody>';

      for (var d = 0; d < data.days.length; d++) {
        var dayObj = data.days[d];
        html += '<tr><td class="tt-day-cell">' + dayObj.day + '</td>';

        for (var s = 0; s < dayObj.slots.length; s++) {
          var slot = dayObj.slots[s];

          if (slot === '--' || slot === '') {
            html += '<td class="tt-empty">—</td>';
          } else if (slot === 'Lunch Break') {
            html += '<td class="tt-lunch">🍽 Lunch Break</td>';
          } else {
            var parts = slot.split('\n');
            var code  = parts[0] || '';
            var name  = parts[1] || '';
            var room  = parts[2] || '';
            var clr   = getCellColor(code);

            html += '<td><div class="tt-cell ' + clr + '">';
            html += '<div class="cell-code">' + code + '</div>';
            if (name) { html += '<div>' + name + '</div>'; }
            if (room) { html += '<div class="cell-room">' + room + '</div>'; }
            html += '</div></td>';
          }
        }
        html += '</tr>';
      }

      html += '</tbody></table>';
      container.innerHTML = html;
    });
}

loadTimetable();