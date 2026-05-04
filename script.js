/* ════════════════════════════════════════
   STATE — reactive data store
   ════════════════════════════════════════ */
const STATE = {
  currentUser: null,
  activeNav: '',

  students: [
    {id:'S001',name:'Maria Reyes',grade:'Grade 1',section:'Sampaguita',gender:'F',parent:'Mrs. Liza Reyes',parentEmail:'parent@gmail.com',parentId:'P001',contact:'09171234567',status:'active',enrolled:'2024-06-01'},
    {id:'S002',name:'Juan Gomez',grade:'Grade 1',section:'Sampaguita',gender:'M',parent:'Mr. Carlos Gomez',parentEmail:'cgomez@gmail.com',parentId:'P002',contact:'09182345678',status:'active',enrolled:'2024-06-01'},
    {id:'S003',name:'Jose Dela Cruz Jr.',grade:'Grade 1',section:'Sampaguita',gender:'M',parent:'Mr. Juan Dela Cruz',parentEmail:'parent@gmail.com',parentId:'P003',contact:'09193456789',status:'active',enrolled:'2024-06-01'},
    {id:'S004',name:'Ana Santos',grade:'Grade 2',section:'Rosal',gender:'F',parent:'Mrs. Rosa Santos',parentEmail:'rsantos@gmail.com',parentId:'P004',contact:'09204567890',status:'active',enrolled:'2024-06-01'},
    {id:'S005',name:'Pedro Lim',grade:'Grade 2',section:'Rosal',gender:'M',parent:'Ms. Aileen Lim',parentEmail:'alim@gmail.com',parentId:'P005',contact:'09215678901',status:'active',enrolled:'2024-06-01'},
    {id:'S006',name:'Sofia Torres',grade:'Grade 2',section:'Rosal',gender:'F',parent:'Mr. Bobby Torres',parentEmail:'btorres@gmail.com',parentId:'P006',contact:'09226789012',status:'active',enrolled:'2024-06-01'},
    {id:'S007',name:'Carlo Ramos',grade:'Grade 3',section:'Gumamela',gender:'M',parent:'Mrs. Nena Ramos',parentEmail:'nramos@gmail.com',parentId:'P007',contact:'09237890123',status:'active',enrolled:'2024-06-01'},
    {id:'S008',name:'Lisa Tan',grade:'Grade 3',section:'Gumamela',gender:'F',parent:'Mr. Anthony Tan',parentEmail:'atan@gmail.com',parentId:'P008',contact:'09248901234',status:'active',enrolled:'2024-06-01'},
    {id:'S009',name:'Marco Cruz',grade:'Grade 3',section:'Gumamela',gender:'M',parent:'Mrs. Paz Cruz',parentEmail:'pcruz@gmail.com',parentId:'P009',contact:'09259012345',status:'active',enrolled:'2024-06-01'},
    {id:'S010',name:'Nina Bautista',grade:'Grade 3',section:'Gumamela',gender:'F',parent:'Mr. Leo Bautista',parentEmail:'lbautista@gmail.com',parentId:'P010',contact:'09260123456',status:'active',enrolled:'2024-06-01'},
  ],

  teachers: [
    {id:'T001',name:'Ms. Maria Santos',email:'teacher@smartgrade.edu',phone:'09171111111',grade:'Grade 1',section:'Sampaguita',subjects:'All Subjects',status:'active',joined:'2020-06-01'},
    {id:'T002',name:'Mr. Pedro Reyes',email:'preyes@smartgrade.edu',phone:'09182222222',grade:'Grade 2',section:'Rosal',subjects:'All Subjects',status:'active',joined:'2019-06-01'},
    {id:'T003',name:'Ms. Carmen Lim',email:'clim@smartgrade.edu',phone:'09193333333',grade:'Grade 3',section:'Gumamela',subjects:'All Subjects',status:'active',joined:'2021-06-01'},
  ],

  parents: [
    {id:'P001',name:'Mrs. Liza Reyes',email:'parent@gmail.com',phone:'09171234567',children:['S001']},
    {id:'P002',name:'Mr. Carlos Gomez',email:'cgomez@gmail.com',phone:'09182345678',children:['S002']},
    {id:'P003',name:'Mr. Juan Dela Cruz',email:'parent@gmail.com',phone:'09193456789',children:['S003']},
    {id:'P004',name:'Mrs. Rosa Santos',email:'rsantos@gmail.com',phone:'09204567890',children:['S004']},
    {id:'P005',name:'Ms. Aileen Lim',email:'alim@gmail.com',phone:'09215678901',children:['S005']},
    {id:'P006',name:'Mr. Bobby Torres',email:'btorres@gmail.com',phone:'09226789012',children:['S006']},
    {id:'P007',name:'Mrs. Nena Ramos',email:'nramos@gmail.com',phone:'09237890123',children:['S007']},
    {id:'P008',name:'Mr. Anthony Tan',email:'atan@gmail.com',phone:'09248901234',children:['S008']},
    {id:'P009',name:'Mrs. Paz Cruz',email:'pcruz@gmail.com',phone:'09259012345',children:['S009']},
    {id:'P010',name:'Mr. Leo Bautista',email:'lbautista@gmail.com',phone:'09260123456',children:['S010']},
  ],

  notifications: [
    {id:1,title:'Q4 grade submission due',body:'All teachers must complete grade entry by Friday afternoon.',time:'2h ago',type:'high',read:false},
    {id:2,title:'New parent message received',body:'A parent has sent a new message about student progress.',time:'5h ago',type:'normal',read:false},
    {id:3,title:'School news posted',body:'New announcements are now available for all users.',time:'1d ago',type:'normal',read:false},
  ],

  grades: {
    S001:{math:[88,92,85,90],science:[90,87,93,91],english:[85,88,82,87],filipino:[92,94,90,93],ap:[88,85,89,87]},
    S002:{math:[75,78,72,80],science:[82,79,85,81],english:[70,73,68,75],filipino:[80,82,78,83],ap:[77,75,80,78]},
    S003:{math:[95,97,93,96],science:[88,91,89,92],english:[90,93,88,92],filipino:[85,87,84,88],ap:[91,93,90,94]},
    S004:{math:[82,85,80,84],science:[79,81,78,82],english:[88,90,86,89],filipino:[86,88,84,87],ap:[83,85,82,86]},
    S005:{math:[65,68,62,70],science:[72,70,75,71],english:[68,65,70,67],filipino:[75,77,73,76],ap:[70,68,72,69]},
    S006:{math:[90,93,88,92],science:[85,87,83,89],english:[88,91,86,90],filipino:[92,94,90,93],ap:[87,89,85,91]},
    S007:{math:[78,80,75,82],science:[84,86,81,85],english:[76,79,73,80],filipino:[82,84,80,85],ap:[79,81,77,83]},
    S008:{math:[72,74,70,76],science:[78,75,80,77],english:[74,72,76,73],filipino:[77,79,75,78],ap:[73,71,75,72]},
    S009:{math:[86,88,84,89],science:[80,82,78,83],english:[84,86,82,87],filipino:[88,90,86,91],ap:[82,84,80,85]},
    S010:{math:[91,93,89,94],science:[87,89,85,90],english:[89,91,87,92],filipino:[93,95,91,96],ap:[85,87,83,88]},
  },

  attendance: {
    S001:{present:42,absent:2,late:1,total:45},
    S002:{present:40,absent:3,late:2,total:45},
    S003:{present:44,absent:1,late:0,total:45},
    S004:{present:41,absent:2,late:2,total:45},
    S005:{present:38,absent:5,late:2,total:45},
    S006:{present:43,absent:1,late:1,total:45},
    S007:{present:39,absent:4,late:2,total:45},
    S008:{present:35,absent:7,late:3,total:45},
    S009:{present:42,absent:2,late:1,total:45},
    S010:{present:44,absent:1,late:0,total:45},
  },

  messages: [
    {id:1,fromRole:'parent',fromId:'P003',fromName:'Mr. Juan Dela Cruz',toRole:'teacher',toId:'teacher',subject:'Concern about Math performance',body:'Good day Ma\'am Santos. I would like to ask about my son Jose Jr.\'s performance in Math this quarter. He seems to be struggling with basic addition at home. Can we schedule a parent-teacher meeting this week? Thank you.',date:'2025-01-20',time:'09:30 AM',read:false,studentId:'S003',thread:null},
    {id:2,fromRole:'teacher',fromId:'teacher',fromName:'Ms. Maria Santos',toRole:'parent',toId:'P003',subject:'Re: Concern about Math performance',body:'Good day Mr. Dela Cruz! Thank you for reaching out. Jose Jr. is actually doing exceptionally well — he currently holds the highest Math score in Grade 1 at 95 this quarter! I would be happy to meet on Friday at 3:00 PM. Please confirm your availability.',date:'2025-01-21',time:'10:15 AM',read:true,studentId:'S003',thread:1},
    {id:3,fromRole:'admin',fromId:'admin',fromName:'Principal Roberto Cruz',toRole:'teacher',toId:'teacher',subject:'Q3 Grade Submission Reminder',body:'Dear Teachers, This is a reminder that Q3 grades must be submitted by January 31, 2025, 5:00 PM. Please ensure all student records are accurate and complete. Thank you.',date:'2025-01-22',time:'08:00 AM',read:false,studentId:null,thread:null},
    {id:4,fromRole:'parent',fromId:'P004',fromName:'Mrs. Rosa Santos',toRole:'teacher',toId:'teacher',subject:'Scholarship Application – Progress Report Needed',body:'Good morning Ma\'am! We are applying for a scholarship for Ana and we need an updated official progress report. Could you please prepare this at your earliest convenience? We need it by January 28. Thank you very much!',date:'2025-01-24',time:'07:45 AM',read:false,studentId:'S004',thread:null},
    {id:5,fromRole:'teacher',fromId:'teacher',fromName:'Ms. Maria Santos',toRole:'parent',toId:'P005',subject:'Attendance Alert: Pedro Lim',body:'Dear Ms. Aileen Lim, I hope this message finds you well. I am writing to inform you that Pedro has been absent 5 times this month, which may affect his quarterly grades. Please let me know if there are any issues we can address together.',date:'2025-01-23',time:'02:00 PM',read:true,studentId:'S005',thread:null},
  ],

  announcements: [
    {id:1,title:'Q3 Report Cards Now Ready for Pickup',body:'Grade 1, 2, and 3 report cards for the 3rd quarter are now available at the Registrar\'s Office. Please bring a valid government-issued ID. Parents must sign the logbook upon claiming. Office hours: Monday to Friday, 8:00 AM to 5:00 PM.',date:'2025-01-25',audience:'all',author:'Principal Cruz',priority:'high',authorRole:'admin'},
    {id:2,title:'Parent-Teacher Conference – February 5, 2025',body:'The quarterly Parent-Teacher Conference is scheduled on Wednesday, February 5, 2025 from 8:00 AM to 12:00 NN. All parents of Grade 1, 2, and 3 students are strongly encouraged to attend. Please sign up at the front office or contact your child\'s teacher to confirm your schedule.',date:'2025-01-24',audience:'all',author:'Principal Cruz',priority:'high',authorRole:'admin'},
    {id:3,title:'Reading Program – Grade 1 and 2',body:'All Grade 1 and 2 homeroom teachers must submit their students\' reading assessment results by January 30, 2025. Please use the approved format from the English Department. Submit results to Ms. Reyes at the Academic Office.',date:'2025-01-23',audience:'teacher',author:'Principal Cruz',priority:'normal',authorRole:'admin'},
    {id:4,title:'No Classes – February 25 (EDSA People Power Anniversary)',body:'There will be no classes on Tuesday, February 25, 2025 in observance of the EDSA People Power Revolution Anniversary, a national holiday. Regular classes will resume on Wednesday, February 26, 2025.',date:'2025-01-22',audience:'all',author:'Admin Office',priority:'normal',authorRole:'admin'},
  ],

  classes: [
    {id:'C001',grade:'Grade 1',section:'Sampaguita',teacherId:'T001',year:'2024-2025'},
    {id:'C002',grade:'Grade 2',section:'Rosal',teacherId:'T002',year:'2024-2025'},
    {id:'C003',grade:'Grade 3',section:'Gumamela',teacherId:'T003',year:'2024-2025'},
  ],

  users: {
    teacher:{role:'teacher',id:'teacher',name:'Ms. Maria Santos',email:'teacher@smartgrade.edu',password:'password123',grade:'Grade 1',section:'Sampaguita',teacherId:'T001'},
    parent:{role:'parent',id:'P003',name:'Mr. Juan Dela Cruz',email:'parent@gmail.com',password:'password123',childIds:['S003'],childId:'S003'},
    admin:{role:'admin',id:'admin',name:'Principal Roberto Cruz',email:'admin@smartgrade.edu',password:'password123',school:'Polangui South Central School'},
  },

  subjects: ['math','science','english','filipino','ap'],
  subjectLabels: {math:'Mathematics',science:'Science',english:'English',filipino:'Filipino',ap:'Araling Panlipunan'},
  quarters: ['Q1','Q2','Q3','Q4','Final'],
  nextStudentId: 11,
  nextTeacherId: 4,
  nextMsgId: 6,
  nextAnnId: 5,
};

/* ════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════ */
const avg = a => a&&a.length ? Math.round(a.reduce((s,v)=>s+v,0)/a.length) : 0;
const ini = n => n.split(' ').filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase();
const glabel = n => n>=90?'Outstanding':n>=85?'Very Satisfactory':n>=80?'Satisfactory':n>=75?'Fairly Satisfactory':'Did Not Meet';
const gbadge = n => n>=90?'bg-green':n>=80?'bg-blue':n>=75?'bg-amber':'bg-red';
const gcol = n => n>=90?'var(--green)':n>=80?'var(--blue)':n>=75?'var(--amber)':'var(--red)';
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
};

function toast(msg, type='success'){
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = (type==='success'?'✓':type==='error'?'✕':'ℹ') + ` ${msg}`;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(()=>t.remove(), 3200);
}

function showConfirm(title, msg, onYes){
  const ov = document.createElement('div');
  ov.className = 'confirm-overlay';
  ov.innerHTML = `<div class="confirm-box">
    <div class="confirm-icon">⚠️</div>
    <div class="confirm-title">${title}</div>
    <div class="confirm-msg">${msg}</div>
    <div class="confirm-btns">
      <button class="btn btn-secondary" onclick="this.closest('.confirm-overlay').remove()">Cancel</button>
      <button class="btn btn-danger" id="confirm-yes">Yes, Confirm</button>
    </div>
  </div>`;
  document.body.appendChild(ov);
  ov.querySelector('#confirm-yes').onclick = ()=>{ ov.remove(); onYes(); };
}

let _modalStack = [];
function openModal(html, onClose){
  const ov = document.createElement('div');
  ov.className = 'modal-bg';
  ov.innerHTML = `<div class="modal">${html}</div>`;
  ov.onclick = e => { if(e.target===ov){ closeModal(); if(onClose) onClose(); } };
  document.body.appendChild(ov);
  _modalStack.push(ov);
  return ov;
}
function closeModal(){
  const m = _modalStack.pop();
  if(m) m.remove();
}
function closeAllModals(){ while(_modalStack.length) _modalStack.pop().remove(); }

