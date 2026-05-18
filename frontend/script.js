/* ════════════════════════════════════════════════════════════════════════════
   SMARTGRADE v2 — script.js
   All roles: principal (monitor-only), teacher/admin (full access)
   ════════════════════════════════════════════════════════════════════════════ */

/* ─── DepEd Subjects per Grade ─────────────────────────────────────────────── */
const SUBJECTS_BY_GRADE = {
  'Grade 1': ['Filipino','English','Mathematics','Araling Panlipunan','MAPEH','EsP','MTB-MLE'],
  'Grade 2': ['Filipino','English','Mathematics','Araling Panlipunan','MAPEH','EsP','MTB-MLE'],
  'Grade 3': ['Filipino','English','Mathematics','Science','Araling Panlipunan','MAPEH','EsP'],
};
const ALL_SUBJECTS = ['Filipino','English','Mathematics','Science','Araling Panlipunan','MAPEH','EsP','MTB-MLE'];
const QUARTERS = ['Q1','Q2','Q3','Q4'];

/* ─── Honors thresholds (DepEd Order No. 8 s.2015 style) ───────────────────── */
function getHonors(avg) {
  if (avg >= 98) return { label:'With Highest Honors', cls:'honors-highest', icon:'🏆' };
  if (avg >= 95) return { label:'With High Honors',    cls:'honors-high',    icon:'🥇' };
  if (avg >= 90) return { label:'With Honors',         cls:'honors',         icon:'🥈' };
  return null;
}

/* ════════════════════════════════════════════════════════════════════════════
   STATE
   ════════════════════════════════════════════════════════════════════════════ */
const STATE = {
  currentUser: null,
  activeNav: '',

  /* Pending teacher registrations (awaiting principal approval) */
  pendingTeachers: [
    { id:'PT001', name:'Ms. Ana Valdez', email:'avaldez@school.edu', phone:'09301234567',
      grade:'Grade 1', section:'Sampaguita', password:'password123',
      appliedDate:'2025-01-20', status:'pending' },
  ],

  teachers: [
    { id:'T001', name:'Ms. Maria Santos',  email:'teacher@smartgrade.edu', phone:'09171111111',
      grade:'Grade 1', section:'Sampaguita', subjects:'All Subjects', status:'active',
      joined:'2020-06-01', password:'password123' },
    { id:'T002', name:'Mr. Pedro Reyes',   email:'preyes@smartgrade.edu',  phone:'09182222222',
      grade:'Grade 2', section:'Rosal',      subjects:'All Subjects', status:'active',
      joined:'2019-06-01', password:'password123' },
    { id:'T003', name:'Ms. Carmen Lim',    email:'clim@smartgrade.edu',    phone:'09193333333',
      grade:'Grade 3', section:'Gumamela',   subjects:'All Subjects', status:'active',
      joined:'2021-06-01', password:'password123' },
  ],

  students: [
    { id:'S001', lrn:'100200300001', name:'Maria Reyes',        grade:'Grade 1', section:'Sampaguita', gender:'F', teacherId:'T001', parentId:'P001', contact:'09171234567', status:'active', enrolled:'2024-06-01' },
    { id:'S002', lrn:'100200300002', name:'Juan Gomez',         grade:'Grade 1', section:'Sampaguita', gender:'M', teacherId:'T001', parentId:'P002', contact:'09182345678', status:'active', enrolled:'2024-06-01' },
    { id:'S003', lrn:'100200300003', name:'Jose Dela Cruz Jr.', grade:'Grade 1', section:'Sampaguita', gender:'M', teacherId:'T001', parentId:'P003', contact:'09193456789', status:'active', enrolled:'2024-06-01' },
    { id:'S004', lrn:'100200300004', name:'Ana Santos',         grade:'Grade 2', section:'Rosal',      gender:'F', teacherId:'T002', parentId:'P004', contact:'09204567890', status:'active', enrolled:'2024-06-01' },
    { id:'S005', lrn:'100200300005', name:'Pedro Lim',          grade:'Grade 2', section:'Rosal',      gender:'M', teacherId:'T002', parentId:'P005', contact:'09215678901', status:'active', enrolled:'2024-06-01' },
    { id:'S006', lrn:'100200300006', name:'Sofia Torres',       grade:'Grade 2', section:'Rosal',      gender:'F', teacherId:'T002', parentId:'P006', contact:'09226789012', status:'active', enrolled:'2024-06-01' },
    { id:'S007', lrn:'100200300007', name:'Carlo Ramos',        grade:'Grade 3', section:'Gumamela',   gender:'M', teacherId:'T003', parentId:'P007', contact:'09237890123', status:'active', enrolled:'2024-06-01' },
    { id:'S008', lrn:'100200300008', name:'Lisa Tan',           grade:'Grade 3', section:'Gumamela',   gender:'F', teacherId:'T003', parentId:'P008', contact:'09248901234', status:'active', enrolled:'2024-06-01' },
    { id:'S009', lrn:'100200300009', name:'Marco Cruz',         grade:'Grade 3', section:'Gumamela',   gender:'M', teacherId:'T003', parentId:'P009', contact:'09259012345', status:'active', enrolled:'2024-06-01' },
    { id:'S010', lrn:'100200300010', name:'Nina Bautista',      grade:'Grade 3', section:'Gumamela',   gender:'F', teacherId:'T003', parentId:'P010', contact:'09260123456', status:'active', enrolled:'2024-06-01' },
  ],

  parents: [
    { id:'P001', name:'Mrs. Liza Reyes',    email:'lreyes@gmail.com',  phone:'09171234567', childId:'S001', addedBy:'T001' },
    { id:'P002', name:'Mr. Carlos Gomez',   email:'cgomez@gmail.com',  phone:'09182345678', childId:'S002', addedBy:'T001' },
    { id:'P003', name:'Mr. Juan Dela Cruz', email:'parent@gmail.com',  phone:'09193456789', childId:'S003', addedBy:'T001' },
    { id:'P004', name:'Mrs. Rosa Santos',   email:'rsantos@gmail.com', phone:'09204567890', childId:'S004', addedBy:'T002' },
    { id:'P005', name:'Ms. Aileen Lim',     email:'alim@gmail.com',    phone:'09215678901', childId:'S005', addedBy:'T002' },
    { id:'P006', name:'Mr. Bobby Torres',   email:'btorres@gmail.com', phone:'09226789012', childId:'S006', addedBy:'T002' },
    { id:'P007', name:'Mrs. Nena Ramos',    email:'nramos@gmail.com',  phone:'09237890123', childId:'S007', addedBy:'T003' },
    { id:'P008', name:'Mr. Anthony Tan',    email:'atan@gmail.com',    phone:'09248901234', childId:'S008', addedBy:'T003' },
    { id:'P009', name:'Mrs. Paz Cruz',      email:'pcruz@gmail.com',   phone:'09259012345', childId:'S009', addedBy:'T003' },
    { id:'P010', name:'Mr. Leo Bautista',   email:'lbautista@gmail.com',phone:'09260123456',childId:'S010', addedBy:'T003' },
  ],

  /* grades[studentId][subject] = [q1,q2,q3,q4] */
  grades: {
    S001:{ Filipino:[88,90,87,91], English:[85,88,82,87], Mathematics:[88,92,85,90], 'Araling Panlipunan':[88,85,89,87], MAPEH:[90,88,92,91], EsP:[92,90,88,93], 'MTB-MLE':[89,91,87,90] },
    S002:{ Filipino:[78,80,76,81], English:[70,73,68,75], Mathematics:[75,78,72,80], 'Araling Panlipunan':[77,75,80,78], MAPEH:[80,78,82,79], EsP:[82,80,78,83], 'MTB-MLE':[76,78,74,79] },
    S003:{ Filipino:[95,97,93,96], English:[90,93,88,92], Mathematics:[95,97,93,96], 'Araling Panlipunan':[91,93,90,94], MAPEH:[92,94,90,93], EsP:[96,98,94,97], 'MTB-MLE':[93,95,91,96] },
    S004:{ Filipino:[86,88,84,87], English:[88,90,86,89], Mathematics:[82,85,80,84], Science:[0,0,0,0],   'Araling Panlipunan':[83,85,82,86], MAPEH:[85,87,83,88], EsP:[88,86,90,87] },
    S005:{ Filipino:[72,74,70,75], English:[68,65,70,67], Mathematics:[65,68,62,70], Science:[0,0,0,0],   'Araling Panlipunan':[70,68,72,69], MAPEH:[72,74,70,73], EsP:[74,72,76,71] },
    S006:{ Filipino:[92,94,90,93], English:[88,91,86,90], Mathematics:[90,93,88,92], Science:[0,0,0,0],   'Araling Panlipunan':[87,89,85,91], MAPEH:[89,91,87,92], EsP:[91,93,89,94] },
    S007:{ Filipino:[82,84,80,85], English:[76,79,73,80], Mathematics:[78,80,75,82], Science:[80,82,78,83],'Araling Panlipunan':[79,81,77,83], MAPEH:[81,83,79,84], EsP:[83,85,81,86] },
    S008:{ Filipino:[77,79,75,78], English:[74,72,76,73], Mathematics:[72,74,70,76], Science:[78,75,80,77],'Araling Panlipunan':[73,71,75,72], MAPEH:[75,77,73,78], EsP:[77,79,75,80] },
    S009:{ Filipino:[88,90,86,91], English:[84,86,82,87], Mathematics:[86,88,84,89], Science:[80,82,78,83],'Araling Panlipunan':[82,84,80,85], MAPEH:[84,86,82,87], EsP:[86,88,84,89] },
    S010:{ Filipino:[93,95,91,96], English:[89,91,87,92], Mathematics:[91,93,89,94], Science:[87,89,85,90],'Araling Panlipunan':[85,87,83,88], MAPEH:[88,90,86,91], EsP:[91,93,89,94] },
  },

  /* attendance[studentId] = { monthly: [{month,present,absent,late,total},...], total:{...} } */
  attendance: {
    S001:{ monthly:[{m:'June',p:19,a:1,l:0,t:20},{m:'July',p:21,a:0,l:1,t:22},{m:'Aug',p:20,a:1,l:0,t:21}], total:{present:60,absent:2,late:1,total:63} },
    S002:{ monthly:[{m:'June',p:18,a:2,l:0,t:20},{m:'July',p:20,a:1,l:1,t:22},{m:'Aug',p:19,a:2,l:0,t:21}], total:{present:57,absent:5,late:1,total:63} },
    S003:{ monthly:[{m:'June',p:20,a:0,l:0,t:20},{m:'July',p:22,a:0,l:0,t:22},{m:'Aug',p:21,a:0,l:0,t:21}], total:{present:63,absent:0,late:0,total:63} },
    S004:{ monthly:[{m:'June',p:18,a:1,l:1,t:20},{m:'July',p:21,a:1,l:0,t:22},{m:'Aug',p:19,a:1,l:1,t:21}], total:{present:58,absent:3,late:2,total:63} },
    S005:{ monthly:[{m:'June',p:15,a:4,l:1,t:20},{m:'July',p:18,a:3,l:1,t:22},{m:'Aug',p:16,a:4,l:1,t:21}], total:{present:49,absent:11,late:3,total:63} },
    S006:{ monthly:[{m:'June',p:19,a:0,l:1,t:20},{m:'July',p:22,a:0,l:0,t:22},{m:'Aug',p:20,a:1,l:0,t:21}], total:{present:61,absent:1,late:1,total:63} },
    S007:{ monthly:[{m:'June',p:18,a:2,l:0,t:20},{m:'July',p:20,a:2,l:0,t:22},{m:'Aug',p:19,a:2,l:0,t:21}], total:{present:57,absent:6,late:0,total:63} },
    S008:{ monthly:[{m:'June',p:16,a:3,l:1,t:20},{m:'July',p:18,a:3,l:1,t:22},{m:'Aug',p:15,a:5,l:1,t:21}], total:{present:49,absent:11,late:3,total:63} },
    S009:{ monthly:[{m:'June',p:20,a:0,l:0,t:20},{m:'July',p:21,a:1,l:0,t:22},{m:'Aug',p:20,a:1,l:0,t:21}], total:{present:61,absent:2,late:0,total:63} },
    S010:{ monthly:[{m:'June',p:20,a:0,l:0,t:20},{m:'July',p:22,a:0,l:0,t:22},{m:'Aug',p:21,a:0,l:0,t:21}], total:{present:63,absent:0,late:0,total:63} },
  },

  messages: [
    { id:1, fromRole:'parent', fromId:'P003', fromName:'Mr. Juan Dela Cruz', toRole:'teacher', toId:'T001',
      subject:'Concern about Math performance', body:"Good day Ma'am Santos. I would like to ask about my son Jose Jr.'s performance in Math this quarter.",
      date:'2025-01-20', time:'09:30 AM', read:false, studentId:'S003', thread:null },
    { id:2, fromRole:'teacher', fromId:'T001', fromName:'Ms. Maria Santos', toRole:'parent', toId:'P003',
      subject:'Re: Concern about Math performance', body:"Good day Mr. Dela Cruz! Jose Jr. is actually doing exceptionally well — he has a 95 in Math this quarter!",
      date:'2025-01-21', time:'10:15 AM', read:true, studentId:'S003', thread:1 },
    { id:3, fromRole:'system', fromId:'system', fromName:'🔔 SmartGrade Alert', toRole:'parent', toId:'P005',
      subject:'Academic Alert: Pedro Lim — Mathematics', body:'This is an automated notification. Pedro Lim has received a failing grade of 65 in Mathematics for Q1. Immediate action may be needed. Please coordinate with the class teacher.',
      date:'2025-01-22', time:'08:00 AM', read:false, studentId:'S005', thread:null, isAlert:true },
  ],

  announcements: [
    { id:1, title:'Q3 Report Cards Ready for Pickup', body:'Grade 1, 2, and 3 report cards for the 3rd quarter are now available at the Registrar\'s Office. Please bring a valid government-issued ID. Office hours: Mon–Fri, 8:00 AM – 5:00 PM.', date:'2025-01-25', audience:'all', author:'Principal Cruz', priority:'high', authorRole:'principal', pinned:true, category:'academic' },
    { id:2, title:'Parent-Teacher Conference – February 5', body:'The quarterly Parent-Teacher Conference is scheduled on Wednesday, February 5, 2025 from 8:00 AM to 12:00 NN. All parents are strongly encouraged to attend.', date:'2025-01-24', audience:'all', author:'Principal Cruz', priority:'high', authorRole:'principal', pinned:true, category:'event' },
    { id:3, title:'No Classes – February 25 (EDSA Anniversary)', body:'There will be no classes on Tuesday, February 25, 2025 in observance of the EDSA People Power Revolution Anniversary. Regular classes resume Wednesday, February 26.', date:'2025-01-22', audience:'all', author:'Principal Cruz', priority:'normal', authorRole:'principal', pinned:false, category:'holiday' },
    { id:4, title:'Reading Assessment Submission Deadline', body:'All Grade 1 and 2 homeroom teachers must submit reading assessment results by January 30, 2025. Use the approved format from the English Department.', date:'2025-01-23', audience:'teacher', author:'Principal Cruz', priority:'normal', authorRole:'principal', pinned:false, category:'academic' },
  ],

  notifications: [
    { id:1, title:'Q4 grade submission due', body:'Complete grade entry by Friday.', time:'2h ago', type:'high', read:false, role:'teacher' },
    { id:2, title:'Pedro Lim — Failing Grade Alert', body:'Pedro Lim received 65 in Mathematics (Q1). Notification sent to parent.', time:'3h ago', type:'alert', read:false, role:'teacher' },
    { id:3, title:'New parent message', body:'Mr. Juan Dela Cruz sent a message.', time:'5h ago', type:'normal', read:false, role:'teacher' },
    { id:4, title:'School news posted', body:'New announcements available.', time:'1d ago', type:'normal', read:true, role:'all' },
  ],

  classes: [
    { id:'C001', grade:'Grade 1', section:'Sampaguita', teacherId:'T001', year:'2024-2025' },
    { id:'C002', grade:'Grade 2', section:'Rosal',      teacherId:'T002', year:'2024-2025' },
    { id:'C003', grade:'Grade 3', section:'Gumamela',   teacherId:'T003', year:'2024-2025' },
  ],

  /* Login credentials map */
  users: {
    'teacher@smartgrade.edu': { role:'teacher', id:'T001', name:'Ms. Maria Santos',  email:'teacher@smartgrade.edu',  password:'password123', grade:'Grade 1', section:'Sampaguita', teacherId:'T001' },
    'preyes@smartgrade.edu':  { role:'teacher', id:'T002', name:'Mr. Pedro Reyes',   email:'preyes@smartgrade.edu',   password:'password123', grade:'Grade 2', section:'Rosal',      teacherId:'T002' },
    'clim@smartgrade.edu':    { role:'teacher', id:'T003', name:'Ms. Carmen Lim',    email:'clim@smartgrade.edu',     password:'password123', grade:'Grade 3', section:'Gumamela',   teacherId:'T003' },
    'parent@gmail.com':       { role:'parent',  id:'P003', name:'Mr. Juan Dela Cruz', email:'parent@gmail.com',        password:'password123', childId:'S003' },
    'principal@smartgrade.edu':{ role:'principal', id:'principal', name:'Principal Roberto Cruz', email:'principal@smartgrade.edu', password:'password123', school:'Polangui South Central School' },
  },

  nextMsgId: 10,
  nextAnnId: 10,
  nextStudentId: 11,
  nextParentId: 11,
};

/* ════════════════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════════════════ */
const avg = a => a && a.length ? Math.round(a.reduce((s,v) => s+v, 0) / a.length) : 0;
const ini = n => (n||'?').split(' ').filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase();

function getSubjectsForGrade(grade) {
  return SUBJECTS_BY_GRADE[grade] || ALL_SUBJECTS;
}

function studentAverage(studentId) {
  const g = STATE.grades[studentId];
  const student = STATE.students.find(s => s.id === studentId);
  if (!g || !student) return 0;
  const subs = getSubjectsForGrade(student.grade);
  const vals = subs.map(sub => avg(g[sub] || [0,0,0,0]));
  return vals.length ? Math.round(vals.reduce((a,b) => a+b, 0) / vals.length) : 0;
}

function subjectAvg(studentId, subject) {
  const g = STATE.grades[studentId];
  return g && g[subject] ? avg(g[subject]) : 0;
}

function glabel(n) {
  if (n >= 90) return 'Outstanding';
  if (n >= 85) return 'Very Satisfactory';
  if (n >= 80) return 'Satisfactory';
  if (n >= 75) return 'Fairly Satisfactory';
  return 'Did Not Meet Expectations';
}
function gbadge(n) {
  if (n >= 90) return 'bg-green';
  if (n >= 80) return 'bg-blue';
  if (n >= 75) return 'bg-amber';
  if (n === 0) return 'bg-gray';
  return 'bg-red';
}
function gcol(n) {
  if (n >= 90) return 'var(--green)';
  if (n >= 80) return 'var(--blue)';
  if (n >= 75) return 'var(--amber)';
  return 'var(--red)';
}

