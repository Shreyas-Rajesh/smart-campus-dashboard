

function loadAdminNotices() {
    var section = document.getElementById('viewNoticeSection').value;
    var container = document.getElementById('adminNoticeList');
    container.innerHTML = '<div class="loading-spin"></div>';

    fetch('/api/notices?section=' + section)
        .then(function(r) { return r.json(); })
        .then(function(list) {
            var html = '';
            if (list.length === 0) {
                html = '<div class="no-data-text">No notices found for Section ' + section + '</div>';
            } else {
                for (var i = 0; i < list.length; i++) {
                    html += '<div class="admin-notice-item">';
                    html += '  <div class="admin-item-content">';
                    html += '    <div class="admin-item-title">' + list[i].heading + '</div>';
                    html += '    <div class="admin-item-meta">' + list[i].date + '</div>';
                    html += '  </div>';
                    html += '  <button class="delete-btn" onclick="deleteNotice(\'' + section + '\', \'' + list[i].heading + '\')"><i class="bi bi-trash3-fill"></i></button>';
                    html += '</div>';
                }
            }
            container.innerHTML = html;
        });
}

document.getElementById('addNoticeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var data = {
        section: document.getElementById('noticeSection').value,
        heading: document.getElementById('noticeTitle').value,
        date:    document.getElementById('noticeDate').value,
        content: document.getElementById('noticeContent').value
    };

    fetch('/api/admin/add_notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(function(r) { return r.json(); })
    .then(function(res) {
        if (res.success) {
            alert('Notice added successfully!');
            document.getElementById('addNoticeForm').reset();
            loadAdminNotices();
        }
    });
});

function deleteNotice(section, heading) {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    fetch('/api/admin/delete_notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: section, heading: heading })
    })
    .then(function(r) { return r.json(); })
    .then(function(res) {
        if (res.success) {
            loadAdminNotices();
        }
    });
}



function loadAdminEvents() {
    var container = document.getElementById('adminEventsList');
    fetch('/api/events')
        .then(function(r) { return r.json(); })
        .then(function(list) {
            var html = '';
            for (var i = 0; i < list.length; i++) {
                html += '<div class="admin-event-item">';
                html += '  <div class="admin-item-content">';
                html += '    <div class="admin-item-title">' + list[i].name + '</div>';
                html += '    <div class="admin-item-meta">' + list[i].date + '</div>';
                html += '  </div>';
                html += '</div>';
            }
            if (html === '') html = '<div class="no-data-text">No events scheduled.</div>';
            container.innerHTML = html;
        });
}

document.getElementById('addEventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var data = {
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        description: document.getElementById('eventDesc').value
    };

    fetch('/api/admin/add_event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(function(r) { return r.json(); })
    .then(function(res) {
        if (res.success) {
            alert('Event added successfully!');
            document.getElementById('addEventForm').reset();
            loadAdminEvents();
        }
    });
});


function loadFeedback() {
    var tbody = document.getElementById('feedbackTableBody');
    fetch('/api/admin/contacts')
        .then(function(r) { return r.json(); })
        .then(function(list) {
            var html = '';
            for (var i = 0; i < list.length; i++) {
                html += '<tr>';
                html += '  <td>' + list[i].name + '</td>';
                html += '  <td>' + list[i].email + '</td>';
                html += '  <td>' + list[i].subject + '</td>';
                html += '  <td>' + list[i].message + '</td>';
                html += '</tr>';
            }
            if (html === '') html = '<tr><td colspan="4" class="text-center py-4 text-muted">No messages yet.</td></tr>';
            tbody.innerHTML = html;
        });
}


loadAdminNotices();
loadAdminEvents();

document.getElementById('feedback-tab').addEventListener('shown.bs.tab', function () {
    loadFeedback();
});