function getNotificationCount(){
  return STATE.notifications.filter(n=>!n.read).length;
}
function markNotificationsRead(){
  STATE.notifications.forEach(n=>n.read=true);
}
function updateUnreadBadge(){
  const u = STATE.currentUser;
  if(!u) return;

  // Count unread messages specifically addressed to this user
  const unreadCount = STATE.messages.filter(m => {
    if(m.read) return false;
    // Must be addressed to this user's role AND this user's specific ID
    const roleMatch = m.toRole === u.role || m.toRole === 'all';
    const idMatch = m.toId === u.id || m.toId === 'all';
    return roleMatch && idMatch;
  }).length;

  const msgBad = document.getElementById('msg-badge');
  if(msgBad){
    msgBad.style.display = unreadCount > 0 ? 'flex' : 'none';
    msgBad.textContent = unreadCount > 0 ? unreadCount : '';
  }

  const notifCount = getNotificationCount();
  const notifBad = document.getElementById('notif-badge');
  if(notifBad){
    notifBad.style.display = notifCount > 0 ? 'flex' : 'none';
    notifBad.textContent = notifCount > 0 ? notifCount : '';
  }
}

function setTopbarAvatar(user){
  const av = document.getElementById('tb-av');
  av.style.backgroundImage = '';
  av.style.backgroundSize = '';
  av.style.backgroundPosition = '';
  av.style.color = user.role==='admin'?'var(--blue)':user.role==='parent'?'var(--amber)':'var(--green)';
  av.style.backgroundColor = user.role==='admin'?'var(--blue-l)':user.role==='parent'?'var(--amber-l)':'var(--green-l)';
  if(user.avatar){
    av.style.backgroundImage = `url("${user.avatar}")`;
    av.style.backgroundSize = 'cover';
    av.style.backgroundPosition = 'center';
    av.style.color = '#fff';
    av.textContent = '';
  } else {
    av.textContent = ini(user.name);
  }
}

function openNotifications(){
  markNotificationsRead();
  updateUnreadBadge();
  nav('announcements');
}

function toggleNotifications(){
  const existing = document.getElementById('notif-dropdown');
  if(existing){ existing.remove(); return; }
  const list = STATE.notifications.map(n=>`
    <div class="notif-item ${n.type==='high'?'high':''}">
      <div class="notif-item-title">${n.title}</div>
      <div class="notif-item-body">${n.body}</div>
      <div class="notif-item-time">${n.time}</div>
    </div>
  `).join('');
  const panel = document.createElement('div');
  panel.id = 'notif-dropdown';
  panel.className = 'notif-dropdown';
  panel.innerHTML = `
    <div class="notif-header"><strong>Notifications</strong><span>${STATE.notifications.length} new</span></div>
    <div class="notif-items">${list}</div>
  `;
  document.body.appendChild(panel);
  const rect = document.querySelector('.tb-notif-btn')?.getBoundingClientRect();
  if(rect){ panel.style.top = `${rect.bottom + 10}px`; panel.style.right = `20px`; }
  setTimeout(()=>document.addEventListener('click', hideNotificationDropdown));
}
function hideNotificationDropdown(e){
  if(!e.target.closest('#notif-dropdown') && !e.target.closest('.tb-notif-btn')){
    document.getElementById('notif-dropdown')?.remove();
    document.removeEventListener('click', hideNotificationDropdown);
  }
}

/* ════════════════════════════════════════
   AUTH
   ════════════════════════════════════════ */