/* ─── Auto-Alert: check all students for failing grades ─────────────────────── */
function checkAndSendFailingAlerts(studentId, subject, quarter, score, teacherName) {
  if (score < 75 && score > 0) {
    const student = STATE.students.find(s => s.id === studentId);
    if (!student) return false;
    // Only send to linked parent — never to admin or principal
    const parent = STATE.parents.find(p => p.childId === studentId);
    if (!parent) return false;
    // Check if alert already sent for this student/subject/quarter
    const alreadySent = STATE.messages.find(m =>
      m.isAlert && m.studentId === studentId &&
      m.subject && m.subject.includes(subject) && m.subject.includes(quarter)
    );
    if (alreadySent) return false;

    const alertMsg = {
      id: STATE.nextMsgId++,
      fromRole: 'system', fromId: 'system', fromName: '🔔 SmartGrade Alert',
      toRole: 'parent',   // always parent only
      toId: parent.id,    // specific parent ID
      subject: `Academic Alert: ${student.name} — ${subject} (${quarter})`,
      body: `This is an automated notification from SmartGrade.\n\n${student.name} has received a grade of ${score} in ${subject} for ${quarter}, which is below the passing mark of 75.\n\nPlease coordinate with ${teacherName || 'the class teacher'} at your earliest convenience to discuss how to support your child's academic performance.\n\nThank you for your continued support.`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit' }),
      read: false, studentId, thread: null, isAlert: true,
    };
    STATE.messages.unshift(alertMsg);

    // Notification only for the teacher — not admin
    STATE.notifications.unshift({
      id: STATE.notifications.length + 1,
      title: `Alert Sent: ${student.name}`,
      body: `${student.name} scored ${score} in ${subject} (${quarter}). Parent notified automatically.`,
      time: 'just now', type: 'alert', read: false, role: 'teacher',
    });
    return true;
  }
  return false;
}

/* ─── SVG icons ─────────────────────────────────────────────────────────────── */
const svgIco = {
  home:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
  people:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
  person:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
  grade:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>`,
  cal:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>`,
  msg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`,
  bell:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`,
  chart:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>`,
  school:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>`,
  trophy:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zm-2 3.5c0 1.93-1.57 3.5-3.5 3.5S10 10.43 10 8.5V5h7v3.5z"/></svg>`,
  report:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`,
  check:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`,
  alert:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
};

/* ─── Toast / Confirm / Modal ────────────────────────────────────────────────── */
function toast(msg, type='success') {
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = (type==='success'?'✓':type==='error'?'✕':type==='alert'?'⚠':'ℹ') + ` ${msg}`;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
function showConfirm(title, msg, onYes) {
  const ov = document.createElement('div');
  ov.className = 'confirm-overlay';
  ov.innerHTML = `<div class="confirm-box"><div class="confirm-icon">⚠️</div><div class="confirm-title">${title}</div><div class="confirm-msg">${msg}</div><div class="confirm-btns"><button class="btn btn-secondary" onclick="this.closest('.confirm-overlay').remove()">Cancel</button><button class="btn btn-danger" id="confirm-yes">Confirm</button></div></div>`;
  document.body.appendChild(ov);
  ov.querySelector('#confirm-yes').onclick = () => { ov.remove(); onYes(); };
}
let _modalStack = [];
function openModal(html, onClose) {
  const ov = document.createElement('div');
  ov.className = 'modal-bg';
  ov.innerHTML = `<div class="modal">${html}</div>`;
  ov.onclick = e => { if (e.target === ov) { closeModal(); if (onClose) onClose(); } };
  document.body.appendChild(ov);
  _modalStack.push(ov);
  return ov;
}
function closeModal() { const m = _modalStack.pop(); if (m) m.remove(); }
function closeAllModals() { while (_modalStack.length) _modalStack.pop().remove(); }

/* ─── Badge / Unread ─────────────────────────────────────────────────────────── */
function updateUnreadBadge() {
  const u = STATE.currentUser;
  if (!u) return;
  const unread = STATE.messages.filter(m => !m.read && m.toId === u.id).length;
  const msgBad = document.getElementById('msg-badge');
  if (msgBad) { msgBad.style.display = unread > 0 ? 'flex':'none'; msgBad.textContent = unread || ''; }
  const notifCount = STATE.notifications.filter(n => !n.read && (n.role === u.role || n.role === 'all')).length;
  const notifBad = document.getElementById('notif-badge');
  if (notifBad) { notifBad.style.display = notifCount > 0 ? 'flex':'none'; notifBad.textContent = notifCount || ''; }
}
function getNotificationCount() {
  const u = STATE.currentUser;
  return STATE.notifications.filter(n => !n.read && (n.role === (u&&u.role) || n.role === 'all')).length;
}
function setTopbarAvatar(user) {
  const av = document.getElementById('tb-av');
  const colors = { principal:'var(--purple)', teacher:'var(--green)', parent:'var(--amber)' };
  const bgs = { principal:'var(--purple-l)', teacher:'var(--green-l)', parent:'var(--amber-l)' };
  av.style.color = colors[user.role] || 'var(--green)';
  av.style.backgroundColor = bgs[user.role] || 'var(--green-l)';
  av.style.backgroundImage = '';
  if (user.avatar) {
    av.style.backgroundImage = `url("${user.avatar}")`;
    av.style.backgroundSize = 'cover'; av.style.backgroundPosition = 'center';
    av.textContent = '';
  } else { av.textContent = ini(user.name); }
}
function openNotifications() {
  // Remove existing dropdown if open (toggle)
  const existing = document.getElementById('notif-panel');
  if (existing) { existing.remove(); return; }

  const u = STATE.currentUser;
  const myNotifs = STATE.notifications.filter(n => n.role === u.role || n.role === 'all');

  const panel = document.createElement('div');
  panel.id = 'notif-panel';
  panel.style.cssText = `position:fixed;top:58px;right:12px;width:340px;max-height:420px;overflow-y:auto;background:#fff;border-radius:var(--rl);border:1px solid var(--border);box-shadow:0 12px 40px rgba(0,0,0,.18);z-index:600`;

  const typeIcon = { high:'🔴', alert:'⚠️', normal:'🔔' };
  panel.innerHTML = `
    <div style="padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
      <span style="font-weight:700;font-size:13.5px">Notifications</span>
      <button onclick="markAllNotifsRead()" style="font-size:11.5px;color:var(--green);font-weight:600;border:none;background:none;cursor:pointer">Mark all read</button>
    </div>
    ${myNotifs.length === 0 ? `<div style="padding:30px;text-align:center;color:var(--text3);font-size:13px">No notifications</div>` :
      myNotifs.map(n => `
        <div data-notif-id="${n.id}" style="padding:12px 16px;border-bottom:1px solid var(--border);background:${n.read?'#fff':'var(--green-l)'};cursor:pointer" onclick="markNotifRead(${n.id})">
          <div style="display:flex;align-items:flex-start;gap:10px">
            <span style="font-size:16px;flex-shrink:0">${typeIcon[n.type]||'🔔'}</span>
            <div style="flex:1">
              <div class="notif-title" style="font-size:13px;font-weight:${n.read?'500':'700'};color:var(--text)">${n.title}</div>
              <div style="font-size:12px;color:var(--text2);margin-top:2px;line-height:1.5">${n.body}</div>
              <div style="font-size:11px;color:var(--text3);margin-top:4px">${n.time}</div>
            </div>
            ${!n.read ? `<div class="notif-unread-dot" style="width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0;margin-top:4px"></div>` : ''}
          </div>
        </div>`).join('')}`;

  document.body.appendChild(panel);

  // Close when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closePanel(e) {
      if (!panel.contains(e.target) && !e.target.closest('.tb-notif-btn')) {
        panel.remove();
        document.removeEventListener('click', closePanel);
      }
    });
  }, 10);
}

function markNotifRead(id) {
  const n = STATE.notifications.find(x => x.id === id);
  if (n) n.read = true;
  updateUnreadBadge();
  // Refresh just the clicked item's background without reopening
  const panel = document.getElementById('notif-panel');
  if (panel) {
    const items = panel.querySelectorAll('[data-notif-id]');
    items.forEach(item => {
      if (parseInt(item.dataset.notifId) === id) {
        item.style.background = '#fff';
        const dot = item.querySelector('.notif-unread-dot');
        if (dot) dot.remove();
        const title = item.querySelector('.notif-title');
        if (title) title.style.fontWeight = '500';
      }
    });
  }
}

function markAllNotifsRead() {
  const u = STATE.currentUser;
  STATE.notifications.filter(n => n.role === u.role || n.role === 'all').forEach(n => n.read = true);
  updateUnreadBadge();
  document.getElementById('notif-panel')?.remove();
}

/* ════════════════════════════════════════════════════════════════════════════
   AUTH
   ════════════════════════════════════════════════════════════════════════════ */
