from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import csv
import json
import os
from functools import wraps

app = Flask(__name__)
app.secret_key = "smartcampus_secret_2025"

def read_csv(filepath):
    rows = []
    if not os.path.exists(filepath):
        return rows
    with open(filepath, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            clean_row = {}
            for key, value in row.items():
                if key is not None:
                    clean_row[key] = value
            rows.append(clean_row)
    return rows

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'userid' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated

# Page Routes 
@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = ''
    if request.method == 'POST':
        role     = request.form.get('role', '')
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()

        if role == 'student':
            for s in read_csv('students.csv'):
                if s['userid'] == username and s['password'] == password:
                    session['name']    = s['name']
                    session['userid']  = s['userid']
                    session['section'] = s['section']
                    session['role']    = 'student'
                    return redirect(url_for('dashboard'))
            error = 'Invalid Student ID or Password'

        elif role == 'admin':
            for a in read_csv('admin.csv'):
                if a['username'] == username and a['password'] == password:
                    session['name']    = 'Admin'
                    session['userid']  = username
                    session['section'] = 'A'
                    session['role']    = 'admin'
                    return redirect(url_for('dashboard'))
            error = 'Invalid Admin credentials'
        else:
            error = 'Please select a role'

    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', active='dashboard')

@app.route('/courses')
@login_required
def courses():
    return render_template('courses.html', active='courses')

@app.route('/timetable')
@login_required
def timetable():
    return render_template('timetable.html', active='timetable')

@app.route('/assignments')
@login_required
def assignments():
    return render_template('assignments.html', active='assignments')

@app.route('/notices')
@login_required
def notices():
    return render_template('notices.html', active='notices')

@app.route('/events')
@login_required
def events():
    return render_template('events.html', active='events')

@app.route('/contact')
@login_required
def contact():
    return render_template('contact.html', active='contact')

@app.route('/about')
@login_required
def about():
    return render_template('about.html', active='about')

@app.route('/admin')
@login_required
def admin_panel():
    if session.get('role') != 'admin':
        return redirect(url_for('dashboard'))
    return render_template('admin.html', active='admin')

# API Routes (return JSON to JavaScript)
@app.route('/api/dashboard_data')
@login_required
def api_dashboard_data():
    role = session.get('role', 'student')
    section = session.get('section', 'A')

    if role == 'admin':
        # Admin stats: total notices across all sections, total events, total messages
        total_notices = 0
        for s in ['A', 'B', 'C', 'D']:
            total_notices += len(read_csv(f'notices/{s}_notice.csv'))
        
        event_count = len(read_csv('events.csv'))
        message_count = len(read_csv('contacts.csv'))

        return jsonify({
            'name':        'Admin',
            'role':        'admin',
            'notices':     total_notices,
            'events':      event_count,
            'messages':    message_count
        })

    # Student stats
    # Count courses from text file
    course_count = 0
    course_file = 'courses/' + section + '_courses.txt'
    if os.path.exists(course_file):
        with open(course_file, 'r', encoding='utf-8') as f:
            course_count = len([l for l in f if l.strip()])

    # Count upcoming assignments for this section
    assignment_count = sum(
        1 for a in read_csv('assignments.csv')
        if a.get('section') == section and a.get('status', '').lower() == 'upcoming'
    )

    notice_count = len(read_csv('notices/' + section + '_notice.csv'))
    event_count  = len(read_csv('events.csv'))

    return jsonify({
        'name':        session.get('name', 'Student'),
        'role':        'student',
        'section':     section,
        'userid':      session.get('userid', ''),
        'courses':     course_count,
        'assignments': assignment_count,
        'notices':     notice_count,
        'events':      event_count
    })

@app.route('/api/admin/contacts')
@login_required
def api_admin_contacts():
    if session.get('role') != 'admin':
        return jsonify([])
    return jsonify(read_csv('contacts.csv'))

@app.route('/api/admin/add_notice', methods=['POST'])
@login_required
def api_admin_add_notice():
    if session.get('role') != 'admin':
        return jsonify({'success': False})
    
    data    = request.get_json()
    section = data.get('section', 'A')
    heading = data.get('heading', '')
    date    = data.get('date', '')
    content = data.get('content', '')

    filepath = f'notices/{section}_notice.csv'
    file_exists = os.path.exists(filepath)
    
    with open(filepath, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['heading', 'date', 'content'])
        writer.writerow([heading, date, content])
    
    return jsonify({'success': True})

@app.route('/api/admin/delete_notice', methods=['POST'])
@login_required
def api_admin_delete_notice():
    if session.get('role') != 'admin':
        return jsonify({'success': False})
    
    data    = request.get_json()
    section = data.get('section', 'A')
    heading = data.get('heading', '')

    filepath = f'notices/{section}_notice.csv'
    rows = read_csv(filepath)
    
    # Simple delete: filter out the matching heading
    new_rows = [r for r in rows if r['heading'] != heading]
    
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        if new_rows:
            writer = csv.DictWriter(f, fieldnames=['heading', 'date', 'content'])
            writer.writeheader()
            writer.writerows(new_rows)
        else:
            # If empty, just write header
            f.write('heading,date,content\n')

    return jsonify({'success': True})

@app.route('/api/admin/add_event', methods=['POST'])
@login_required
def api_admin_add_event():
    if session.get('role') != 'admin':
        return jsonify({'success': False})
    
    data = request.get_json()
    name = data.get('name', '')
    date = data.get('date', '')
    desc = data.get('description', '')

    filepath = 'events.csv'
    file_exists = os.path.exists(filepath)
    
    with open(filepath, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['name', 'date', 'description'])
        writer.writerow([name, date, desc])
    
    return jsonify({'success': True})

@app.route('/api/courses')
@login_required
def api_courses():
    section = session.get('section', 'A')
    course_file = 'courses/' + section + '_courses.txt'
    courses = []
    if os.path.exists(course_file):
        with open(course_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                parts = line.split('|')
                if len(parts) >= 3:
                    courses.append({
                        'code':   parts[0].strip(),
                        'name':   parts[1].strip(),
                        'topics': [t.strip() for t in parts[2].split(',')]
                    })
    return jsonify(courses)

@app.route('/api/timetable')
@login_required
def api_timetable():
    section = session.get('section', 'A')
    tt_file = 'timetables/' + section + '_timetable.json'
    if os.path.exists(tt_file):
        with open(tt_file, 'r', encoding='utf-8') as f:
            return jsonify(json.load(f))
    return jsonify({"periods": [], "days": []})

@app.route('/api/assignments')
@login_required
def api_assignments():
    section = session.get('section', 'A')
    result = [a for a in read_csv('assignments.csv') if a.get('section') == section]
    return jsonify(result)

@app.route('/api/notices')
@login_required
def api_notices():
    # Admin can specify section in query param
    section = request.args.get('section')
    if not section or session.get('role') != 'admin':
        section = session.get('section', 'A')
    
    return jsonify(read_csv('notices/' + section + '_notice.csv'))

@app.route('/api/events')
@login_required
def api_events():
    return jsonify(read_csv('events.csv'))

@app.route('/api/contact', methods=['POST'])
@login_required
def api_contact():
    data    = request.get_json()
    name    = data.get('name', '')
    email   = data.get('email', '')
    subject = data.get('subject', '')
    message = data.get('message', '')

    # Ensure headers are written if file is new or empty
    file_exists = os.path.exists('contacts.csv')
    is_empty = True
    if file_exists:
        is_empty = os.path.getsize('contacts.csv') == 0
    
    with open('contacts.csv', 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        if is_empty:
            writer.writerow(['name', 'email', 'subject', 'message'])
        writer.writerow([name, email, subject, message])

    return jsonify({'success': True, 'msg': 'Message sent successfully!'})

if __name__ == '__main__':
    app.run(debug=True)