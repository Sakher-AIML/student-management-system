document.addEventListener('DOMContentLoaded', function () {
    var demoRoot = document.getElementById('ssms-demo-root');
    if (!demoRoot) {
        runPhpPageHelpers();
        return;
    }

    var AUTH_KEY = 'SSMS_DEMO_AUTH';
    var DATA_KEY = 'SSMS_DEMO_DATA';

    var DEFAULT_DATA = {
        subjects: [
            { id: 1, code: 'CS101', name: 'Programming Fundamentals' },
            { id: 2, code: 'CS102', name: 'Database Management System' },
            { id: 3, code: 'CS103', name: 'Web Development Basics' },
            { id: 4, code: 'CS104', name: 'Mathematics for Computing' }
        ],
        students: [
            { id: 1, rollNo: 'CSE101', name: 'Aarav Sharma', course: 'BSc Computer Science', semester: 'Semester 1' },
            { id: 2, rollNo: 'CSE102', name: 'Diya Patel', course: 'BSc Computer Science', semester: 'Semester 1' },
            { id: 3, rollNo: 'CSE103', name: 'Rahul Verma', course: 'BSc Computer Science', semester: 'Semester 1' }
        ],
        attendance: [
            { id: 101, studentId: 1, subjectId: 1, date: '2026-04-10', status: 'Present' },
            { id: 102, studentId: 2, subjectId: 1, date: '2026-04-10', status: 'Absent' },
            { id: 103, studentId: 3, subjectId: 2, date: '2026-04-10', status: 'Present' }
        ],
        marks: [
            { id: 201, studentId: 1, subjectId: 1, examType: 'Internal-1', marksObtained: 86, maxMarks: 100 },
            { id: 202, studentId: 2, subjectId: 1, examType: 'Internal-1', marksObtained: 74, maxMarks: 100 },
            { id: 203, studentId: 3, subjectId: 2, examType: 'Internal-1', marksObtained: 91, maxMarks: 100 }
        ]
    };

    var state = loadState();
    var notifyTimer = null;

    var authView = document.getElementById('authView');
    var appView = document.getElementById('appView');
    var notificationBox = document.getElementById('demoNotification');

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
    var studentSearchInput = document.getElementById('studentSearchInput');
    var clearStudentSearchBtn = document.getElementById('clearStudentSearchBtn');

    var subjectForm = document.getElementById('subjectForm');
    var subjectEditId = document.getElementById('subjectEditId');
    var subjectCode = document.getElementById('subjectCode');
    var subjectName = document.getElementById('subjectName');
    var saveSubjectBtn = document.getElementById('saveSubjectBtn');
    var cancelEditSubjectBtn = document.getElementById('cancelEditSubjectBtn');

    var studentsTableBody = document.getElementById('studentsTableBody');
    var subjectsTableBody = document.getElementById('subjectsTableBody');
    var attendanceTableBody = document.getElementById('attendanceTableBody');
    var marksTableBody = document.getElementById('marksTableBody');

    var attendanceForm = document.getElementById('attendanceForm');
    var attendanceStudent = document.getElementById('attendanceStudent');
    var attendanceSubject = document.getElementById('attendanceSubject');
    var attendanceDate = document.getElementById('attendanceDate');
    var attendanceStatus = document.getElementById('attendanceStatus');

    var marksForm = document.getElementById('marksForm');
    var marksStudent = document.getElementById('marksStudent');
    var marksSubject = document.getElementById('marksSubject');
    var examType = document.getElementById('examType');
    var marksObtained = document.getElementById('marksObtained');
    var maxMarks = document.getElementById('maxMarks');
    var marksGradePreview = document.getElementById('marksGradePreview');

    var reportStudent = document.getElementById('reportStudent');
    var generateReportBtn = document.getElementById('generateReportBtn');
    var printReportBtn = document.getElementById('printReportBtn');
    var exportReportCsvBtn = document.getElementById('exportReportCsvBtn');
    var reportOutput = document.getElementById('reportOutput');

    var exportDataBtn = document.getElementById('exportDataBtn');
    var importDataInput = document.getElementById('importDataInput');
    var importDataBtn = document.getElementById('importDataBtn');

    var totalStudentsCard = document.getElementById('totalStudentsCard');
    var totalSubjectsCard = document.getElementById('totalSubjectsCard');
    var totalAttendanceCard = document.getElementById('totalAttendanceCard');
    var totalMarksCard = document.getElementById('totalMarksCard');
    var averageScoreCard = document.getElementById('averageScoreCard');
    var passRateCard = document.getElementById('passRateCard');
    var resetDemoDataBtn = document.getElementById('resetDemoDataBtn');

    initializeUI();
    bindEvents();

    function initializeUI() {
        attendanceDate.value = getTodayDate();
        updateMarksGradePreview();
        renderAll();

        var isLoggedIn = localStorage.getItem(AUTH_KEY) === 'true';
        toggleAppView(isLoggedIn);
        if (isLoggedIn) {
            showPage('dashboard');
        }
    }

    function bindEvents() {
        loginForm.addEventListener('submit', onLoginSubmit);
        logoutBtn.addEventListener('click', onLogout);

        navLinks.forEach(function (button) {
            button.addEventListener('click', function () {
                showPage(button.getAttribute('data-page'));
            });
        });

        studentForm.addEventListener('submit', onStudentSubmit);
        cancelEditStudentBtn.addEventListener('click', resetStudentForm);
        clearStudentSearchBtn.addEventListener('click', function () {
            studentSearchInput.value = '';
            renderStudentsTable();
        });
        studentSearchInput.addEventListener('input', renderStudentsTable);

        subjectForm.addEventListener('submit', onSubjectSubmit);
        cancelEditSubjectBtn.addEventListener('click', resetSubjectForm);

        studentsTableBody.addEventListener('click', onStudentTableAction);
        subjectsTableBody.addEventListener('click', onSubjectTableAction);

        attendanceForm.addEventListener('submit', onAttendanceSubmit);
        attendanceTableBody.addEventListener('click', onAttendanceTableAction);

        marksForm.addEventListener('submit', onMarksSubmit);
        marksTableBody.addEventListener('click', onMarksTableAction);
        marksObtained.addEventListener('input', updateMarksGradePreview);
        maxMarks.addEventListener('input', updateMarksGradePreview);

        generateReportBtn.addEventListener('click', function () {
            var studentId = Number(reportStudent.value);
            if (!studentId) {
                reportOutput.innerHTML = '<p>Please select a student first.</p>';
                return;
            }
            renderStudentReport(studentId);
        });

        printReportBtn.addEventListener('click', function () {
            window.print();
        });

        exportReportCsvBtn.addEventListener('click', function () {
            var studentId = Number(reportStudent.value);
            if (!studentId) {
                notify('Select a student to export report.', 'error');
                return;
            }
            exportStudentReportCsv(studentId);
        });

        exportDataBtn.addEventListener('click', function () {
            downloadTextFile('ssms-demo-backup.json', JSON.stringify(state, null, 2), 'application/json');
            notify('Backup exported successfully.', 'success');
        });

        importDataBtn.addEventListener('click', function () {
            if (!importDataInput.files || importDataInput.files.length === 0) {
                notify('Choose a JSON backup file first.', 'error');
                return;
            }

            var file = importDataInput.files[0];
            var reader = new FileReader();
            reader.onload = function () {
                try {
                    var parsed = JSON.parse(String(reader.result || '{}'));
                    state = normalizeState(parsed);
                    saveState();
                    resetStudentForm();
                    resetSubjectForm();
                    renderAll();
                    reportOutput.innerHTML = '<p>Backup imported successfully. Select a student and click Generate Report.</p>';
                    notify('Backup imported successfully.', 'success');
                } catch (error) {
                    notify('Invalid JSON backup file.', 'error');
                }
            };
            reader.readAsText(file);
        });

        resetDemoDataBtn.addEventListener('click', function () {
            var shouldReset = confirm('Reset all demo data to default sample values?');
            if (!shouldReset) {
                return;
            }

            state = normalizeState(clone(DEFAULT_DATA));
            saveState();
            resetStudentForm();
            resetSubjectForm();
            renderAll();
            reportOutput.innerHTML = '<p>Data reset complete. Select a student and click Generate Report.</p>';
            notify('Demo data has been reset.', 'success');
        });
    }

    function onLoginSubmit(event) {
        event.preventDefault();
        var username = document.getElementById('username').value.trim();
        var password = document.getElementById('password').value.trim();

        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem(AUTH_KEY, 'true');
            loginMessage.textContent = '';
            loginForm.reset();
            toggleAppView(true);
            showPage('dashboard');
            notify('Welcome back, admin.', 'success');
            return;
        }

        loginMessage.textContent = 'Invalid credentials. Try admin / admin123.';
        loginMessage.style.color = '#b91c1c';
    }

    function onLogout() {
        localStorage.setItem(AUTH_KEY, 'false');
        toggleAppView(false);
    }

    function onStudentSubmit(event) {
        event.preventDefault();

        var editId = Number(studentEditId.value || 0);
        var rollNo = studentRollNo.value.trim();
        var name = studentName.value.trim();
        var course = studentCourse.value.trim();
        var semester = studentSemester.value.trim();

        if (!rollNo || !name || !course || !semester) {
            notify('Please fill all student fields.', 'error');
            return;
        }

        var duplicateRoll = state.students.some(function (student) {
            return student.rollNo.toLowerCase() === rollNo.toLowerCase() && student.id !== editId;
        });
        if (duplicateRoll) {
            notify('Roll number already exists.', 'error');
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
                notify('Student updated successfully.', 'success');
            }
        } else {
            state.students.push({
                id: nextId(state.students),
                rollNo: rollNo,
                name: name,
                course: course,
                semester: semester
            });
            notify('Student added successfully.', 'success');
        }

        resetStudentForm();
        saveState();
        renderAll();
    }

    function onSubjectSubmit(event) {
        event.preventDefault();

        var editId = Number(subjectEditId.value || 0);
        var code = subjectCode.value.trim().toUpperCase();
        var name = subjectName.value.trim();

        if (!code || !name) {
            notify('Please fill all subject fields.', 'error');
            return;
        }

        var duplicateCode = state.subjects.some(function (subject) {
            return subject.code.toLowerCase() === code.toLowerCase() && subject.id !== editId;
        });
        if (duplicateCode) {
            notify('Subject code already exists.', 'error');
            return;
        }

        if (editId > 0) {
            var index = state.subjects.findIndex(function (subject) {
                return subject.id === editId;
            });
            if (index !== -1) {
                state.subjects[index].code = code;
                state.subjects[index].name = name;
                notify('Subject updated successfully.', 'success');
            }
        } else {
            state.subjects.push({
                id: nextId(state.subjects),
                code: code,
                name: name
            });
            notify('Subject added successfully.', 'success');
        }

        resetSubjectForm();
        saveState();
        renderAll();
    }

    function onStudentTableAction(event) {
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
            var shouldDelete = confirm('Delete this student and all related records?');
            if (!shouldDelete) {
                return;
            }

            state.students = state.students.filter(function (student) {
                return student.id !== id;
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
            notify('Student deleted successfully.', 'success');
        }
    }

    function onSubjectTableAction(event) {
        var target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        var action = target.getAttribute('data-action');
        var id = Number(target.getAttribute('data-id'));
        if (!action || !id) {
            return;
        }

        if (action === 'edit-subject') {
            var subject = getSubjectById(id);
            if (!subject) {
                return;
            }

            subjectEditId.value = String(subject.id);
            subjectCode.value = subject.code;
            subjectName.value = subject.name;
            saveSubjectBtn.textContent = 'Update Subject';
            cancelEditSubjectBtn.classList.remove('demo-hidden');
            showPage('subjects');
            return;
        }

        if (action === 'delete-subject') {
            var shouldDelete = confirm('Delete this subject and all related attendance/marks records?');
            if (!shouldDelete) {
                return;
            }

            state.subjects = state.subjects.filter(function (subject) {
                return subject.id !== id;
            });
            state.attendance = state.attendance.filter(function (row) {
                return row.subjectId !== id;
            });
            state.marks = state.marks.filter(function (row) {
                return row.subjectId !== id;
            });

            saveState();
            renderAll();
            notify('Subject deleted successfully.', 'success');
        }
    }

    function onAttendanceSubmit(event) {
        event.preventDefault();

        var studentId = Number(attendanceStudent.value);
        var subjectId = Number(attendanceSubject.value);
        var date = attendanceDate.value;
        var status = attendanceStatus.value;

        if (!studentId || !subjectId || !date || !status) {
            notify('Please fill all attendance fields.', 'error');
            return;
        }

        var existing = state.attendance.find(function (entry) {
            return entry.studentId === studentId && entry.subjectId === subjectId && entry.date === date;
        });

        if (existing) {
            existing.status = status;
            notify('Attendance updated for selected date.', 'success');
        } else {
            state.attendance.push({
                id: nextId(state.attendance),
                studentId: studentId,
                subjectId: subjectId,
                date: date,
                status: status
            });
            notify('Attendance saved successfully.', 'success');
        }

        saveState();
        renderDashboard();
        renderAttendanceTable();
        attendanceForm.reset();
        attendanceDate.value = getTodayDate();
        attendanceStatus.value = 'Present';
    }

    function onAttendanceTableAction(event) {
        var target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        var action = target.getAttribute('data-action');
        var id = Number(target.getAttribute('data-id'));
        if (!action || !id) {
            return;
        }

        if (action === 'toggle-attendance') {
            var row = state.attendance.find(function (entry) {
                return entry.id === id;
            });
            if (!row) {
                return;
            }

            row.status = row.status === 'Present' ? 'Absent' : 'Present';
            saveState();
            renderDashboard();
            renderAttendanceTable();
            notify('Attendance status changed.', 'success');
            return;
        }

        if (action === 'delete-attendance') {
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
            notify('Attendance entry deleted.', 'success');
        }
    }

    function onMarksSubmit(event) {
        event.preventDefault();

        var studentId = Number(marksStudent.value);
        var subjectId = Number(marksSubject.value);
        var exam = examType.value.trim();
        var obtained = Number(marksObtained.value);
        var total = Number(maxMarks.value);

        if (!studentId || !subjectId || !exam) {
            notify('Please fill all marks fields.', 'error');
            return;
        }

        if (obtained < 0 || total <= 0 || obtained > total) {
            notify('Marks should be between 0 and max marks.', 'error');
            return;
        }

        var existingMark = state.marks.find(function (entry) {
            return entry.studentId === studentId && entry.subjectId === subjectId && entry.examType.toLowerCase() === exam.toLowerCase();
        });

        if (existingMark) {
            existingMark.marksObtained = obtained;
            existingMark.maxMarks = total;
            notify('Marks updated for this exam.', 'success');
        } else {
            state.marks.push({
                id: nextId(state.marks),
                studentId: studentId,
                subjectId: subjectId,
                examType: exam,
                marksObtained: obtained,
                maxMarks: total
            });
            notify('Marks saved successfully.', 'success');
        }

        saveState();
        renderDashboard();
        renderMarksTable();
        marksForm.reset();
        examType.value = 'Internal-1';
        maxMarks.value = '100';
        updateMarksGradePreview();
    }

    function onMarksTableAction(event) {
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
        notify('Marks entry deleted.', 'success');
    }

    function updateMarksGradePreview() {
        var obtained = Number(marksObtained.value || 0);
        var total = Number(maxMarks.value || 0);

        if (total <= 0 || obtained < 0 || obtained > total) {
            marksGradePreview.value = '-';
            return;
        }

        var percent = (obtained / total) * 100;
        marksGradePreview.value = calculateGrade(percent);
    }

    function exportStudentReportCsv(studentId) {
        var student = getStudentById(studentId);
        if (!student) {
            notify('Student not found.', 'error');
            return;
        }

        var attendanceRows = state.attendance.filter(function (entry) {
            return entry.studentId === studentId;
        });

        var marksRows = state.marks.filter(function (entry) {
            return entry.studentId === studentId;
        });

        var csvLines = [
            'Section,Field,Value',
            'Student,Roll No,"' + csvEscape(student.rollNo) + '"',
            'Student,Name,"' + csvEscape(student.name) + '"',
            'Student,Course,"' + csvEscape(student.course) + '"',
            'Student,Semester,"' + csvEscape(student.semester) + '"',
            ''
        ];

        csvLines.push('Attendance,Date,Subject,Status');
        if (attendanceRows.length === 0) {
            csvLines.push('Attendance,N/A,N/A,N/A');
        } else {
            attendanceRows.forEach(function (row) {
                var subject = getSubjectById(row.subjectId);
                csvLines.push('Attendance,' + csvEscape(row.date) + ',"' + csvEscape(subject ? subject.name : '-') + '",' + csvEscape(row.status));
            });
        }

        csvLines.push('');
        csvLines.push('Marks,Subject,Exam,Score,Grade');
        if (marksRows.length === 0) {
            csvLines.push('Marks,N/A,N/A,N/A,N/A');
        } else {
            marksRows.forEach(function (row) {
                var percent = (row.marksObtained / row.maxMarks) * 100;
                var subject = getSubjectById(row.subjectId);
                csvLines.push('Marks,"' + csvEscape(subject ? subject.name : '-') + '","' + csvEscape(row.examType) + '","' + row.marksObtained + ' / ' + row.maxMarks + '",' + calculateGrade(percent));
            });
        }

        downloadTextFile('student-report-' + student.rollNo + '.csv', csvLines.join('\n'), 'text/csv');
        notify('Student report exported as CSV.', 'success');
    }

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
        populateSubjectsSelects();
        renderDashboard();
        renderStudentsTable();
        renderSubjectsTable();
        renderAttendanceTable();
        renderMarksTable();
    }

    function renderDashboard() {
        totalStudentsCard.textContent = String(state.students.length);
        totalSubjectsCard.textContent = String(state.subjects.length);
        totalAttendanceCard.textContent = String(state.attendance.length);
        totalMarksCard.textContent = String(state.marks.length);

        if (state.marks.length === 0) {
            averageScoreCard.textContent = '0%';
            passRateCard.textContent = '0%';
            return;
        }

        var sumPercentage = 0;
        var passCount = 0;

        state.marks.forEach(function (entry) {
            var percent = (entry.marksObtained / entry.maxMarks) * 100;
            sumPercentage += percent;
            if (percent >= 50) {
                passCount += 1;
            }
        });

        averageScoreCard.textContent = (sumPercentage / state.marks.length).toFixed(1) + '%';
        passRateCard.textContent = ((passCount / state.marks.length) * 100).toFixed(1) + '%';
    }

    function renderStudentsTable() {
        var query = (studentSearchInput.value || '').trim().toLowerCase();
        var filtered = state.students.filter(function (student) {
            if (!query) {
                return true;
            }

            var joined = (student.rollNo + ' ' + student.name + ' ' + student.course + ' ' + student.semester).toLowerCase();
            return joined.indexOf(query) !== -1;
        });

        if (filtered.length === 0) {
            studentsTableBody.innerHTML = '<tr><td colspan="5">No students found.</td></tr>';
            return;
        }

        studentsTableBody.innerHTML = filtered
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

    function renderSubjectsTable() {
        if (state.subjects.length === 0) {
            subjectsTableBody.innerHTML = '<tr><td colspan="3">No subjects found.</td></tr>';
            return;
        }

        subjectsTableBody.innerHTML = state.subjects
            .slice()
            .sort(function (a, b) {
                return a.code.localeCompare(b.code);
            })
            .map(function (subject) {
                return '<tr>' +
                    '<td>' + escapeHtml(subject.code) + '</td>' +
                    '<td>' + escapeHtml(subject.name) + '</td>' +
                    '<td class="demo-inline-actions">' +
                        '<button type="button" class="demo-btn demo-btn-secondary demo-btn-mini" data-action="edit-subject" data-id="' + subject.id + '">Edit</button>' +
                        '<button type="button" class="demo-btn demo-btn-danger demo-btn-mini" data-action="delete-subject" data-id="' + subject.id + '">Delete</button>' +
                    '</td>' +
                '</tr>';
            }).join('');
    }

    function renderAttendanceTable() {
        if (state.attendance.length === 0) {
            attendanceTableBody.innerHTML = '<tr><td colspan="6">No attendance records found.</td></tr>';
            return;
        }

        attendanceTableBody.innerHTML = state.attendance
            .slice()
            .sort(function (a, b) {
                return b.id - a.id;
            })
            .map(function (entry) {
                var student = getStudentById(entry.studentId);
                var subject = getSubjectById(entry.subjectId);
                var statusClass = entry.status === 'Present' ? 'demo-pill demo-pill-present' : 'demo-pill demo-pill-absent';

                return '<tr>' +
                    '<td>' + escapeHtml(entry.date) + '</td>' +
                    '<td>' + escapeHtml(student ? student.rollNo : '-') + '</td>' +
                    '<td>' + escapeHtml(student ? student.name : 'Unknown') + '</td>' +
                    '<td>' + escapeHtml(subject ? subject.name : '-') + '</td>' +
                    '<td><span class="' + statusClass + '">' + escapeHtml(entry.status) + '</span></td>' +
                    '<td class="demo-inline-actions">' +
                        '<button type="button" class="demo-btn demo-btn-secondary demo-btn-mini" data-action="toggle-attendance" data-id="' + entry.id + '">Toggle</button>' +
                        '<button type="button" class="demo-btn demo-btn-danger demo-btn-mini" data-action="delete-attendance" data-id="' + entry.id + '">Delete</button>' +
                    '</td>' +
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
                var subject = getSubjectById(entry.subjectId);
                var percent = (entry.marksObtained / entry.maxMarks) * 100;

                return '<tr>' +
                    '<td>' + escapeHtml(student ? student.rollNo : '-') + '</td>' +
                    '<td>' + escapeHtml(student ? student.name : 'Unknown') + '</td>' +
                    '<td>' + escapeHtml(subject ? subject.name : '-') + '</td>' +
                    '<td>' + escapeHtml(entry.examType) + '</td>' +
                    '<td>' + escapeHtml(String(entry.marksObtained)) + ' / ' + escapeHtml(String(entry.maxMarks)) + '</td>' +
                    '<td>' + calculateGrade(percent) + '</td>' +
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
                    var subject = getSubjectById(entry.subjectId);
                    var percent = (entry.marksObtained / entry.maxMarks) * 100;
                    return '<tr><td>' + escapeHtml(subject ? subject.name : '-') + '</td><td>' + escapeHtml(entry.examType) + '</td><td>' +
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

    function populateSubjectsSelects() {
        var options = ['<option value="">Select Subject</option>']
            .concat(state.subjects.map(function (subject) {
                return '<option value="' + subject.id + '">' + escapeHtml(subject.code + ' - ' + subject.name) + '</option>';
            }))
            .join('');

        attendanceSubject.innerHTML = options;
        marksSubject.innerHTML = options;
    }

    function getStudentById(studentId) {
        return state.students.find(function (student) {
            return student.id === studentId;
        }) || null;
    }

    function getSubjectById(subjectId) {
        return state.subjects.find(function (subject) {
            return subject.id === subjectId;
        }) || null;
    }

    function resetStudentForm() {
        studentEditId.value = '';
        studentForm.reset();
        saveStudentBtn.textContent = 'Add Student';
        cancelEditStudentBtn.classList.add('demo-hidden');
    }

    function resetSubjectForm() {
        subjectEditId.value = '';
        subjectForm.reset();
        saveSubjectBtn.textContent = 'Add Subject';
        cancelEditSubjectBtn.classList.add('demo-hidden');
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
            var currentId = Number(item.id || 0);
            if (currentId > max) {
                max = currentId;
            }
        });
        return max + 1;
    }

    function normalizeState(raw) {
        var normalized = {
            students: [],
            subjects: [],
            attendance: [],
            marks: []
        };

        var safeRaw = raw && typeof raw === 'object' ? raw : {};

        normalized.students = Array.isArray(safeRaw.students) ? safeRaw.students.map(function (row, index) {
            return {
                id: Number(row.id || index + 1),
                rollNo: String(row.rollNo || ('STU' + (index + 1))).trim(),
                name: String(row.name || 'Unknown Student').trim(),
                course: String(row.course || 'N/A').trim(),
                semester: String(row.semester || 'N/A').trim()
            };
        }) : clone(DEFAULT_DATA.students);

        if (normalized.students.length === 0) {
            normalized.students = clone(DEFAULT_DATA.students);
        }

        normalized.subjects = Array.isArray(safeRaw.subjects) ? safeRaw.subjects.map(function (row, index) {
            return {
                id: Number(row.id || index + 1),
                code: String(row.code || ('SUB' + (index + 1))).trim().toUpperCase(),
                name: String(row.name || 'Unnamed Subject').trim()
            };
        }) : clone(DEFAULT_DATA.subjects);

        if (normalized.subjects.length === 0) {
            normalized.subjects = clone(DEFAULT_DATA.subjects);
        }

        function ensureSubjectFromName(name) {
            var cleanName = String(name || '').trim();
            if (!cleanName) {
                return normalized.subjects[0].id;
            }

            var existing = normalized.subjects.find(function (subject) {
                return subject.name.toLowerCase() === cleanName.toLowerCase();
            });

            if (existing) {
                return existing.id;
            }

            var newSubject = {
                id: nextId(normalized.subjects),
                code: ('SUB' + (normalized.subjects.length + 1)).toUpperCase(),
                name: cleanName
            };
            normalized.subjects.push(newSubject);
            return newSubject.id;
        }

        normalized.attendance = Array.isArray(safeRaw.attendance) ? safeRaw.attendance.map(function (row, index) {
            var mappedSubjectId = Number(row.subjectId || 0);
            if (!mappedSubjectId) {
                mappedSubjectId = ensureSubjectFromName(row.subject || '');
            }

            return {
                id: Number(row.id || index + 1),
                studentId: Number(row.studentId || 0),
                subjectId: mappedSubjectId,
                date: String(row.date || getTodayDate()).slice(0, 10),
                status: row.status === 'Absent' ? 'Absent' : 'Present'
            };
        }).filter(function (row) {
            return !!getStudentByList(normalized.students, row.studentId) && !!getSubjectByList(normalized.subjects, row.subjectId);
        }) : clone(DEFAULT_DATA.attendance);

        normalized.marks = Array.isArray(safeRaw.marks) ? safeRaw.marks.map(function (row, index) {
            var mappedSubjectId = Number(row.subjectId || 0);
            if (!mappedSubjectId) {
                mappedSubjectId = ensureSubjectFromName(row.subject || '');
            }

            var obtained = Number(row.marksObtained || 0);
            var total = Number(row.maxMarks || 100);

            return {
                id: Number(row.id || index + 1),
                studentId: Number(row.studentId || 0),
                subjectId: mappedSubjectId,
                examType: String(row.examType || 'Internal-1').trim(),
                marksObtained: obtained,
                maxMarks: total > 0 ? total : 100
            };
        }).filter(function (row) {
            return !!getStudentByList(normalized.students, row.studentId) && !!getSubjectByList(normalized.subjects, row.subjectId);
        }) : clone(DEFAULT_DATA.marks);

        return normalized;
    }

    function loadState() {
        var raw = localStorage.getItem(DATA_KEY);
        if (!raw) {
            var firstState = normalizeState(clone(DEFAULT_DATA));
            localStorage.setItem(DATA_KEY, JSON.stringify(firstState));
            return firstState;
        }

        try {
            var parsed = JSON.parse(raw);
            return normalizeState(parsed);
        } catch (error) {
            var fallbackState = normalizeState(clone(DEFAULT_DATA));
            localStorage.setItem(DATA_KEY, JSON.stringify(fallbackState));
            return fallbackState;
        }
    }

    function saveState() {
        localStorage.setItem(DATA_KEY, JSON.stringify(state));
    }

    function notify(message, type) {
        if (!notificationBox) {
            return;
        }

        notificationBox.textContent = message;
        notificationBox.classList.remove('demo-hidden', 'demo-notify-success', 'demo-notify-error');
        notificationBox.classList.add(type === 'error' ? 'demo-notify-error' : 'demo-notify-success');

        if (notifyTimer) {
            clearTimeout(notifyTimer);
        }

        notifyTimer = setTimeout(function () {
            notificationBox.classList.add('demo-hidden');
        }, 2500);
    }

    function getTodayDate() {
        return new Date().toISOString().slice(0, 10);
    }

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function downloadTextFile(filename, content, mimeType) {
        var blob = new Blob([content], { type: mimeType || 'text/plain' });
        var url = URL.createObjectURL(blob);
        var anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    }

    function csvEscape(value) {
        return String(value || '').replace(/"/g, '""');
    }

    function getStudentByList(students, studentId) {
        return students.find(function (student) {
            return student.id === studentId;
        }) || null;
    }

    function getSubjectByList(subjects, subjectId) {
        return subjects.find(function (subject) {
            return subject.id === subjectId;
        }) || null;
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