let selRole = 'teacher';
function setRole(role, btn){
  selRole = role;
  document.querySelectorAll('.role-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const emails = {teacher:'teacher@smartgrade.edu',parent:'parent@gmail.com',admin:'admin@smartgrade.edu'};
  document.getElementById('l-email').value = emails[role];
}

function doLogin() {
  const email = document.getElementById('l-email').value.trim();
  const pass  = document.getElementById('l-pass').value.trim();

  let foundUser = null;
  let foundRole = null;

  // 🔍 SEARCH ALL ROLES (IMPORTANT FIX)
  for (const role in STATE.users) {
    const user = STATE.users[role];

    if (user.email === email && user.password === pass) {
      foundUser = user;
      foundRole = role;
      break;
    }
  }

  // ❌ INVALID LOGIN
  if (!foundUser) {
    toast('Invalid email or password.', 'error');
    return;
  }

  // ✅ SAVE USER SESSION
  STATE.currentUser = foundUser;
  STATE.currentRole = foundRole;

  // SWITCH UI
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('app').style.display = 'flex';

  // TOPBAR
  setTopbarAvatar(foundUser);
  document.getElementById('tb-name').textContent = foundUser.name;
  document.getElementById('tb-role').textContent =
    foundRole.charAt(0).toUpperCase() + foundRole.slice(1);

  // SIDEBAR BASED ON ROLE
  buildSidebar(foundRole);

  updateUnreadBadge();
  nav('dashboard');
}

function doLogout(){
  STATE.currentUser = null;
  closeAllModals();
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-page').style.display = 'grid';
  // Clear fields so next login starts fresh
  document.getElementById('l-email').value = '';
  document.getElementById('l-pass').value  = '';
}


function togglePasswordVisibility(){
  const passInput = document.getElementById('l-pass');
  const toggleBtn = document.getElementById('pass-toggle');
  if(!passInput || !toggleBtn) return;
 
  if(passInput.type === 'password'){
    passInput.type = 'text';
    toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    toggleBtn.setAttribute('aria-label', 'Hide password');
  } else {
    passInput.type = 'password';
    toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    toggleBtn.setAttribute('aria-label', 'Show password');
  }
}
 

/* ════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════ */
const navMenus = {
  teacher:[
    {s:'Overview'},{id:'dashboard',l:'Dashboard',ic:'home'},
    {s:'Classroom'},{id:'students',l:'My Students',ic:'people'},{id:'grades',l:'Grade Entry',ic:'grade'},{id:'attendance',l:'Attendance',ic:'cal'},
    {s:'Communication'},{id:'messages',l:'Messages',ic:'msg'},{id:'announcements',l:'Announcements',ic:'bell'},
    {s:'Tools'},{id:'reports',l:'Reports',ic:'chart'},
  ],
  parent:[
    {s:'Overview'},{id:'dashboard',l:'Dashboard',ic:'home'},
    {s:"My Child"},{id:'grades',l:'Academic Record',ic:'grade'},{id:'attendance',l:'Attendance',ic:'cal'},
    {s:'Communication'},{id:'messages',l:'Messages',ic:'msg'},{id:'announcements',l:'School News',ic:'bell'},
  ],
  admin:[
    {s:'Overview'},{id:'dashboard',l:'Dashboard',ic:'home'},
    {s:'Management'},{id:'students',l:'Students',ic:'people'},{id:'teachers',l:'Teachers',ic:'person'},{id:'parents',l:'Parents',ic:'person'},{id:'classes',l:'Classes',ic:'school'},
    {s:'Academics'},{id:'grades',l:'Grade Overview',ic:'grade'},{id:'attendance',l:'Attendance',ic:'cal'},
    {s:'Communication'},{id:'messages',l:'Messages',ic:'msg'},{id:'announcements',l:'Announcements',ic:'bell'},
    {s:'System'},{id:'reports',l:'Reports',ic:'chart'},
  ]
};

function buildSidebar(role){
  const sb = document.getElementById('sidebar');
  sb.innerHTML = '';
  navMenus[role].forEach(item=>{
    if(item.s){ sb.innerHTML+=`<div class="nav-section-label">${item.s}</div>`; return; }
    const unread = item.id==='messages' ? STATE.messages.filter(m=>!m.read&&m.toRole===role&&m.toId===STATE.currentUser.id).length : 0;
    sb.innerHTML += `<button class="nav-link" id="nl-${item.id}" onclick="nav('${item.id}')">${svgIco[item.ic]||''} ${item.l}${unread?`<span class="nav-count">${unread}</span>`:''}</button>`;
  });
}

function nav(page){
  if(STATE.activeNav){ document.getElementById('nl-'+STATE.activeNav)?.classList.remove('active'); }
  STATE.activeNav = page;
  document.getElementById('nl-'+page)?.classList.add('active');
  const c = document.getElementById('content');
  c.innerHTML='';
  const role = STATE.currentUser.role;
  const pages = {
    teacher:{dashboard:pgTeacherDash,students:pgStudents,grades:pgGrades,attendance:pgAttendance,messages:pgMessages,announcements:pgAnnouncements,reports:pgReports,profile:pgProfile},
    parent:{dashboard:pgParentDash,grades:pgGrades,attendance:pgAttendance,messages:pgMessages,announcements:pgAnnouncements,profile:pgProfile},
    admin:{dashboard:pgAdminDash,students:pgStudents,teachers:pgTeachers,parents:pgParents,classes:pgClasses,grades:pgGrades,attendance:pgAttendance,messages:pgMessages,announcements:pgAnnouncements,reports:pgReports,profile:pgProfile}
  };
  (pages[role]?.[page] || (()=>{ c.innerHTML='<div class="empty-state"><div class="es-icon">🔍</div><div class="es-title">Page not found</div></div>'; }))(c);
}

/* ════════════════════════════════════════
   ██████████ TEACHER DASHBOARD ██████████
   ════════════════════════════════════════ */
function pgTeacherDash(el){
  const u = STATE.currentUser;
  const myStudents = STATE.students.filter(s=>s.section===u.section&&s.grade===u.grade&&s.status==='active');
  const unread = STATE.messages.filter(m=>!m.read&&m.toRole==='teacher'&&m.toId===u.id).length;
  let allScores=[];
  myStudents.forEach(s=>{const g=STATE.grades[s.id];if(g) STATE.subjects.forEach(sub=>allScores.push(avg(g[sub])));});
  const clsAvg = allScores.length?Math.round(allScores.reduce((a,b)=>a+b,0)/allScores.length):0;
  const lowCount = myStudents.filter(s=>{const g=STATE.grades[s.id];return g&&STATE.subjects.some(sub=>avg(g[sub])<75);}).length;
  const totPres = myStudents.reduce((a,s)=>{const at=STATE.attendance[s.id];return a+(at?at.present:0);},0);
  const totAll  = myStudents.reduce((a,s)=>{const at=STATE.attendance[s.id];return a+(at?at.total:0);},0);
  const attR = totAll?Math.round(totPres/totAll*100):0;
  const today = new Date().toLocaleDateString('en-PH',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const pendingMsgs = STATE.messages.filter(m=>m.toRole==='teacher'&&!m.read);

  el.innerHTML=`
  <div class="dash-hero hero-green" style="margin-bottom:22px">
    <div class="hero-deco hero-deco-1" style="width:260px;height:260px;top:-80px;right:-60px;background:rgba(255,255,255,.06);border-radius:50%;position:absolute"></div>
    <div class="hero-deco hero-deco-2" style="width:180px;height:180px;bottom:-60px;right:180px;background:rgba(255,255,255,.04);border-radius:50%;position:absolute"></div>
    <div style="position:relative;z-index:1">
      <div class="hero-rl">Teacher Dashboard</div>
      <div class="hero-name">Good day, ${u.name.split(' ')[1]}! 👋</div>
      <div class="hero-sub">${today} &nbsp;·&nbsp; ${u.grade} – ${u.section}</div>
      <div class="hero-kpis">
        <div><div class="hero-kpi-val">${myStudents.length}</div><div class="hero-kpi-lbl">Students</div></div>
        <div><div class="hero-kpi-val">${clsAvg}</div><div class="hero-kpi-lbl">Class Average</div></div>
        <div><div class="hero-kpi-val">${attR}%</div><div class="hero-kpi-lbl">Attendance Rate</div></div>
        <div><div class="hero-kpi-val">${unread}</div><div class="hero-kpi-lbl">Unread Messages</div></div>
      </div>
    </div>
  </div>

  <div class="stats-grid">
    <div class="stat-card"><div class="stat-lbl">My Students</div><div class="stat-val green">${myStudents.length}</div><div class="stat-foot">${u.grade} – ${u.section}</div><div class="stat-bar"><div class="stat-bar-f" style="width:100%;background:var(--green)"></div></div></div>
    <div class="stat-card"><div class="stat-lbl">Class Average</div><div class="stat-val ${clsAvg>=85?'green':clsAvg>=75?'amber':'red'}">${clsAvg}</div><div class="stat-foot">${glabel(clsAvg)}</div><div class="stat-bar"><div class="stat-bar-f" style="width:${clsAvg}%;background:${gcol(clsAvg)}"></div></div></div>
    <div class="stat-card"><div class="stat-lbl">Need Attention</div><div class="stat-val ${lowCount>0?'red':'green'}">${lowCount}</div><div class="stat-foot">Students below 75</div><div class="stat-bar"><div class="stat-bar-f" style="width:${myStudents.length?lowCount/myStudents.length*100:0}%;background:var(--red)"></div></div></div>
    <div class="stat-card"><div class="stat-lbl">Unread Messages</div><div class="stat-val ${unread>0?'amber':'green'}">${unread}</div><div class="stat-foot">Parent messages</div><div class="stat-bar"><div class="stat-bar-f" style="width:${Math.min(unread*15,100)}%;background:var(--amber)"></div></div></div>
  </div>

  <div class="g2 mb-16">
    <!-- Student Performance -->
    <div class="card">
      <div class="card-header"><div class="card-title" style="margin:0">Student Performance</div><button class="btn btn-secondary btn-xs" onclick="nav('grades')">Enter Grades</button></div>
      <div id="perf-list">
      ${myStudents.length===0?`<div class="empty-state"><div class="es-icon">👥</div><div class="es-title">No students found</div></div>`:
        myStudents.map(s=>{
          const g=STATE.grades[s.id];
          const ov=g?Math.round(STATE.subjects.reduce((a,sub)=>a+avg(g[sub]),0)/STATE.subjects.length):0;
          const att=STATE.attendance[s.id];
          const attRate=att?Math.round(att.present/att.total*100):0;
          return `<div class="flex aic gap-12" style="padding:10px 0;border-bottom:1px solid var(--border)">
            <div class="av av-40 av-green">${ini(s.name)}</div>
            <div class="f1">
              <div class="fw6 ts">${s.name}</div>
              <div style="height:4px;background:var(--surface2);border-radius:2px;margin-top:5px"><div style="height:100%;width:${ov}%;background:${gcol(ov)};border-radius:2px;transition:width .6s"></div></div>
            </div>
            <div style="text-align:right">
              <span class="badge ${gbadge(ov)}">${ov}</span>
              <div class="txs tmm mt-8">${attRate}% present</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Right column -->
    <div style="display:flex;flex-direction:column;gap:14px">
      <!-- Messages -->
      <div class="card">
        <div class="card-header"><div class="card-title" style="margin:0">Recent Messages</div>${unread?`<span class="badge bg-red">${unread} new</span>`:''}</div>
        ${pendingMsgs.length===0?`<p class="ts tm">No new messages.</p>`:
          pendingMsgs.slice(0,3).map(m=>`
            <div class="flex aic gap-10" style="padding:9px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="nav('messages')">
              <div class="av av-32 av-green">${ini(m.fromName)}</div>
              <div class="f1">
                <div class="ts fw6">${m.fromName}</div>
                <div class="txs tm" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px">${m.subject}</div>
                <div class="txs tmm">${m.date}</div>
              </div>
              <div style="width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0"></div>
            </div>`).join('')}
        <button class="btn btn-secondary btn-sm mt-12" style="width:100%" onclick="nav('messages')">Open Inbox</button>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <div class="card-title">Quick Actions</div>
        <div style="display:grid;gap:8px">
          <button class="btn btn-primary" onclick="nav('grades')" style="justify-content:flex-start;padding:11px 14px">📝 &nbsp;Enter Student Grades</button>
          <button class="btn btn-secondary" onclick="nav('attendance')" style="justify-content:flex-start;padding:11px 14px">📋 &nbsp;Mark Today's Attendance</button>
          <button class="btn btn-secondary" onclick="openComposeModal()" style="justify-content:flex-start;padding:11px 14px">💬 &nbsp;Message a Parent</button>
          <button class="btn btn-secondary" onclick="nav('reports')" style="justify-content:flex-start;padding:11px 14px">📊 &nbsp;Generate Report</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Subject Averages -->
  <div class="card mb-16">
    <div class="card-header"><div class="card-title" style="margin:0">Subject Performance Overview</div><span class="badge bg-gray">${u.grade} – ${u.section}</span></div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">
      ${STATE.subjects.map(sub=>{
        let vals=[];myStudents.forEach(s=>{const g=STATE.grades[s.id];if(g&&g[sub]) vals.push(avg(g[sub]));});
        const sa=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
        return `<div style="padding:16px;background:var(--bg);border-radius:12px;text-align:center">
          <div class="txs tmm fw7" style="text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${STATE.subjectLabels[sub].split(' ')[0]}</div>
          <div style="font-size:28px;font-weight:800;color:${gcol(sa)};letter-spacing:-1px">${sa}</div>
          <div style="height:4px;background:var(--surface2);border-radius:2px;margin-top:8px"><div style="height:100%;width:${sa}%;background:${gcol(sa)};border-radius:2px"></div></div>
          <div class="txs tmm mt-8">${glabel(sa)}</div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <!-- Announcements preview -->
  <div class="card">
    <div class="card-header"><div class="card-title" style="margin:0">Latest Announcements</div><button class="btn btn-secondary btn-xs" onclick="nav('announcements')">See All</button></div>
    ${STATE.announcements.slice(0,2).map(a=>`
      <div style="padding:12px 0;border-bottom:1px solid var(--border)">
        <div class="flex aic gap-8 mb-8"><span class="badge ${a.priority==='high'?'bg-red':'bg-gray'}">${a.priority==='high'?'Important':'Notice'}</span><span class="txs tmm">${a.date}</span></div>
        <div class="fw6 ts">${a.title}</div>
        <div class="txs tm mt-8" style="line-height:1.5">${a.body.slice(0,100)}...</div>
      </div>`).join('')}
  </div>`;
}

/* ════════════════════════════════════════
   ██████████ PARENT DASHBOARD ██████████
   ════════════════════════════════════════ */
function pgParentDash(el){
  const u = STATE.currentUser;
  const child = STATE.students.find(s=>s.id===u.childId);
  const g = STATE.grades[u.childId]||{};
  const att = STATE.attendance[u.childId]||{present:0,absent:0,late:0,total:45};
  const subs = STATE.subjects.map(sub=>avg(g[sub]||[]));
  const ov = subs.length?Math.round(subs.reduce((a,b)=>a+b,0)/subs.length):0;
  const attR = att.total?Math.round(att.present/att.total*100):0;
  const myMsgs = STATE.messages.filter(m=>m.studentId===u.childId||m.toId===u.id||m.fromId===u.id);
  const unread = myMsgs.filter(m=>!m.read&&m.toId===u.id).length;
  const bestI = subs.indexOf(Math.max(...subs));
  const worstI = subs.indexOf(Math.min(...subs));
  const today = new Date().toLocaleDateString('en-PH',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

  el.innerHTML=`
  <div class="dash-hero hero-amber" style="margin-bottom:22px">
    <div style="position:absolute;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,.06);top:-80px;right:-60px"></div>
    <div style="position:absolute;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.04);bottom:-60px;right:180px"></div>
    <div style="position:relative;z-index:1">
      <div class="hero-rl">Parent Dashboard</div>
      <div class="hero-name">Welcome, ${u.name.split(' ')[1]}! 👋</div>
      <div class="hero-sub">Monitoring: <strong style="color:#fff">${child?.name||'Your Child'}</strong> &nbsp;·&nbsp; ${child?.grade} – ${child?.section}</div>
      <div class="hero-kpis">
        <div><div class="hero-kpi-val">${ov}</div><div class="hero-kpi-lbl">Overall Average</div></div>
        <div><div class="hero-kpi-val">${attR}%</div><div class="hero-kpi-lbl">Attendance Rate</div></div>
        <div><div class="hero-kpi-val">${att.absent}</div><div class="hero-kpi-lbl">Days Absent</div></div>
        <div><div class="hero-kpi-val">${unread}</div><div class="hero-kpi-lbl">New Messages</div></div>
      </div>
    </div>
  </div>

  <div class="stats-grid">
    <div class="stat-card"><div class="stat-lbl">Overall Grade</div><div class="stat-val ${ov>=90?'green':ov>=75?'amber':'red'}">${ov}</div><div class="stat-foot">${glabel(ov)}</div></div>
    <div class="stat-card"><div class="stat-lbl">Attendance</div><div class="stat-val ${attR>=90?'green':attR>=75?'amber':'red'}">${attR}%</div><div class="stat-foot">${att.present} of ${att.total} days</div></div>
    <div class="stat-card"><div class="stat-lbl">Best Subject</div><div class="stat-val green">${subs[bestI]}</div><div class="stat-foot">${STATE.subjectLabels[STATE.subjects[bestI]]}</div></div>
    <div class="stat-card"><div class="stat-lbl">Needs Focus</div><div class="stat-val ${subs[worstI]<75?'red':'amber'}">${subs[worstI]}</div><div class="stat-foot">${STATE.subjectLabels[STATE.subjects[worstI]]}</div></div>
  </div>

  <div class="g2 mb-16">
    <div style="display:flex;flex-direction:column;gap:14px">
      <!-- Child Profile -->
      <div class="card" style="background:linear-gradient(135deg,var(--amber-l),var(--bg))">
        <div class="flex aic gap-14">
          <div class="av av-52 av-amber">${ini(child?.name||'')}</div>
          <div class="f1">
            <div style="font-size:18px;font-weight:800;letter-spacing:-.3px">${child?.name}</div>
            <div class="ts tm">${child?.grade} – ${child?.section}</div>
            <div class="txs tmm mt-8">LRN: ${child?.id} &nbsp;·&nbsp; ${child?.gender==='F'?'Female':'Male'}</div>
          </div>
          <span class="badge bg-green" style="font-size:12px">${child?.status}</span>
        </div>
        <div class="divider"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center">
          <div style="padding:10px;background:var(--green-l);border-radius:9px"><div style="font-size:22px;font-weight:800;color:var(--green)">${att.present}</div><div class="txs tm">Present</div></div>
          <div style="padding:10px;background:var(--red-l);border-radius:9px"><div style="font-size:22px;font-weight:800;color:var(--red)">${att.absent}</div><div class="txs tm">Absent</div></div>
          <div style="padding:10px;background:var(--amber-l);border-radius:9px"><div style="font-size:22px;font-weight:800;color:var(--amber)">${att.late}</div><div class="txs tm">Late</div></div>
        </div>
      </div>

      <!-- Subject Grades -->
      <div class="card">
        <div class="card-header"><div class="card-title" style="margin:0">Subject Performance</div><button class="btn btn-secondary btn-xs" onclick="nav('grades')">Full Record</button></div>
        ${STATE.subjects.map((sub,i)=>`
          <div class="prog-wrap">
            <div class="prog-top"><span class="prog-lbl">${STATE.subjectLabels[sub]}</span><span class="badge ${gbadge(subs[i])}">${subs[i]}</span></div>
            <div class="prog-track"><div class="prog-fill" style="width:${subs[i]}%;background:${gcol(subs[i])}"></div></div>
          </div>`).join('')}
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:14px">
      <!-- Quarterly breakdown -->
      <div class="card">
        <div class="card-title">Quarterly Grades – Mathematics</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
          ${STATE.quarters.map((q,i)=>{
            const sc=g.math?g.math[i]:0;
            return `<div style="padding:14px 8px;background:${sc>=90?'var(--green-l)':sc>=75?'var(--amber-l)':'var(--red-l)'};border-radius:10px;text-align:center">
              <div class="txs tmm fw7" style="text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">${q}</div>
              <div style="font-size:24px;font-weight:800;color:${gcol(sc)};letter-spacing:-1px">${sc}</div>
              <div class="txs" style="color:${gcol(sc)};margin-top:4px">${sc>=90?'Outstanding':sc>=75?'Satisfactory':'Below'}</div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Messages -->
      <div class="card">
        <div class="card-header"><div class="card-title" style="margin:0">Messages from Teacher</div>${unread?`<span class="badge bg-red">${unread} new</span>`:''}</div>
        ${myMsgs.slice(0,3).map(m=>`
          <div class="flex aic gap-10" style="padding:9px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="nav('messages')">
            <div class="av av-32 av-green">${ini(m.fromName)}</div>
            <div class="f1">
              <div class="ts fw6">${m.fromName}</div>
              <div class="txs tm" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px">${m.subject}</div>
            </div>
            ${!m.read&&m.toId===u.id?`<div style="width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0"></div>`:''}
          </div>`).join('')||'<p class="ts tm">No messages yet.</p>'}
        <div class="flex gap-8 mt-12">
          <button class="btn btn-primary btn-sm f1" onclick="openComposeModal()">✉️ Send Message</button>
          <button class="btn btn-secondary btn-sm f1" onclick="nav('messages')">View All</button>
        </div>
      </div>

      <!-- Announcements -->
      <div class="card">
        <div class="card-header"><div class="card-title" style="margin:0">School Announcements</div><button class="btn btn-secondary btn-xs" onclick="nav('announcements')">All</button></div>
        ${STATE.announcements.filter(a=>a.audience==='all').slice(0,2).map(a=>`
          <div style="padding:10px;background:var(--bg);border-radius:9px;margin-bottom:8px">
            <div class="flex aic gap-8 mb-6"><span class="badge ${a.priority==='high'?'bg-red':'bg-gray'}" style="font-size:11px">${a.priority==='high'?'Important':'Notice'}</span><span class="txs tmm">${a.date}</span></div>
            <div class="ts fw6">${a.title}</div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

/* ════════════════════════════════════════
   ██████████ ADMIN DASHBOARD ██████████
   ════════════════════════════════════════ */
function pgAdminDash(el){
  const u=STATE.currentUser;
  const total=STATE.students.length,active=STATE.students.filter(s=>s.status==='active').length;
  let allOv=[];
  STATE.students.forEach(s=>{const g=STATE.grades[s.id];if(g) allOv.push(Math.round(STATE.subjects.reduce((a,sub)=>a+avg(g[sub]),0)/STATE.subjects.length));});
  const schAvg=allOv.length?Math.round(allOv.reduce((a,b)=>a+b,0)/allOv.length):0;
  const outstanding=allOv.filter(x=>x>=90).length,dnm=allOv.filter(x=>x<75).length;
  const unreadMsgs=STATE.messages.filter(m=>!m.read).length;
  const today=new Date().toLocaleDateString('en-PH',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

  el.innerHTML=`
  <div class="dash-hero hero-green" style="margin-bottom:22px">
    <div style="position:absolute;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,.06);top:-80px;right:-60px"></div>
    <div style="position:relative;z-index:1">
      <div class="hero-rl">Admin Dashboard</div>
      <div class="hero-name">Welcome, ${u.name.split(' ').slice(-1)[0]}! 👋</div>
    <div class="hero-sub">${today} &nbsp;·&nbsp; Polangui South Central School</div>
   <div class="hero-kpis">
  <div><div class="hero-kpi-val">${total}</div><div class="hero-kpi-lbl">Total Students</div></div>
  <div><div class="hero-kpi-val">${STATE.teachers.length}</div><div class="hero-kpi-lbl">Teachers</div></div>
  <div><div class="hero-kpi-val">1–3</div><div class="hero-kpi-lbl">Grade Levels</div></div>
  <div><div class="hero-kpi-val">${schAvg}</div><div class="hero-kpi-lbl">School Average</div></div>
</div>
    </div>
  </div>

  <div class="stats-grid" style="margin-bottom:20px">
    <div class="stat-card"><div class="stat-lbl">Active Students</div><div class="stat-val green">${active}</div><div class="stat-foot">${total-active} inactive</div><div class="stat-bar"><div class="stat-bar-f" style="width:${total?active/total*100:0}%;background:var(--green)"></div></div></div>
    <div class="stat-card"><div class="stat-lbl">School Average</div><div class="stat-val ${schAvg>=85?'green':schAvg>=75?'amber':'red'}">${schAvg}</div><div class="stat-foot">${glabel(schAvg)}</div><div class="stat-bar"><div class="stat-bar-f" style="width:${schAvg}%;background:${gcol(schAvg)}"></div></div></div>
    <div class="stat-card"><div class="stat-lbl">Outstanding</div><div class="stat-val green">${outstanding}</div><div class="stat-foot">Average ≥ 90</div><div class="stat-bar"><div class="stat-bar-f" style="width:${allOv.length?outstanding/allOv.length*100:0}%;background:var(--green)"></div></div></div>
    <div class="stat-card"><div class="stat-lbl">Need Attention</div><div class="stat-val ${dnm>0?'red':'green'}">${dnm}</div><div class="stat-foot">Below 75</div><div class="stat-bar"><div class="stat-bar-f" style="width:${allOv.length?dnm/allOv.length*100:0}%;background:var(--red)"></div></div></div>
  </div>

  <div class="card mb-16">
    <div class="card-title">Quick Actions</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
      ${[
        {i:'👤',l:'Add Student',s:'Enroll a new student',f:'openAddStudentModal()'},
        {i:'👩‍🏫',l:'Add Teacher',s:'Register a new teacher',f:'openAddTeacherModal()'},
        {i:'📢',l:'Post Announcement',s:'Broadcast to everyone',f:'openAddAnnouncementModal()'},
        {i:'📊',l:'View Reports',s:'Analytics & exports',f:"nav('reports')"},
      ].map(c=>`<div onclick="${c.f}"
        style="background:var(--bg);border:1.5px solid var(--border);border-radius:var(--rl);padding:20px 16px;cursor:pointer;text-align:center;transition:all .18s"
        onmouseover="this.style.borderColor='var(--green)';this.style.transform='translateY(-2px)'"
        onmouseout="this.style.borderColor='var(--border)';this.style.transform='none'">
        <div style="font-size:28px;margin-bottom:8px">${c.i}</div>
        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:3px">${c.l}</div>
        <div style="font-size:11.5px;color:var(--text3)">${c.s}</div>
      </div>`).join('')}
    </div>
  </div>

  <div class="g2 mb-16">
    <div class="card">
      <div class="card-header"><div class="card-title" style="margin:0">Recent Students</div><button class="btn btn-secondary btn-xs" onclick="nav('students')">View All</button></div>
      ${STATE.students.slice(0,5).map(s=>{
        const g=STATE.grades[s.id];
        const ov=g?Math.round(STATE.subjects.reduce((a,sub)=>a+avg(g[sub]),0)/STATE.subjects.length):0;
        return `<div class="flex aic gap-10" style="padding:9px 0;border-bottom:1px solid var(--border)">
          <div class="av av-32 av-green">${ini(s.name)}</div>
          <div class="f1"><div class="fw6 ts">${s.name}</div><div class="txs tmm">${s.grade} – ${s.section}</div></div>
          <span class="badge ${gbadge(ov)}">${ov||'—'}</span>
          <span class="badge ${s.status==='active'?'bg-green':'bg-gray'}">${s.status}</span>
        </div>`;
      }).join('')}
    </div>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="card">
        <div class="card-header"><div class="card-title" style="margin:0">Classes</div><button class="btn btn-secondary btn-xs" onclick="nav('classes')">Manage</button></div>
        ${STATE.classes.map(c=>{
          const t=STATE.teachers.find(x=>x.id===c.teacherId);
          const sts=STATE.students.filter(s=>s.grade===c.grade&&s.section===c.section&&s.status==='active').length;
          return `<div class="flex aic gap-10" style="padding:8px 0;border-bottom:1px solid var(--border)">
            <div style="width:36px;height:36px;background:var(--blue-l);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px">🏫</div>
            <div class="f1"><div class="fw6 ts">${c.grade} – ${c.section}</div><div class="txs tmm">${t?t.name:'No teacher'}</div></div>
            <span class="badge bg-blue">${sts} students</span>
          </div>`;
        }).join('')}
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title" style="margin:0">Recent Messages</div>${unreadMsgs?`<span class="badge bg-red">${unreadMsgs} new</span>`:''}</div>
        ${STATE.messages.slice(0,3).map(m=>`
          <div class="flex aic gap-10" style="padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="nav('messages')">
            <div class="av av-32 av-blue">${ini(m.fromName)}</div>
            <div class="f1"><div class="fw6 ts">${m.fromName}</div><div class="txs tm" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px">${m.subject}</div></div>
            ${!m.read?`<div style="width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0"></div>`:''}
          </div>`).join('')}
        <button class="btn btn-secondary btn-sm mt-12" style="width:100%" onclick="nav('messages')">Open Inbox</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><div class="card-title" style="margin:0">Latest Announcements</div><button class="btn btn-secondary btn-xs" onclick="nav('announcements')">See All</button></div>
    ${STATE.announcements.slice(0,2).map(a=>`
      <div style="padding:12px 0;border-bottom:1px solid var(--border)">
        <div class="flex aic gap-8 mb-6"><span class="badge ${a.priority==='high'?'bg-red':'bg-gray'}">${a.priority==='high'?'Important':'Notice'}</span><span class="txs tmm">${a.date}</span></div>
        <div class="fw6 ts">${a.title}</div>
        <div class="txs tm mt-6" style="line-height:1.5">${a.body.slice(0,100)}…</div>
      </div>`).join('')}
  </div>`;
}
function openForgotPassword(){
  document.getElementById('forgot-overlay')?.remove();
  const ov = document.createElement('div');
  ov.id = 'forgot-overlay';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(2px)';
  ov.innerHTML = `
    <div style="background:#fff;border-radius:20px;width:100%;max-width:400px;padding:32px;box-shadow:0 24px 60px rgba(0,0,0,.2)">
      <div style="font-size:20px;font-weight:800;margin-bottom:6px;color:#18180E">Forgot Password?</div>
      <div style="font-size:13px;color:#5C5A52;margin-bottom:20px;line-height:1.6">Enter your registered email and we'll send you a reset link.</div>
      <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:18px">
        <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#5C5A52">Email Address*</label>
        <input id="fp-email" type="email" placeholder="your@email.com"
          style="padding:10px 12px;border:1.5px solid #E3E0D8;border-radius:9px;font-size:13.5px;outline:none;font-family:inherit">
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button onclick="document.getElementById('forgot-overlay').remove()"
          style="padding:9px 18px;border-radius:9px;border:1.5px solid #E3E0D8;background:#fff;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit">
          Cancel
        </button>
        <button onclick="submitForgotPassword()"
          style="padding:9px 18px;border-radius:9px;border:none;background:#2A76C9;color:#fff;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit">
          Send Reset Link
        </button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if(e.target===ov) ov.remove(); });
  setTimeout(() => document.getElementById('fp-email')?.focus(), 50);
}

function submitForgotPassword(){
  const email = document.getElementById('fp-email')?.value.trim();
  if(!email){
    const inp = document.getElementById('fp-email');
    if(inp) inp.style.border = '1.5px solid #B52B2B';
    return;
  }
  const found = Object.values(STATE.users).find(u => u.email === email);
  document.getElementById('forgot-overlay')?.remove();
  // Use a self-contained toast that works even before app loads
  const tc = document.getElementById('toast-container') || (() => {
    const el = document.createElement('div');
    el.id = 'toast-container';
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px';
    document.body.appendChild(el);
    return el;
  })();
  const t = document.createElement('div');
  t.className = found ? 'toast toast-success' : 'toast toast-error';
  t.textContent = found ? `✓ Reset link sent to ${email}!` : `No account found for ${email}.`;
  tc.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}
 
/* ─── 1. STUDENTS PAGE (Teacher & Admin) ─── */
function pgStudents(el){
  const isAdmin = STATE.currentUser.role === 'admin';
  el.innerHTML = `
    <div class="page-head">
      <div><div class="page-title">${isAdmin?'All Students':'My Students'}</div><div class="page-sub" id="stud-sub"></div></div>
      <div class="page-actions">
        ${isAdmin?`<button class="btn btn-primary" onclick="openAddStudentModal()">${svgIco.people} Add Student`:''}
        ${isAdmin?`</button>`:''}
      </div>
    </div>
    <div class="tbl-wrap">
      <div class="tbl-toolbar">
        <input id="stud-search" class="tbl-search" placeholder="🔍  Search by name, ID, grade or section...">
        ${isAdmin?`<button class="btn btn-secondary btn-sm" onclick="exportStudents()">Export</button>`:''}
      </div>
      <table>
        <thead><tr><th>Student</th><th>Grade &amp; Section</th><th>Gender</th><th>Parent/Guardian</th><th>Contact</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody id="stud-tbody"></tbody>
      </table>
    </div>`;

  function getBase(){
    return isAdmin ? STATE.students
      : STATE.students.filter(s => s.section===STATE.currentUser.section && s.grade===STATE.currentUser.grade);
  }
  function renderRows(){
    const q = document.getElementById('stud-search').value.toLowerCase();
    const students = getBase().filter(s => !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.section.toLowerCase().includes(q) || s.grade.toLowerCase().includes(q));
    document.getElementById('stud-sub').textContent = `${students.length} student(s) found`;
    document.getElementById('stud-tbody').innerHTML = students.length===0
      ? `<tr><td colspan="7"><div class="empty-state"><div class="es-icon">👥</div><div class="es-title">No students found</div><div class="es-sub">Try adjusting your search</div></div></td></tr>`
      : students.map(s=>`<tr>
          <td><div class="flex aic gap-10"><div class="av av-32 av-green">${ini(s.name)}</div><div><div class="fw6">${s.name}</div><div class="txs tmm">${s.id}</div></div></div></td>
          <td>${s.grade} – ${s.section}</td><td>${s.gender==='F'?'Female':'Male'}</td>
          <td><div>${s.parent}</div><div class="txs tmm">${s.parentEmail}</div></td>
          <td>${s.contact}</td>
          <td><span class="badge ${s.status==='active'?'bg-green':'bg-gray'}">${s.status}</span></td>
          <td><div class="flex gap-6">
            <button class="btn btn-secondary btn-xs" onclick="viewStudentModal('${s.id}')">View</button>
            ${isAdmin?`<button class="btn btn-secondary btn-xs" onclick="openEditStudentModal('${s.id}')">Edit</button><button class="btn btn-danger btn-xs" onclick="deleteStudent('${s.id}','${s.name.replace(/'/g,"\\'")}')">Delete</button>`:''}
          </div></td>
        </tr>`).join('');
  }
  document.getElementById('stud-search').addEventListener('input', renderRows);
  window.refreshStudentRows = renderRows;
  renderRows();
}


function openAddStudentModal(){
  openModal(`
  <div class="modal-header"><div class="modal-title">Add New Student</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid form-row-2">
      <div class="fg"><label>First Name*</label><input id="sf-fn" placeholder="First name"></div>
      <div class="fg"><label>Last Name*</label><input id="sf-ln" placeholder="Last name"></div>
      <div class="fg"><label>Grade*</label><select id="sf-gr">${['Grade 1','Grade 2','Grade 3'].map(g=>`<option>${g}</option>`).join('')}</select></div>
      <div class="fg"><label>Section*</label><input id="sf-sec" placeholder="e.g. Mabini"></div>
      <div class="fg"><label>Gender*</label><select id="sf-gen"><option value="F">Female</option><option value="M">Male</option></select></div>
      <div class="fg"><label>Status</label><select id="sf-st"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
      <div class="fg"><label>Parent/Guardian Name*</label><input id="sf-par" placeholder="Full name"></div>
      <div class="fg"><label>Parent Email</label><input id="sf-pe" type="email" placeholder="parent@email.com"></div>
      <div class="fg" style="grid-column:span 2"><label>Contact Number*</label><input id="sf-con" placeholder="09XXXXXXXXX"></div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveStudent()">Save Student</button>
  </div>`);
}
 
function saveStudent(){
  const fn=document.getElementById('sf-fn')?.value.trim();
  const ln=document.getElementById('sf-ln')?.value.trim();
  const gr=document.getElementById('sf-gr')?.value;
  const sec=document.getElementById('sf-sec')?.value.trim();
  const gen=document.getElementById('sf-gen')?.value;
  const st=document.getElementById('sf-st')?.value;
  const par=document.getElementById('sf-par')?.value.trim();
  const pe=document.getElementById('sf-pe')?.value.trim();
  const con=document.getElementById('sf-con')?.value.trim();
  if(!fn||!ln||!sec||!par||!con){ toast('Please fill all required fields.','error'); return; }
  const id='S'+String(STATE.nextStudentId++).padStart(3,'0');
  STATE.students.push({id,name:`${fn} ${ln}`,grade:gr,section:sec,gender:gen,parent:par,parentEmail:pe||'',contact:con,status:st,enrolled:new Date().toISOString().split('T')[0]});
  closeModal();
  toast(`Student "${fn} ${ln}" added successfully!`);
  if(STATE.activeNav==='students'){
    if(typeof window.refreshStudentRows==='function') window.refreshStudentRows();
  } else if(STATE.activeNav==='dashboard') nav('dashboard');
}

function openEditStudentModal(id){
  const s = STATE.students.find(x=>x.id===id);
  if(!s) return;
  openModal(`
  <div class="modal-header"><div class="modal-title">Edit Student</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid form-row-2">
      <div class="fg"><label>First Name*</label><input id="ef-fn" value="${s.name.split(' ')[0]}"></div>
      <div class="fg"><label>Last Name*</label><input id="ef-ln" value="${s.name.split(' ').slice(1).join(' ')}"></div>
      <div class="fg"><label>Grade*</label><select id="ef-gr">${['Grade 1','Grade 2','Grade 3'].map(g=>`<option ${g===s.grade?'selected':''}>${g}</option>`).join('')}</select></div>
      <div class="fg"><label>Section*</label><input id="ef-sec" value="${s.section}"></div>
      <div class="fg"><label>Gender*</label><select id="ef-gen"><option value="F" ${s.gender==='F'?'selected':''}>Female</option><option value="M" ${s.gender==='M'?'selected':''}>Male</option></select></div>
      <div class="fg"><label>Status</label><select id="ef-st"><option value="active" ${s.status==='active'?'selected':''}>Active</option><option value="inactive" ${s.status==='inactive'?'selected':''}>Inactive</option></select></div>
      <div class="fg"><label>Parent/Guardian</label><input id="ef-par" value="${s.parent}"></div>
      <div class="fg"><label>Parent Email</label><input id="ef-pe" type="email" value="${s.parentEmail}"></div>
      <div class="fg" style="grid-column:span 2"><label>Contact</label><input id="ef-con" value="${s.contact}"></div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="updateStudent('${id}')">Save Changes</button></div>`);
}

function updateStudent(id){
  const s = STATE.students.find(x=>x.id===id);
  if(!s) return;
  const fn=document.getElementById('ef-fn')?.value.trim();
  const ln=document.getElementById('ef-ln')?.value.trim();
  if(!fn||!ln){ toast('Name is required.','error'); return; }
  s.name=`${fn} ${ln}`;
  s.grade=document.getElementById('ef-gr')?.value;
  s.section=document.getElementById('ef-sec')?.value.trim()||s.section;
  s.gender=document.getElementById('ef-gen')?.value;
  s.status=document.getElementById('ef-st')?.value;
  s.parent=document.getElementById('ef-par')?.value.trim()||s.parent;
  s.parentEmail=document.getElementById('ef-pe')?.value.trim()||s.parentEmail;
  s.contact=document.getElementById('ef-con')?.value.trim()||s.contact;
  closeModal(); toast('Student updated successfully!');
  if(STATE.activeNav==='students') nav('students');
}

function viewStudentModal(id){
  const s = STATE.students.find(x=>x.id===id);
  const g = STATE.grades[id]||{};
  const att = STATE.attendance[id]||{present:0,absent:0,late:0,total:45};
  const ov = STATE.subjects.length?Math.round(STATE.subjects.reduce((a,sub)=>a+avg(g[sub]||[]),0)/STATE.subjects.length):0;
  openModal(`
  <div class="modal-header"><div class="modal-title">Student Profile</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="flex aic gap-14 mb-16" style="padding-bottom:14px;border-bottom:1px solid var(--border)">
      <div class="av av-52 av-green">${ini(s.name)}</div>
      <div><div style="font-size:20px;font-weight:800;letter-spacing:-.4px">${s.name}</div><div class="ts tm">${s.grade} – ${s.section} · ${s.gender==='F'?'Female':'Male'} · ID: ${s.id}</div><span class="badge ${s.status==='active'?'bg-green':'bg-gray'} mt-8">${s.status}</span></div>
    </div>
    <div class="g2 mb-14">
      <div><div class="txs tmm fw7">Parent/Guardian</div><div class="fw6">${s.parent}</div></div>
      <div><div class="txs tmm fw7">Contact</div><div class="fw6">${s.contact}</div></div>
      <div><div class="txs tmm fw7">Email</div><div class="fw6">${s.parentEmail||'—'}</div></div>
      <div><div class="txs tmm fw7">Enrolled</div><div class="fw6">${s.enrolled}</div></div>
    </div>
    <div class="g3 mb-14" style="text-align:center">
      <div style="padding:12px;background:var(--green-l);border-radius:9px"><div style="font-size:22px;font-weight:800;color:var(--green)">${att.present}</div><div class="txs tm">Present</div></div>
      <div style="padding:12px;background:var(--red-l);border-radius:9px"><div style="font-size:22px;font-weight:800;color:var(--red)">${att.absent}</div><div class="txs tm">Absent</div></div>
      <div style="padding:12px;background:var(--amber-l);border-radius:9px"><div style="font-size:22px;font-weight:800;color:var(--amber)">${att.late}</div><div class="txs tm">Late</div></div>
    </div>
    <div class="fw7 ts mb-8">Academic Performance</div>
    ${STATE.subjects.map(sub=>{const sc=avg(g[sub]||[]);return `<div class="flex aic jb" style="padding:8px 0;border-bottom:1px solid var(--border)"><span class="ts">${STATE.subjectLabels[sub]}</span><span class="badge ${gbadge(sc)}">${sc}</span></div>`;}).join('')}
    <div style="margin-top:12px;padding:12px;background:var(--bg);border-radius:9px;text-align:center"><div class="txs tmm">Overall Average</div><div style="font-size:28px;font-weight:800;color:${gcol(ov)}">${ov}</div><div class="ts" style="color:${gcol(ov)}">${glabel(ov)}</div></div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button><button class="btn btn-primary" onclick="closeModal();openEditStudentModal('${id}')">Edit Student</button></div>`);
}

function deleteStudent(id, name){
  showConfirm('Delete Student', `Are you sure you want to remove <strong>${name}</strong> from the system? This action cannot be undone.`, ()=>{
    const idx = STATE.students.findIndex(s=>s.id===id);
    if(idx>=0){ STATE.students.splice(idx,1); toast(`${name} has been removed.`); nav('students'); }
  });
}

function exportStudents(){
  const rows = [['ID','Name','Grade','Section','Gender','Parent','Contact','Status']];
  STATE.students.forEach(s=>rows.push([s.id,s.name,s.grade,s.section,s.gender,s.parent,s.contact,s.status]));
  const csv = rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
  const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download='students.csv';a.click();
  toast('Student list exported!');
}

/* ════════════════════════════════════════
   TEACHERS PAGE (Admin)
   ════════════════════════════════════════ */
function pgTeachers(el){
  el.innerHTML = `
    <div class="page-head">
      <div><div class="page-title">Teachers</div><div class="page-sub" id="teach-sub"></div></div>
      <div class="page-actions"><button class="btn btn-primary" onclick="openAddTeacherModal()">${svgIco.person} Add Teacher</button></div>
    </div>
    <div class="tbl-wrap">
      <div class="tbl-toolbar"><input id="teach-search" class="tbl-search" placeholder="🔍  Search teachers..."></div>
      <table>
        <thead><tr><th>Teacher</th><th>Grade / Section</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody id="teach-tbody"></tbody>
      </table>
    </div>`;
  function renderRows(){
    const q = document.getElementById('teach-search').value.toLowerCase();
    const list = STATE.teachers.filter(t => !q || t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.section.toLowerCase().includes(q));
    document.getElementById('teach-sub').textContent = `${list.length} teacher(s)`;
    document.getElementById('teach-tbody').innerHTML = list.length===0
      ? `<tr><td colspan="7"><div class="empty-state"><div class="es-icon">👩‍🏫</div><div class="es-title">No teachers found</div></div></td></tr>`
      : list.map(t=>`<tr>
          <td><div class="flex aic gap-10"><div class="av av-32 av-blue">${ini(t.name)}</div><div><div class="fw6">${t.name}</div><div class="txs tmm">${t.id}</div></div></div></td>
          <td>${t.grade} – ${t.section}</td><td class="tm">${t.email}</td><td>${t.phone}</td><td>${t.joined}</td>
          <td><span class="badge ${t.status==='active'?'bg-green':'bg-gray'}">${t.status}</span></td>
          <td><div class="flex gap-6">
            <button class="btn btn-secondary btn-xs" onclick="openEditTeacherModal('${t.id}')">Edit</button>
            <button class="btn btn-danger btn-xs" onclick="deleteTeacher('${t.id}','${t.name.replace(/'/g,"\\'")}')">Delete</button>
          </div></td>
        </tr>`).join('');
  }
  document.getElementById('teach-search').addEventListener('input', renderRows);
  window.refreshTeacherRows = renderRows;
  renderRows();
}
 
function openAddTeacherModal(){
  openModal(`
  <div class="modal-header"><div class="modal-title">Add New Teacher</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid form-row-2">
      <div class="fg"><label>First Name*</label><input id="tf-fn" placeholder="First name"></div>
      <div class="fg"><label>Last Name*</label><input id="tf-ln" placeholder="Last name"></div>
      <div class="fg"><label>Title</label><select id="tf-ti"><option>Ms.</option><option>Mrs.</option><option>Mr.</option><option>Dr.</option></select></div>
      <div class="fg"><label>Email*</label><input id="tf-em" type="email" placeholder="teacher@school.edu"></div>
      <div class="fg"><label>Phone</label><input id="tf-ph" placeholder="09XXXXXXXXX"></div>
      <div class="fg"><label>Grade Assigned*</label><select id="tf-gr">${['Grade 1','Grade 2','Grade 3'].map(g=>`<option>${g}</option>`).join('')}</select></div>
      <div class="fg" style="grid-column:span 2"><label>Section*</label><input id="tf-sec" placeholder="e.g. Mabini"></div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveTeacher()">Add Teacher</button>
  </div>`);
}
 
function saveTeacher(){
  const ti=document.getElementById('tf-ti')?.value;
  const fn=document.getElementById('tf-fn')?.value.trim();
  const ln=document.getElementById('tf-ln')?.value.trim();
  const em=document.getElementById('tf-em')?.value.trim();
  const ph=document.getElementById('tf-ph')?.value.trim();
  const gr=document.getElementById('tf-gr')?.value;
  const sec=document.getElementById('tf-sec')?.value.trim();
  if(!fn||!ln||!em||!sec){ toast('Please fill all required fields.','error'); return; }
  const id='T'+String(STATE.nextTeacherId++).padStart(3,'0');
  const name=`${ti} ${fn} ${ln}`;
  STATE.teachers.push({id,name,email:em,phone:ph||'—',grade:gr,section:sec,subjects:'All Subjects',status:'active',joined:new Date().toISOString().split('T')[0]});
  closeModal();
  toast(`Teacher "${name}" added!`);
  if(typeof window.refreshTeacherRows==='function') window.refreshTeacherRows();
  else nav('teachers');
}
 
function openEditTeacherModal(id){
  const t=STATE.teachers.find(x=>x.id===id); if(!t) return;
  openModal(`
  <div class="modal-header"><div class="modal-title">Edit Teacher</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid form-row-2">
      <div class="fg" style="grid-column:span 2"><label>Full Name*</label><input id="etf-nm" value="${t.name}"></div>
      <div class="fg"><label>Email*</label><input id="etf-em" type="email" value="${t.email}"></div>
      <div class="fg"><label>Phone</label><input id="etf-ph" value="${t.phone}"></div>
      <div class="fg"><label>Grade</label><select id="etf-gr">${['Grade 1','Grade 2','Grade 3'].map(g=>`<option ${g===t.grade?'selected':''}>${g}</option>`).join('')}</select></div>
      <div class="fg"><label>Section</label><input id="etf-sec" value="${t.section}"></div>
      <div class="fg"><label>Status</label><select id="etf-st"><option value="active" ${t.status==='active'?'selected':''}>Active</option><option value="inactive" ${t.status==='inactive'?'selected':''}>Inactive</option></select></div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="updateTeacher('${id}')">Save Changes</button>
  </div>`);
}
 
function updateTeacher(id){
  const t=STATE.teachers.find(x=>x.id===id); if(!t) return;
  t.name=document.getElementById('etf-nm')?.value.trim()||t.name;
  t.email=document.getElementById('etf-em')?.value.trim()||t.email;
  t.phone=document.getElementById('etf-ph')?.value.trim()||t.phone;
  t.grade=document.getElementById('etf-gr')?.value||t.grade;
  t.section=document.getElementById('etf-sec')?.value.trim()||t.section;
  t.status=document.getElementById('etf-st')?.value||t.status;
  closeModal();
  toast('Teacher updated!');
  if(typeof window.refreshTeacherRows==='function') window.refreshTeacherRows();
  else nav('teachers');
}
 
function deleteTeacher(id,name){
  showConfirm('Remove Teacher',`Remove <strong>${name}</strong> from the system?`,()=>{
    const idx=STATE.teachers.findIndex(t=>t.id===id);
    if(idx>=0){
      STATE.teachers.splice(idx,1);
      toast(`${name} removed.`);
      if(typeof window.refreshTeacherRows==='function') window.refreshTeacherRows();
      else nav('teachers');
    }
  });
}
 
/* ════════════════════════════════════════
   PARENTS PAGE
   - Admin : sees all parents, can add/edit/delete
   - Teacher: sees only parents of students in their class, view only
   ════════════════════════════════════════ */
function pgParents(el){
  const isAdmin = STATE.currentUser.role==='admin';
  function getBase(){
    if(isAdmin) return STATE.parents;
    const myIds = STATE.students.filter(s=>s.section===STATE.currentUser.section&&s.grade===STATE.currentUser.grade).map(s=>s.id);
    return STATE.parents.filter(p=>p.children.some(cid=>myIds.includes(cid)));
  }
  el.innerHTML = `
    <div class="page-head">
      <div><div class="page-title">Parents</div><div class="page-sub" id="par-sub"></div></div>
      <div class="page-actions">${isAdmin?`<button class="btn btn-primary" onclick="openAddParentModal()">+ Add Parent</button>`:''}</div>
    </div>
    <div class="tbl-wrap">
      <div class="tbl-toolbar"><input id="par-search" class="tbl-search" placeholder="🔍  Search parents..."></div>
      <table>
        <thead><tr><th>Parent</th><th>Email</th><th>Phone</th><th>Children</th>${isAdmin?'<th>Actions</th>':''}</tr></thead>
        <tbody id="par-tbody"></tbody>
      </table>
    </div>`;
  function renderRows(){
    const q = document.getElementById('par-search').value.toLowerCase();
    const list = getBase().filter(p => !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.phone.includes(q));
    document.getElementById('par-sub').textContent = `${list.length} parent(s) ${isAdmin?'in the system':'in your class'}`;
    document.getElementById('par-tbody').innerHTML = list.length===0
      ? `<tr><td colspan="${isAdmin?5:4}"><div class="empty-state"><div class="es-icon">👨‍👩‍👧</div><div class="es-title">No parents found</div></div></td></tr>`
      : list.map(p=>`<tr>
          <td><div class="flex aic gap-10"><div class="av av-32 av-amber">${ini(p.name)}</div><div><div class="fw6">${p.name}</div><div class="txs tmm">${p.id}</div></div></div></td>
          <td>${p.email}</td><td>${p.phone}</td>
          <td>${p.children.map(cid=>STATE.students.find(s=>s.id===cid)?.name||cid).join(', ')}</td>
          ${isAdmin?`<td><div class="flex gap-6">
            <button class="btn btn-secondary btn-xs" onclick="openEditParentModal('${p.id}')">Edit</button>
            <button class="btn btn-danger btn-xs" onclick="deleteParent('${p.id}','${p.name.replace(/'/g,"\\'")}')">Delete</button>
          </div></td>`:''}
        </tr>`).join('');
  }
  document.getElementById('par-search').addEventListener('input', renderRows);
  window.refreshParentRows = renderRows;
  renderRows();
}
 
function openAddParentModal(){
  openModal(`
  <div class="modal-header"><div class="modal-title">Add Parent / Guardian</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid form-row-2">
      <div class="fg"><label>Full Name*</label><input id="pf-name" placeholder="Parent name"></div>
      <div class="fg"><label>Email*</label><input id="pf-email" type="email" placeholder="parent@email.com"></div>
      <div class="fg"><label>Phone</label><input id="pf-phone" placeholder="09XXXXXXXXX"></div>
      <div class="fg"><label>Child</label>
        <select id="pf-child">
          <option value="">-- Select a student --</option>
          ${STATE.students.map(s=>`<option value="${s.id}">${s.name} (${s.grade} ${s.section})</option>`).join('')}
        </select>
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveParent()">Save Parent</button>
  </div>`);
}
 
function saveParent(){
  const name=document.getElementById('pf-name')?.value.trim();
  const email=document.getElementById('pf-email')?.value.trim();
  const phone=document.getElementById('pf-phone')?.value.trim();
  const child=document.getElementById('pf-child')?.value;
  if(!name||!email){ toast('Name and email are required.','error'); return; }
  const id='P'+String(STATE.parents.length+1).padStart(3,'0');
  const children=child?[child]:[];
  STATE.parents.push({id,name,email,phone:phone||'—',children});
  if(child){ const student=STATE.students.find(s=>s.id===child); if(student) student.parentId=id; }
  closeModal();
  toast(`Parent ${name} added.`);
  if(typeof window.refreshParentRows==='function') window.refreshParentRows();
  else nav('parents');
}
 
function openEditParentModal(id){
  const p=STATE.parents.find(x=>x.id===id); if(!p) return;
  openModal(`
  <div class="modal-header"><div class="modal-title">Edit Parent</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid form-row-2">
      <div class="fg"><label>Full Name*</label><input id="epf-name" value="${p.name}"></div>
      <div class="fg"><label>Email*</label><input id="epf-email" type="email" value="${p.email}"></div>
      <div class="fg"><label>Phone</label><input id="epf-phone" value="${p.phone}"></div>
      <div class="fg"><label>Children</label><input id="epf-child" value="${p.children.map(cid=>STATE.students.find(s=>s.id===cid)?.name||cid).join(', ')}" readonly></div>
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="updateParent('${id}')">Save</button>
  </div>`);
}
 
function updateParent(id){
  const p=STATE.parents.find(x=>x.id===id); if(!p) return;
  p.name=document.getElementById('epf-name')?.value.trim()||p.name;
  p.email=document.getElementById('epf-email')?.value.trim()||p.email;
  p.phone=document.getElementById('epf-phone')?.value.trim()||p.phone;
  closeModal();
  toast('Parent updated.');
  if(typeof window.refreshParentRows==='function') window.refreshParentRows();
  else nav('parents');
}
 
function deleteParent(id,name){
  showConfirm('Delete Parent',`Remove <strong>${name}</strong> from the system?`,()=>{
    const idx=STATE.parents.findIndex(x=>x.id===id);
    if(idx>=0){
      STATE.parents.splice(idx,1);
      toast(`${name} deleted.`);
      if(typeof window.refreshParentRows==='function') window.refreshParentRows();
      else nav('parents');
    }
  });
}

/* ════════════════════════════════════════
   CLASSES PAGE (Admin)
   ════════════════════════════════════════ */
function pgClasses(el){
  function render(){
    el.innerHTML=`
    <div class="page-head">
      <div><div class="page-title">Classes</div><div class="page-sub">Manage sections and teacher assignments</div></div>
      <div class="page-actions"><button class="btn btn-primary" onclick="openAddClassModal()">+ Add Class</button></div>
    </div>
    <div class="g2">
      ${STATE.classes.map(c=>{
        const t=STATE.teachers.find(x=>x.id===c.teacherId);
        const sts=STATE.students.filter(s=>s.grade===c.grade&&s.section===c.section&&s.status==='active');
        let sc=[];sts.forEach(s=>{const g=STATE.grades[s.id];if(g) STATE.subjects.forEach(sub=>sc.push(avg(g[sub])));});
        const ca=sc.length?Math.round(sc.reduce((a,b)=>a+b,0)/sc.length):0;
        return `<div class="card">
          <div class="flex aic gap-14 mb-16">
            <div style="width:50px;height:50px;background:var(--blue-l);border-radius:12px;display:flex;align-items:center;justify-content:center">${svgIco.school.replace('fill="currentColor"','fill="var(--blue)"').replace('width="16" height="16"','width="24" height="24"')}</div>
            <div class="f1"><div style="font-size:18px;font-weight:800;letter-spacing:-.4px">${c.grade} – ${c.section}</div><div class="ts tm">SY ${c.year}</div></div>
            <button class="btn btn-danger btn-xs" onclick="deleteClass('${c.id}','${c.grade} – ${c.section}')">Delete</button>
          </div>
          <div class="g3 mb-14" style="text-align:center">
            <div style="padding:10px;background:var(--bg);border-radius:9px"><div style="font-size:20px;font-weight:800;color:var(--blue)">${sts.length}</div><div class="txs tm">Students</div></div>
            <div style="padding:10px;background:var(--bg);border-radius:9px"><div style="font-size:20px;font-weight:800;color:${gcol(ca)}">${ca||'–'}</div><div class="txs tm">Avg Grade</div></div>
            <div style="padding:10px;background:var(--bg);border-radius:9px"><div style="font-size:16px;font-weight:800;color:var(--green)">${c.year}</div><div class="txs tm">School Year</div></div>
          </div>
          <div class="divider"></div>
          <div class="flex aic gap-10">
            <div class="av av-32 av-blue">${t?ini(t.name):'?'}</div>
            <div class="f1"><div class="fw6 ts">${t?t.name:'No teacher assigned'}</div><div class="txs tmm">Homeroom Teacher</div></div>
          </div>
          <div class="flex gap-8 mt-12">
            <button class="btn btn-secondary btn-sm f1" onclick="openEditClassModal('${c.id}')">Edit Assignment</button>
            <button class="btn btn-primary btn-sm f1" onclick="nav('grades')">View Grades</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  }
  window.renderClasses=render;
  render();
}

function openAddClassModal(){
  openModal(`
  <div class="modal-header"><div class="modal-title">Add New Class</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid form-row-2">
      <div class="fg"><label>Grade*</label><select id="clf-gr">${['Grade 1','Grade 2','Grade 3'].map(g=>`<option>${g}</option>`).join('')}</select></div>
      <div class="fg"><label>Section Name*</label><input id="clf-sec" placeholder="e.g. Mabini"></div>
      <div class="fg"><label>Assign Teacher</label><select id="clf-t"><option value="">-- None --</option>${STATE.teachers.map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</select></div>
      <div class="fg"><label>School Year</label><input id="clf-yr" value="2024-2025"></div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveClass()">Add Class</button></div>`);
}

function saveClass(){
  const gr=document.getElementById('clf-gr')?.value;
  const sec=document.getElementById('clf-sec')?.value.trim();
  const tid=document.getElementById('clf-t')?.value;
  const yr=document.getElementById('clf-yr')?.value.trim()||'2024-2025';
  if(!sec){ toast('Section name is required.','error'); return; }
  const id='C'+String(STATE.classes.length+1).padStart(3,'0');
  STATE.classes.push({id,grade:gr,section:sec,teacherId:tid||null,year:yr});
  closeModal(); toast('Class added!'); nav('classes');
}

function openEditClassModal(id){
  const c=STATE.classes.find(x=>x.id===id); if(!c) return;
  openModal(`
  <div class="modal-header"><div class="modal-title">Edit Class Assignment</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid">
      <div class="fg"><label>Assign Teacher</label><select id="eclf-t"><option value="">-- None --</option>${STATE.teachers.map(t=>`<option value="${t.id}" ${t.id===c.teacherId?'selected':''}>${t.name}</option>`).join('')}</select></div>
      <div class="fg"><label>School Year</label><input id="eclf-yr" value="${c.year}"></div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="updateClass('${id}')">Save</button></div>`);
}

function updateClass(id){
  const c=STATE.classes.find(x=>x.id===id); if(!c) return;
  c.teacherId=document.getElementById('eclf-t')?.value||null;
  c.year=document.getElementById('eclf-yr')?.value.trim()||c.year;
  closeModal(); toast('Class updated!'); nav('classes');
}

function deleteClass(id,name){
  showConfirm('Delete Class',`Remove class <strong>${name}</strong>?`,()=>{
    const idx=STATE.classes.findIndex(c=>c.id===id);
    if(idx>=0){ STATE.classes.splice(idx,1); toast(`${name} deleted.`); nav('classes'); }
  });
}

/* ════════════════════════════════════════
   GRADES PAGE
   - Teacher: can edit grades, save, reset
   - Admin:   read-only view of all students
   - Parent:  read-only view of their child
   ════════════════════════════════════════ */
function pgGrades(el){
  const role=STATE.currentUser.role,isParent=role==='parent',isAdmin=role==='admin',isTeacher=role==='teacher';
  let activeQ=0,changed={};
  function getStudents(){
    if(isParent) return STATE.students.filter(s=>s.id===STATE.currentUser.childId);
    if(isAdmin)  return STATE.students.filter(s=>STATE.grades[s.id]);
    return STATE.students.filter(s=>s.section===STATE.currentUser.section&&s.grade===STATE.currentUser.grade&&s.status==='active');
  }
  function render(){
    const students=getStudents();
    el.innerHTML=`
    <div class="page-head">
      <div><div class="page-title">${isParent?'Academic Record':isAdmin?'Grade Overview':'Grade Entry'}</div>
      <div class="page-sub">${isParent?STATE.currentUser.childId:isAdmin?'All sections':'Enter and save student grades'}</div></div>
      ${isTeacher?`<div class="page-actions"><button class="btn btn-secondary" onclick="resetGrades()">Reset</button><button class="btn btn-primary" onclick="saveGrades()">💾 Save Grades</button></div>`:''}
    </div>
    <div class="tab-bar">${STATE.quarters.map((q,i)=>`<button class="tab-btn ${i===activeQ?'active':''}" data-qi="${i}">${q}</button>`).join('')}</div>
    <div class="tbl-wrap"><table>
      <thead><tr><th>Student</th>${activeQ===4?STATE.quarters.slice(0,4).map(q=>`<th>${q}</th>`).join(''):STATE.subjects.map(s=>`<th>${STATE.subjectLabels[s]}</th>`).join('')}<th>Average</th><th>Remarks</th></tr></thead>
      <tbody>${students.map(s=>{
        const g=STATE.grades[s.id]||{},showFinal=activeQ===4;
        const scores=showFinal?STATE.quarters.slice(0,4).map((_,qi)=>{const v=STATE.subjects.map(sub=>g[sub]?g[sub][qi]:0);return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):0;}):STATE.subjects.map(sub=>g[sub]?g[sub][activeQ]:0);
        const ov=Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
        return `<tr>
          <td><div class="flex aic gap-8"><div class="av av-32 av-green">${ini(s.name)}</div><div><div class="fw6">${s.name}</div><div class="txs tmm">${s.grade} – ${s.section}</div></div></div></td>
          ${scores.map((sc,i)=>{
            if(showFinal||isParent||isAdmin) return `<td><span class="badge ${gbadge(sc)}">${sc}</span></td>`;
            const sub=STATE.subjects[i],key=`${s.id}-${sub}-${activeQ}`;
            return `<td><input class="grade-cell ${changed[key]?'changed':''}" type="number" min="0" max="100" value="${sc}" data-sid="${s.id}" data-sub="${sub}" data-qi="${activeQ}" onchange="onGradeChange(this,'${key}')"></td>`;
          }).join('')}
          <td><strong style="color:${gcol(ov)}">${ov}</strong></td>
          <td><span class="badge ${gbadge(ov)}">${glabel(ov)}</span></td>
        </tr>`;
      }).join('')}</tbody>
    </table></div>`;
    el.querySelectorAll('.tab-btn').forEach(btn=>{btn.onclick=()=>{activeQ=parseInt(btn.dataset.qi);changed={};render();};});
  }
  window.onGradeChange=(inp,key)=>{let v=parseInt(inp.value)||0;if(v<0)v=0;if(v>100)v=100;inp.value=v;const sid=inp.dataset.sid,sub=inp.dataset.sub,qi=parseInt(inp.dataset.qi);if(!STATE.grades[sid])STATE.grades[sid]={};if(!STATE.grades[sid][sub])STATE.grades[sid][sub]=[0,0,0,0];STATE.grades[sid][sub][qi]=v;changed[key]=true;inp.classList.add('changed');};
  window.saveGrades=()=>{changed={};toast('Grades saved!');render();};
  window.resetGrades=()=>{getStudents().forEach(s=>{if(!STATE.grades[s.id])STATE.grades[s.id]={};STATE.subjects.forEach(sub=>{if(!STATE.grades[s.id][sub])STATE.grades[s.id][sub]=[0,0,0,0];if(activeQ===4)STATE.grades[s.id][sub]=[0,0,0,0];else STATE.grades[s.id][sub][activeQ]=0;});});changed={};render();toast('Grades reset.','info');};
  render();
}

/* ════════════════════════════════════════
   ATTENDANCE PAGE
   - Teacher: can mark & save attendance
   - Admin:   read-only summary view
   - Parent:  read-only view of their child
   ════════════════════════════════════════ */
function pgAttendance(el){
  const role=STATE.currentUser.role,isParent=role==='parent',isAdmin=role==='admin',isTeacher=role==='teacher';
  const calTypes=['att-h','att-h','att-p','att-p','att-p','att-a','att-p','att-l','att-p','att-p','att-p','att-h','att-h','att-p','att-p','att-p','att-p','att-a','att-p','att-p','att-p','att-h','att-h','att-p','att-p','att-p','att-l','att-p','att-h','att-h','att-p'];
  let selDate=new Date().toISOString().split('T')[0],todayRecords={};
  function getStudents(){
    if(isParent) return STATE.students.filter(s=>s.id===STATE.currentUser.childId);
    if(isAdmin)  return STATE.students.filter(s=>STATE.attendance[s.id]);
    return STATE.students.filter(s=>s.section===STATE.currentUser.section&&s.grade===STATE.currentUser.grade&&s.status==='active');
  }
  function render(){
    const students=getStudents();
    el.innerHTML=`
    <div class="page-head">
      <div><div class="page-title">Attendance ${isParent?'Record':isAdmin?'Overview':'Tracking'}</div>
      <div class="page-sub">${isParent?STATE.currentUser.childId:isAdmin?'All sections':'Mark and monitor daily attendance'}</div></div>
      ${isTeacher?`<button class="btn btn-primary" onclick="saveAttendance()">💾 Save Attendance</button>`:''}
    </div>
    ${isTeacher?`<div class="card mb-16"><div class="flex aic gap-14">
      <div class="flex aic gap-10"><label class="txs tmm fw7">DATE:</label>
        <input type="date" value="${selDate}" id="att-date" style="padding:8px 12px;border:1.5px solid var(--border);border-radius:var(--r);font-size:13px;outline:none" onchange="setAttendanceDate(this.value)">
      </div>
      <div class="flex gap-8"><span class="badge bg-green">P = Present</span><span class="badge bg-red">A = Absent</span><span class="badge bg-amber">L = Late</span></div>
    </div></div>`:''}
    <div class="${isParent?'g2':''}">
      <div class="tbl-wrap ${isParent?'':'mb-16'}"><table>
        <thead><tr><th>Student</th><th>Present</th><th>Absent</th><th>Late</th><th>Rate</th>${isTeacher?`<th>Today's Status</th>`:''}</tr></thead>
        <tbody>${students.map(s=>{
          const a=STATE.attendance[s.id]||{present:0,absent:0,late:0,total:45};
          const rate=a.total?Math.round(a.present/a.total*100):0;
          const cur=todayRecords[s.id]||'Present';
          return `<tr>
            <td><div class="flex aic gap-8"><div class="av av-32 av-green">${ini(s.name)}</div><div><div class="fw6">${s.name}</div><div class="txs tmm">${s.grade} – ${s.section}</div></div></div></td>
            <td><span class="badge bg-green">${a.present}</span></td>
            <td><span class="badge bg-red">${a.absent}</span></td>
            <td><span class="badge bg-amber">${a.late}</span></td>
            <td><div class="flex aic gap-8"><div style="flex:1;height:5px;background:var(--surface2);border-radius:3px"><div style="height:100%;width:${rate}%;background:${rate>=90?'var(--green)':rate>=75?'var(--amber)':'var(--red)'};border-radius:3px"></div></div><span class="txs fw6" style="color:${rate>=90?'var(--green)':rate>=75?'var(--amber)':'var(--red)'};min-width:30px">${rate}%</span></div></td>
            ${isTeacher?`<td><select style="padding:6px 10px;border:1.5px solid var(--border);border-radius:7px;font-size:13px;outline:none" data-sid="${s.id}" onchange="onAttendanceChange(this)">
              <option ${cur==='Present'?'selected':''}>Present</option>
              <option ${cur==='Absent'?'selected':''}>Absent</option>
              <option ${cur==='Late'?'selected':''}>Late</option>
            </select></td>`:''}
          </tr>`;
        }).join('')}</tbody>
      </table></div>
      ${isParent?`<div class="card">
        <div class="card-title">Attendance Calendar – May 2026 &nbsp;·&nbsp; Polangui South Central School</div>
        <div class="att-cal">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="att-cal-hdr">${d}</div>`).join('')}${Array.from({length:31},(_,i)=>`<div class="att-cal-cell ${calTypes[i]}">${i+1}</div>`).join('')}</div>
        <div class="att-legend">
          <div class="att-leg-item"><div class="att-leg-dot" style="background:var(--blue-l)"></div>Present</div>
          <div class="att-leg-item"><div class="att-leg-dot" style="background:#FDECEC"></div>Absent</div>
          <div class="att-leg-item"><div class="att-leg-dot" style="background:var(--amber-l)"></div>Late</div>
          <div class="att-leg-item"><div class="att-leg-dot" style="background:var(--surface2)"></div>No class</div>
        </div>
      </div>`:''}
    </div>
    ${!isParent?`<div class="card mt-16"><div class="card-title">Attendance Rate Summary</div>
      ${students.map(s=>{const a=STATE.attendance[s.id]||{present:0,absent:0,late:0,total:45};const rate=a.total?Math.round(a.present/a.total*100):0;
        return `<div class="prog-wrap"><div class="prog-top"><span class="ts fw6">${s.name}${isAdmin?` <span class="txs tmm">– ${s.grade} ${s.section}</span>`:''}</span><span class="ts" style="color:${rate>=90?'var(--green)':rate>=75?'var(--amber)':'var(--red)'}">${rate}%</span></div><div class="prog-track"><div class="prog-fill" style="width:${rate}%;background:${rate>=90?'var(--green)':rate>=75?'var(--amber)':'var(--red)'}"></div></div></div>`;
      }).join('')}
    </div>`:''}`;
    window.saveAttendance=()=>{getStudents().forEach(s=>{const val=todayRecords[s.id]||'Present';if(!STATE.attendance[s.id])STATE.attendance[s.id]={present:0,absent:0,late:0,total:45};const a=STATE.attendance[s.id];if(val==='Absent')a.absent++;else if(val==='Late'){a.late++;a.present++;}else a.present++;a.total++;});todayRecords={};toast('Attendance saved for '+selDate+'!');render();};
    window.onAttendanceChange=sel=>{todayRecords[sel.dataset.sid]=sel.value;};
    window.setAttendanceDate=value=>{selDate=value;};
  }
  render();
}

/* ════════════════════════════════════════
   MESSAGES PAGE — fully functional inbox
   ════════════════════════════════════════ */
function pgMessages(el){
  const u = STATE.currentUser;
  let selectedRoot = null;
  let searchQ = '';

  function getAllMsgs(){
    return STATE.messages.filter(m =>
      m.toRole===u.role || m.toRole==='all' || m.fromId===u.id || u.role==='admin');
  }

  function getThreadPreviews(){
    const all = getAllMsgs();
    const map = {};
    all.forEach(m => { const root=m.thread||m.id; if(!map[root]) map[root]=[]; map[root].push(m); });
    return Object.entries(map).map(([root,msgs]) => {
      msgs.sort((a,b) => (b.date+b.time).localeCompare(a.date+a.time));
      return { rootId:parseInt(root), latest:msgs[0] };
    }).sort((a,b) => (b.latest.date+b.latest.time).localeCompare(a.latest.date+a.latest.time));
  }

  function getThread(rootId){
    return getAllMsgs()
      .filter(m => m.id===rootId || m.thread===rootId)
      .sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time));
  }

  function render(){
    let threads = getThreadPreviews();
    if(searchQ) threads = threads.filter(t =>
      t.latest.subject.toLowerCase().includes(searchQ) ||
      t.latest.fromName.toLowerCase().includes(searchQ) ||
      t.latest.body.toLowerCase().includes(searchQ));

    if(!selectedRoot && threads.length>0) selectedRoot = threads[0].rootId;
    const selThread = threads.find(t=>t.rootId===selectedRoot)||null;
    const messages  = selThread ? getThread(selThread.rootId) : [];

    // Mark as read — mark ALL messages in the current thread as read
messages.forEach(m => {
  if(!m.read && (m.toId === u.id || m.toId === u.role || m.toId === 'all')) {
    m.read = true;
  }
});
updateUnreadBadge();
buildSidebar(u.role);

    const unreadCount = getAllMsgs().filter(m=>!m.read&&m.toId===u.id).length;

    el.innerHTML = `
    <div class="page-head">
      <div><div class="page-title">Messages</div><div class="page-sub">${threads.length} conversation(s)</div></div>
      <div class="page-actions"><button class="btn btn-primary" onclick="openComposeModal()">✏️ Compose</button></div>
    </div>
    <div class="msg-layout">
      <div class="msg-list">
        <div class="msg-list-head">
          <span>Inbox</span>
          <span class="badge bg-red" style="${unreadCount?'':'display:none'}">${unreadCount}</span>
        </div>
        <div style="padding:8px">
          <input id="msg-search-inp" style="width:100%;padding:7px 10px;border:1.5px solid var(--border);border-radius:7px;font-size:12.5px;outline:none;font-family:inherit"
            placeholder="Search messages..." value="${searchQ}">
        </div>
        <div class="msg-list-body">
          ${threads.length===0
            ? `<div class="msg-empty"><span>💬</span><span>No messages</span></div>`
            : threads.map(t => {
                const m = t.latest;
                const isUnread = !m.read && m.toId===u.id;
                const preview  = m.body.replace(/\n/g,' ').slice(0,55)+(m.body.length>55?'…':'');
                return `<div class="msg-item ${t.rootId===selectedRoot?'active':''} ${isUnread?'unread':''}" data-root="${t.rootId}">
                  <div class="msg-item-meta">
                    <div class="msg-item-name">${m.fromId===u.id?`You → ${m.toRole}`:m.fromName}</div>
                    ${isUnread?'<div class="msg-unread-dot"></div>':''}
                  </div>
                  <div style="font-size:12.5px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px">${m.subject.replace(/^(Re: )+/,'')}</div>
                  <div class="msg-item-preview">${preview}</div>
                  <div class="msg-item-date">${m.date} · ${m.time}</div>
                </div>`;
              }).join('')}
        </div>
      </div>

      <div class="msg-panel">
        ${!selThread
          ? `<div class="msg-empty" style="height:100%"><span style="font-size:48px">💬</span><span class="fw6">Select a conversation</span><span class="ts tm">or compose a new one</span></div>`
          : `<div class="msg-panel-head">
               <div class="msg-panel-subject">${selThread.latest.subject.replace(/^(Re: )+/,'')}</div>
               <div class="msg-panel-meta">${messages.length} message(s)${selThread.latest.studentId?` · Re: ${STATE.students.find(s=>s.id===selThread.latest.studentId)?.name||''}`:''}</div>
             </div>
             <div class="msg-panel-body" id="msg-thread-body" style="display:flex;flex-direction:column;gap:12px">
               ${messages.map(m => {
                 const isMe = m.fromId===u.id;
                 return `<div style="display:flex;flex-direction:column;align-items:${isMe?'flex-end':'flex-start'}">
                   <div style="max-width:72%;background:${isMe?'var(--green)':'var(--bg)'};color:${isMe?'#fff':'var(--text)'};padding:11px 15px;border-radius:${isMe?'16px 16px 4px 16px':'16px 16px 16px 4px'};font-size:13.5px;line-height:1.65;box-shadow:0 1px 4px rgba(0,0,0,.07)">
                     ${m.body.replace(/\n/g,'<br>')}
                   </div>
                   <div class="txs tmm" style="margin-top:4px">${isMe?'You':'<strong>'+m.fromName+'</strong>'} · ${m.date} ${m.time}</div>
                 </div>`;
               }).join('')}
             </div>
             <div class="msg-panel-reply">
               <textarea id="reply-area" placeholder="Type your reply…"></textarea>
               <button class="btn btn-primary" id="send-reply-btn">Send →</button>
             </div>`}
      </div>
    </div>`;

    // Thread click — no full re-render, just switch
    el.querySelectorAll('.msg-item[data-root]').forEach(item => {
      item.addEventListener('click', () => { selectedRoot=parseInt(item.dataset.root); render(); scrollChat(); });
    });

    // Search input — doesn't reset selectedRoot
    const si = document.getElementById('msg-search-inp');
    if(si) si.addEventListener('input', () => { searchQ=si.value.toLowerCase(); render(); });

    // Send reply
    const btn = document.getElementById('send-reply-btn');
    if(btn) btn.addEventListener('click', () => {
      const txt = document.getElementById('reply-area')?.value.trim();
      if(!txt){ toast('Reply cannot be empty.','error'); return; }
      const orig = STATE.messages.find(m=>m.id===selThread.rootId);
      if(!orig) return;
      STATE.messages.unshift({
        id:STATE.nextMsgId++,
        fromRole:u.role,fromId:u.id,fromName:u.name,
        toRole:orig.fromId===u.id?orig.toRole:orig.fromRole,
        toId:orig.fromId===u.id?orig.toId:orig.fromId,
        subject:orig.subject.startsWith('Re:')?orig.subject:'Re: '+orig.subject,
        body:txt,
        date:new Date().toISOString().split('T')[0],
        time:new Date().toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'}),
        read:false,studentId:orig.studentId,
        thread:orig.thread||orig.id
      });
      selectedRoot = orig.thread||orig.id;
      updateUnreadBadge(); buildSidebar(u.role);
      toast('Reply sent!'); render(); scrollChat();
    });

    scrollChat();
  }

  function scrollChat(){
    setTimeout(() => { const b=document.getElementById('msg-thread-body'); if(b) b.scrollTop=b.scrollHeight; }, 60);
  }

  render();
}


function openComposeModal(){
  const u=STATE.currentUser;
  const toOptions = u.role==='teacher'?
    `<option value="">-- Select recipient --</option>
     <option value="admin|admin">Principal Roberto Cruz (Admin)</option>
     ${STATE.parents.filter(p=>p.children.some(cid=>STATE.students.find(s=>s.id===cid&&s.section===u.section&&s.grade===u.grade))).map(p=>`<option value="parent|${p.id}">Parent: ${p.name}</option>`).join('')}`
    :u.role==='parent'?
    `<option value="teacher|teacher">Ms. Maria Santos (Teacher)</option>
     <option value="admin|admin">Principal Roberto Cruz (Admin)</option>`
    :`<option value="">-- Select recipient --</option>
     ${STATE.teachers.map(t=>`<option value="teacher|${t.id}">${t.name} (Teacher)</option>`).join('')}
     <option value="all|all">All Teachers (Broadcast)</option>`;

  const studentOptions = u.role!=='parent'?
    `<option value="">-- None --</option>${STATE.students.map(s=>`<option value="${s.id}">${s.name} – ${s.grade} ${s.section}</option>`).join('')}`:'';

  openModal(`
  <div class="modal-header"><div class="modal-title">Compose Message</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid">
      <div class="fg"><label>To*</label><select id="cm-to">${toOptions}</select></div>
      ${u.role!=='parent'?`<div class="fg"><label>Regarding Student (optional)</label><select id="cm-sid">${studentOptions}</select></div>`:''}
      <div class="fg"><label>Subject*</label><input id="cm-sub" placeholder="Message subject"></div>
      <div class="fg"><label>Message*</label><textarea id="cm-body" placeholder="Write your message here..." style="min-height:120px"></textarea></div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="sendCompose()">Send Message</button></div>`);
}

function sendCompose(){
  const u=STATE.currentUser;
  const toVal=document.getElementById('cm-to')?.value;
  const sub=document.getElementById('cm-sub')?.value.trim();
  const body=document.getElementById('cm-body')?.value.trim();
  const sid=document.getElementById('cm-sid')?.value||null;
  if(!toVal){ toast('Please select a recipient.','error'); return; }
  if(!sub||!body){ toast('Subject and message are required.','error'); return; }
  const [toRole,toId]=toVal?toVal.split('|'):['',''];
  const newMsg={
    id:STATE.nextMsgId++,
    fromRole:u.role,fromId:u.id,fromName:u.name,
    toRole:toRole||'teacher',toId:toId||'teacher',
    subject:sub,body,
    date:new Date().toISOString().split('T')[0],
    time:new Date().toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'}),
    read:false,studentId:sid,thread:null
  };
  STATE.messages.unshift(newMsg);
  updateUnreadBadge(); buildSidebar(u.role);
  closeModal(); toast('Message sent successfully!');
  nav('messages');
}

/* ════════════════════════════════════════
   ANNOUNCEMENTS PAGE
   ════════════════════════════════════════ */
function pgAnnouncements(el){
  const isAdmin=STATE.currentUser.role==='admin';
  function render(){
    el.innerHTML=`
    <div class="page-head">
      <div><div class="page-title">Announcements</div><div class="page-sub">${STATE.announcements.length} announcement(s)</div></div>
      ${isAdmin?`<div class="page-actions"><button class="btn btn-primary" onclick="openAddAnnouncementModal()">📢 Post Announcement</button></div>`:''}
    </div>
    <div style="display:grid;gap:14px">
      ${STATE.announcements.map(a=>`
        <div class="card" style="cursor:pointer" onclick="openAnnouncementModal(${a.id})">
          <div class="flex aic jb mb-10">
            <div class="flex aic gap-8">
              <span class="badge ${a.priority==='high'?'bg-red':'bg-gray'}">${a.priority==='high'?'🔔 Important':'📋 Notice'}</span>
              <span class="badge ${a.audience==='all'?'bg-blue':'bg-amber'}">${a.audience==='all'?'Everyone':'Teachers Only'}</span>
            </div>
            ${isAdmin?`<div class="flex gap-8"><button class="btn btn-secondary btn-xs" onclick="event.stopPropagation();openEditAnnouncementModal(${a.id})">Edit</button><button class="btn btn-danger btn-xs" onclick="event.stopPropagation();deleteAnnouncement(${a.id},'${a.title.replace(/'/g,"\\'")}')">Delete</button></div>`:''}
          </div>
          <div style="font-size:17px;font-weight:800;letter-spacing:-.3px;margin-bottom:4px">${a.title}</div>
          <div class="txs tmm mb-10">By ${a.author} &nbsp;·&nbsp; ${a.date}</div>
          <p class="ts tm" style="line-height:1.7">${a.body}</p>
        </div>`).join('')}
      ${STATE.announcements.length===0?`<div class="card"><div class="empty-state"><div class="es-icon">📢</div><div class="es-title">No announcements yet</div></div></div>`:''}
    </div>`;
    window.renderAnnouncements=render;
  }
  window.renderAnnouncements=render;
  render();
}

function openAnnouncementModal(id){
  const a = STATE.announcements.find(x=>x.id===id);
  if(!a) return;
  openModal(`
  <div class="modal-header"><div class="modal-title">${a.title}</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="flex aic gap-10 mb-16"><span class="badge ${a.priority==='high'?'bg-red':'bg-gray'}">${a.priority==='high'?'Important':'Notice'}</span><span class="badge ${a.audience==='all'?'bg-blue':'bg-amber'}">${a.audience==='all'?'Everyone':'Teachers Only'}</span></div>
    <div class="txs tmm mb-10">By ${a.author} &nbsp;·&nbsp; ${a.date}</div>
    <p class="ts tm" style="line-height:1.8">${a.body}</p>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>`);
}

function openAddAnnouncementModal(){
  openModal(`
  <div class="modal-header"><div class="modal-title">Post Announcement</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid">
      <div class="fg"><label>Title*</label><input id="an-ti" placeholder="Announcement title"></div>
      <div class="fg"><label>Message*</label><textarea id="an-bo" placeholder="Write the full announcement..." style="min-height:100px"></textarea></div>
      <div class="form-grid form-row-2">
        <div class="fg"><label>Audience</label><select id="an-au"><option value="all">Everyone</option><option value="teacher">Teachers Only</option><option value="parent">Parents Only</option></select></div>
        <div class="fg"><label>Priority</label><select id="an-pr"><option value="normal">Normal</option><option value="high">Important</option></select></div>
      </div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveAnnouncement()">Post Announcement</button></div>`);
}

function saveAnnouncement(){
  const ti=document.getElementById('an-ti')?.value.trim();
  const bo=document.getElementById('an-bo')?.value.trim();
  const au=document.getElementById('an-au')?.value;
  const pr=document.getElementById('an-pr')?.value;
  if(!ti||!bo){ toast('Title and message are required.','error'); return; }
  STATE.announcements.unshift({
    id:STATE.nextAnnId++,title:ti,body:bo,
    date:new Date().toISOString().split('T')[0],
    audience:au,priority:pr,
    author:STATE.currentUser.name,authorRole:STATE.currentUser.role
  });
  closeModal(); toast('Announcement posted!'); nav('announcements');
}

function openEditAnnouncementModal(id){
  const a=STATE.announcements.find(x=>x.id===id); if(!a) return;
  openModal(`
  <div class="modal-header"><div class="modal-title">Edit Announcement</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid">
      <div class="fg"><label>Title*</label><input id="ean-ti" value="${a.title.replace(/"/g,'&quot;')}"></div>
      <div class="fg"><label>Message*</label><textarea id="ean-bo" style="min-height:100px">${a.body}</textarea></div>
      <div class="form-grid form-row-2">
        <div class="fg"><label>Audience</label><select id="ean-au"><option value="all" ${a.audience==='all'?'selected':''}>Everyone</option><option value="teacher" ${a.audience==='teacher'?'selected':''}>Teachers Only</option><option value="parent" ${a.audience==='parent'?'selected':''}>Parents Only</option></select></div>
        <div class="fg"><label>Priority</label><select id="ean-pr"><option value="normal" ${a.priority==='normal'?'selected':''}>Normal</option><option value="high" ${a.priority==='high'?'selected':''}>Important</option></select></div>
      </div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="updateAnnouncement(${id})">Save Changes</button></div>`);
}

function updateAnnouncement(id){
  const a=STATE.announcements.find(x=>x.id===id); if(!a) return;
  a.title=document.getElementById('ean-ti')?.value.trim()||a.title;
  a.body=document.getElementById('ean-bo')?.value.trim()||a.body;
  a.audience=document.getElementById('ean-au')?.value||a.audience;
  a.priority=document.getElementById('ean-pr')?.value||a.priority;
  closeModal(); toast('Announcement updated!'); nav('announcements');
}

function deleteAnnouncement(id,title){
  showConfirm('Delete Announcement',`Remove "<strong>${title}</strong>"?`,()=>{
    const idx=STATE.announcements.findIndex(a=>a.id===id);
    if(idx>=0){ STATE.announcements.splice(idx,1); toast('Announcement deleted.'); nav('announcements'); }
  });
}

/* ════════════════════════════════════════
   PARENT MANAGEMENT PAGE (Admin)
   ════════════════════════════════════════ */
/* ─── 3. PARENTS PAGE (Admin) ─── */
function pgParents(el){
  // Build shell ONCE — search input is never destroyed on keystroke
  el.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-title">Parents</div>
        <div class="page-sub" id="par-sub"></div>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openAddParentModal()">+ Add Parent</button>
      </div>
    </div>
    <div class="tbl-wrap">
      <div class="tbl-toolbar">
        <input
          id="par-search"
          class="tbl-search"
          placeholder="🔍  Search parents..."
        >
      </div>
      <table>
        <thead>
          <tr>
            <th>Parent</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Children</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="par-tbody"></tbody>
      </table>
    </div>`;
 
  function renderRows(){
    // ← toLowerCase() applied here so "Mrs" matches "mrs" etc.
    const q = document.getElementById('par-search').value.toLowerCase();
 
    const list = STATE.parents.filter(p =>
      !q ||
      p.name.toLowerCase().includes(q)  ||
      p.email.toLowerCase().includes(q) ||
      p.phone.includes(q)
    );
 
    document.getElementById('par-sub').textContent = `${list.length} parent(s) in the system`;
 
    document.getElementById('par-tbody').innerHTML = list.length === 0
      ? `<tr><td colspan="5">
           <div class="empty-state">
             <div class="es-icon">👨‍👩‍👧</div>
             <div class="es-title">No parents found</div>
           </div>
         </td></tr>`
      : list.map(p => `
          <tr>
            <td>
              <div class="flex aic gap-10">
                <div class="av av-32 av-amber">${ini(p.name)}</div>
                <div>
                  <div class="fw6">${p.name}</div>
                  <div class="txs tmm">${p.id}</div>
                </div>
              </div>
            </td>
            <td>${p.email}</td>
            <td>${p.phone}</td>
            <td>${p.children.map(cid => STATE.students.find(s=>s.id===cid)?.name || cid).join(', ')}</td>
            <td>
              <div class="flex gap-6">
                <button class="btn btn-secondary btn-xs" onclick="openEditParentModal('${p.id}')">Edit</button>
                <button class="btn btn-danger btn-xs"    onclick="deleteParent('${p.id}','${p.name.replace(/'/g,"\\'")}')">Delete</button>
              </div>
            </td>
          </tr>`).join('');
  }
 
  document.getElementById('par-search').addEventListener('input', renderRows);
 
  // Expose so add/edit/delete can refresh without rebuilding the page
  window.refreshParentRows = renderRows;
 
  renderRows();
}
function openAddParentModal(){
  openModal(`
  <div class="modal-header"><div class="modal-title">Add Parent / Guardian</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid form-row-2">
      <div class="fg"><label>Full Name*</label><input id="pf-name" placeholder="Parent name"></div>
      <div class="fg"><label>Email*</label><input id="pf-email" type="email" placeholder="parent@email.com"></div>
      <div class="fg"><label>Phone</label><input id="pf-phone" placeholder="09XXXXXXXXX"></div>
      <div class="fg"><label>Child</label><select id="pf-child">
        <option value="">-- Select a student --</option>
        ${STATE.students.map(s=>`<option value="${s.id}">${s.name} (${s.grade} ${s.section})</option>`).join('')}
      </select></div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveParent()">Save Parent</button></div>`);
}
/* Also patch deleteParent & saveParent to use refreshParentRows */
function saveParent(){
  const name  = document.getElementById('pf-name')?.value.trim();
  const email = document.getElementById('pf-email')?.value.trim();
  const phone = document.getElementById('pf-phone')?.value.trim();
  const child = document.getElementById('pf-child')?.value;
  if(!name || !email){ toast('Name and email are required.', 'error'); return; }
  const id       = 'P' + String(STATE.parents.length + 1).padStart(3, '0');
  const children = child ? [child] : [];
  STATE.parents.push({id, name, email, phone: phone||'—', children});
  if(child){ const student = STATE.students.find(s=>s.id===child); if(student) student.parentId = id; }
  closeModal();
  toast(`Parent ${name} added.`);
  if(typeof window.refreshParentRows === 'function') window.refreshParentRows();
  else nav('parents');
}
function openEditParentModal(id){
  const p = STATE.parents.find(x=>x.id===id); if(!p) return;
  openModal(`
  <div class="modal-header"><div class="modal-title">Edit Parent</div><button class="modal-close" onclick="closeModal()">✕</button></div>
  <div class="modal-body">
    <div class="form-grid form-row-2">
      <div class="fg"><label>Full Name*</label><input id="epf-name" value="${p.name}"></div>
      <div class="fg"><label>Email*</label><input id="epf-email" type="email" value="${p.email}"></div>
      <div class="fg"><label>Phone</label><input id="epf-phone" value="${p.phone}"></div>
      <div class="fg"><label>Children</label><input id="epf-child" value="${p.children.map(cid=>STATE.students.find(s=>s.id===cid)?.name||cid).join(', ')}" readonly></div>
    </div>
  </div>
  <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="updateParent('${id}')">Save</button></div>`);
}
function updateParent(id){
  const p=STATE.parents.find(x=>x.id===id); if(!p) return;
  p.name=document.getElementById('epf-name')?.value.trim()||p.name;
  p.email=document.getElementById('epf-email')?.value.trim()||p.email;
  p.phone=document.getElementById('epf-phone')?.value.trim()||p.phone;
  closeModal(); toast('Parent updated.'); nav('parents');
}
function deleteParent(id, name){
  showConfirm('Delete Parent', `Remove <strong>${name}</strong> from the system?`, ()=>{
    const idx = STATE.parents.findIndex(x=>x.id===id);
    if(idx >= 0){
      STATE.parents.splice(idx, 1);
      toast(`${name} deleted.`);
      if(typeof window.refreshParentRows === 'function') window.refreshParentRows();
      else nav('parents');
    }
  });
}
 

/* ════════════════════════════════════════
   PROFILE PAGE
   ════════════════════════════════════════ */
function pgProfile(el){
  const u=STATE.currentUser;
  const child=u.role==='parent'?STATE.students.find(s=>s.id===u.childId):null;
  const secondary=u.role==='teacher'?`${u.grade} – ${u.section}`:u.role==='parent'?`Child: ${child?.name||'N/A'}`:`School: ${u.school||'N/A'}`;
  const extraField=u.role==='admin'?`<div class="fg"><label>School</label><input id="pf-school" value="${u.school||''}"></div>`:'';
  const contactField=u.role!=='admin'?`<div class="fg"><label>Phone</label><input id="pf-phone" value="${u.phone||''}"></div>`:'';
  const avatarBg=u.role==='admin'?'var(--blue-l)':u.role==='parent'?'var(--amber-l)':'var(--green-l)';
  const avatarFg=u.role==='admin'?'var(--blue)':u.role==='parent'?'var(--amber)':'var(--green)';
  const avatarInner=u.avatar
    ?`<img src="${u.avatar}" style="width:96px;height:96px;object-fit:cover;border-radius:18px;display:block">`
    :`<div style="width:96px;height:96px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;color:${avatarFg};background:${avatarBg};border-radius:18px">${ini(u.name)}</div>`;

  const myStudents=u.role==='teacher'?STATE.students.filter(s=>s.section===u.section&&s.grade===u.grade&&s.status==='active'):[];
  const cg=myStudents.flatMap(s=>{const g=STATE.grades[s.id];return g?STATE.subjects.map(sub=>avg(g[sub])):[];});
  const classAvg=cg.length?Math.round(cg.reduce((a,b)=>a+b,0)/cg.length):0;
  const lowCount=myStudents.filter(s=>{const g=STATE.grades[s.id];return g&&STATE.subjects.some(sub=>avg(g[sub])<75);}).length;
  const attR=myStudents.length?Math.round(myStudents.reduce((s2,s)=>{const at=STATE.attendance[s.id];return s2+(at?.total?at.present/at.total:0);},0)/myStudents.length*100):0;
  const childG=child?STATE.grades[child.id]:null;
  const childAvg=childG&&STATE.subjects.length?Math.round(STATE.subjects.reduce((s2,sub)=>s2+avg(childG[sub]),0)/STATE.subjects.length):0;
  const childAtt=child?(()=>{const at=STATE.attendance[child.id];return at?.total?Math.round(at.present/at.total*100):0;})():0;

  const snap=u.role==='teacher'?[
    {l:'Students',v:myStudents.length},{l:'Class Avg',v:classAvg+'%'},{l:'Attendance',v:attR+'%'},{l:'Below 75',v:lowCount}
  ]:u.role==='parent'?[
    {l:'Child',v:child?.name||'N/A'},{l:'Avg Grade',v:childAvg+'%'},{l:'Attendance',v:childAtt+'%'},{l:'Notifs',v:getNotificationCount()}
  ]:[
    {l:'Students',v:STATE.students.filter(s=>s.status==='active').length},{l:'Teachers',v:STATE.teachers.length},
    {l:'Classes',v:STATE.classes.length},{l:'Unread',v:STATE.messages.filter(m=>!m.read).length}
  ];

  el.innerHTML=`
  <div class="page-head"><div><div class="page-title">Profile</div><div class="page-sub">Manage your account</div></div></div>
  <div class="profile-summary">
    <div class="card">
      <div class="flex aic gap-16 mb-16" style="padding-bottom:16px;border-bottom:1px solid var(--border)">
        <div id="avatar-wrap" style="position:relative;width:96px;height:96px;flex-shrink:0;border-radius:18px;overflow:hidden;cursor:pointer">
          <div id="avatar-display">${avatarInner}</div>
          <div id="avatar-overlay" style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.55);color:#fff;font-size:11px;font-weight:600;text-align:center;padding:6px 0;opacity:0;transition:opacity .2s;pointer-events:none">📷 Edit Photo</div>
          <input type="file" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%" onchange="previewProfilePic(event)">
        </div>
        <div>
          <div style="font-size:20px;font-weight:800;letter-spacing:-.4px">${u.name}</div>
          <div class="ts tm mt-4">${u.role.charAt(0).toUpperCase()+u.role.slice(1)} · ${secondary}</div>
          <div class="txs tmm mt-4">${u.email}</div>
          <button class="btn btn-secondary btn-xs mt-8" onclick="resetProfilePic()">Remove Photo</button>
        </div>
      </div>
      <div class="form-grid form-row-2">
        <div class="fg"><label>Full Name</label><input id="pf-name" value="${u.name}"></div>
        <div class="fg"><label>Email</label><input id="pf-email" type="email" value="${u.email}"></div>
        ${contactField}${extraField}
      </div>
      <button class="btn btn-primary mt-12" onclick="saveProfile()">Save Changes</button>
    </div>
    <div class="card">
      <div style="font-size:16px;font-weight:800;margin-bottom:4px">${u.role==='teacher'?'Class Snapshot':u.role==='parent'?'Child Snapshot':'School Overview'}</div>
      <div class="ts tm mb-16">${u.role==='teacher'?'Your current class performance.':u.role==='parent'?"Your child's progress.":"School-wide summary."}</div>
      <div class="profile-meta-grid">${snap.map(s=>`<div class="profile-meta-item"><div class="profile-meta-label">${s.l}</div><div class="profile-meta-value">${s.v}</div></div>`).join('')}</div>
      <div class="flex gap-10 mt-12">
        ${u.role==='teacher'?`<button class="btn btn-secondary btn-sm" onclick="nav('grades')">Grade Entry</button><button class="btn btn-primary btn-sm" onclick="nav('attendance')">Attendance</button>`:''}
        ${u.role==='parent'?`<button class="btn btn-secondary btn-sm" onclick="nav('announcements')">School News</button><button class="btn btn-primary btn-sm" onclick="nav('messages')">Messages</button>`:''}
        ${u.role==='admin'?`<button class="btn btn-secondary btn-sm" onclick="nav('students')">Students</button><button class="btn btn-primary btn-sm" onclick="nav('reports')">Reports</button>`:''}
      </div>
    </div>
  </div>`;

  const wrap=document.getElementById('avatar-wrap');
  const overlay=document.getElementById('avatar-overlay');
  if(wrap&&overlay){
    wrap.addEventListener('mouseenter',()=>overlay.style.opacity='1');
    wrap.addEventListener('mouseleave',()=>overlay.style.opacity='0');
  }
  window._profilePic=undefined;
}

function previewProfilePic(evt){
  const file=evt.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    const d=document.getElementById('avatar-display');
    if(d) d.innerHTML=`<img src="${e.target.result}" style="width:96px;height:96px;object-fit:cover;border-radius:18px;display:block">`;
    window._profilePic=e.target.result;
  };
  reader.readAsDataURL(file);
}

function resetProfilePic(){
  const u=STATE.currentUser;
  const bg=u.role==='admin'?'var(--blue-l)':u.role==='parent'?'var(--amber-l)':'var(--green-l)';
  const fg=u.role==='admin'?'var(--blue)':u.role==='parent'?'var(--amber)':'var(--green)';
  const d=document.getElementById('avatar-display');
  if(d) d.innerHTML=`<div style="width:96px;height:96px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;color:${fg};background:${bg};border-radius:18px">${ini(u.name)}</div>`;
  window._profilePic='';
}

function saveProfile(){
  const u=STATE.currentUser;
  const name=document.getElementById('pf-name')?.value.trim();
  const email=document.getElementById('pf-email')?.value.trim();
  if(!name||!email){toast('Name and email are required.','error');return;}
  u.name=name; u.email=email;
  if(window._profilePic!==undefined) u.avatar=window._profilePic||null;
  if(u.role==='admin') u.school=document.getElementById('pf-school')?.value.trim()||u.school;
  if(u.role!=='admin'){
    const phone=document.getElementById('pf-phone')?.value.trim();
    if(!phone){toast('Phone number is required.','error');return;}
    if(!/^\d{11}$/.test(phone)){toast('Phone must be exactly 11 digits.','error');return;}
    u.phone=phone;
  }
  setTopbarAvatar(u);
  document.getElementById('tb-name').textContent=u.name;
  toast('Profile updated successfully!');
}
/* ════════════════════════════════════════
   REPORTS PAGE
   ════════════════════════════════════════ */
function pgReports(el){
  const role=STATE.currentUser.role;
  const isTeacher=role==='teacher';
  const myStudents=isTeacher?STATE.students.filter(s=>s.section===STATE.currentUser.section&&s.grade===STATE.currentUser.grade):STATE.students;
  let allOv=[];
  myStudents.forEach(s=>{const g=STATE.grades[s.id];if(g){const ov=Math.round(STATE.subjects.reduce((a,sub)=>a+avg(g[sub]),0)/STATE.subjects.length);allOv.push({name:s.name,ov});}});
  const sorted=[...allOv].sort((a,b)=>b.ov-a.ov);

  el.innerHTML=`
  <div class="page-head"><div><div class="page-title">Reports &amp; Analytics</div><div class="page-sub">Generate and export academic data</div></div></div>

  <div class="g2 mb-16">
    ${[
      {title:'Student Report Card',desc:'Individual quarterly report card for each student.',icon:'📋'},
      {title:'Class Performance Report',desc:'Summary of grades across all subjects and quarters.',icon:'📊'},
      {title:'Attendance Report',desc:'Complete attendance records with rates per student.',icon:'📅'},
      {title:'Communication Log',desc:'Archive of all teacher-parent message exchanges.',icon:'💬'},
    ].map(r=>`<div class="card flex aic gap-14">
      <div style="width:48px;height:48px;background:var(--green-l);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${r.icon}</div>
      <div class="f1"><div class="fw7 ts mb-4">${r.title}</div><div class="txs tm mb-10">${r.desc}</div><div class="flex gap-8"><button class="btn btn-primary btn-xs" onclick="toast('PDF generated! (demo)')">Generate PDF</button><button class="btn btn-secondary btn-xs" onclick="toast('CSV exported! (demo)')">Export CSV</button></div></div>
    </div>`).join('')}
  </div>

  <div class="g2">
    <!-- Leaderboard -->
    <div class="card">
      <div class="card-header"><div class="card-title" style="margin:0">Top Performers</div><span class="badge bg-green">Ranked by average</span></div>
      ${sorted.slice(0,5).map((item,i)=>`
        <div class="flex aic gap-12" style="padding:10px 0;border-bottom:1px solid var(--border)">
          <div style="width:28px;height:28px;border-radius:50%;background:${i===0?'#C79800':i===1?'#C0C0C0':i===2?'#CD7F32':'var(--surface2)'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:${i<3?'#fff':'var(--text2)'};flex-shrink:0">${i+1}</div>
          <div class="f1 fw6 ts">${item.name}</div>
          <span class="badge ${gbadge(item.ov)}">${item.ov}</span>
        </div>`).join('')}
    </div>

    <!-- Subject summary -->
    <div class="card">
      <div class="card-header"><div class="card-title" style="margin:0">Subject Averages</div></div>
      ${STATE.subjects.map(sub=>{
        let vals=[];myStudents.forEach(s=>{const g=STATE.grades[s.id];if(g&&g[sub]) vals.push(avg(g[sub]));});
        const sa=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
        return `<div class="prog-wrap">
          <div class="prog-top"><span class="ts fw6">${STATE.subjectLabels[sub]}</span><span class="badge ${gbadge(sa)}">${sa}</span></div>
          <div class="prog-track"><div class="prog-fill" style="width:${sa}%;background:${gcol(sa)}"></div></div>
          <div class="txs tmm">${glabel(sa)}</div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}