function doLogin() {
  const email = document.getElementById('l-email').value.trim().toLowerCase();
  const pass  = document.getElementById('l-pass').value.trim();
  const user  = STATE.users[email];
  if (!user || user.password !== pass) { toast('Invalid email or password.', 'error'); return; }

  STATE.currentUser = user;
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  setTopbarAvatar(user);
  document.getElementById('tb-name').textContent = user.name;
  document.getElementById('tb-role').textContent = user.role === 'principal' ? 'Principal' : user.role.charAt(0).toUpperCase() + user.role.slice(1);
  buildSidebar(user.role);
  updateUnreadBadge();
  nav('dashboard');
}
function doLogout() {
  STATE.currentUser = null; closeAllModals();
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-page').style.display = 'grid';
  document.getElementById('l-email').value = '';
  document.getElementById('l-pass').value  = '';
  // Show register tab on logout if needed
  showLoginTab('login');
}
function togglePasswordVisibility() {
  const inp = document.getElementById('l-pass');
  const btn = document.getElementById('pass-toggle');
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.innerHTML = inp.type === 'password' ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
}
function openForgotPassword() {
  const ov = document.createElement('div');
  ov.id = 'forgot-overlay';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(2px)';
  ov.innerHTML = `<div style="background:#fff;border-radius:20px;width:100%;max-width:400px;padding:32px;box-shadow:0 24px 60px rgba(0,0,0,.2)">
    <div style="font-size:20px;font-weight:800;margin-bottom:6px">Forgot Password?</div>
    <div style="font-size:13px;color:#5C5A52;margin-bottom:20px">Enter your registered email and we'll send a reset link.</div>
    <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:18px">
      <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#5C5A52">Email Address*</label>
      <input id="fp-email" type="email" placeholder="your@email.com" style="padding:10px 12px;border:1.5px solid #E3E0D8;border-radius:9px;font-size:13.5px;outline:none;font-family:inherit">
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button onclick="document.getElementById('forgot-overlay').remove()" style="padding:9px 18px;border-radius:9px;border:1.5px solid #E3E0D8;background:#fff;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit">Cancel</button>
      <button onclick="submitForgotPassword()" style="padding:9px 18px;border-radius:9px;border:none;background:#2A76C9;color:#fff;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit">Send Reset Link</button>
    </div>
  </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  setTimeout(() => document.getElementById('fp-email')?.focus(), 50);
}
function submitForgotPassword() {
  const email = document.getElementById('fp-email')?.value.trim();
  if (!email) return;
  const found = STATE.users[email.toLowerCase()];
  document.getElementById('forgot-overlay')?.remove();
  toast(found ? `Reset link sent to ${email}!` : `No account found for ${email}.`, found ? 'success' : 'error');
}

/* ─── Login Page tabs (Login | Register as Teacher) ─────────────────────────── */
function showLoginTab(tab) {
  const loginForm = document.getElementById('login-form-section');
  const regForm   = document.getElementById('register-form-section');
  const loginTab  = document.getElementById('tab-login');
  const regTab    = document.getElementById('tab-register');
  if (!loginForm) return;
  if (tab === 'login') {
    loginForm.style.display = ''; regForm.style.display = 'none';
    loginTab.classList.add('active'); regTab.classList.remove('active');
  } else {
    loginForm.style.display = 'none'; regForm.style.display = '';
    regTab.classList.add('active'); loginTab.classList.remove('active');
  }
}

function doRegisterTeacher() {
  const name  = document.getElementById('r-name')?.value.trim();
  const email = document.getElementById('r-email')?.value.trim().toLowerCase();
  const pass  = document.getElementById('r-pass')?.value.trim();
  const phone = document.getElementById('r-phone')?.value.trim();
  const grade = document.getElementById('r-grade')?.value;
  const sec   = document.getElementById('r-section')?.value.trim();
  if (!name || !email || !pass || !sec) { toast('Please fill all required fields.', 'error'); return; }
  if (STATE.users[email]) { toast('This email is already registered.', 'error'); return; }
  const existing = STATE.pendingTeachers.find(t => t.email === email);
  if (existing) { toast('Your registration is already pending approval.', 'error'); return; }
  STATE.pendingTeachers.push({
    id: 'PT' + String(STATE.pendingTeachers.length + 1).padStart(3,'0'),
    name, email, phone: phone || '—', grade, section: sec,
    password: pass, appliedDate: new Date().toISOString().split('T')[0], status:'pending',
  });
  toast('Registration submitted! Please wait for the principal\'s approval.', 'success');
  showLoginTab('login');
}

/* ════════════════════════════════════════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════════════════════════════════════════ */
const navMenus = {
  teacher:[
    { s:'Overview' }, { id:'dashboard', l:'Dashboard', ic:'home' },
    { s:'Classroom' }, { id:'students', l:'My Students', ic:'people' }, { id:'grades', l:'Grade Entry', ic:'grade' }, { id:'attendance', l:'Attendance', ic:'cal' },
    { s:'Reports' }, { id:'reports', l:'Reports', ic:'report' }, { id:'ranking', l:'Class Ranking', ic:'trophy' },
    { s:'Communication' }, { id:'messages', l:'Messages', ic:'msg' }, { id:'announcements', l:'Announcements', ic:'bell' },
    { s:'Management' }, { id:'parents', l:'Manage Parents', ic:'people' },
  ],
  parent:[
    { s:'Overview' }, { id:'dashboard', l:'Dashboard', ic:'home' },
    { s:'My Child' }, { id:'grades', l:'Academic Record', ic:'grade' }, { id:'attendance', l:'Attendance', ic:'cal' }, { id:'reports', l:'Reports', ic:'report' },
    { s:'Communication' }, { id:'messages', l:'Messages', ic:'msg' }, { id:'announcements', l:'Announcements', ic:'bell' },
  ],
  principal:[
    { s:'Overview' }, { id:'dashboard', l:'Dashboard', ic:'home' },
    { s:'Monitor' }, { id:'students', l:'All Students', ic:'people' }, { id:'teachers', l:'Teachers', ic:'person' }, { id:'ranking', l:'School Ranking', ic:'trophy' },
    { s:'Academics' }, { id:'grades', l:'Grade Overview', ic:'grade' }, { id:'attendance', l:'Attendance', ic:'cal' },
    { s:'Administration' }, { id:'approvals', l:'Teacher Approvals', ic:'check' }, { id:'classes', l:'Classes', ic:'school' },
    { s:'Communication' }, { id:'messages', l:'Messages', ic:'msg' }, { id:'announcements', l:'Announcements', ic:'bell' },
  ],
};

function buildSidebar(role) {
  const sb = document.getElementById('sidebar');
  sb.innerHTML = '';
  (navMenus[role] || []).forEach(item => {
    if (item.s) { sb.innerHTML += `<div class="nav-section-label">${item.s}</div>`; return; }
    const unread = item.id === 'messages' ? STATE.messages.filter(m => !m.read && m.toId === STATE.currentUser.id).length : 0;
    const pending = item.id === 'approvals' ? STATE.pendingTeachers.filter(t => t.status === 'pending').length : 0;
    const badge = unread || pending;
    sb.innerHTML += `<button class="nav-link" id="nl-${item.id}" onclick="nav('${item.id}')">${svgIco[item.ic]||''} ${item.l}${badge ? `<span class="nav-count">${badge}</span>` : ''}</button>`;
  });
}

function nav(page) {
  if (STATE.activeNav) document.getElementById('nl-'+STATE.activeNav)?.classList.remove('active');
  STATE.activeNav = page;
  document.getElementById('nl-'+page)?.classList.add('active');
  const c = document.getElementById('content');
  c.innerHTML = '';
  // Reset announcement filter on each page navigation
  if (page !== 'announcements') window._annFilterCat = 'all';
  const role = STATE.currentUser.role;
  const pages = {
    teacher:   { dashboard:pgTeacherDash,   students:pgStudents, grades:pgGrades, attendance:pgAttendance, messages:pgMessages, announcements:pgAnnouncements, reports:pgReports, ranking:pgRanking, parents:pgParentsTeacher, profile:pgProfile },
    parent:    { dashboard:pgParentDash,     grades:pgGrades, attendance:pgAttendance, messages:pgMessages, announcements:pgAnnouncements, reports:pgReports, profile:pgProfile },
    principal: { dashboard:pgPrincipalDash,  students:pgStudents, teachers:pgTeachers, ranking:pgRanking, grades:pgGrades, attendance:pgAttendance, approvals:pgApprovals, classes:pgClasses, messages:pgMessages, announcements:pgAnnouncements, profile:pgProfile },
  };
  (pages[role]?.[page] || (() => { c.innerHTML = '<div class="empty-state"><div class="es-icon">🔍</div><div class="es-title">Page not found</div></div>'; }))(c);
}

/* ════════════════════════════════════════════════════════════════════════════
   TEACHER DASHBOARD
   ════════════════════════════════════════════════════════════════════════════ */
function pgTeacherDash(el) {
  const u = STATE.currentUser;
  const myStudents = STATE.students.filter(s => s.teacherId === u.teacherId && s.status === 'active');
  const unread = STATE.messages.filter(m => !m.read && m.toId === u.id).length;
  const subs = getSubjectsForGrade(u.grade);
  let allScores = [];
  myStudents.forEach(s => { subs.forEach(sub => { const sc = subjectAvg(s.id, sub); if (sc > 0) allScores.push(sc); }); });
  const clsAvg = allScores.length ? Math.round(allScores.reduce((a,b)=>a+b,0)/allScores.length) : 0;
  const failingCount = myStudents.filter(s => {
    const subs2 = getSubjectsForGrade(s.grade);
    return subs2.some(sub => { const sc = subjectAvg(s.id, sub); return sc > 0 && sc < 75; });
  }).length;
  const attR = myStudents.length ? Math.round(myStudents.reduce((r,s) => {
    const at = STATE.attendance[s.id]; return r + (at ? at.total.present/at.total.total : 0);
  }, 0) / myStudents.length * 100) : 0;
  const today = new Date().toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  el.innerHTML = `
  <div class="dash-hero hero-green mb-20">
    <div class="hero-deco" style="width:260px;height:260px;top:-80px;right:-60px"></div>
    <div class="hero-deco" style="width:180px;height:180px;bottom:-60px;right:180px"></div>
    <div style="position:relative;z-index:1">
      <div class="hero-rl">Teacher Dashboard</div>
      <div class="hero-name">Good day, ${u.name.split(' ').slice(-1)[0]}! 👋</div>
      <div class="hero-sub">${today} &nbsp;·&nbsp; ${u.grade} – ${u.section}</div>
      <div class="hero-kpis">
        <div><div class="hero-kpi-val">${myStudents.length}</div><div class="hero-kpi-lbl">Students</div></div>
        <div><div class="hero-kpi-val">${clsAvg}</div><div class="hero-kpi-lbl">Class Average</div></div>
        <div><div class="hero-kpi-val">${attR}%</div><div class="hero-kpi-lbl">Attendance Rate</div></div>
        <div><div class="hero-kpi-val">${unread}</div><div class="hero-kpi-lbl">Unread Messages</div></div>
      </div>
    </div>
  </div>

  <div class="stats-grid mb-20">
    <div class="stat-card"><div class="stat-lbl">My Students</div><div class="stat-val green">${myStudents.length}</div><div class="stat-foot">${u.grade} – ${u.section}</div></div>
    <div class="stat-card"><div class="stat-lbl">Class Average</div><div class="stat-val ${clsAvg>=85?'green':clsAvg>=75?'amber':'red'}">${clsAvg}</div><div class="stat-foot">${glabel(clsAvg)}</div></div>
    <div class="stat-card" style="cursor:pointer" onclick="nav('ranking')"><div class="stat-lbl">Class Ranking</div><div class="stat-val green">View</div><div class="stat-foot">Honors & Rankings</div></div>
    <div class="stat-card"><div class="stat-lbl">Need Attention</div><div class="stat-val ${failingCount>0?'red':'green'}">${failingCount}</div><div class="stat-foot">Students w/ failing grade</div></div>
  </div>

  <div class="g2 mb-16">
    <div class="card">
      <div class="card-header"><div class="card-title" style="margin:0">Student Performance</div><button class="btn btn-secondary btn-xs" onclick="nav('grades')">Enter Grades</button></div>
      ${myStudents.map(s => {
        const ov = studentAverage(s.id);
        const at = STATE.attendance[s.id];
        const attRate = at ? Math.round(at.total.present/at.total.total*100) : 0;
        const honors = getHonors(ov);
        return `<div class="flex aic gap-12" style="padding:10px 0;border-bottom:1px solid var(--border)">
          <div class="av av-40 av-green">${ini(s.name)}</div>
          <div class="f1">
            <div class="fw6 ts">${s.name} ${honors?`<span style="font-size:13px">${honors.icon}</span>`:''}</div>
            <div style="height:4px;background:var(--surface2);border-radius:2px;margin-top:5px"><div style="height:100%;width:${ov}%;background:${gcol(ov)};border-radius:2px"></div></div>
          </div>
          <div style="text-align:right">
            <span class="badge ${gbadge(ov)}">${ov}</span>
            <div class="txs tmm mt-8">${attRate}% present</div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="card">
        <div class="card-title">Quick Actions</div>
        <div style="display:grid;gap:8px">
          <button class="btn btn-primary" onclick="nav('grades')" style="justify-content:flex-start">📝 &nbsp;Enter Student Grades</button>
          <button class="btn btn-secondary" onclick="nav('attendance')" style="justify-content:flex-start">📋 &nbsp;Record Attendance</button>
          <button class="btn btn-secondary" onclick="nav('reportcard')" style="justify-content:flex-start">📄 &nbsp;Generate Report Card</button>
          <button class="btn btn-secondary" onclick="nav('ranking')" style="justify-content:flex-start">🏆 &nbsp;View Class Ranking</button>
          <button class="btn btn-secondary" onclick="openComposeModal()" style="justify-content:flex-start">💬 &nbsp;Message a Parent</button>
          <button class="btn btn-secondary" onclick="nav('parents')" style="justify-content:flex-start">👥 &nbsp;Manage Parents</button>
        </div>
      </div>
      ${failingCount > 0 ? `<div class="card" style="border-color:var(--red);background:var(--red-l)">
        <div class="card-title" style="color:var(--red)">⚠️ Failing Grade Alerts</div>
        ${myStudents.filter(s => getSubjectsForGrade(s.grade).some(sub => { const sc = subjectAvg(s.id, sub); return sc > 0 && sc < 75; })).map(s => {
          const failingSubs = getSubjectsForGrade(s.grade).filter(sub => { const sc = subjectAvg(s.id, sub); return sc > 0 && sc < 75; });
          return `<div class="flex aic gap-8 mb-8"><div class="av av-32 av-green">${ini(s.name)}</div><div class="f1"><div class="fw6 ts">${s.name}</div><div class="txs" style="color:var(--red)">${failingSubs.join(', ')}</div></div><span class="badge bg-red">ALERT SENT</span></div>`;
        }).join('')}
      </div>` : ''}
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════════════════════
   PARENT DASHBOARD
   ════════════════════════════════════════════════════════════════════════════ */
function pgParentDash(el) {
  const u = STATE.currentUser;
  const child = STATE.students.find(s => s.id === u.childId);
  if (!child) { el.innerHTML = '<div class="empty-state"><div class="es-icon">👶</div><div class="es-title">No child linked to your account.</div></div>'; return; }
  const subs = getSubjectsForGrade(child.grade);
  const g = STATE.grades[child.id] || {};
  const at = STATE.attendance[child.id];
  const attR = at ? Math.round(at.total.present/at.total.total*100) : 0;
  const ov = studentAverage(child.id);
  const honors = getHonors(ov);
  const alerts = STATE.messages.filter(m => m.isAlert && m.studentId === child.id && !m.read);
  const today = new Date().toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  el.innerHTML = `
  <div class="dash-hero hero-amber mb-20">
    <div style="position:absolute;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,.06);top:-80px;right:-60px"></div>
    <div style="position:relative;z-index:1">
      <div class="hero-rl">Parent Dashboard</div>
      <div class="hero-name">Welcome, ${u.name.split(' ').slice(-1)[0]}! 👋</div>
      <div class="hero-sub">
        Monitoring: <strong style="color:#fff">${child.name}</strong> · ${child.grade} – ${child.section}
        <span style="margin-left:12px;background:rgba(255,255,255,.15);padding:2px 10px;border-radius:20px;font-size:12px">
          LRN: <strong style="color:#fff">${child.lrn||'Not set'}</strong>
        </span>
      </div>
      <div class="hero-kpis">
        <div><div class="hero-kpi-val">${ov}</div><div class="hero-kpi-lbl">Overall Average</div></div>
        <div><div class="hero-kpi-val">${attR}%</div><div class="hero-kpi-lbl">Attendance</div></div>
        <div><div class="hero-kpi-val">${at?at.total.absent:0}</div><div class="hero-kpi-lbl">Days Absent</div></div>
        <div><div class="hero-kpi-val">${alerts.length}</div><div class="hero-kpi-lbl">Alert Messages</div></div>
      </div>
    </div>
  </div>

  ${alerts.length > 0 ? `<div class="card mb-16" style="border-color:var(--red);background:var(--red-l)">
    <div class="flex aic gap-10 mb-12"><span style="font-size:22px">⚠️</span><div class="fw7" style="color:var(--red)">Academic Alert — Action Required</div></div>
    ${alerts.map(a => `<div style="padding:10px;background:#fff;border-radius:9px;margin-bottom:8px;border-left:3px solid var(--red)">
      <div class="fw6 ts mb-4">${a.subject}</div>
      <div class="txs tm">${a.body.split('\n')[2]||''}</div>
    </div>`).join('')}
    <button class="btn btn-danger btn-sm mt-8" onclick="nav('messages')">View Full Details →</button>
  </div>` : ''}

  ${honors ? `<div class="card mb-16" style="background:linear-gradient(135deg,#FFF4C2,#fff);border-color:var(--gold)">
    <div class="flex aic gap-12">
      <span style="font-size:40px">${honors.icon}</span>
      <div><div style="font-size:18px;font-weight:800;color:var(--gold)">${honors.label}</div><div class="ts tm">${child.name} is performing excellently with a ${ov} overall average.</div></div>
    </div>
  </div>` : ''}

  <div class="g2 mb-16">
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="card">
        <div class="card-title">Subject Performance</div>
        ${subs.map(sub => { const sc = subjectAvg(child.id, sub); return `<div class="prog-wrap"><div class="prog-top"><span class="prog-lbl ts">${sub}</span><span class="badge ${gbadge(sc)}">${sc}</span></div><div class="prog-track"><div class="prog-fill" style="width:${sc}%;background:${gcol(sc)}"></div></div><div class="txs tmm">${glabel(sc)}</div></div>`; }).join('')}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="card">
        <div class="card-title">Attendance Summary</div>
        <div class="g3 mb-12" style="text-align:center">
          <div style="padding:12px;background:var(--green-l);border-radius:9px"><div style="font-size:22px;font-weight:800;color:var(--green)">${at?at.total.present:0}</div><div class="txs tm">Present</div></div>
          <div style="padding:12px;background:var(--red-l);border-radius:9px"><div style="font-size:22px;font-weight:800;color:var(--red)">${at?at.total.absent:0}</div><div class="txs tm">Absent</div></div>
          <div style="padding:12px;background:var(--amber-l);border-radius:9px"><div style="font-size:22px;font-weight:800;color:var(--amber)">${at?at.total.late:0}</div><div class="txs tm">Late</div></div>
        </div>
        <button class="btn btn-secondary btn-sm" style="width:100%" onclick="nav('attendance')">View Full Attendance →</button>
      </div>
      <div class="card">
        <div class="flex gap-8 mt-4">
          <button class="btn btn-primary btn-sm f1" onclick="nav('reportcard')">📄 Report Card</button>
          <button class="btn btn-secondary btn-sm f1" onclick="openComposeModal()">✉️ Message Teacher</button>
        </div>
      </div>
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════════════════════
   PRINCIPAL DASHBOARD (read-only monitor)
   ════════════════════════════════════════════════════════════════════════════ */
function pgPrincipalDash(el) {
  const u = STATE.currentUser;
  const active = STATE.students.filter(s => s.status === 'active');
  let allOv = active.map(s => studentAverage(s.id)).filter(v => v > 0);
  const schAvg = allOv.length ? Math.round(allOv.reduce((a,b)=>a+b,0)/allOv.length) : 0;
  const outstanding = allOv.filter(x => x >= 90).length;
  const failing = allOv.filter(x => x < 75).length;
  const pending = STATE.pendingTeachers.filter(t => t.status === 'pending').length;
  const today = new Date().toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  el.innerHTML = `
  <div class="dash-hero hero-purple mb-20">
    <div class="hero-deco" style="width:260px;height:260px;top:-80px;right:-60px"></div>
    <div style="position:relative;z-index:1">
      <div class="hero-rl">Principal Dashboard — Read-Only Monitor</div>
      <div class="hero-name">Welcome, ${u.name.split(' ').slice(-1)[0]}! 👋</div>
      <div class="hero-sub">${today} &nbsp;·&nbsp; Polangui South Central School</div>
      <div class="hero-kpis">
        <div><div class="hero-kpi-val">${active.length}</div><div class="hero-kpi-lbl">Students</div></div>
        <div><div class="hero-kpi-val">${STATE.teachers.length}</div><div class="hero-kpi-lbl">Teachers</div></div>
        <div><div class="hero-kpi-val">${schAvg}</div><div class="hero-kpi-lbl">School Average</div></div>
        <div><div class="hero-kpi-val">${pending}</div><div class="hero-kpi-lbl">Pending Approvals</div></div>
      </div>
    </div>
  </div>

  ${pending > 0 ? `<div class="card mb-16" style="border-color:var(--amber);background:var(--amber-l)">
    <div class="flex aic jb">
      <div class="flex aic gap-10"><span style="font-size:20px">⏳</span><div><div class="fw7" style="color:var(--amber)">${pending} Pending Teacher Registration${pending>1?'s':''}</div><div class="txs tm">Review and approve teacher applications.</div></div></div>
      <button class="btn btn-amber btn-sm" onclick="nav('approvals')">Review Now →</button>
    </div>
  </div>` : ''}

  <div class="stats-grid mb-20">
    <div class="stat-card"><div class="stat-lbl">Active Students</div><div class="stat-val green">${active.length}</div><div class="stat-foot">${STATE.students.length} total enrolled</div></div>
    <div class="stat-card"><div class="stat-lbl">School Average</div><div class="stat-val ${schAvg>=85?'green':schAvg>=75?'amber':'red'}">${schAvg}</div><div class="stat-foot">${glabel(schAvg)}</div></div>
    <div class="stat-card"><div class="stat-lbl">Outstanding</div><div class="stat-val green">${outstanding}</div><div class="stat-foot">Average ≥ 90</div></div>
    <div class="stat-card"><div class="stat-lbl">Need Support</div><div class="stat-val ${failing>0?'red':'green'}">${failing}</div><div class="stat-foot">Average below 75</div></div>
  </div>

  <div class="g2 mb-16">
    <div class="card">
      <div class="card-header"><div class="card-title" style="margin:0">Classes Overview</div><button class="btn btn-secondary btn-xs" onclick="nav('classes')">Manage</button></div>
      ${STATE.classes.map(c => {
        const t = STATE.teachers.find(x => x.id === c.teacherId);
        const sts = STATE.students.filter(s => s.grade===c.grade && s.section===c.section && s.status==='active');
        let sc2 = []; sts.forEach(s => { let v = studentAverage(s.id); if (v>0) sc2.push(v); });
        const ca = sc2.length ? Math.round(sc2.reduce((a,b)=>a+b,0)/sc2.length) : 0;
        return `<div class="flex aic gap-10" style="padding:9px 0;border-bottom:1px solid var(--border)">
          <div style="width:36px;height:36px;background:var(--blue-l);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px">🏫</div>
          <div class="f1"><div class="fw6 ts">${c.grade} – ${c.section}</div><div class="txs tmm">${t?t.name:'No teacher'} · ${sts.length} students</div></div>
          <span class="badge ${gbadge(ca)}">${ca||'–'}</span>
        </div>`;
      }).join('')}
    </div>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="card">
        <div class="card-header"><div class="card-title" style="margin:0">Top Performers</div><button class="btn btn-secondary btn-xs" onclick="nav('ranking')">Full Ranking</button></div>
        ${active.sort((a,b) => studentAverage(b.id)-studentAverage(a.id)).slice(0,5).map((s,i) => {
          const ov = studentAverage(s.id);
          const honors = getHonors(ov);
          return `<div class="flex aic gap-10" style="padding:8px 0;border-bottom:1px solid var(--border)">
            <div style="width:24px;height:24px;border-radius:50%;background:${i===0?'#C79800':i===1?'#C0C0C0':i===2?'#CD7F32':'var(--surface2)'};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${i<3?'#fff':'var(--text2)'}">${i+1}</div>
            <div class="av av-32 av-green">${ini(s.name)}</div>
            <div class="f1"><div class="fw6 ts">${s.name}</div><div class="txs tmm">${s.grade} – ${s.section}</div></div>
            <div style="text-align:right"><span class="badge ${gbadge(ov)}">${ov}</span>${honors?`<div class="txs" style="color:var(--gold)">${honors.icon}</div>`:''}</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════════════════════
   STUDENTS PAGE
   ════════════════════════════════════════════════════════════════════════════ */
function pgStudents(el) {
  const isPrincipal = STATE.currentUser.role === 'principal';
  const isTeacher   = STATE.currentUser.role === 'teacher';
  el.innerHTML = `
    <div class="page-head">
      <div><div class="page-title">${isPrincipal ? 'All Students' : 'My Students'}</div><div class="page-sub" id="stud-sub"></div></div>
      <div class="page-actions">
        ${isTeacher ? `<button class="btn btn-primary" onclick="openAddStudentModal()">+ Add Student</button>` : ''}
      </div>
    </div>
    <div class="tbl-wrap">
      <div class="tbl-toolbar"><input id="stud-search" class="tbl-search" placeholder="🔍  Search by name, ID, grade, section...">
        ${isTeacher ? `<button class="btn btn-secondary btn-sm" onclick="exportStudents()">Export CSV</button>` : ''}
      </div>
      <table>
        <thead><tr><th>Student</th><th>LRN</th><th>Grade & Section</th><th>Gender</th><th>Average</th><th>Honors</th><th>Attendance</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody id="stud-tbody"></tbody>
      </table>
    </div>`;
  function getBase() {
    return isPrincipal ? STATE.students : STATE.students.filter(s => s.teacherId === STATE.currentUser.teacherId);
  }
  function renderRows() {
    const q = document.getElementById('stud-search').value.toLowerCase();
    const students = getBase().filter(s => !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.grade.toLowerCase().includes(q) || s.section.toLowerCase().includes(q));
    document.getElementById('stud-sub').textContent = `${students.length} student(s) found`;
    document.getElementById('stud-tbody').innerHTML = students.length === 0
      ? `<tr><td colspan="8"><div class="empty-state"><div class="es-icon">👥</div><div class="es-title">No students found</div></div></td></tr>`
      : students.map(s => {
          const ov = studentAverage(s.id);
          const honors = getHonors(ov);
          const at = STATE.attendance[s.id];
          const attRate = at ? Math.round(at.total.present/at.total.total*100) : 0;
          return `<tr>
            <td><div class="flex aic gap-10"><div class="av av-32 av-green">${ini(s.name)}</div><div><div class="fw6">${s.name}</div><div class="txs tmm">${s.id}</div></div></div></td>
            <td><span class="txs fw6" style="color:var(--text2)">${s.lrn||'—'}</span></td>
            <td>${s.grade} – ${s.section}</td>
            <td>${s.gender==='F'?'Female':'Male'}</td>
            <td><span class="badge ${gbadge(ov)}">${ov}</span></td>
            <td>${honors ? `<span style="color:var(--gold);font-size:12px;font-weight:600">${honors.icon} ${honors.label}</span>` : '<span class="txs tmm">—</span>'}</td>
            <td><span class="${attRate>=90?'badge bg-green':attRate>=75?'badge bg-amber':'badge bg-red'}">${attRate}%</span></td>
            <td><span class="badge ${s.status==='active'?'bg-green':'bg-gray'}">${s.status}</span></td>
            <td><div class="flex gap-6">
              <button class="btn btn-secondary btn-xs" onclick="viewStudentModal('${s.id}')">View</button>
              ${isTeacher ? `<button class="btn btn-secondary btn-xs" onclick="openEditStudentModal('${s.id}')">Edit</button>
              <button class="btn btn-danger btn-xs" onclick="deleteStudent('${s.id}','${s.name.replace(/'/g,"\\'")}')">Delete</button>` : ''}
            </div></td>
          </tr>`;
        }).join('');
  }
  document.getElementById('stud-search').addEventListener('input', renderRows);
  window.refreshStudentRows = renderRows;
  renderRows();
}

function openAddStudentModal() {
  openModal(`
  <div class="modal-header"><div class="modal-title">Add New Student</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid form-row-2">
      <div class="fg"><label>First Name*</label><input id="sf-fn" placeholder="First name"></div>
      <div class="fg"><label>Last Name*</label><input id="sf-ln" placeholder="Last name"></div>
      <div class="fg"><label>LRN (12 digits)*</label><input id="sf-lrn" placeholder="100200300001" maxlength="12"></div>
      <div class="fg"><label>Grade*</label><select id="sf-gr">${['Grade 1','Grade 2','Grade 3'].map(g=>`<option ${g===STATE.currentUser.grade?'selected':''}>${g}</option>`).join('')}</select></div>
      <div class="fg"><label>Section*</label><input id="sf-sec" value="${STATE.currentUser.section||''}"></div>
      <div class="fg"><label>Gender*</label><select id="sf-gen"><option value="F">Female</option><option value="M">Male</option></select></div>
      <div class="fg"><label>Status</label><select id="sf-st"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
      <div class="fg"><label>Contact Number*</label><input id="sf-con" placeholder="09XXXXXXXXX"></div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveStudent()">Save Student</button></div>`);
}
function saveStudent() {
  const fn=document.getElementById('sf-fn')?.value.trim(), ln=document.getElementById('sf-ln')?.value.trim();
  const lrn=document.getElementById('sf-lrn')?.value.trim();
  const gr=document.getElementById('sf-gr')?.value, sec=document.getElementById('sf-sec')?.value.trim();
  const gen=document.getElementById('sf-gen')?.value, st=document.getElementById('sf-st')?.value;
  const con=document.getElementById('sf-con')?.value.trim();
  if (!fn||!ln||!sec||!con) { toast('Fill all required fields.','error'); return; }
  const id = 'S'+String(STATE.nextStudentId++).padStart(3,'0');
  STATE.students.push({ id, lrn:lrn||'', name:`${fn} ${ln}`, grade:gr, section:sec, gender:gen,
    teacherId:STATE.currentUser.teacherId, parentId:null, contact:con, status:st, enrolled:new Date().toISOString().split('T')[0] });
  STATE.grades[id] = {};
  STATE.attendance[id] = { monthly:[], total:{present:0,absent:0,late:0,total:0} };
  closeModal(); toast(`${fn} ${ln} added!`);
  if (typeof window.refreshStudentRows === 'function') window.refreshStudentRows();
}
function openEditStudentModal(id) {
  const s = STATE.students.find(x=>x.id===id); if (!s) return;
  openModal(`
  <div class="modal-header"><div class="modal-title">Edit Student</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid form-row-2">
      <div class="fg"><label>First Name*</label><input id="ef-fn" value="${s.name.split(' ')[0]}"></div>
      <div class="fg"><label>Last Name*</label><input id="ef-ln" value="${s.name.split(' ').slice(1).join(' ')}"></div>
      <div class="fg"><label>Grade*</label><select id="ef-gr">${['Grade 1','Grade 2','Grade 3'].map(g=>`<option ${g===s.grade?'selected':''}>${g}</option>`).join('')}</select></div>
      <div class="fg"><label>Section</label><input id="ef-sec" value="${s.section}"></div>
      <div class="fg"><label>Gender</label><select id="ef-gen"><option value="F" ${s.gender==='F'?'selected':''}>Female</option><option value="M" ${s.gender==='M'?'selected':''}>Male</option></select></div>
      <div class="fg"><label>Status</label><select id="ef-st"><option value="active" ${s.status==='active'?'selected':''}>Active</option><option value="inactive">Inactive</option></select></div>
      <div class="fg" style="grid-column:span 2"><label>Contact</label><input id="ef-con" value="${s.contact}"></div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="updateStudent('${id}')">Save Changes</button></div>`);
}
function updateStudent(id) {
  const s = STATE.students.find(x=>x.id===id); if (!s) return;
  const fn=document.getElementById('ef-fn')?.value.trim(), ln=document.getElementById('ef-ln')?.value.trim();
  if (!fn||!ln) { toast('Name required.','error'); return; }
  s.name=`${fn} ${ln}`; s.grade=document.getElementById('ef-gr')?.value;
  s.section=document.getElementById('ef-sec')?.value.trim()||s.section;
  s.gender=document.getElementById('ef-gen')?.value; s.status=document.getElementById('ef-st')?.value;
  s.contact=document.getElementById('ef-con')?.value.trim()||s.contact;
  closeModal(); toast('Student updated!');
  if (typeof window.refreshStudentRows==='function') window.refreshStudentRows();
}
function viewStudentModal(id) {
  const s = STATE.students.find(x=>x.id===id);
  const subs = getSubjectsForGrade(s.grade);
  const at = STATE.attendance[id];
  const ov = studentAverage(id);
  const honors = getHonors(ov);
  const parent = STATE.parents.find(p=>p.childId===id);
  openModal(`
  <div class="modal-header"><div class="modal-title">Student Profile</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="flex aic gap-14 mb-16" style="padding-bottom:14px;border-bottom:1px solid var(--border)">
      <div class="av av-52 av-green">${ini(s.name)}</div>
      <div><div style="font-size:20px;font-weight:800">${s.name} ${honors?honors.icon:''}</div>
      <div class="ts tm">${s.grade} – ${s.section} · ${s.gender==='F'?'Female':'Male'}</div>
      <div class="txs tmm mt-4">LRN: <strong>${s.lrn||'Not set'}</strong> · ID: ${s.id}</div>
      ${honors?`<span style="color:var(--gold);font-size:12px;font-weight:700">${honors.label}</span>`:''}
      <div class="flex gap-8 mt-8"><span class="badge ${s.status==='active'?'bg-green':'bg-gray'}">${s.status}</span><span class="badge ${gbadge(ov)}">Average: ${ov}</span></div></div>
    </div>
    ${parent?`<div class="mb-14 p-12" style="background:var(--bg);border-radius:9px"><div class="txs tmm fw7 mb-4">Parent/Guardian</div><div class="fw6">${parent.name}</div><div class="txs tm">${parent.email} · ${parent.phone}</div></div>`:'<div class="mb-14 p-12" style="background:var(--amber-l);border-radius:9px"><div class="txs fw6" style="color:var(--amber)">⚠ No parent linked. Add a parent in Manage Parents.</div></div>'}
    <div class="fw7 ts mb-8">Academic Performance (Subject Averages)</div>
    ${subs.map(sub=>{const sc=subjectAvg(id,sub);return `<div class="flex aic jb" style="padding:8px 0;border-bottom:1px solid var(--border)"><span>${sub}</span><div class="flex aic gap-8"><span class="badge ${gbadge(sc)}">${sc}</span><span class="txs tmm">${glabel(sc)}</span></div></div>`;}).join('')}
    <div style="margin-top:12px;padding:12px;background:var(--bg);border-radius:9px;text-align:center"><div class="txs tmm">Overall Average</div><div style="font-size:28px;font-weight:800;color:${gcol(ov)}">${ov}</div><div class="ts" style="color:${gcol(ov)}">${glabel(ov)}</div></div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>`);
}
function deleteStudent(id,name) {
  showConfirm('Delete Student',`Remove <strong>${name}</strong>?`, ()=>{
    STATE.students.splice(STATE.students.findIndex(s=>s.id===id),1);
    toast(`${name} removed.`); if(typeof window.refreshStudentRows==='function') window.refreshStudentRows(); else nav('students');
  });
}
function exportStudents() {
  const rows = [['ID','Name','Grade','Section','Gender','Contact','Average','Status']];
  STATE.students.filter(s=>s.teacherId===STATE.currentUser.teacherId).forEach(s=>rows.push([s.id,s.name,s.grade,s.section,s.gender,s.contact,studentAverage(s.id),s.status]));
  const csv = rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
  const a=document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download='students.csv'; a.click();
  toast('Exported!');
}

/* ════════════════════════════════════════════════════════════════════════════
   GRADES PAGE — with per-subject quarter entry & auto-alert
   ════════════════════════════════════════════════════════════════════════════ */
function pgGrades(el) {
  const role=STATE.currentUser.role, isParent=role==='parent', isPrincipal=role==='principal', isTeacher=role==='teacher';
  let activeQ=0, changed={};

  function getStudents() {
    if (isParent)    return STATE.students.filter(s=>s.id===STATE.currentUser.childId);
    if (isPrincipal) return STATE.students.filter(s=>STATE.grades[s.id]);
    return STATE.students.filter(s=>s.teacherId===STATE.currentUser.teacherId&&s.status==='active');
  }

  function render() {
    const students = getStudents();
    const repGrade = students[0]?.grade || 'Grade 1';
    const subs = getSubjectsForGrade(repGrade);
    const showFinal = activeQ === 4;

    el.innerHTML = `
    <div class="page-head">
      <div><div class="page-title">${isParent?'Academic Record':isPrincipal?'Grade Overview':'Grade Entry'}</div>
      <div class="page-sub">${isParent?STATE.students.find(s=>s.id===STATE.currentUser.childId)?.name:isTeacher?`${STATE.currentUser.grade} – ${STATE.currentUser.section}`:'All Sections'}</div></div>
      ${isTeacher?`<div class="page-actions"><button class="btn btn-secondary" onclick="resetGradesQ()">Reset Quarter</button><button class="btn btn-primary" onclick="saveGradesQ()">💾 Save Grades</button></div>`:''}
    </div>
    <div class="tab-bar">
      ${QUARTERS.map((q,i)=>`<button class="tab-btn ${i===activeQ?'active':''}" data-qi="${i}">${q}</button>`).join('')}
      <button class="tab-btn ${activeQ===4?'active':''}" data-qi="4">Final Average</button>
    </div>
    <div class="tbl-wrap"><table>
      <thead><tr><th>Student</th>${showFinal ? QUARTERS.map(q=>`<th>${q} Avg</th>`).join('')+'<th>Final</th>' : subs.map(s=>`<th>${s}</th>`).join('')}<th>Quarter Avg</th><th>Remarks</th></tr></thead>
      <tbody>${students.map(s=>{
        const g=STATE.grades[s.id]||{};
        const studentSubs = getSubjectsForGrade(s.grade);
        if (showFinal) {
          const qAvgs = QUARTERS.map((_,qi) => {
            const vals = studentSubs.map(sub=>(g[sub]&&g[sub][qi])||0).filter(v=>v>0);
            return vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : 0;
          });
          const fin = qAvgs.filter(v=>v>0).length ? Math.round(qAvgs.filter(v=>v>0).reduce((a,b)=>a+b,0)/qAvgs.filter(v=>v>0).length) : 0;
          const honors = getHonors(fin);
          return `<tr><td><div class="flex aic gap-8"><div class="av av-32 av-green">${ini(s.name)}</div><div><div class="fw6">${s.name}</div><div class="txs tmm">${s.grade}–${s.section}</div></div></div></td>${qAvgs.map(qa=>`<td><span class="badge ${gbadge(qa)}">${qa||'—'}</span></td>`).join('')}<td><strong style="font-size:15px;color:${gcol(fin)}">${fin}</strong></td><td><span class="badge ${gbadge(fin)}">${glabel(fin)}</span>${honors?`<div class="txs" style="color:var(--gold)">${honors.icon} ${honors.label}</div>`:''}</td></tr>`;
        }
        const scores = studentSubs.map(sub=>(g[sub]&&g[sub][activeQ])||0);
        const nonZero = scores.filter(v=>v>0);
        const qa = nonZero.length ? Math.round(nonZero.reduce((a,b)=>a+b,0)/nonZero.length) : 0;
        return `<tr><td><div class="flex aic gap-8"><div class="av av-32 av-green">${ini(s.name)}</div><div><div class="fw6">${s.name}</div><div class="txs tmm">${s.grade}–${s.section}</div></div></div></td>${studentSubs.map((sub,i)=>{
          const sc=scores[i];
          if (!isTeacher) return `<td><span class="badge ${gbadge(sc)}">${sc||'—'}</span></td>`;
          const key=`${s.id}-${sub}-${activeQ}`;
          return `<td><input class="grade-cell ${changed[key]?'changed':''}" type="number" min="0" max="100" value="${sc||''}" placeholder="0" data-sid="${s.id}" data-sub="${sub}" data-qi="${activeQ}" onchange="onGradeChange(this,'${key}')"></td>`;
        }).join('')}<td><strong style="color:${gcol(qa)}">${qa||'—'}</strong></td><td><span class="badge ${gbadge(qa)}">${qa?glabel(qa):'—'}</span></td></tr>`;
      }).join('')}</tbody>
    </table></div>`;

    el.querySelectorAll('.tab-btn').forEach(btn => { btn.onclick=()=>{ activeQ=parseInt(btn.dataset.qi); changed={}; render(); }; });
  }

  window.onGradeChange = (inp, key) => {
    let v = parseInt(inp.value)||0; if(v<0)v=0; if(v>100)v=100; inp.value=v;
    const sid=inp.dataset.sid, sub=inp.dataset.sub, qi=parseInt(inp.dataset.qi);
    if (!STATE.grades[sid]) STATE.grades[sid]={};
    if (!STATE.grades[sid][sub]) STATE.grades[sid][sub]=[0,0,0,0];
    STATE.grades[sid][sub][qi]=v;
    changed[key]=true; inp.classList.add('changed');
    // Auto-alert check
    if (v < 75 && v > 0) {
      const sent = checkAndSendFailingAlerts(sid, sub, QUARTERS[qi], v, STATE.currentUser.name);
      if (sent) { toast(`⚠️ Alert sent to parent: ${STATE.students.find(s=>s.id===sid)?.name} failed ${sub}`, 'alert'); updateUnreadBadge(); buildSidebar(STATE.currentUser.role); }
    }
  };
  window.saveGradesQ = () => { changed={}; toast('Grades saved successfully!'); render(); };
  window.resetGradesQ = () => {
    getStudents().forEach(s=>{
      if(!STATE.grades[s.id]) STATE.grades[s.id]={};
      getSubjectsForGrade(s.grade).forEach(sub=>{ if(!STATE.grades[s.id][sub]) STATE.grades[s.id][sub]=[0,0,0,0]; STATE.grades[s.id][sub][activeQ]=0; });
    });
    changed={}; render(); toast('Quarter grades reset.','info');
  };
  render();
}

/* ════════════════════════════════════════════════════════════════════════════
   REPORT CARD PAGE — DepEd SF9 style
   ════════════════════════════════════════════════════════════════════════════ */
function pgReportCard(el) {
  const role = STATE.currentUser.role;
  let students = [];
  if (role === 'parent') {
    students = STATE.students.filter(s=>s.id===STATE.currentUser.childId);
  } else if (role === 'teacher') {
    students = STATE.students.filter(s=>s.teacherId===STATE.currentUser.teacherId && s.status==='active');
  } else {
    students = STATE.students.filter(s=>s.status==='active');
  }

  let selStudentId = students[0]?.id || null;

  function renderRC() {
    const s = STATE.students.find(x=>x.id===selStudentId);
    if (!s) { el.innerHTML='<div class="empty-state"><div class="es-title">No student selected</div></div>'; return; }
    const subs = getSubjectsForGrade(s.grade);
    const g = STATE.grades[s.id]||{};
    const at = STATE.attendance[s.id];
    const teacher = STATE.teachers.find(t=>t.id===s.teacherId);
    const parent = STATE.parents.find(p=>p.childId===s.id);
    const ov = studentAverage(s.id);
    const honors = getHonors(ov);

    // Monthly attendance from monthly array
    const months = at ? at.monthly : [];
    const totalAtt = at ? at.total : {present:0,absent:0,late:0,total:0};

    el.innerHTML = `
    <div class="page-head">
      <div><div class="page-title">Report Card</div><div class="page-sub">DepEd SF9 Format · SY 2024-2025</div></div>
      <div class="page-actions">
        ${students.length > 1 ? `<select class="btn btn-secondary" id="rc-student-sel" onchange="selStudentId=this.value;renderRC()">
          ${students.map(st=>`<option value="${st.id}" ${st.id===selStudentId?'selected':''}>${st.name}</option>`).join('')}
        </select>` : ''}
        <button class="btn btn-secondary" onclick="printReportCard()">🖨 Print</button>
      </div>
    </div>

    <div id="rc-print-area">
    <!-- Report Card Wrapper -->
    <div class="rc-card">
      <!-- Header -->
      <div class="rc-header">
        <div class="rc-logo-area">
          <div style="width:60px;height:60px;border-radius:50%;background:var(--green-l);display:flex;align-items:center;justify-content:center;font-size:24px">🏫</div>
        </div>
        <div class="rc-school-info">
          <div class="rc-republic">Republic of the Philippines</div>
          <div class="rc-deped">Department of Education</div>
          <div class="rc-region">Region V – Bicol Region · Division of Albay</div>
          <div class="rc-school-name">Polangui South Central School</div>
          <div class="rc-address">Polangui, Albay</div>
        </div>
        <div class="rc-logo-area">
          <div style="width:60px;height:60px;border-radius:50%;background:var(--amber-l);display:flex;align-items:center;justify-content:center;font-size:22px">🇵🇭</div>
        </div>
      </div>
      <div class="rc-title-bar">SCHOOL REPORT CARD (SF9)</div>

      <!-- Learner Info -->
      <div class="rc-section-title">LEARNER INFORMATION</div>
      <div class="rc-info-grid">
        <div class="rc-info-row"><span class="rc-label">LRN / ID:</span><span class="rc-value fw7">${s.id}</span></div>
        <div class="rc-info-row"><span class="rc-label">Learner's Name:</span><span class="rc-value fw7">${s.name}</span></div>
        <div class="rc-info-row"><span class="rc-label">Grade Level:</span><span class="rc-value">${s.grade}</span></div>
        <div class="rc-info-row"><span class="rc-label">Section:</span><span class="rc-value">${s.section}</span></div>
        <div class="rc-info-row"><span class="rc-label">Sex:</span><span class="rc-value">${s.gender==='F'?'Female':'Male'}</span></div>
        <div class="rc-info-row"><span class="rc-label">School Year:</span><span class="rc-value">2024-2025</span></div>
        <div class="rc-info-row"><span class="rc-label">Adviser:</span><span class="rc-value">${teacher?.name||'—'}</span></div>
        <div class="rc-info-row"><span class="rc-label">Parent/Guardian:</span><span class="rc-value">${parent?.name||'Not linked'}</span></div>
      </div>

      <!-- Grades Table -->
      <div class="rc-section-title" style="margin-top:16px">LEARNER'S ACADEMIC PROGRESS REPORT</div>
      <table class="rc-table">
        <thead>
          <tr><th rowspan="2">Learning Area</th><th colspan="4">Quarter</th><th rowspan="2">Final Grade</th><th rowspan="2">Descriptor</th></tr>
          <tr><th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th></tr>
        </thead>
        <tbody>
          ${subs.map(sub => {
            const scores = g[sub]||[0,0,0,0];
            const fin = scores.filter(v=>v>0).length ? Math.round(scores.filter(v=>v>0).reduce((a,b)=>a+b,0)/scores.filter(v=>v>0).length) : 0;
            return `<tr>
              <td class="rc-subject">${sub}</td>
              ${scores.map(sc=>`<td class="rc-score" style="${sc>0&&sc<75?'color:var(--red);font-weight:700':sc>=90?'color:var(--green);font-weight:700':''}">${sc||'—'}</td>`).join('')}
              <td class="rc-final" style="color:${gcol(fin)};font-weight:800">${fin||'—'}</td>
              <td class="rc-desc">${fin?glabel(fin):'—'}</td>
            </tr>`;
          }).join('')}
          <tr class="rc-total-row">
            <td class="rc-subject" style="font-weight:800">General Average</td>
            ${QUARTERS.map((_,qi)=>{
              const vals=subs.map(sub=>(g[sub]&&g[sub][qi])||0).filter(v=>v>0);
              const qa=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
              return `<td class="rc-score" style="font-weight:800;color:${gcol(qa)}">${qa||'—'}</td>`;
            }).join('')}
            <td class="rc-final" style="font-size:16px;font-weight:900;color:${gcol(ov)}">${ov||'—'}</td>
            <td class="rc-desc" style="font-weight:700">${ov?glabel(ov):'—'}</td>
          </tr>
        </tbody>
      </table>

      ${honors ? `<div class="rc-honors-badge"><span style="font-size:20px">${honors.icon}</span> <strong>${honors.label}</strong> — General Average: ${ov}</div>` : ''}

      <!-- Attendance Table -->
      <div class="rc-section-title" style="margin-top:16px">ATTENDANCE REPORT</div>
      <table class="rc-table rc-att-table">
        <thead><tr><th>Month</th><th>Days Present</th><th>Days Absent</th><th>Days Late</th><th>School Days</th></tr></thead>
        <tbody>
          ${months.length > 0 ? months.map(m=>`<tr>
            <td class="rc-subject">${m.m}</td>
            <td class="rc-score" style="color:var(--green)">${m.p}</td>
            <td class="rc-score" style="color:var(--red)">${m.a}</td>
            <td class="rc-score" style="color:var(--amber)">${m.l}</td>
            <td class="rc-score">${m.t}</td>
          </tr>`).join('') : '<tr><td colspan="5" style="text-align:center;color:var(--text3);padding:12px">No monthly data available</td></tr>'}
          <tr class="rc-total-row">
            <td class="rc-subject" style="font-weight:800">TOTAL</td>
            <td class="rc-score" style="font-weight:800;color:var(--green)">${totalAtt.present}</td>
            <td class="rc-score" style="font-weight:800;color:var(--red)">${totalAtt.absent}</td>
            <td class="rc-score" style="font-weight:800;color:var(--amber)">${totalAtt.late}</td>
            <td class="rc-score" style="font-weight:800">${totalAtt.total}</td>
          </tr>
        </tbody>
      </table>

      <!-- Grading Scale -->
      <div class="rc-section-title" style="margin-top:16px">GRADING SCALE</div>
      <div class="rc-scale-grid">
        ${[['90–100','Outstanding'],['85–89','Very Satisfactory'],['80–84','Satisfactory'],['75–79','Fairly Satisfactory'],['Below 75','Did Not Meet Expectations']].map(([r,d])=>`<div class="rc-scale-item"><span class="rc-scale-range">${r}</span><span class="rc-scale-desc">${d}</span></div>`).join('')}
      </div>

      <!-- Signatures -->
      <div class="rc-sig-row">
        <div class="rc-sig-block"><div class="rc-sig-line"></div><div class="rc-sig-name">${teacher?.name||'Class Adviser'}</div><div class="rc-sig-role">Class Adviser / Teacher</div></div>
        <div class="rc-sig-block"><div class="rc-sig-line"></div><div class="rc-sig-name">Principal Roberto Cruz</div><div class="rc-sig-role">School Principal</div></div>
        <div class="rc-sig-block"><div class="rc-sig-line"></div><div class="rc-sig-name">${parent?.name||'Parent / Guardian'}</div><div class="rc-sig-role">Parent / Guardian</div></div>
      </div>
    </div>
    </div>`;

    // re-attach select listener
    document.getElementById('rc-student-sel')?.addEventListener('change', e => { selStudentId=e.target.value; renderRC(); });
  }

  window.renderRC = renderRC;
  window.printReportCard = () => {
    const content = document.getElementById('rc-print-area')?.innerHTML;
    const w = window.open('','_blank');
    w.document.write(`<!DOCTYPE html><html><head><title>Report Card</title>
    <style>
      body{font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:12px;color:#000;margin:20px}
      .rc-card{max-width:780px;margin:0 auto;border:2px solid #000;padding:16px}
      .rc-header{display:flex;align-items:center;justify-content:space-between;text-align:center;margin-bottom:12px}
      .rc-school-name{font-size:15px;font-weight:800}
      .rc-republic,.rc-deped,.rc-region,.rc-address{font-size:11px}
      .rc-title-bar{background:#1856A8;color:#fff;text-align:center;font-weight:800;font-size:14px;padding:8px;margin-bottom:12px}
      .rc-section-title{background:#E8EFFF;font-weight:800;font-size:11px;padding:5px 8px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
      .rc-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px}
      .rc-info-row{display:flex;gap:8px;font-size:11px;padding:3px 0;border-bottom:1px solid #eee}
      .rc-label{color:#666;min-width:120px}.rc-value{font-weight:500}.fw7{font-weight:700}
      .rc-table{width:100%;border-collapse:collapse;margin-bottom:8px;font-size:11px}
      .rc-table th,.rc-table td{border:1px solid #ccc;padding:5px 8px;text-align:center}
      .rc-table th{background:#E8EFFF;font-weight:700}
      .rc-subject{text-align:left!important;font-weight:500}
      .rc-total-row{background:#F5F4F0}
      .rc-honors-badge{background:#FFF4C2;border:2px solid #C79800;border-radius:8px;padding:10px 16px;text-align:center;font-size:13px;margin:8px 0}
      .rc-att-table th,.rc-att-table td{padding:4px 8px}
      .rc-scale-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-bottom:12px}
      .rc-scale-item{border:1px solid #ccc;border-radius:4px;padding:6px;text-align:center;font-size:10px}
      .rc-scale-range{display:block;font-weight:700;margin-bottom:3px}
      .rc-sig-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:20px}
      .rc-sig-block{text-align:center}
      .rc-sig-line{border-bottom:1px solid #000;margin-bottom:4px;height:40px}
      .rc-sig-name{font-weight:700;font-size:11px}.rc-sig-role{font-size:10px;color:#666}
    </style></head><body>${content}</body></html>`);
    w.document.close(); setTimeout(()=>w.print(),500);
  };
  renderRC();
}

/* ════════════════════════════════════════════════════════════════════════════
   RANKING PAGE — per section & per grade, with honors
   ════════════════════════════════════════════════════════════════════════════ */
function pgRanking(el) {
  const role = STATE.currentUser.role;
  let viewMode = 'section'; // 'section' | 'grade'
  let selGrade = 'Grade 1';
  let selSection = STATE.classes[0]?.section || 'Sampaguita';

  function render() {
    const grades = ['Grade 1','Grade 2','Grade 3'];
    const sectionsList = [...new Set(STATE.classes.map(c=>`${c.grade}|${c.section}`))];

    let students = STATE.students.filter(s=>s.status==='active');
    let title = '';
    if (viewMode === 'section') {
      const cls = STATE.classes.find(c=>c.section===selSection);
      students = students.filter(s=>s.section===selSection);
      title = `${cls?.grade||''} – ${selSection}`;
    } else {
      students = students.filter(s=>s.grade===selGrade);
      title = selGrade;
    }

    // If teacher, restrict to own class (unless principal)
    if (role === 'teacher') {
      students = students.filter(s=>s.teacherId===STATE.currentUser.teacherId);
      viewMode = 'section'; selSection = STATE.currentUser.section; title = `${STATE.currentUser.grade} – ${STATE.currentUser.section}`;
    }

    const ranked = students.map(s=>({ ...s, avg: studentAverage(s.id) })).sort((a,b)=>b.avg-a.avg);
    const highestHonors = ranked.filter(s=>s.avg>=98);
    const highHonors    = ranked.filter(s=>s.avg>=95&&s.avg<98);
    const honors        = ranked.filter(s=>s.avg>=90&&s.avg<95);

    el.innerHTML = `
    <div class="page-head">
      <div><div class="page-title">Class Ranking 🏆</div><div class="page-sub">${title} — ${ranked.length} students</div></div>
      ${role==='principal'?`<div class="page-actions">
        <select class="btn btn-secondary" onchange="viewMode=this.value;render()">
          <option value="section" ${viewMode==='section'?'selected':''}>By Section</option>
          <option value="grade"   ${viewMode==='grade'  ?'selected':''}>By Grade Level</option>
        </select>
        ${viewMode==='section'
          ? `<select class="btn btn-secondary" onchange="selSection=this.value;render()">${[...new Set(STATE.classes.map(c=>c.section))].map(s=>`<option ${s===selSection?'selected':''}>${s}</option>`).join('')}</select>`
          : `<select class="btn btn-secondary" onchange="selGrade=this.value;render()">${grades.map(g=>`<option ${g===selGrade?'selected':''}>${g}</option>`).join('')}</select>`}
      </div>`:''}
    </div>

    <!-- Honors Summary Cards -->
    ${highestHonors.length+highHonors.length+honors.length > 0 ? `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
      <div class="card" style="background:linear-gradient(135deg,#FFF4C2,#fff);border-color:var(--gold);text-align:center">
        <div style="font-size:32px">🏆</div>
        <div style="font-size:18px;font-weight:800;color:var(--gold);margin:6px 0">With Highest Honors</div>
        <div style="font-size:28px;font-weight:900;color:var(--text)">${highestHonors.length}</div>
        <div class="txs tmm">Average 98–100</div>
        ${highestHonors.length>0?`<div class="mt-8">${highestHonors.map(s=>`<div class="txs fw6">${s.name}</div>`).join('')}</div>`:''}
      </div>
      <div class="card" style="background:linear-gradient(135deg,#E8F0FF,#fff);border-color:var(--blue);text-align:center">
        <div style="font-size:32px">🥇</div>
        <div style="font-size:18px;font-weight:800;color:var(--blue);margin:6px 0">With High Honors</div>
        <div style="font-size:28px;font-weight:900;color:var(--text)">${highHonors.length}</div>
        <div class="txs tmm">Average 95–97</div>
        ${highHonors.length>0?`<div class="mt-8">${highHonors.map(s=>`<div class="txs fw6">${s.name}</div>`).join('')}</div>`:''}
      </div>
      <div class="card" style="background:linear-gradient(135deg,var(--green-l),#fff);border-color:var(--green);text-align:center">
        <div style="font-size:32px">🥈</div>
        <div style="font-size:18px;font-weight:800;color:var(--green);margin:6px 0">With Honors</div>
        <div style="font-size:28px;font-weight:900;color:var(--text)">${honors.length}</div>
        <div class="txs tmm">Average 90–94</div>
        ${honors.length>0?`<div class="mt-8">${honors.map(s=>`<div class="txs fw6">${s.name}</div>`).join('')}</div>`:''}
      </div>
    </div>` : ''}

    <!-- Full Rankings Table -->
    <div class="tbl-wrap">
      <div class="tbl-toolbar"><span class="ts fw7">Complete Rankings — ${title}</span></div>
      <table>
        <thead><tr><th>#</th><th>Student</th><th>LRN</th><th>Grade & Section</th>${getSubjectsForGrade(ranked[0]?.grade||'Grade 1').map(s=>`<th style="font-size:10px">${s.replace(' ','\u00A0')}</th>`).join('')}<th>Average</th><th>Honors</th></tr></thead>
        <tbody>
          ${ranked.map((s,i)=>{
            const subs2 = getSubjectsForGrade(s.grade);
            const h = getHonors(s.avg);
            return `<tr style="${i<3?'background:linear-gradient(90deg,rgba(199,152,0,.06),transparent)':''}">
              <td><div style="width:28px;height:28px;border-radius:50%;background:${i===0?'#C79800':i===1?'#C0C0C0':i===2?'#CD7F32':'var(--surface2)'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:${i<3?'#fff':'var(--text2)'}">${i+1}</div></td>
              <td><div class="flex aic gap-8"><div class="av av-32 av-green">${ini(s.name)}</div><div class="fw6">${s.name}</div></div></td>
              <td class="txs tm">${s.lrn||'—'}</td>
              <td class="txs tm">${s.grade} – ${s.section}</td>
              ${subs2.map(sub=>{const sc=subjectAvg(s.id,sub);return `<td><span class="${sc<75&&sc>0?'badge bg-red':sc>=90?'badge bg-green':sc>0?'badge bg-blue':'txs tmm'}">${sc||'—'}</span></td>`;}).join('')}
              <td><strong style="font-size:16px;color:${gcol(s.avg)}">${s.avg}</strong></td>
              <td>${h?`<span style="color:var(--gold);font-size:12px;white-space:nowrap">${h.icon} ${h.label}</span>`:'<span class="txs tmm">—</span>'}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
    // make viewMode/selGrade/selSection available to inline onchange
    window._rankViewMode = viewMode;
  }
  window.render = render;
  render();
}

/* ════════════════════════════════════════════════════════════════════════════
   ATTENDANCE PAGE — with calendar grid for parent, mark-today for teacher
   ════════════════════════════════════════════════════════════════════════════ */
function pgAttendance(el) {
  const role=STATE.currentUser.role, isParent=role==='parent', isPrincipal=role==='principal', isTeacher=role==='teacher';
  const monthNames=['June','July','August','September','October','November','December','January','February','March','April','May'];
  // Month start days (0=Sun) and day counts for SY 2024-2025
  const monthMeta=[
    {days:30,start:6},{days:31,start:1},{days:31,start:4},{days:30,start:0},
    {days:31,start:2},{days:30,start:5},{days:31,start:0},{days:31,start:3},
    {days:28,start:6},{days:31,start:6},{days:30,start:2},{days:31,start:4}
  ];
  let selMonth=0, todayRecords={};

  function getStudents() {
    if(isParent) return STATE.students.filter(s=>s.id===STATE.currentUser.childId);
    if(isPrincipal) return STATE.students.filter(s=>STATE.attendance[s.id]);
    return STATE.students.filter(s=>s.teacherId===STATE.currentUser.teacherId&&s.status==='active');
  }

  // Build a simple calendar for parent view
  function buildCalendar(sid, monthIdx) {
    const mn = monthNames[monthIdx];
    const meta = monthMeta[monthIdx];
    const at = STATE.attendance[sid];
    const rec = at?.monthly?.find(m=>m.m===mn) || {p:0,a:0,l:0,t:0};
    const days = meta.days;
    const start = meta.start; // day of week for 1st (0=Sun)
    const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    // Mock day statuses from record totals (distribute P/A/L across school days Mon-Fri)
    const statuses = {};
    let pLeft=rec.p, aLeft=rec.a, lLeft=rec.l;
    for(let d=1;d<=days;d++){
      const dow=(start+d-1)%7;
      if(dow===0||dow===6){statuses[d]='weekend';continue;}
      if(aLeft>0){statuses[d]='A';aLeft--;}
      else if(lLeft>0){statuses[d]='L';lLeft--;}
      else if(pLeft>0){statuses[d]='P';pLeft--;}
      else{statuses[d]='none';}
    }

    const colorMap={P:'#DCE6FF',A:'#FDECEC',L:'#FFF4C2',weekend:'#F5F4F0',none:'#fff'};
    const textMap={P:'#2A76C9',A:'#B52B2B',L:'#C79800',weekend:'#9E9C94',none:'#ccc'};

    let cells='';
    // Empty cells before 1st
    for(let i=0;i<start;i++) cells+=`<div></div>`;
    for(let d=1;d<=days;d++){
      const st=statuses[d];
      cells+=`<div style="aspect-ratio:1;border-radius:6px;background:${colorMap[st]};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:${textMap[st]}">${d}</div>`;
    }

    return `<div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:6px">
        ${dayLabels.map(d=>`<div style="font-size:9px;font-weight:700;text-align:center;color:var(--text3);padding:3px 0">${d}</div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">${cells}</div>
      <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text2)"><div style="width:10px;height:10px;border-radius:3px;background:#DCE6FF"></div>Present</div>
        <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text2)"><div style="width:10px;height:10px;border-radius:3px;background:#FDECEC"></div>Absent</div>
        <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text2)"><div style="width:10px;height:10px;border-radius:3px;background:#FFF4C2"></div>Late</div>
        <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text2)"><div style="width:10px;height:10px;border-radius:3px;background:#F5F4F0"></div>Weekend</div>
      </div>
    </div>`;
  }

  function render() {
    const students=getStudents();
    el.innerHTML=`
    <div class="page-head">
      <div><div class="page-title">Attendance ${isParent?'Record':isPrincipal?'Overview':'Tracking'}</div><div class="page-sub">SY 2024-2025</div></div>
      ${isTeacher?`<button class="btn btn-primary" onclick="saveAttendanceRecord()">💾 Save Attendance</button>`:''}
    </div>

    <!-- Month selector -->
    <div class="card mb-16" style="padding:14px 16px">
      <div class="flex aic gap-16 flex-wrap">
        <div class="flex aic gap-10">
          <label class="txs tmm fw7">MONTH:</label>
          <select id="att-month-sel" style="padding:8px 12px;border:1.5px solid var(--border);border-radius:var(--r);font-size:13px;outline:none;font-family:inherit" onchange="selMonth=parseInt(this.value);todayRecords={};render()">
            ${monthNames.map((m,i)=>`<option value="${i}" ${i===selMonth?'selected':''}>${m}</option>`).join('')}
          </select>
        </div>
        ${isTeacher?`<div class="flex gap-8">
          <span class="badge bg-green">P = Present</span>
          <span class="badge bg-red">A = Absent</span>
          <span class="badge bg-amber">L = Late</span>
        </div>`:''}
      </div>
    </div>

    ${isParent ? `
    <!-- Parent: calendar + summary side by side -->
    <div class="g2 mb-16">
      <div class="card">
        <div class="card-title">${monthNames[selMonth]} Calendar</div>
        ${buildCalendar(STATE.currentUser.childId, selMonth)}
      </div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="card">
          <div class="card-title">Summary — ${monthNames[selMonth]}</div>
          ${(()=>{
            const at=STATE.attendance[STATE.currentUser.childId];
            const rec=at?.monthly?.find(m=>m.m===monthNames[selMonth])||{p:0,a:0,l:0,t:0};
            const rate=rec.t?Math.round(rec.p/rec.t*100):0;
            return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
              <div style="padding:12px;background:var(--green-l);border-radius:9px;text-align:center"><div style="font-size:24px;font-weight:800;color:var(--green)">${rec.p}</div><div class="txs tm">Present</div></div>
              <div style="padding:12px;background:var(--red-l);border-radius:9px;text-align:center"><div style="font-size:24px;font-weight:800;color:var(--red)">${rec.a}</div><div class="txs tm">Absent</div></div>
              <div style="padding:12px;background:var(--amber-l);border-radius:9px;text-align:center"><div style="font-size:24px;font-weight:800;color:var(--amber)">${rec.l}</div><div class="txs tm">Late</div></div>
              <div style="padding:12px;background:var(--surface2);border-radius:9px;text-align:center"><div style="font-size:24px;font-weight:800;color:${rate>=90?'var(--green)':rate>=75?'var(--amber)':'var(--red)'}">${rate}%</div><div class="txs tm">Rate</div></div>
            </div>`;
          })()}
        </div>
        <!-- All months breakdown -->
        <div class="card">
          <div class="card-title">All Months</div>
          <table style="width:100%;border-collapse:collapse;font-size:12.5px">
            <thead><tr style="background:var(--surface2)">
              <th style="padding:7px 8px;text-align:left;border-bottom:1px solid var(--border)">Month</th>
              <th style="padding:7px 8px;text-align:center;border-bottom:1px solid var(--border)">P</th>
              <th style="padding:7px 8px;text-align:center;border-bottom:1px solid var(--border)">A</th>
              <th style="padding:7px 8px;text-align:center;border-bottom:1px solid var(--border)">L</th>
              <th style="padding:7px 8px;text-align:center;border-bottom:1px solid var(--border)">Rate</th>
            </tr></thead>
            <tbody>${(()=>{
              const at=STATE.attendance[STATE.currentUser.childId];
              if(!at||!at.monthly.length) return `<tr><td colspan="5" style="padding:14px;text-align:center;color:var(--text3)">No records yet</td></tr>`;
              return at.monthly.map(m=>`<tr style="border-bottom:1px solid var(--border)">
                <td style="padding:6px 8px;font-weight:600">${m.m}</td>
                <td style="padding:6px 8px;text-align:center;color:var(--green);font-weight:600">${m.p}</td>
                <td style="padding:6px 8px;text-align:center;color:var(--red);font-weight:600">${m.a}</td>
                <td style="padding:6px 8px;text-align:center;color:var(--amber);font-weight:600">${m.l}</td>
                <td style="padding:6px 8px;text-align:center"><span class="badge ${m.t&&Math.round(m.p/m.t*100)>=90?'bg-green':m.t&&Math.round(m.p/m.t*100)>=75?'bg-amber':'bg-red'}">${m.t?Math.round(m.p/m.t*100)+'%':'—'}</span></td>
              </tr>`).join('');
            })()}</tbody>
          </table>
        </div>
      </div>
    </div>` : `
    <!-- Teacher / Principal: mark-today table -->
    <div class="tbl-wrap mb-16">
      <div class="tbl-toolbar"><span class="ts fw7">${monthNames[selMonth]} — Attendance</span></div>
      <table>
        <thead><tr>
          <th>Student</th><th>Present</th><th>Absent</th><th>Late</th><th>School Days</th><th>Rate</th>
          ${isTeacher?`<th>Mark Today</th>`:''}
        </tr></thead>
        <tbody>${students.map(s=>{
          const at=STATE.attendance[s.id];
          const monthly=at?.monthly?.find(m=>m.m===monthNames[selMonth])||{p:0,a:0,l:0,t:0};
          const totalAt=at?at.total:{present:0,absent:0,late:0,total:0};
          const rate=totalAt.total?Math.round(totalAt.present/totalAt.total*100):0;
          const cur=todayRecords[s.id]||'Present';
          return `<tr>
            <td><div class="flex aic gap-8"><div class="av av-32 av-green">${ini(s.name)}</div><div><div class="fw6">${s.name}</div><div class="txs tmm">${s.grade}–${s.section}</div></div></div></td>
            <td><span class="badge bg-green">${monthly.p}</span></td>
            <td><span class="badge bg-red">${monthly.a}</span></td>
            <td><span class="badge bg-amber">${monthly.l}</span></td>
            <td>${monthly.t}</td>
            <td><div class="flex aic gap-6">
              <div style="flex:1;height:5px;background:var(--surface2);border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${rate}%;background:${rate>=90?'var(--green)':rate>=75?'var(--amber)':'var(--red)'}"></div>
              </div>
              <span class="txs fw6" style="color:${rate>=90?'var(--green)':rate>=75?'var(--amber)':'var(--red)'};min-width:32px">${rate}%</span>
            </div></td>
            ${isTeacher?`<td><select style="padding:6px 10px;border:1.5px solid var(--border);border-radius:7px;font-size:13px;outline:none;font-family:inherit" data-sid="${s.id}" onchange="todayRecords[this.dataset.sid]=this.value">
              <option ${cur==='Present'?'selected':''}>Present</option>
              <option ${cur==='Absent'?'selected':''}>Absent</option>
              <option ${cur==='Late'?'selected':''}>Late</option>
            </select></td>`:''}
          </tr>`;
        }).join('')}</tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-title">Overall Attendance Rate</div>
      ${students.map(s=>{
        const at=STATE.attendance[s.id];
        const t=at?at.total:{present:0,total:0};
        const rate=t.total?Math.round(t.present/t.total*100):0;
        return `<div class="prog-wrap">
          <div class="prog-top">
            <span class="ts fw6">${s.name}${isPrincipal?` <span class="txs tmm">– ${s.grade} ${s.section}</span>`:''}</span>
            <span class="ts" style="color:${rate>=90?'var(--green)':rate>=75?'var(--amber)':'var(--red)'}">${rate}%</span>
          </div>
          <div class="prog-track"><div class="prog-fill" style="width:${rate}%;background:${rate>=90?'var(--green)':rate>=75?'var(--amber)':'var(--red)'}"></div></div>
        </div>`;
      }).join('')}
    </div>`}`;

    window.saveAttendanceRecord = () => {
      const mn=monthNames[selMonth];
      getStudents().forEach(s=>{
        if(!STATE.attendance[s.id]) STATE.attendance[s.id]={monthly:[],total:{present:0,absent:0,late:0,total:0}};
        const at=STATE.attendance[s.id];
        const val=todayRecords[s.id]||'Present';
        let mRec=at.monthly.find(x=>x.m===mn);
        if(!mRec){mRec={m:mn,p:0,a:0,l:0,t:0};at.monthly.push(mRec);}
        if(val==='Absent'){mRec.a++;at.total.absent++;}
        else if(val==='Late'){mRec.l++;mRec.p++;at.total.late++;at.total.present++;}
        else{mRec.p++;at.total.present++;}
        mRec.t++;at.total.total++;
      });
      todayRecords={};
      toast(`Attendance saved for ${monthNames[selMonth]}!`);
      render();
    };
  }
  render();
}

/* ════════════════════════════════════════════════════════════════════════════
   PARENTS — Teacher manages parents (add, edit, link to student)
   ════════════════════════════════════════════════════════════════════════════ */
function pgParentsTeacher(el) {
  const myStudents = STATE.students.filter(s=>s.teacherId===STATE.currentUser.teacherId);
  el.innerHTML = `
    <div class="page-head">
      <div><div class="page-title">Manage Parents</div><div class="page-sub" id="par-sub"></div></div>
      <div class="page-actions"><button class="btn btn-primary" onclick="openAddParentTeacherModal()">+ Add Parent</button></div>
    </div>
    <div class="tbl-wrap">
      <div class="tbl-toolbar"><input id="par-search" class="tbl-search" placeholder="🔍 Search parents..."></div>
      <table>
        <thead><tr><th>Parent/Guardian</th><th>Email</th><th>Phone</th><th>Child (Student)</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody id="par-tbody"></tbody>
      </table>
    </div>`;

  function renderRows() {
    const q = document.getElementById('par-search').value.toLowerCase();
    const myParents = STATE.parents.filter(p => myStudents.some(s=>s.id===p.childId));
    const list = myParents.filter(p => !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q));
    document.getElementById('par-sub').textContent = `${list.length} parent(s) for ${STATE.currentUser.grade} – ${STATE.currentUser.section}`;
    document.getElementById('par-tbody').innerHTML = list.length===0
      ? `<tr><td colspan="6"><div class="empty-state"><div class="es-icon">👨‍👩‍👧</div><div class="es-title">No parents yet</div><div class="es-sub">Click "+ Add Parent" to link parents to your students.</div></div></td></tr>`
      : list.map(p => {
          const child = STATE.students.find(s=>s.id===p.childId);
          const isLinked = !!p.childId && STATE.users[p.email];
          return `<tr>
            <td><div class="flex aic gap-10"><div class="av av-32 av-amber">${ini(p.name)}</div><div><div class="fw6">${p.name}</div><div class="txs tmm">${p.id}</div></div></div></td>
            <td>${p.email}</td><td>${p.phone}</td>
            <td>${child?`<span class="badge bg-blue">${child.name}</span>`:'<span class="badge bg-gray">Not linked</span>'}</td>
            <td>${isLinked?'<span class="badge bg-green">Has Account</span>':'<span class="badge bg-amber">No Account</span>'}</td>
            <td><div class="flex gap-6">
              <button class="btn btn-secondary btn-xs" onclick="openEditParentTeacherModal('${p.id}')">Edit</button>
              <button class="btn btn-danger btn-xs" onclick="deleteParentTeacher('${p.id}','${p.name.replace(/'/g,"\\'")}')">Remove</button>
            </div></td>
          </tr>`;
        }).join('');
  }
  document.getElementById('par-search').addEventListener('input', renderRows);
  window.refreshParentRows = renderRows;
  renderRows();
}

