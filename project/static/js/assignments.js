function loadAssignments() {
  fetch('/api/assignments')
    .then(function(response) { return response.json(); })
    .then(function(list) {
      var container = document.getElementById('assignmentsList');
      var html = '';

      for (var i = 0; i < list.length; i++) {
        var a = list[i];
        var statusClass = a.status.toLowerCase() === 'finished' ? 'finished' : '';

        html += '<div class="assign-card ' + statusClass + '">';
        html += '<div class="assign-num">' + (i + 1) + '</div>';
        html += '<div class="assign-info">';
        html += '<div class="assign-title">' + a.title + '</div>';
        html += '<div class="assign-sub">' + a.subject + ' · ' + a.code + '</div>';
        html += '</div>';
        html += '<div class="assign-right">';
        html += '<div class="assign-due">Due ' + a.due_date + '</div>';
        html += '<div class="assign-status ' + a.status.toLowerCase() + '">' + a.status + '</div>';
        html += '</div>';
        html += '</div>';
      }

      if (html === '') { html = '<div class="no-data-text">No assignments found for your section.</div>'; }
      container.innerHTML = html;
    });
}
 
loadAssignments();