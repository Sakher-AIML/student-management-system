document.addEventListener('DOMContentLoaded', function () {
    var demoRoot = document.getElementById('ssms-demo-root');
    if (!demoRoot) {
        runPhpPageHelpers();
        return;
    }

    var AUTH_KEY = 'SSMS_DEMO_AUTH';
    var DATA_KEY = 'SSMS_DEMO_DATA';

    var DEFAULT_SUBJECTS = [
        'Programming Fundamentals',
        'Database Management System',
        'Web Development Basics',
        'Mathematics for Computing'
    ];

    var DEFAULT_DATA = {
        students: [
            { id: 1, rollNo: 'CSE101', name: 'Aarav Sharma', course: 'BSc Computer Science', semester: 'Semester 1' },
            { id: 2, rollNo: 'CSE102', name: 'Diya Patel', course: 'BSc Computer Science', semester: 'Semester 1' },
            { id: 3, rollNo: 'CSE103', name: 'Rahul Verma', course: 'BSc Computer Science', semester: 'Semester 1' },
            { id: 4, rollNo: 'CSE104', name: 'Sneha Iyer', course: 'BSc Computer Science', semester: 'Semester 1' },
            { id: 5, rollNo: 'CSE105', name: 'Kabir Khan', course: 'BSc Computer Science', semester: 'Semester 1' }
        ],
        attendance: [
            { id: 101, studentId: 1, date: '2026-04-10', status: 'Present' },
            { id: 102, studentId: 2, date: '2026-04-10', status: 'Absent' },
            { id: 103, studentId: 3, date: '2026-04-10', status: 'Present' }
        ],
        marks: [
            { id: 201, studentId: 1, subject: 'Programming Fundamentals', examType: 'Internal-1', marksObtained: 86, maxMarks: 100 },
            { id: 202, studentId: 2, subject: 'Programming Fundamentals', examType: 'Internal-1', marksObtained: 74, maxMarks: 100 },
            { id: 203, studentId: 3, subject: 'Database Management System', examType: 'Internal-1', marksObtained: 91, maxMarks: 100 }
        ]
    };

    var state = loadState();

    var authView = document.getElementById('authView');
    var appView = document.getElementById('appView');
    var loginForm = document.getElementById('loginForm');
    var loginMessage = document.getElementById('loginMessage');
    var logoutBtn = document.getElementById('logoutBtn');
    var navLinks = document.querySelectorAll('.demo-nav-link');
    var pagePanels = document.querySelectorAll('[data-page-content]');

    var studentForm = document.getElementById('studentForm');
    var studentEditId = document.getElementById('studentEditId');
    var studentRollNo = document.getElementById('studentRollNo');
    var studentName = document.getElementById('studentName');
    var studentCourse = document.getElementById('studentCourse');
    var studentSemester = document.getElementById('studentSemester');
    var saveStudentBtn = document.getElementById('saveStudentBtn');
    var cancelEditStudentBtn = document.getElementById('cancelEditStudentBtn');

    var studentsTableBody = document.getElementById('studentsTableBody');
    var attendanceTableBody = document.getElementById('attendanceTableBody');
    var marksTableBody = document.getElementById('marksTableBody');

    var attendanceForm = document.getElementById('attendanceForm');
    var attendanceStudent = document.getElementById('attendanceStudent');
    var attendanceDate = document.getElementById('attendanceDate');
    var attendanceStatus = document.getElementById('attendanceStatus');

    var marksForm = document.getElementById('marksForm');
    var marksStudent = document.getElementById('marksStudent');
    var marksSubject = document.getElementById('marksSubject');
    var examType = document.getElementById('examType');
    var marksObtained = document.getElementById('marksObtained');
    var maxMarks = document.getElementById('maxMarks');

    var reportStudent = document.getElementById('reportStudent');
    var generateReportBtn = document.getElementById('generateReportBtn');
    var reportOutput = document.getElementById('reportOutput');

    var totalStudentsCard = document.getElementById('totalStudentsCard');
    var totalAttendanceCard = document.getElementById('totalAttendanceCard');
    var totalMarksCard = document.getElementById('totalMarksCard');
    var averageScoreCard = document.getElementById('averageScoreCard');
    var resetDemoDataBtn = document.getElementById('resetDemoDataBtn');

    initializeUI();

    function initializeUI() {
        populateSubjectSelect();
        renderAll();

        if (!attendanceDate.value) {
            attendanceDate.value = getTodayDate();
        }

        var isLoggedIn = localStorage.getItem(AUTH_KEY) === 'true';
        toggleAppView(isLoggedIn);
        if (isLoggedIn) {
            showPage('dashboard');
        }
    }

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var username = document.getElementById('username').value.trim();
        var password = document.getElementById('password').value.trim();

        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem(AUTH_KEY, 'true');
            loginMessage.textContent = '';
            loginForm.reset();
            toggleAppView(true);
            showPage('dashboard');
        } else {
            loginMessage.textContent = 'Invalid credentials. Try admin / admin123.';
            loginMessage.style.color = '#b91c1c';
        }
    });

    logoutBtn.addEventListener('click', function () {
        localStorage.setItem(AUTH_KEY, 'false');
        toggleAppView(false);
    });

    navLinks.forEach(function (button) {
        button.addEventListener('click', function () {
            showPage(button.getAttribute('data-page'));
        });
    });

    studentForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var editId = Number(studentEditId.value || 0);
        var rollNo = studentRollNo.value.trim();
        var name = studentName.value.trim();
        var course = studentCourse.value.trim();
        var semester = studentSemester.value.trim();

        if (!rollNo || !name || !course || !semester) {
            alert('Please fill all student fields.');
            return;
        }

        var duplicateRoll = state.students.some(function (student) {
            return student.rollNo.toLowerCase() === rollNo.toLowerCase() && student.id !== editId;
        });
        if (duplicateRoll) {
            alert('Roll number already exists. Please use a unique roll number.');
            return;
        }

        if (editId > 0) {
            var index = state.students.findIndex(function (student) {
                return student.id === editId;
            });
            if (index !== -1) {
                state.students[index].rollNo = rollNo;
                state.students[index].name = name;
                state.students[index].course = course;
                state.students[index].semester = semester;
            }
            alert('Student updated successfully.');
        } else {
            state.students.push({
                id: nextId(state.students),
                rollNo: rollNo,
                name: name,
                course: course,
                semester: semester
            });
            alert('Student added successfully.');
        }

        resetStudentForm();
        saveState();
        renderAll();
    });

    cancelEditStudentBtn.addEventListener('click', function () {
        resetStudentForm();
    });

    studentsTableBody.addEventListener('click', function (event) {
        var target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        var action = target.getAttribute('data-action');
        var id = Number(target.getAttribute('data-id'));
        if (!action || !id) {
            return;
        }

        if (action === 'edit-student') {
            var student = getStudentById(id);
            if (!student) {
                return;
            }

            studentEditId.value = String(student.id);
            studentRollNo.value = student.rollNo;
            studentName.value = student.name;
            studentCourse.value = student.course;
            studentSemester.value = student.semester;

            saveStudentBtn.textContent = 'Update Student';
            cancelEditStudentBtn.classList.remove('demo-hidden');
            showPage('students');
            return;
        }

        if (action === 'delete-student') {
            var shouldDelete = confirm('Delete this student and all related attendance and marks records?');
            if (!shouldDelete) {
                return;
            }

            state.students = state.students.filter(function (studentRow) {
                return studentRow.id !== id;
            });
            state.attendance = state.attendance.filter(function (row) {
                return row.studentId !== id;
            });
            state.marks = state.marks.filter(function (row) {
                return row.studentId !== id;
            });

            saveState();
            renderAll();
            reportOutput.innerHTML = '<p>Select a student and click Generate Report.</p>';
        }
    });

    attendanceForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var studentId = Number(attendanceStudent.value);
        var date = attendanceDate.value;
        var status = attendanceStatus.value;

        if (!studentId || !date || !status) {
            alert('Please fill all attendance fields.');
            return;
        }

        var existing = state.attendance.find(function (entry) {
            return entry.studentId === studentId && entry.date === date;
        });

        if (existing) {
            existing.status = status;
            alert('Attendance updated for selected date.');
        } else {
            state.attendance.push({
                id: nextId(state.attendance),
                studentId: studentId,
                date: date,
                status: status
            });
            alert('Attendance saved successfully.');
        }

        saveState();
        renderDashboard();
        renderAttendanceTable();
        attendanceForm.reset();
        attendanceDate.value = getTodayDate();
        attendanceStatus.value = 'Present';
    });

    attendanceTableBody.addEventListener('click', function (event) {
        var target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        if (target.getAttribute('data-action') !== 'delete-attendance') {
            return;
        }

        var id = Number(target.getAttribute('data-id'));
        if (!id) {
            return;
        }

        var shouldDelete = confirm('Delete this attendance entry?');
        if (!shouldDelete) {
            return;
        }

        state.attendance = state.attendance.filter(function (entry) {
            return entry.id !== id;
        });

        saveState();
        renderDashboard();
        renderAttendanceTable();
    });

    marksForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var studentId = Number(marksStudent.value);
        var subject = marksSubject.value;
        var exam = examType.value.trim();
        var obtained = Number(marksObtained.value);
        var total = Number(maxMarks.value);

        if (!studentId || !subject || !exam) {
            alert('Please fill all marks fields.');
            return;
        }

        if (obtained < 0 || total <= 0 || obtained > total) {
            alert('Marks should be between 0 and max marks.');
            return;
        }

        var existingMark = state.marks.find(function (entry) {
            return entry.studentId === studentId && entry.subject === subject && entry.examType.toLowerCase() === exam.toLowerCase();
        });

        if (existingMark) {
            existingMark.marksObtained = obtained;
            existingMark.maxMarks = total;
            alert('Marks updated for this exam.');
        } else {
            state.marks.push({
                id: nextId(state.marks),
                studentId: studentId,
                subject: subject,
                examType: exam,
                marksObtained: obtained,
                maxMarks: total
            });
            alert('Marks saved successfully.');
        }

        saveState();
        renderDashboard();
        renderMarksTable();
        marksForm.reset();
        examType.value = 'Internal-1';
        maxMarks.value = '100';
    });

    marksTableBody.addEventListener('click', function (event) {
        var target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        if (target.getAttribute('data-action') !== 'delete-marks') {
            return;
        }

        var id = Number(target.getAttribute('data-id'));
        if (!id) {
            return;
        }

        var shouldDelete = confirm('Delete this marks entry?');
        if (!shouldDelete) {
            return;
        }

        state.marks = state.marks.filter(function (entry) {
            return entry.id !== id;
        });

        saveState();
        renderDashboard();
        renderMarksTable();
    });

    generateReportBtn.addEventListener('click', function () {
        var studentId = Number(reportStudent.value);
        if (!studentId) {
            reportOutput.innerHTML = '<p>Please select a student first.</p>';
            return;
        }

        renderStudentReport(studentId);
    });

    resetDemoDataBtn.addEventListener('click', function () {
        var shouldReset = confirm('Reset all demo data to default sample values?');
        if (!shouldReset) {
            return;
        }

        state = clone(DEFAULT_DATA);
        saveState();
        resetStudentForm();
        renderAll();
        reportOutput.innerHTML = '<p>Data reset complete. Select a student and click Generate Report.</p>';
        alert('Demo data has been reset.');
    });

    function toggleAppView(isLoggedIn) {
        if (isLoggedIn) {
            authView.classList.add('demo-hidden');
            appView.classList.remove('demo-hidden');
        } else {
            appView.classList.add('demo-hidden');
            authView.classList.remove('demo-hidden');
        }
    }

    function showPage(pageName) {
        navLinks.forEach(function (btn) {
            btn.classList.toggle('demo-active', btn.getAttribute('data-page') === pageName);
        });

        pagePanels.forEach(function (panel) {
            var isTarget = panel.getAttribute('data-page-content') === pageName;
            panel.classList.toggle('demo-hidden', !isTarget);
        });
    }

    function renderAll() {
        populateStudentsSelects();
        renderDashboard();
        renderStudentsTable();
        renderAttendanceTable();
        renderMarksTable();
    }

    function renderDashboard() {
        totalStudentsCard.textContent = String(state.students.length);
        totalAttendanceCard.textContent = String(state.attendance.length);
        totalMarksCard.textContent = String(state.marks.length);

        if (state.marks.length === 0) {
            averageScoreCard.textContent = '0%';
            return;
        }

        var sumPercentage = 0;
        state.marks.forEach(function (entry) {
            sumPercentage += (entry.marksObtained / entry.maxMarks) * 100;
        });

        var average = sumPercentage / state.marks.length;
        averageScoreCard.textContent = average.toFixed(1) + '%';
    }

    function renderStudentsTable() {
        if (state.students.length === 0) {
            studentsTableBody.innerHTML = '<tr><td colspan="5">No students found.</td></tr>';
            return;
        }

        studentsTableBody.innerHTML = state.students
            .slice()
            .sort(function (a, b) {
                return a.rollNo.localeCompare(b.rollNo);
            })
            .map(function (student) {
                return '<tr>' +
                    '<td>' + escapeHtml(student.rollNo) + '</td>' +
                    '<td>' + escapeHtml(student.name) + '</td>' +
                    '<td>' + escapeHtml(student.course) + '</td>' +
                    '<td>' + escapeHtml(student.semester) + '</td>' +
                    '<td class="demo-inline-actions">' +
                        '<button type="button" class="demo-btn demo-btn-secondary demo-btn-mini" data-action="edit-student" data-id="' + student.id + '">Edit</button>' +
                        '<button type="button" class="demo-btn demo-btn-danger demo-btn-mini" data-action="delete-student" data-id="' + student.id + '">Delete</button>' +
                    '</td>' +
                '</tr>';
            }).join('');
    }

    function renderAttendanceTable() {
        if (state.attendance.length === 0) {
            attendanceTableBody.innerHTML = '<tr><td colspan="5">No attendance records found.</td></tr>';
            return;
        }

        attendanceTableBody.innerHTML = state.attendance
            .slice()
            .sort(function (a, b) {
                return b.id - a.id;
            })
            .map(function (entry) {
                var student = getStudentById(entry.studentId);
                var statusClass = entry.status === 'Present' ? 'demo-pill demo-pill-present' : 'demo-pill demo-pill-absent';

                return '<tr>' +
                    '<td>' + escapeHtml(entry.date) + '</td>' +
                    '<td>' + escapeHtml(student ? student.rollNo : '-') + '</td>' +
                    '<td>' + escapeHtml(student ? student.name : 'Unknown') + '</td>' +
                    '<td><span class="' + statusClass + '">' + escapeHtml(entry.status) + '</span></td>' +
                    '<td><button type="button" class="demo-btn demo-btn-danger demo-btn-mini" data-action="delete-attendance" data-id="' + entry.id + '">Delete</button></td>' +
                '</tr>';
            }).join('');
    }

    function renderMarksTable() {
        if (state.marks.length === 0) {
            marksTableBody.innerHTML = '<tr><td colspan="7">No marks records found.</td></tr>';
            return;
        }

        marksTableBody.innerHTML = state.marks
            .slice()
            .sort(function (a, b) {
                return b.id - a.id;
            })
            .map(function (entry) {
                var student = getStudentById(entry.studentId);
                var percent = (entry.marksObtained / entry.maxMarks) * 100;
                var grade = calculateGrade(percent);

                return '<tr>' +
                    '<td>' + escapeHtml(student ? student.rollNo : '-') + '</td>' +
                    '<td>' + escapeHtml(student ? student.name : 'Unknown') + '</td>' +
                    '<td>' + escapeHtml(entry.subject) + '</td>' +
                    '<td>' + escapeHtml(entry.examType) + '</td>' +
                    '<td>' + escapeHtml(String(entry.marksObtained)) + ' / ' + escapeHtml(String(entry.maxMarks)) + '</td>' +
                    '<td>' + grade + '</td>' +
                    '<td><button type="button" class="demo-btn demo-btn-danger demo-btn-mini" data-action="delete-marks" data-id="' + entry.id + '">Delete</button></td>' +
                '</tr>';
            }).join('');
    }

    function renderStudentReport(studentId) {
        var student = getStudentById(studentId);
        if (!student) {
            reportOutput.innerHTML = '<p>Student not found.</p>';
            return;
        }

        var attendanceRows = state.attendance.filter(function (entry) {
            return entry.studentId === studentId;
        });

        var marksRows = state.marks.filter(function (entry) {
            return entry.studentId === studentId;
        });

        var presentCount = attendanceRows.filter(function (entry) {
            return entry.status === 'Present';
        }).length;
        var absentCount = attendanceRows.length - presentCount;
        var attendancePercent = attendanceRows.length > 0 ? (presentCount / attendanceRows.length) * 100 : 0;

        var marksAvg = 0;
        if (marksRows.length > 0) {
            var totalPercent = 0;
            marksRows.forEach(function (entry) {
                totalPercent += (entry.marksObtained / entry.maxMarks) * 100;
            });
            marksAvg = totalPercent / marksRows.length;
        }

        var marksListHtml;
        if (marksRows.length === 0) {
            marksListHtml = '<p>No marks available.</p>';
        } else {
            marksListHtml = '<div class="demo-table-wrap"><table><thead><tr><th>Subject</th><th>Exam</th><th>Score</th><th>Grade</th></tr></thead><tbody>' +
                marksRows.map(function (entry) {
                    var percent = (entry.marksObtained / entry.maxMarks) * 100;
                    return '<tr><td>' + escapeHtml(entry.subject) + '</td><td>' + escapeHtml(entry.examType) + '</td><td>' +
                        escapeHtml(String(entry.marksObtained)) + ' / ' + escapeHtml(String(entry.maxMarks)) + '</td><td>' + calculateGrade(percent) + '</td></tr>';
                }).join('') +
                '</tbody></table></div>';
        }

        reportOutput.innerHTML = '' +
            '<h4>Student Summary</h4>' +
            '<div class="demo-report-grid">' +
                '<div><strong>Roll No:</strong><br>' + escapeHtml(student.rollNo) + '</div>' +
                '<div><strong>Name:</strong><br>' + escapeHtml(student.name) + '</div>' +
                '<div><strong>Course:</strong><br>' + escapeHtml(student.course) + '</div>' +
                '<div><strong>Semester:</strong><br>' + escapeHtml(student.semester) + '</div>' +
            '</div>' +
            '<h4>Attendance</h4>' +
            '<p>Total: ' + attendanceRows.length + ' | Present: ' + presentCount + ' | Absent: ' + absentCount + ' | Attendance: ' + attendancePercent.toFixed(1) + '%</p>' +
            '<h4>Marks</h4>' +
            '<p>Average Score: ' + marksAvg.toFixed(1) + '%</p>' +
            marksListHtml;
    }

    function populateStudentsSelects() {
        var options = ['<option value="">Select Student</option>']
            .concat(state.students.map(function (student) {
                return '<option value="' + student.id + '">' + escapeHtml(student.rollNo + ' - ' + student.name) + '</option>';
            }))
            .join('');

        attendanceStudent.innerHTML = options;
        marksStudent.innerHTML = options;
        reportStudent.innerHTML = options;
    }

    function populateSubjectSelect() {
        marksSubject.innerHTML = DEFAULT_SUBJECTS.map(function (subject) {
            return '<option value="' + escapeHtml(subject) + '">' + escapeHtml(subject) + '</option>';
        }).join('');
    }

    function getStudentById(studentId) {
        return state.students.find(function (student) {
            return student.id === studentId;
        }) || null;
    }

    function resetStudentForm() {
        studentEditId.value = '';
        studentForm.reset();
        saveStudentBtn.textContent = 'Add Student';
        cancelEditStudentBtn.classList.add('demo-hidden');
    }

    function calculateGrade(percent) {
        if (percent >= 90) {
            return 'A+';
        }
        if (percent >= 80) {
            return 'A';
        }
        if (percent >= 70) {
            return 'B';
        }
        if (percent >= 60) {
            return 'C';
        }
        if (percent >= 50) {
            return 'D';
        }
        return 'F';
    }

    function nextId(list) {
        if (!list || list.length === 0) {
            return 1;
        }

        var max = 0;
        list.forEach(function (item) {
            if (Number(item.id) > max) {
                max = Number(item.id);
            }
        });
        return max + 1;
    }

    function loadState() {
        var raw = localStorage.getItem(DATA_KEY);
        if (!raw) {
            var firstState = clone(DEFAULT_DATA);
            localStorage.setItem(DATA_KEY, JSON.stringify(firstState));
            return firstState;
        }

        try {
            var parsed = JSON.parse(raw);
            if (!parsed.students || !parsed.attendance || !parsed.marks) {
                throw new Error('Invalid data structure');
            }
            return parsed;
        } catch (error) {
            var fallbackState = clone(DEFAULT_DATA);
            localStorage.setItem(DATA_KEY, JSON.stringify(fallbackState));
            return fallbackState;
        }
    }

    function saveState() {
        localStorage.setItem(DATA_KEY, JSON.stringify(state));
    }

    function getTodayDate() {
        return new Date().toISOString().slice(0, 10);
    }

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function runPhpPageHelpers() {
        var forms = document.querySelectorAll('.needs-validation');
        forms.forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                    alert('Please fill all required fields correctly.');
                }
            });
        });

        var deleteButtons = document.querySelectorAll('.confirm-delete');
        deleteButtons.forEach(function (button) {
            button.addEventListener('click', function (event) {
                var ok = confirm('Are you sure you want to delete this record?');
                if (!ok) {
                    event.preventDefault();
                }
            });
        });
    }
});