function openAddParentTeacherModal() {
  const myStudents = STATE.students.filter(s=>s.teacherId===STATE.currentUser.teacherId && !STATE.parents.find(p=>p.childId===s.id));
  openModal(`
  <div class="modal-header"><div class="modal-title">Add Parent / Guardian</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div style="background:var(--blue-l);border-radius:9px;padding:12px;margin-bottom:16px;font-size:13px;color:var(--blue)">
      <strong>ℹ Note:</strong> A login account will be created automatically. Share the email and password below with the parent so they can log in.
    </div>
    <div class="form-grid form-row-2">
      <div class="fg"><label>Full Name*</label><input id="pt-name" placeholder="Parent/Guardian name"></div>
      <div class="fg"><label>Email* (used for login)</label><input id="pt-email" type="email" placeholder="parent@email.com"></div>
      <div class="fg"><label>Phone*</label><input id="pt-phone" placeholder="09XXXXXXXXX"></div>
      <div class="fg"><label>Password* (parent will use this to log in)</label>
        <div class="pass-wrap">
          <input id="pt-pass" type="password" placeholder="Create a password for the parent">
          <button type="button" class="pass-toggle" onclick="
            var i=document.getElementById('pt-pass');
            i.type=i.type==='password'?'text':'password';
            this.innerHTML=i.type==='password'?'<i class=\'fa-solid fa-eye\'></i>':'<i class=\'fa-solid fa-eye-slash\'></i>'
          "><i class="fa-solid fa-eye"></i></button>
        </div>
      </div>
      <div class="fg" style="grid-column:span 2"><label>Linked Student*</label><select id="pt-child">
        <option value="">-- Select student --</option>
        ${myStudents.map(s=>`<option value="${s.id}">${s.name} (LRN: ${s.lrn||s.id})</option>`).join('')}
        ${STATE.students.filter(s=>s.teacherId===STATE.currentUser.teacherId && STATE.parents.find(p=>p.childId===s.id)).map(s=>`<option value="${s.id}" disabled>${s.name} (already linked)</option>`).join('')}
      </select></div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveParentTeacher()">Add Parent</button></div>`);
}

