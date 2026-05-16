function loadNotices() {
  fetch('/api/notices')
    .then(function(response) { return response.json(); })
    .then(function(list) {
      var container = document.getElementById('noticesContainer');
      var html = '';

      for (var i = 0; i < list.length; i++) {
        html += '<div class="notice-card">';
        html += '<div class="notice-heading">' + list[i].heading + '</div>';
        html += '<div class="notice-content">' + list[i].content + '</div>';
        html += '</div>';
      }

      if (html === '') { html = '<div class="no-data-text">No notices at this time.</div>'; }
      container.innerHTML = html;
    });
}

loadNotices();