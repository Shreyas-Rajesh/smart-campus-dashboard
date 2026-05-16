var selectedRole = 'student';


function selectRole(role) {
  selectedRole = role;
  document.getElementById('roleInput').value = role;

  if (role === 'student') {
    document.getElementById('btnStudent').classList.add('active');
    document.getElementById('btnAdmin').classList.remove('active');
    document.getElementById('userLabel').innerHTML = 'STUDENT ID';
    document.getElementById('usernameField').placeholder = 'AM.SC.U4CSE25249';
  } else {
    document.getElementById('btnAdmin').classList.add('active');
    document.getElementById('btnStudent').classList.remove('active');
    document.getElementById('userLabel').innerHTML = 'ADMIN USERNAME';
    document.getElementById('usernameField').placeholder = 'admin';
  }
}

function validateForm() {
  var username = document.getElementById('usernameField').value.trim();
  var password = document.getElementById('passwordField').value.trim();
  var uErr = document.getElementById('usernameError');
  var pErr = document.getElementById('passwordError');

  uErr.innerHTML = '';
  pErr.innerHTML = '';

  var valid = true;

  if (username === '') {
    uErr.innerHTML = 'This field cannot be empty';
    valid = false;
  } else if (selectedRole === 'student' && username.substring(0, 2).toUpperCase() !== 'AM') {
    uErr.innerHTML = 'Student ID must start with "AM"';
    valid = false;
  }

  if (password === '') {
    pErr.innerHTML = 'Password cannot be empty';
    valid = false;
  }

  return valid;
}