function saveParentTeacher() {
  const name  = document.getElementById('pt-name')?.value.trim();
  const email = document.getElementById('pt-email')?.value.trim().toLowerCase();
  const phone = document.getElementById('pt-phone')?.value.trim();
  const pass  = document.getElementById('pt-pass')?.value.trim();
  const childId = document.getElementById('pt-child')?.value;
  if (!name||!email||!phone||!childId) { toast('Fill all required fields.','error'); return; }
  if (!pass) { toast('Please set a password for the parent.','error'); return; }
  if (STATE.users[email]) { toast('This email already has an account.','error'); return; }
  const id = 'P'+String(STATE.nextParentId++).padStart(3,'0');
  STATE.parents.push({ id, name, email, phone, childId, addedBy: STATE.currentUser.id });
  STATE.users[email] = { role:'parent', id, name, email, password: pass, childId };
  const student = STATE.students.find(s=>s.id===childId);
  if (student) student.parentId = id;
  closeModal();
  toast(`✓ Parent ${name} added! Login: ${email} / ${pass}`);
  if (typeof window.refreshParentRows==='function') window.refreshParentRows();
}

function openEditParentTeacherModal(id) {
  const p = STATE.parents.find(x=>x.id===id); if (!p) return;
  openModal(`
  <div class="modal-header"><div class="modal-title">Edit Parent</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid form-row-2">
      <div class="fg"><label>Full Name*</label><input id="ept-name" value="${p.name}"></div>
      <div class="fg"><label>Email*</label><input id="ept-email" type="email" value="${p.email}"></div>
      <div class="fg" style="grid-column:span 2"><label>Phone</label><input id="ept-phone" value="${p.phone}"></div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="updateParentTeacher('${id}')">Save</button></div>`);
}
function updateParentTeacher(id) {
  const p=STATE.parents.find(x=>x.id===id); if(!p) return;
  p.name=document.getElementById('ept-name')?.value.trim()||p.name;
  p.email=document.getElementById('ept-email')?.value.trim()||p.email;
  p.phone=document.getElementById('ept-phone')?.value.trim()||p.phone;
  closeModal(); toast('Parent updated!'); if(typeof window.refreshParentRows==='function') window.refreshParentRows();
}
function deleteParentTeacher(id,name) {
  showConfirm('Remove Parent',`Remove <strong>${name}</strong>?`,()=>{
    const p=STATE.parents.find(x=>x.id===id);
    if (p) {
      delete STATE.users[p.email]; // remove login
      const s=STATE.students.find(st=>st.id===p.childId); if(s) s.parentId=null;
    }
    STATE.parents.splice(STATE.parents.findIndex(x=>x.id===id),1);
    toast(`${name} removed.`);
    if(typeof window.refreshParentRows==='function') window.refreshParentRows();
  });
}

