// Store fetched courses so we can access them when syllabus button is clicked
var allCourses = [];

// Color classes for card tops (cycles through for each card)
var cardColors = ['card-color-0','card-color-1','card-color-2','card-color-3','card-color-4','card-color-5'];

function loadCourses() {
  fetch('/api/courses')
    .then(function(response) { return response.json(); })
    .then(function(courses) {
      allCourses = courses;   // save to global array

      var grid = document.getElementById('coursesGrid');
      var html = '';

      for (var i = 0; i < courses.length; i++) {
        var color = cardColors[i % cardColors.length];
        html += '<div class="col-md-3 col-sm-6">';
        html += '<div class="course-card ' + color + '">';
        html += '<div class="course-code">' + courses[i].code + '</div>';
        html += '<div class="course-name">' + courses[i].name + '</div>';
        // Pass the index so showSyllabus knows which course was clicked
        html += '<button class="view-syllabus-btn" onclick="showSyllabus(' + i + ')">View Syllabus →</button>';
        html += '</div></div>';
      }

      if (html === '') { html = '<div class="col-12 no-data-text">No courses found.</div>'; }

      grid.innerHTML = html;
      document.getElementById('courseMeta').innerHTML = courses.length + ' Courses this semester';
    });
}

// Show the syllabus panel below all the cards
function showSyllabus(index) {
  var course = allCourses[index];
  var panel  = document.getElementById('syllabusPanel');
  var title  = document.getElementById('syllabusTitle');
  var list   = document.getElementById('syllabusList');

  title.innerHTML = course.name + ' : Syllabus Overview';

  var html = '';
  for (var i = 0; i < course.topics.length; i++) {
    html += '<li>' + course.topics[i] + '</li>';
  }
  list.innerHTML = html;

  // Make the panel visible and scroll to it
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth' });
}

loadCourses();