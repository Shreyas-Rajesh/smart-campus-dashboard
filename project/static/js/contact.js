function submitContact() {
  var name    = document.getElementById('cName').value.trim();
  var email   = document.getElementById('cEmail').value.trim();
  var subject = document.getElementById('cSubject').value.trim();
  var message = document.getElementById('cMessage').value.trim();
  var msgDiv  = document.getElementById('contactMsg');

 
  if (name === '' || email === '' || subject === '' || message === '') {
    msgDiv.style.display = 'block';
    msgDiv.className = 'contact-feedback-msg error';
    msgDiv.innerHTML = 'Please fill in all fields (Name, Email, Subject, and Message).';
    return;
  }

 
  if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
    msgDiv.style.display = 'block';
    msgDiv.className = 'contact-feedback-msg error';
    msgDiv.innerHTML = 'Please enter a valid email address (must contain @ and .).';
    return;
  }

 
  if (message.length < 10) {
    msgDiv.style.display = 'block';
    msgDiv.className = 'contact-feedback-msg error';
    msgDiv.innerHTML = 'Message too short. Please write at least 10 characters.';
    return;
  }

  
  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, email: email, subject: subject, message: message })
  })
  .then(function(response) { return response.json(); })
  .then(function(data) {
    msgDiv.style.display = 'block';
    msgDiv.className = 'contact-feedback-msg success';
    msgDiv.innerHTML = 'Feedback sent successfully!';
    
    // Clear form fields
    document.getElementById('cEmail').value   = '';
    document.getElementById('cSubject').value = '';
    document.getElementById('cMessage').value = '';
  });
}