/* ════════════════════════════════════════════════════════════════════════════
   TEACHER APPROVALS (Principal only)
   ════════════════════════════════════════════════════════════════════════════ */
function pgApprovals(el) {
  function render() {
    const pending = STATE.pendingTeachers.filter(t=>t.status==='pending');
    const approved = STATE.pendingTeachers.filter(t=>t.status==='approved');
    const rejected = STATE.pendingTeachers.filter(t=>t.status==='rejected');
    el.innerHTML = `
    <div class="page-head"><div><div class="page-title">Teacher Registrations</div><div class="page-sub">${pending.length} pending approval${pending.length!==1?'s':''}</div></div></div>

    ${pending.length === 0 ? `<div class="card mb-16" style="text-align:center;padding:40px"><div style="font-size:40px">✅</div><div class="fw7 ts mt-12">All registrations reviewed</div><div class="txs tm">No pending teacher applications.</div></div>` :
    pending.map(t=>`<div class="card mb-12" style="border-left:4px solid var(--amber)">
      <div class="flex aic gap-14">
        <div class="av av-52 av-amber">${ini(t.name)}</div>
        <div class="f1">
          <div style="font-size:17px;font-weight:800">${t.name}</div>
          <div class="ts tm">${t.email} · ${t.phone}</div>
          <div class="txs tmm mt-4">Applying for: <strong>${t.grade} – ${t.section}</strong> · Applied: ${t.appliedDate}</div>
        </div>
        <div class="flex gap-8">
          <button class="btn btn-primary btn-sm" onclick="approveTeacher('${t.id}')">✓ Approve</button>
          <button class="btn btn-danger btn-sm" onclick="rejectTeacher('${t.id}','${t.name.replace(/'/g,"\\'")}')">✕ Reject</button>
        </div>
      </div>
    </div>`).join('')}

    ${approved.length > 0 ? `<div class="card mt-16">
      <div class="card-title">Recently Approved</div>
      ${approved.map(t=>`<div class="flex aic gap-10" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="badge bg-green">Approved</span>
        <div class="f1 fw6 ts">${t.name}</div>
        <div class="txs tmm">${t.grade} – ${t.section}</div>
      </div>`).join('')}
    </div>` : ''}

    ${rejected.length > 0 ? `<div class="card mt-16">
      <div class="card-title">Rejected Applications</div>
      ${rejected.map(t=>`<div class="flex aic gap-10" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="badge bg-red">Rejected</span>
        <div class="f1 fw6 ts">${t.name}</div>
        <div class="txs tmm">${t.grade} – ${t.section}</div>
      </div>`).join('')}
    </div>` : ''}`;
  }
  window.approveTeacher = (id) => {
    const t = STATE.pendingTeachers.find(x=>x.id===id); if (!t) return;
    const tid = 'T'+String(STATE.teachers.length+1).padStart(3,'0');
    STATE.teachers.push({ id:tid, name:t.name, email:t.email, phone:t.phone, grade:t.grade, section:t.section, subjects:'All Subjects', status:'active', joined:new Date().toISOString().split('T')[0] });
    STATE.users[t.email.toLowerCase()] = { role:'teacher', id:tid, name:t.name, email:t.email.toLowerCase(), password:t.password, grade:t.grade, section:t.section, teacherId:tid };
    t.status='approved';
    toast(`${t.name} approved and can now log in!`); buildSidebar(STATE.currentUser.role); render();
  };
  window.rejectTeacher = (id, name) => {
    showConfirm('Reject Application',`Reject application from <strong>${name}</strong>?`, ()=>{
      const t=STATE.pendingTeachers.find(x=>x.id===id); if(t) t.status='rejected';
      toast(`${name}'s application rejected.`,'error'); buildSidebar(STATE.currentUser.role); render();
    });
  };
  render();
}

/* ════════════════════════════════════════════════════════════════════════════
   TEACHERS PAGE (Principal — view only)
   ════════════════════════════════════════════════════════════════════════════ */
function pgTeachers(el) {
  el.innerHTML = `
    <div class="page-head"><div><div class="page-title">Teachers</div><div class="page-sub">${STATE.teachers.length} teachers registered</div></div></div>
    <div class="tbl-wrap">
      <div class="tbl-toolbar"><input id="teach-search" class="tbl-search" placeholder="🔍 Search teachers..."></div>
      <table>
        <thead><tr><th>Teacher</th><th>Grade / Section</th><th>Email</th><th>Phone</th><th>Students</th><th>Avg Grade</th><th>Status</th></tr></thead>
        <tbody id="teach-tbody"></tbody>
      </table>
    </div>`;
  function renderRows(){
    const q=document.getElementById('teach-search').value.toLowerCase();
    const list=STATE.teachers.filter(t=>!q||t.name.toLowerCase().includes(q)||t.email.toLowerCase().includes(q)||t.section.toLowerCase().includes(q));
    document.getElementById('teach-tbody').innerHTML=list.map(t=>{
      const sts=STATE.students.filter(s=>s.teacherId===t.id&&s.status==='active');
      let avgs=sts.map(s=>studentAverage(s.id)).filter(v=>v>0);
      const ca=avgs.length?Math.round(avgs.reduce((a,b)=>a+b,0)/avgs.length):0;
      return `<tr><td><div class="flex aic gap-10"><div class="av av-32 av-blue">${ini(t.name)}</div><div><div class="fw6">${t.name}</div><div class="txs tmm">${t.id}</div></div></div></td>
        <td>${t.grade} – ${t.section}</td><td class="tm">${t.email}</td><td>${t.phone}</td>
        <td><span class="badge bg-blue">${sts.length}</span></td>
        <td><span class="badge ${gbadge(ca)}">${ca||'—'}</span></td>
        <td><span class="badge ${t.status==='active'?'bg-green':'bg-gray'}">${t.status}</span></td>
      </tr>`;
    }).join('');
  }
  document.getElementById('teach-search').addEventListener('input', renderRows);
  renderRows();
}

/* ════════════════════════════════════════════════════════════════════════════
   CLASSES PAGE (Principal)
   ════════════════════════════════════════════════════════════════════════════ */
