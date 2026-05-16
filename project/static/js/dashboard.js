// Load all dashboard data when page opens
function loadDashboard() {

  // Step 1: Fetch summary counts from Flask
  fetch('/api/dashboard_data')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Set greeting based on hour of day
      var hour = new Date().getHours();
      var greeting = 'GOOD MORNING';
      if (hour >= 12 && hour < 17) { greeting = 'GOOD AFTERNOON'; }
      if (hour >= 17)              { greeting = 'GOOD EVENING'; }

      document.getElementById('greetingText').innerHTML = greeting;
      document.getElementById('greetingName').innerHTML = data.name;
      
      var semVal = document.getElementById('semVal');
      if (semVal) {
        semVal.innerHTML = data.section + ' CSE';
      }

      // Update the four stat cards
      if (data.role === 'admin') {
        document.getElementById('roleBadge').innerHTML = 'Admin View';
        
        // Change labels for Admin
        document.getElementById('card1Label').innerHTML = 'TOTAL NOTICES';
        document.getElementById('card1Sub').innerHTML   = 'Across sections';
        document.getElementById('courseCount').innerHTML = data.notices;

        document.getElementById('card2Label').innerHTML = 'TOTAL EVENTS';
        document.getElementById('card2Sub').innerHTML   = 'Upcoming';
        document.getElementById('assignCount').innerHTML = data.events;

        document.getElementById('noticeCount').innerHTML = data.messages;
        // reuse notice card for messages for now or keep it
        // let's follow the requirement: show total notices, total events, total messages
        
        // Wait, the requirement says show: total notices, total events, total messages.
        // I have 4 cards.
        // Card 1: Total Notices
        // Card 2: Total Events
        // Card 3: Total Messages
        // Card 4: ? Maybe just keep it as is or hide?
        
        // Let's re-align:
        document.getElementById('card1Label').innerHTML = 'NOTICES';
        document.getElementById('courseCount').innerHTML = data.notices;
        
        document.getElementById('card2Label').innerHTML = 'EVENTS';
        document.getElementById('assignCount').innerHTML = data.events;
        
        // Use the 3rd card for Messages
        document.querySelector('.border-green .stat-card-label').innerHTML = 'MESSAGES';
        document.querySelector('.border-green .stat-card-sub').innerHTML   = 'From contact form';
        document.getElementById('noticeCount').innerHTML = data.messages;

        // Hide 4th card for admin or use for something else? 
        // Let's just hide it or show "Active Users" if I had that. 
        // Requirement said: "show: total notices, total events, total messages"
        document.querySelector('.border-red').parentElement.style.display = 'none';

      } else {
        document.getElementById('courseCount').innerHTML = data.courses;
        document.getElementById('assignCount').innerHTML = data.assignments;
        document.getElementById('noticeCount').innerHTML = data.notices;
        document.getElementById('eventCount').innerHTML  = data.events;
      }
    });

  // Step 2: Fetch assignments and show upcoming deadlines
  var deadlinesList = document.getElementById('deadlinesList');
  if (deadlinesList) {
    fetch('/api/assignments')
      .then(function(response) { return response.json(); })
      .then(function(list) {
        var container = document.getElementById('deadlinesList');
        var html = '';
        var shown = 0;

        for (var i = 0; i < list.length; i++) {
          if (list[i].status.toLowerCase() === 'upcoming' && shown < 4) {
            html += '<div class="deadline-item">';
            html += '<span class="deadline-subject">' + list[i].title + '</span>';
            html += '<span class="deadline-due">Due ' + list[i].due_date + '</span>';
            html += '</div>';
            shown++;
          }
        }

        if (html === '') { html = '<div class="no-data-text">No upcoming deadlines 🎉</div>'; }
        container.innerHTML = html;
      });
  }

  // Step 3: Fetch events and show mini list
  fetch('/api/events')
    .then(function(response) { return response.json(); })
    .then(function(list) {
      var container = document.getElementById('eventsList');
      var html = '';

      for (var i = 0; i < list.length && i < 4; i++) {
        html += '<div class="event-mini-item">';
        html += '<span class="event-mini-name">' + list[i].name + '</span>';
        html += '<span class="event-mini-date">' + list[i].date + '</span>';
        html += '</div>';
      }

      if (html === '') { html = '<div class="no-data-text">No upcoming events</div>'; }
      container.innerHTML = html;
    });
}

// Run when page loads
loadDashboard();