function pgClasses(el) {
  el.innerHTML = `
    <div class="page-head"><div><div class="page-title">Classes</div><div class="page-sub">SY 2024-2025</div></div></div>
    <div class="g2">
      ${STATE.classes.map(c=>{
        const t=STATE.teachers.find(x=>x.id===c.teacherId);
        const sts=STATE.students.filter(s=>s.grade===c.grade&&s.section===c.section&&s.status==='active');
        let sc=[]; sts.forEach(s=>{let v=studentAverage(s.id);if(v>0)sc.push(v);});
        const ca=sc.length?Math.round(sc.reduce((a,b)=>a+b,0)/sc.length):0;
        const honors=sts.filter(s=>getHonors(studentAverage(s.id))).length;
        return `<div class="card">
          <div class="flex aic gap-14 mb-16">
            <div style="width:50px;height:50px;background:var(--blue-l);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px">🏫</div>
            <div class="f1"><div style="font-size:18px;font-weight:800">${c.grade} – ${c.section}</div><div class="ts tm">SY ${c.year}</div></div>
          </div>
          <div class="g3 mb-14" style="text-align:center">
            <div style="padding:10px;background:var(--bg);border-radius:9px"><div style="font-size:20px;font-weight:800;color:var(--blue)">${sts.length}</div><div class="txs tm">Students</div></div>
            <div style="padding:10px;background:var(--bg);border-radius:9px"><div style="font-size:20px;font-weight:800;color:${gcol(ca)}">${ca||'–'}</div><div class="txs tm">Avg Grade</div></div>
            <div style="padding:10px;background:var(--gold-l);border-radius:9px"><div style="font-size:20px;font-weight:800;color:var(--gold)">${honors}</div><div class="txs tm">Honor Students</div></div>
          </div>
          <div class="divider"></div>
          <div class="flex aic gap-10">
            <div class="av av-32 av-blue">${t?ini(t.name):'?'}</div>
            <div class="f1"><div class="fw6 ts">${t?t.name:'No teacher assigned'}</div><div class="txs tmm">Homeroom Teacher</div></div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

/* ════════════════════════════════════════════════════════════════════════════
   MESSAGES PAGE
   ════════════════════════════════════════════════════════════════════════════ */
function pgMessages(el) {
  const u = STATE.currentUser;
  let selectedRoot = null, searchQ='';
  function getAllMsgs() {
    return STATE.messages.filter(m => m.toId===u.id || m.fromId===u.id || (u.role==='principal'&&true));
  }
  function getThreadPreviews() {
    const all=getAllMsgs(), map={};
    all.forEach(m=>{const root=m.thread||m.id; if(!map[root])map[root]=[]; map[root].push(m);});
    return Object.entries(map).map(([root,msgs])=>{
      msgs.sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
      return {rootId:parseInt(root),latest:msgs[0]};
    }).sort((a,b)=>(b.latest.date+b.latest.time).localeCompare(a.latest.date+a.latest.time));
  }
  function getThread(rootId) {
    return getAllMsgs().filter(m=>m.id===rootId||m.thread===rootId).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  }
  function render() {
    let threads=getThreadPreviews();
    if(searchQ) threads=threads.filter(t=>t.latest.subject.toLowerCase().includes(searchQ)||t.latest.fromName.toLowerCase().includes(searchQ)||t.latest.body.toLowerCase().includes(searchQ));
    if(!selectedRoot&&threads.length>0) selectedRoot=threads[0].rootId;
    const selThread=threads.find(t=>t.rootId===selectedRoot)||null;
    const messages=selThread?getThread(selThread.rootId):[];
    messages.forEach(m=>{if(!m.read&&(m.toId===u.id))m.read=true;});
    updateUnreadBadge(); buildSidebar(u.role);
    const unreadCount=getAllMsgs().filter(m=>!m.read&&m.toId===u.id).length;
    el.innerHTML=`
    <div class="page-head"><div><div class="page-title">Messages</div><div class="page-sub">${threads.length} conversation(s)</div></div>
    <div class="page-actions">${u.role!=='principal'?`<button class="btn btn-primary" onclick="openComposeModal()">✏️ Compose</button>`:''}</div></div>
    <div class="msg-layout">
      <div class="msg-list">
        <div class="msg-list-head"><span>Inbox</span><span class="badge bg-red" style="${unreadCount?'':'display:none'}">${unreadCount}</span></div>
        <div style="padding:8px"><input id="msg-search-inp" style="width:100%;padding:7px 10px;border:1.5px solid var(--border);border-radius:7px;font-size:12.5px;outline:none;font-family:inherit" placeholder="Search..." value="${searchQ}"></div>
        <div class="msg-list-body">
          ${threads.length===0?`<div class="msg-empty"><span>💬</span><span>No messages</span></div>`:
            threads.map(t=>{
              const m=t.latest;
              const isUnread=!m.read&&m.toId===u.id;
              const isAlert=m.isAlert;
              return `<div class="msg-item ${t.rootId===selectedRoot?'active':''} ${isUnread?'unread':''}" data-root="${t.rootId}" style="${isAlert?'border-left:3px solid var(--red)':''}">
                <div class="msg-item-meta"><div class="msg-item-name" style="${isAlert?'color:var(--red)':''}">${m.fromId===u.id?`You → ${m.toRole}`:m.fromName}</div>${isUnread?'<div class="msg-unread-dot"></div>':''}</div>
                <div style="font-size:12.5px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px">${isAlert?'⚠️ ':''} ${m.subject.replace(/^(Re: )+/,'')}</div>
                <div class="msg-item-preview">${m.body.replace(/\n/g,' ').slice(0,55)}…</div>
                <div class="msg-item-date">${m.date} · ${m.time}</div>
              </div>`;
            }).join('')}
        </div>
      </div>
      <div class="msg-panel">
        ${!selThread?`<div class="msg-empty" style="height:100%"><span style="font-size:48px">💬</span><span class="fw6">Select a conversation</span></div>`:
          `<div class="msg-panel-head">
            <div class="msg-panel-subject">${selThread.latest.isAlert?'⚠️ ':''} ${selThread.latest.subject.replace(/^(Re: )+/,'')}</div>
            <div class="msg-panel-meta">${messages.length} message(s)${selThread.latest.studentId?` · ${STATE.students.find(s=>s.id===selThread.latest.studentId)?.name||''}`:''}</div>
          </div>
          <div class="msg-panel-body" id="msg-thread-body" style="display:flex;flex-direction:column;gap:12px">
            ${messages.map(m=>{
              const isMe=m.fromId===u.id, isSystem=m.fromId==='system';
              return `<div style="display:flex;flex-direction:column;align-items:${isSystem?'center':isMe?'flex-end':'flex-start'}">
                ${isSystem?`<div style="max-width:90%;background:var(--red-l);border:1px solid var(--red);padding:12px 16px;border-radius:12px;font-size:13.5px;line-height:1.65;white-space:pre-line">${m.body}</div><div class="txs tmm mt-4">${m.fromName} · ${m.date}</div>`:
                `<div style="max-width:72%;background:${isMe?'var(--green)':'var(--bg)'};color:${isMe?'#fff':'var(--text)'};padding:11px 15px;border-radius:${isMe?'16px 16px 4px 16px':'16px 16px 16px 4px'};font-size:13.5px;line-height:1.65;white-space:pre-line">${m.body}</div>
                <div class="txs tmm mt-4">${isMe?'You':'<strong>'+m.fromName+'</strong>'} · ${m.date} ${m.time}</div>`}
              </div>`;
            }).join('')}
          </div>
          ${u.role!=='principal'?`<div class="msg-panel-reply">
            <textarea id="reply-area" placeholder="Type your reply…"></textarea>
            <button class="btn btn-primary" id="send-reply-btn">Send →</button>
          </div>`:'<div style="padding:12px 20px;background:var(--surface2);text-align:center;font-size:12px;color:var(--text2)">Principal account is read-only for messages</div>'}`}
      </div>
    </div>`;
    el.querySelectorAll('.msg-item[data-root]').forEach(item=>{item.addEventListener('click',()=>{selectedRoot=parseInt(item.dataset.root);render();scrollChat();});});
    const si=document.getElementById('msg-search-inp');
    if(si)si.addEventListener('input',()=>{searchQ=si.value.toLowerCase();render();});
    const btn=document.getElementById('send-reply-btn');
    if(btn)btn.addEventListener('click',()=>{
      const txt=document.getElementById('reply-area')?.value.trim();
      if(!txt){toast('Reply cannot be empty.','error');return;}
      const orig=STATE.messages.find(m=>m.id===selThread.rootId); if(!orig)return;
      STATE.messages.unshift({
        id:STATE.nextMsgId++,fromRole:u.role,fromId:u.id,fromName:u.name,
        toRole:orig.fromId===u.id?orig.toRole:orig.fromRole,
        toId:orig.fromId===u.id?orig.toId:orig.fromId,
        subject:orig.subject.startsWith('Re:')?orig.subject:'Re: '+orig.subject,
        body:txt,date:new Date().toISOString().split('T')[0],
        time:new Date().toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'}),
        read:false,studentId:orig.studentId,thread:orig.thread||orig.id,
      });
      selectedRoot=orig.thread||orig.id;
      updateUnreadBadge();buildSidebar(u.role);toast('Reply sent!');render();scrollChat();
    });
    scrollChat();
  }
  function scrollChat(){setTimeout(()=>{const b=document.getElementById('msg-thread-body');if(b)b.scrollTop=b.scrollHeight;},60);}
  render();
}

function openComposeModal() {
  const u=STATE.currentUser;
  let toOptions='';
  if(u.role==='teacher'){
    const myParents=STATE.parents.filter(p=>STATE.students.some(s=>s.teacherId===u.teacherId&&s.id===p.childId));
    toOptions=`<option value="">-- Select recipient --</option>${myParents.map(p=>`<option value="parent|${p.id}">Parent: ${p.name} (${STATE.students.find(s=>s.id===p.childId)?.name})</option>`).join('')}`;
  } else if(u.role==='parent'){
    const child=STATE.students.find(s=>s.id===u.childId);
    const teacher=child?STATE.teachers.find(t=>t.id===child.teacherId):null;
    toOptions=teacher?`<option value="teacher|${teacher.id}">${teacher.name} (Class Teacher)</option>`:'<option>No teacher found</option>';
  }
  const studOptions=u.role==='teacher'?`<option value="">-- None --</option>${STATE.students.filter(s=>s.teacherId===u.teacherId).map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}`:'';
  openModal(`
  <div class="modal-header"><div class="modal-title">Compose Message</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid">
      <div class="fg"><label>To*</label><select id="cm-to">${toOptions}</select></div>
      ${u.role==='teacher'?`<div class="fg"><label>Regarding Student</label><select id="cm-sid">${studOptions}</select></div>`:''}
      <div class="fg"><label>Subject*</label><input id="cm-sub" placeholder="Message subject"></div>
      <div class="fg"><label>Message*</label><textarea id="cm-body" style="min-height:120px" placeholder="Type your message..."></textarea></div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="sendCompose()">Send Message</button></div>`);
}
function sendCompose() {
  const u=STATE.currentUser;
  const toVal=document.getElementById('cm-to')?.value;
  const sub=document.getElementById('cm-sub')?.value.trim();
  const body=document.getElementById('cm-body')?.value.trim();
  const sid=document.getElementById('cm-sid')?.value||null;
  if(!toVal){toast('Select a recipient.','error');return;}
  if(!sub||!body){toast('Subject and message required.','error');return;}
  const [toRole,toId]=toVal.split('|');
  STATE.messages.unshift({
    id:STATE.nextMsgId++,fromRole:u.role,fromId:u.id,fromName:u.name,
    toRole:toRole,toId:toId,subject:sub,body,
    date:new Date().toISOString().split('T')[0],
    time:new Date().toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'}),
    read:false,studentId:sid,thread:null,
  });
  updateUnreadBadge();buildSidebar(u.role);closeModal();toast('Message sent!');nav('messages');
}

/* ════════════════════════════════════════════════════════════════════════════
   ANNOUNCEMENTS — redesigned bulletin board UI
   ════════════════════════════════════════════════════════════════════════════ */
function pgAnnouncements(el) {
  const role = STATE.currentUser.role;
  const canPost = role === 'principal' || role === 'teacher';
  const catColors  = { academic:'#2A76C9', event:'#27ae60', holiday:'#C79800', general:'#6B3FA0' };
  const catBg      = { academic:'#DCE6FF', event:'#d5f5e3', holiday:'#FFF4C2', general:'#EDE5FF' };
  const catIcons   = { academic:'📋', event:'📅', holiday:'🎉', general:'📢' };
  const catLabels  = { academic:'EXAM', event:'EVENT', holiday:'HOLIDAY', general:'NOTICE' };
  const heroBg     = { academic:'linear-gradient(135deg,#2A76C9,#1a4a8a)', event:'linear-gradient(135deg,#27ae60,#1a7a44)', holiday:'linear-gradient(135deg,#C79800,#8a6800)', general:'linear-gradient(135deg,#6B3FA0,#4a2a70)' };
  const catFilterLabels = { all:'All Updates', academic:'Exams', event:'Events', holiday:'Holidays', general:'Notices' };
  const catFilterIcons  = { all:'⊞', academic:'📋', event:'📅', holiday:'🎉', general:'📢' };

  window._annFilterCat = window._annFilterCat || 'all';

  window._annRender = function() {
    const filterCat = window._annFilterCat;
    const anns = STATE.announcements.filter(a => {
      if (role === 'principal') return true;
      if (a.audience === 'all') return true;
      if (a.audience === role) return true;
      return false;
    });
    const filtered = filterCat === 'all' ? anns : anns.filter(a => a.category === filterCat);
    const cats = ['all','academic','event','holiday','general'];

    el.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-title">Announcements</div>
        <div class="page-sub">Stay informed with the latest updates, important notices, and upcoming events.</div>
      </div>
      ${canPost ? `<div class="page-actions"><button class="btn btn-primary" onclick="openAddAnnouncementModal()">📢 Post Announcement</button></div>` : ''}
    </div>

    <!-- Filter tabs — matches reference image -->
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:24px">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${cats.map(c=>`
          <button onclick="window._annFilterCat='${c}';window._annRender()"
            style="display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:25px;font-size:13px;font-weight:600;cursor:pointer;border:2px solid ${filterCat===c?catColors[c]||'var(--green)':'var(--border)'};background:${filterCat===c?(catBg[c]||'var(--green-l)'):'#fff'};color:${filterCat===c?(catColors[c]||'var(--green)'):'var(--text2)'};transition:all .2s">
            ${catFilterIcons[c]} ${catFilterLabels[c]}
          </button>`).join('')}
      </div>
      <span style="font-size:13px;color:var(--green);font-weight:600;cursor:pointer" onclick="window._annFilterCat='all';window._annRender()">View All Announcements →</span>
    </div>

    <!-- Cards grid -->
    ${filtered.length === 0
      ? `<div class="card" style="text-align:center;padding:60px"><div style="font-size:48px">📭</div><div class="fw7 ts mt-12">No announcements in this category</div></div>`
      : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px">
           ${filtered.map(a=>_annCard(a,canPost,catColors,catBg,catLabels,catIcons,heroBg)).join('')}
         </div>`}`;
  };
  window._annRender();
}

function _annCard(a, canPost, catColors, catBg, catLabels, catIcons, heroBg) {
  const cat   = a.category || 'general';
  const color = catColors[cat]  || '#6B3FA0';
  const bg    = catBg[cat]      || '#EDE5FF';
  const label = catLabels[cat]  || 'NOTICE';
  const icon  = catIcons[cat]   || '📢';
  const hero  = heroBg[cat]     || heroBg.general;
  const d   = new Date(a.date);
  const day = isNaN(d)?'--':d.getDate().toString().padStart(2,'0');
  const mon = isNaN(d)?'---':d.toLocaleString('en',{month:'short'}).toUpperCase();
  const yr  = isNaN(d)?'----':d.getFullYear();

  return `<div onclick="openAnnouncementModal(${a.id})"
    style="background:#fff;border-radius:16px;border:1px solid var(--border);overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.07);transition:transform .2s,box-shadow .2s;cursor:pointer;display:flex;flex-direction:column"
    onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 10px 30px rgba(0,0,0,.13)'"
    onmouseout="this.style.transform='none';this.style.boxShadow='0 2px 12px rgba(0,0,0,.07)'">

    <!-- Hero with date badge -->
    <div style="height:130px;background:${hero};position:relative;display:flex;align-items:flex-start;padding:14px;flex-shrink:0">
      <div style="background:#fff;border-radius:10px;padding:8px 12px;text-align:center;min-width:52px;box-shadow:0 2px 8px rgba(0,0,0,.2)">
        <div style="font-size:22px;font-weight:900;color:${color};line-height:1">${day}</div>
        <div style="font-size:10px;font-weight:700;color:${color};letter-spacing:.5px">${mon}</div>
        <div style="font-size:10px;color:#999">${yr}</div>
      </div>
      <div style="position:absolute;right:14px;bottom:8px;font-size:52px;opacity:.2">${icon}</div>
      ${a.pinned?`<div style="position:absolute;top:10px;right:12px;background:#C79800;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:12px">📌 PINNED</div>`:''}
    </div>

    <!-- Body -->
    <div style="padding:14px 16px 14px;flex:1;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span style="display:inline-flex;align-items:center;gap:5px;background:${bg};color:${color};font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px">${icon} ${label}</span>
        ${a.priority==='high'?`<span style="background:var(--red-l);color:var(--red);font-size:10px;font-weight:700;padding:3px 8px;border-radius:12px">🔔 Important</span>`:''}
      </div>
      <div style="font-size:15px;font-weight:800;color:var(--text);line-height:1.35;margin-bottom:8px">${a.title}</div>
      <div style="font-size:12.5px;color:var(--text2);line-height:1.6;flex:1">${a.body.slice(0,90)}${a.body.length>90?'…':''}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border);padding-top:10px;margin-top:12px">
        <span style="font-size:11px;color:var(--text3)">By ${a.author}</span>
        <div style="display:flex;align-items:center;gap:8px" onclick="event.stopPropagation()">
          ${canPost?`<button class="btn btn-secondary btn-xs" onclick="openEditAnnouncementModal(${a.id})">Edit</button>
          <button class="btn btn-danger btn-xs" onclick="deleteAnnouncement(${a.id},'${a.title.replace(/'/g,"\\'")}')">Delete</button>`:''}
          <span style="font-size:13px;font-weight:700;color:${color};display:flex;align-items:center;gap:3px" onclick="openAnnouncementModal(${a.id})">Read More →</span>
        </div>
      </div>
    </div>
  </div>`;
}

function openAnnouncementModal(id) {
  const a = STATE.announcements.find(x=>x.id===id); if (!a) return;
  const catColors={academic:'var(--blue)',event:'var(--green)',holiday:'var(--amber)',general:'var(--text2)'};
  openModal(`
  <div class="modal-header"><div class="modal-title">${a.title}</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="flex aic gap-8 mb-12">
      <span class="badge bg-gray">${a.category||'general'}</span>
      <span class="badge ${a.priority==='high'?'bg-red':'bg-gray'}">${a.priority==='high'?'Important':'Notice'}</span>
      <span class="badge ${a.audience==='all'?'bg-blue':'bg-amber'}">${a.audience==='all'?'Everyone':'Teachers Only'}</span>
    </div>
    <div class="txs tmm mb-14">By ${a.author} &nbsp;·&nbsp; ${a.date}</div>
    <p style="font-size:14px;color:var(--text);line-height:1.8">${a.body}</p>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>`);
}
function openAddAnnouncementModal(){
  openModal(`
  <div class="modal-header"><div class="modal-title">Post Announcement</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid">
      <div class="fg"><label>Title*</label><input id="an-ti" placeholder="Announcement title"></div>
      <div class="fg"><label>Message*</label><textarea id="an-bo" style="min-height:100px" placeholder="Full announcement text..."></textarea></div>
      <div class="form-grid form-row-2">
        <div class="fg"><label>Category</label><select id="an-cat"><option value="academic">📚 Academic</option><option value="event">📅 Event</option><option value="holiday">🎉 Holiday</option><option value="general">📌 General</option></select></div>
        <div class="fg"><label>Priority</label><select id="an-pr"><option value="normal">Normal</option><option value="high">🔔 Important</option></select></div>
        <div class="fg"><label>Audience</label><select id="an-au"><option value="all">Everyone</option><option value="teacher">Teachers Only</option><option value="parent">Parents Only</option></select></div>
        <div class="fg"><label>Pin to top?</label><select id="an-pin"><option value="0">No</option><option value="1">Yes — Pin it</option></select></div>
      </div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveAnnouncement()">Post Announcement</button></div>`);
}
function saveAnnouncement(){
  const ti=document.getElementById('an-ti')?.value.trim(),bo=document.getElementById('an-bo')?.value.trim();
  if(!ti||!bo){toast('Title and message required.','error');return;}
  STATE.announcements.unshift({
    id:STATE.nextAnnId++,title:ti,body:bo,
    date:new Date().toISOString().split('T')[0],
    audience:document.getElementById('an-au')?.value,
    priority:document.getElementById('an-pr')?.value,
    category:document.getElementById('an-cat')?.value,
    pinned:document.getElementById('an-pin')?.value==='1',
    author:STATE.currentUser.name,authorRole:STATE.currentUser.role,
  });
  closeModal();toast('Announcement posted!');window._annFilterCat='all';nav('announcements');
}
function openEditAnnouncementModal(id){
  const a=STATE.announcements.find(x=>x.id===id);if(!a)return;
  openModal(`
  <div class="modal-header"><div class="modal-title">Edit Announcement</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid">
      <div class="fg"><label>Title*</label><input id="ean-ti" value="${a.title.replace(/"/g,'&quot;')}"></div>
      <div class="fg"><label>Message*</label><textarea id="ean-bo" style="min-height:100px">${a.body}</textarea></div>
      <div class="form-grid form-row-2">
        <div class="fg"><label>Category</label><select id="ean-cat"><option value="academic" ${a.category==='academic'?'selected':''}>📚 Academic</option><option value="event" ${a.category==='event'?'selected':''}>📅 Event</option><option value="holiday" ${a.category==='holiday'?'selected':''}>🎉 Holiday</option><option value="general" ${a.category==='general'?'selected':''}>📌 General</option></select></div>
        <div class="fg"><label>Priority</label><select id="ean-pr"><option value="normal" ${a.priority==='normal'?'selected':''}>Normal</option><option value="high" ${a.priority==='high'?'selected':''}>🔔 Important</option></select></div>
        <div class="fg"><label>Audience</label><select id="ean-au"><option value="all" ${a.audience==='all'?'selected':''}>Everyone</option><option value="teacher" ${a.audience==='teacher'?'selected':''}>Teachers Only</option></select></div>
        <div class="fg"><label>Pinned</label><select id="ean-pin"><option value="0" ${!a.pinned?'selected':''}>No</option><option value="1" ${a.pinned?'selected':''}>Yes</option></select></div>
      </div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="updateAnnouncement(${id})">Save Changes</button></div>`);
}
function updateAnnouncement(id){
  const a=STATE.announcements.find(x=>x.id===id);if(!a)return;
  a.title=document.getElementById('ean-ti')?.value.trim()||a.title;
  a.body=document.getElementById('ean-bo')?.value.trim()||a.body;
  a.audience=document.getElementById('ean-au')?.value||a.audience;
  a.priority=document.getElementById('ean-pr')?.value||a.priority;
  a.category=document.getElementById('ean-cat')?.value||a.category;
  a.pinned=document.getElementById('ean-pin')?.value==='1';
  closeModal();toast('Announcement updated!');if(typeof window._annRender==='function')window._annRender();else nav('announcements');
}
function deleteAnnouncement(id,title){
  showConfirm('Delete Announcement',`Remove "<strong>${title}</strong>"?`,()=>{
    STATE.announcements.splice(STATE.announcements.findIndex(a=>a.id===id),1);
    toast('Deleted.');if(typeof window._annRender==='function')window._annRender();else nav('announcements');
  });
}

/* ════════════════════════════════════════════════════════════════════════════
   REPORTS PAGE
   ════════════════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════════════════
   REPORTS PAGE — Class Performance Report + Attendance Report
   ════════════════════════════════════════════════════════════════════════════ */
function pgReports(el) {
  const role = STATE.currentUser.role;
  const isTeacher = role === 'teacher';
  const myStudents = isTeacher
    ? STATE.students.filter(s=>s.teacherId===STATE.currentUser.teacherId && s.status==='active')
    : STATE.students.filter(s=>s.status==='active');

  let allOv = [];
  myStudents.forEach(s=>{ const ov=studentAverage(s.id); if(ov>0) allOv.push({...s, ov}); });
  const sorted = [...allOv].sort((a,b)=>b.ov-a.ov);
  const teacher = STATE.teachers.find(t=>t.id===STATE.currentUser.teacherId);
  const grade = STATE.currentUser.grade||'Grade 1';
  const section = STATE.currentUser.section||'';
  const subs = getSubjectsForGrade(grade);

  el.innerHTML = `
  <div class="page-head">
    <div><div class="page-title">Reports</div><div class="page-sub">Generate and download official school reports</div></div>
  </div>

  <div class="g2 mb-20">
    <!-- Class Performance Report card -->
    <div class="card">
      <div class="flex aic gap-14 mb-14">
        <div style="width:48px;height:48px;background:var(--green-l);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">📊</div>
        <div>
          <div class="fw7 ts">Class Performance Report</div>
          <div class="txs tm">Summary of grades per subject and quarter · DepEd format</div>
        </div>
      </div>
      <div class="flex gap-8">
        <button class="btn btn-primary btn-sm f1" onclick="downloadClassPerformancePDF()">⬇ Download PDF</button>
        <button class="btn btn-secondary btn-sm f1" onclick="downloadClassPerformanceCSV()">⬇ Export CSV</button>
      </div>
    </div>

    <!-- Attendance Report card -->
    <div class="card">
      <div class="flex aic gap-14 mb-14">
        <div style="width:48px;height:48px;background:var(--blue-l);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">📅</div>
        <div>
          <div class="fw7 ts">Attendance Report</div>
          <div class="txs tm">Monthly attendance records with rates per student</div>
        </div>
      </div>
      <div class="flex gap-8">
        <button class="btn btn-primary btn-sm f1" onclick="downloadAttendancePDF()">⬇ Download PDF</button>
        <button class="btn btn-secondary btn-sm f1" onclick="downloadAttendanceCSV()">⬇ Export CSV</button>
      </div>
    </div>
  </div>

  <!-- Preview: Class Performance -->
  <div class="card mb-16">
    <div class="card-header"><div class="card-title" style="margin:0">📊 Class Performance Preview</div><span class="badge bg-gray">${grade} – ${section}</span></div>
    <div style="overflow-x:auto">
    <table>
      <thead>
        <tr>
          <th>Rank</th><th>Student Name</th><th>LRN</th>
          ${subs.map(s=>`<th style="font-size:10px">${s}</th>`).join('')}
          <th>Average</th><th>Descriptor</th><th>Honors</th>
        </tr>
      </thead>
      <tbody>
        ${sorted.map((s,i)=>{
          const h=getHonors(s.ov);
          return `<tr>
            <td><strong>${i+1}</strong></td>
            <td class="fw6">${s.name}</td>
            <td class="txs tm">${s.lrn||'—'}</td>
            ${subs.map(sub=>{const sc=subjectAvg(s.id,sub);return `<td><span class="badge ${gbadge(sc)}" style="font-size:11px">${sc||'—'}</span></td>`;}).join('')}
            <td><strong style="color:${gcol(s.ov)}">${s.ov}</strong></td>
            <td class="txs">${glabel(s.ov)}</td>
            <td>${h?`<span style="color:var(--gold);font-size:11px">${h.icon} ${h.label}</span>`:'—'}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
    </div>
  </div>

  <!-- Preview: Attendance -->
  <div class="card">
    <div class="card-header"><div class="card-title" style="margin:0">📅 Attendance Report Preview</div><span class="badge bg-gray">${grade} – ${section}</span></div>
    <div style="overflow-x:auto">
    <table>
      <thead><tr><th>Student Name</th><th>LRN</th><th>Present</th><th>Absent</th><th>Late</th><th>Total Days</th><th>Rate</th><th>Remarks</th></tr></thead>
      <tbody>
        ${myStudents.map(s=>{
          const at=STATE.attendance[s.id];
          const t=at?at.total:{present:0,absent:0,late:0,total:0};
          const rate=t.total?Math.round(t.present/t.total*100):0;
          return `<tr>
            <td class="fw6">${s.name}</td>
            <td class="txs tm">${s.lrn||'—'}</td>
            <td><span class="badge bg-green">${t.present}</span></td>
            <td><span class="badge bg-red">${t.absent}</span></td>
            <td><span class="badge bg-amber">${t.late}</span></td>
            <td>${t.total}</td>
            <td><span class="${rate>=90?'badge bg-green':rate>=75?'badge bg-amber':'badge bg-red'}">${rate}%</span></td>
            <td class="txs">${rate>=90?'Excellent':rate>=75?'Good':'Needs Improvement'}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
    </div>
  </div>`;

  /* ── Class Performance PDF ─────────────────────────────────────────────── */
  window.downloadClassPerformancePDF = function() {
    const sy='2024-2025';
    const rows = sorted.map((s,i)=>{
      const h=getHonors(s.ov);
      const subCells = subs.map(sub=>`<td style="text-align:center;padding:5px 8px;border:1px solid #ccc">${subjectAvg(s.id,sub)||'—'}</td>`).join('');
      return `<tr style="background:${i%2===0?'#fff':'#f9f9f9'}">
        <td style="text-align:center;padding:5px 8px;border:1px solid #ccc">${i+1}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;font-weight:600">${s.name}</td>
        <td style="padding:5px 8px;border:1px solid #ccc">${s.lrn||'—'}</td>
        ${subCells}
        <td style="text-align:center;padding:5px 8px;border:1px solid #ccc;font-weight:800;color:${s.ov>=90?'#2A76C9':s.ov>=75?'#C79800':'#B52B2B'}">${s.ov}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;font-size:11px">${glabel(s.ov)}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;font-size:11px">${h?h.label:'—'}</td>
      </tr>`;
    }).join('');
    const subHeaders = subs.map(s=>`<th style="padding:6px 8px;border:1px solid #999;background:#dce6ff;font-size:11px">${s}</th>`).join('');
    const html=`<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Class Performance Report</title>
    <style>
      body{font-family:Arial,sans-serif;font-size:12px;color:#000;margin:20px}
      h2{text-align:center;margin:0;font-size:15px}
      .sub{text-align:center;font-size:12px;color:#333;margin-bottom:4px}
      table{width:100%;border-collapse:collapse;margin-top:14px}
      th{background:#1856A8;color:#fff;padding:7px 8px;border:1px solid #999;text-align:center}
      .footer{margin-top:40px;display:flex;justify-content:space-between}
      .sig{text-align:center;width:200px}
      .sig-line{border-bottom:1px solid #000;margin-bottom:4px;height:40px}
    </style></head><body>
    <div style="text-align:center;margin-bottom:12px">
      <div style="font-size:13px">Republic of the Philippines · Department of Education</div>
      <div style="font-size:13px">Region V – Bicol · Division of Albay</div>
      <h2>POLANGUI SOUTH CENTRAL SCHOOL</h2>
      <div style="font-size:13px;font-weight:700;margin-top:6px">CLASS PERFORMANCE REPORT</div>
      <div class="sub">School Year ${sy} · ${grade} – ${section} · Teacher: ${teacher?.name||'—'}</div>
    </div>
    <table>
      <thead><tr>
        <th>Rank</th><th>Name of Learner</th><th>LRN</th>
        ${subHeaders}
        <th>General Average</th><th>Descriptor</th><th>Honors</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="footer">
      <div class="sig"><div class="sig-line"></div><div>${teacher?.name||'Class Teacher'}</div><div style="font-size:10px">Class Adviser / Teacher</div></div>
      <div class="sig"><div class="sig-line"></div><div>Principal Roberto Cruz</div><div style="font-size:10px">School Principal</div></div>
    </div>
    </body></html>`;
    const blob = new Blob([html], {type:'text/html;charset=utf-8'});
    const url  = URL.createObjectURL(blob);
    const a2   = document.createElement('a');
    a2.href    = url;
    a2.download = `class_performance_${grade}_${section}.html`.replace(/ /g,'_');
    a2.click();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
    toast('✓ Class Performance report downloaded! Open the file in your browser then Ctrl+P → Save as PDF.');
  };

  /* ── Class Performance CSV ─────────────────────────────────────────────── */
  window.downloadClassPerformanceCSV = function() {
    const header=['Rank','Name','LRN',...subs,'General Average','Descriptor','Honors'];
    const rows=[header];
    sorted.forEach((s,i)=>{
      const h=getHonors(s.ov);
      rows.push([i+1,s.name,s.lrn||'',
        ...subs.map(sub=>subjectAvg(s.id,sub)||''),
        s.ov,glabel(s.ov),h?h.label:'']);
    });
    const csv=rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
    const a=document.createElement('a');
    a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
    a.download=`class_performance_${grade}_${section}.csv`.replace(/ /g,'_');
    a.click();
    toast('Class Performance CSV downloaded!');
  };

  /* ── Attendance PDF ────────────────────────────────────────────────────── */
  window.downloadAttendancePDF = function() {
    const sy='2024-2025';
    const months=['June','July','August','September','October','November','December','January','February','March'];
    const rows=myStudents.map((s,i)=>{
      const at=STATE.attendance[s.id];
      const t=at?at.total:{present:0,absent:0,late:0,total:0};
      const rate=t.total?Math.round(t.present/t.total*100):0;
      const monthCells=months.map(m=>{
        const mr=at?.monthly?.find(x=>x.m===m);
        return mr?`<td style="text-align:center;padding:4px 6px;border:1px solid #ccc">${mr.p}</td>`:`<td style="text-align:center;padding:4px 6px;border:1px solid #ccc">—</td>`;
      }).join('');
      return `<tr style="background:${i%2===0?'#fff':'#f9f9f9'}">
        <td style="padding:5px 8px;border:1px solid #ccc;font-weight:600">${s.name}</td>
        <td style="padding:5px 8px;border:1px solid #ccc">${s.lrn||'—'}</td>
        ${monthCells}
        <td style="text-align:center;padding:5px 8px;border:1px solid #ccc;color:green;font-weight:700">${t.present}</td>
        <td style="text-align:center;padding:5px 8px;border:1px solid #ccc;color:red;font-weight:700">${t.absent}</td>
        <td style="text-align:center;padding:5px 8px;border:1px solid #ccc;color:#C79800;font-weight:700">${t.late}</td>
        <td style="text-align:center;padding:5px 8px;border:1px solid #ccc">${t.total}</td>
        <td style="text-align:center;padding:5px 8px;border:1px solid #ccc;font-weight:700;color:${rate>=90?'green':rate>=75?'#C79800':'red'}">${rate}%</td>
      </tr>`;
    }).join('');
    const html=`<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Attendance Report</title>
    <style>
      body{font-family:Arial,sans-serif;font-size:11px;color:#000;margin:16px}
      h2{text-align:center;margin:0;font-size:14px}
      table{width:100%;border-collapse:collapse;margin-top:12px}
      th{background:#1856A8;color:#fff;padding:6px 8px;border:1px solid #999;text-align:center;font-size:10px}
      .footer{margin-top:40px;display:flex;justify-content:space-between}
      .sig{text-align:center;width:200px}
      .sig-line{border-bottom:1px solid #000;margin-bottom:4px;height:40px}
    </style></head><body>
    <div style="text-align:center;margin-bottom:10px">
      <div style="font-size:12px">Republic of the Philippines · Department of Education</div>
      <div style="font-size:12px">Region V – Bicol · Division of Albay</div>
      <h2>POLANGUI SOUTH CENTRAL SCHOOL</h2>
      <div style="font-size:12px;font-weight:700;margin-top:5px">ATTENDANCE REPORT — SY ${sy}</div>
      <div style="font-size:11px">${grade} – ${section} · Teacher: ${teacher?.name||'—'}</div>
    </div>
    <table>
      <thead><tr>
        <th>Name of Learner</th><th>LRN</th>
        ${months.map(m=>`<th>${m}</th>`).join('')}
        <th>Total Present</th><th>Total Absent</th><th>Total Late</th><th>School Days</th><th>Rate</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="footer">
      <div class="sig"><div class="sig-line"></div><div>${teacher?.name||'Class Teacher'}</div><div style="font-size:10px">Class Adviser</div></div>
      <div class="sig"><div class="sig-line"></div><div>Principal Roberto Cruz</div><div style="font-size:10px">School Principal</div></div>
    </div>
    </body></html>`;
    const blob2 = new Blob([html], {type:'text/html;charset=utf-8'});
    const url2  = URL.createObjectURL(blob2);
    const a3    = document.createElement('a');
    a3.href     = url2;
    a3.download = `attendance_report_${grade}_${section}.html`.replace(/ /g,'_');
    a3.click();
    setTimeout(()=>URL.revokeObjectURL(url2), 1000);
    toast('✓ Attendance report downloaded! Open the file in your browser then Ctrl+P → Save as PDF.');
  };

  /* ── Attendance CSV ────────────────────────────────────────────────────── */
  window.downloadAttendanceCSV = function() {
    const months=['June','July','August','September','October','November','December','January','February','March'];
    const header=['Name','LRN',...months.map(m=>m+' (Present)'),'Total Present','Total Absent','Total Late','Total Days','Rate %'];
    const rows=[header];
    myStudents.forEach(s=>{
      const at=STATE.attendance[s.id];
      const t=at?at.total:{present:0,absent:0,late:0,total:0};
      const rate=t.total?Math.round(t.present/t.total*100):0;
      rows.push([s.name,s.lrn||'',
        ...months.map(m=>at?.monthly?.find(x=>x.m===m)?.p||0),
        t.present,t.absent,t.late,t.total,rate+'%']);
    });
    const csv=rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
    const a=document.createElement('a');
    a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
    a.download=`attendance_${grade}_${section}.csv`.replace(/ /g,'_');
    a.click();
    toast('Attendance CSV downloaded!');
  };
}

/* ════════════════════════════════════════════════════════════════════════════
   PROFILE PAGE
   ════════════════════════════════════════════════════════════════════════════ */
function pgProfile(el) {
  const u=STATE.currentUser;
  const roleColor={principal:'var(--purple)',teacher:'var(--green)',parent:'var(--amber)'}[u.role];
  const roleBg={principal:'var(--purple-l)',teacher:'var(--green-l)',parent:'var(--amber-l)'}[u.role];
  el.innerHTML=`
  <div class="page-head"><div><div class="page-title">My Profile</div><div class="page-sub">Manage your account settings</div></div></div>
  <div class="g2">
    <div class="card">
      <div class="flex aic gap-16 mb-16" style="padding-bottom:16px;border-bottom:1px solid var(--border)">
        <div id="avatar-wrap" style="position:relative;width:96px;height:96px;flex-shrink:0;border-radius:18px;overflow:hidden;cursor:pointer">
          <div id="avatar-display" style="width:96px;height:96px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;color:${roleColor};background:${roleBg};border-radius:18px">${u.avatar?`<img src="${u.avatar}" style="width:96px;height:96px;object-fit:cover;border-radius:18px">`:ini(u.name)}</div>
          <div id="avatar-overlay" style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.55);color:#fff;font-size:11px;font-weight:600;text-align:center;padding:6px 0;opacity:0;transition:opacity .2s;pointer-events:none">📷 Change</div>
          <input type="file" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%" onchange="previewProfilePic(event)">
        </div>
        <div><div style="font-size:20px;font-weight:800">${u.name}</div><div class="ts tm">${u.role.charAt(0).toUpperCase()+u.role.slice(1)}${u.grade?` · ${u.grade} – ${u.section}`:''}</div><div class="txs tmm">${u.email}</div><button class="btn btn-secondary btn-xs mt-8" onclick="resetProfilePic()">Remove Photo</button></div>
      </div>
      <div class="form-grid form-row-2">
        <div class="fg"><label>Full Name</label><input id="pf-name" value="${u.name}"></div>
        <div class="fg"><label>Email</label><input id="pf-email" type="email" value="${u.email}"></div>
        ${u.role!=='principal'?`<div class="fg"><label>Phone</label><input id="pf-phone" value="${u.phone||''}"></div>`:''}
      </div>
      <button class="btn btn-primary mt-12" onclick="saveProfile()">Save Changes</button>
    </div>
    <div class="card">
      <div class="fw7 ts mb-12">Account Info</div>
      <div style="display:grid;gap:10px">
        <div style="padding:12px;background:var(--bg);border-radius:9px"><div class="txs tmm fw7">Role</div><div class="fw6 ts mt-4">${u.role.charAt(0).toUpperCase()+u.role.slice(1)}</div></div>
        ${u.grade?`<div style="padding:12px;background:var(--bg);border-radius:9px"><div class="txs tmm fw7">Assigned Class</div><div class="fw6 ts mt-4">${u.grade} – ${u.section}</div></div>`:''}
        ${u.school?`<div style="padding:12px;background:var(--bg);border-radius:9px"><div class="txs tmm fw7">School</div><div class="fw6 ts mt-4">${u.school}</div></div>`:''}
        ${u.childId?`<div style="padding:12px;background:var(--bg);border-radius:9px"><div class="txs tmm fw7">Child</div><div class="fw6 ts mt-4">${STATE.students.find(s=>s.id===u.childId)?.name||u.childId}</div></div>`:''}
      </div>
      <div class="flex gap-10 mt-16">
        <button class="btn btn-secondary f1" onclick="nav('dashboard')">← Dashboard</button>
        <button class="btn btn-danger f1" onclick="doLogout()">Sign Out</button>
      </div>
    </div>
  </div>`;
  const wrap=document.getElementById('avatar-wrap'), ov=document.getElementById('avatar-overlay');
  if(wrap&&ov){wrap.addEventListener('mouseenter',()=>ov.style.opacity='1');wrap.addEventListener('mouseleave',()=>ov.style.opacity='0');}
  window._profilePic=undefined;
}
function previewProfilePic(evt){
  const file=evt.target.files[0];if(!file)return;
  const reader=new FileReader();reader.onload=e=>{const d=document.getElementById('avatar-display');if(d)d.innerHTML=`<img src="${e.target.result}" style="width:96px;height:96px;object-fit:cover;border-radius:18px">`;window._profilePic=e.target.result;};reader.readAsDataURL(file);
}
function resetProfilePic(){const u=STATE.currentUser;const d=document.getElementById('avatar-display');if(d)d.innerHTML=ini(u.name);window._profilePic='';}
function saveProfile(){
  const u=STATE.currentUser;
  const name=document.getElementById('pf-name')?.value.trim(),email=document.getElementById('pf-email')?.value.trim();
  if(!name||!email){toast('Name and email required.','error');return;}
  u.name=name;u.email=email;
  if(window._profilePic!==undefined)u.avatar=window._profilePic||null;
  if(u.role!=='principal')u.phone=document.getElementById('pf-phone')?.value.trim()||u.phone;
  setTopbarAvatar(u);document.getElementById('tb-name').textContent=u.name;
  toast('Profile updated!');
}