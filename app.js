const DAYS = [
  {
    id: 'sat', name: 'الجمعة', label: 'الجمعة', rest: true,
    title: 'يوم راحة', subtitle: 'استرح وخلي جسمك يتعافى',
    exercises: []
  },
  {
    id: 'sun', name: 'السبت', label: 'السبت', rest: false,
    title: 'صدر + تراسبس', subtitle: 'قوة عضلية — Push Day',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 12 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 12 },
      { name: 'Butterfly / Pec Deck', sets: 3, reps: 15 },
      { name: 'Tricep Pushdown بحبل', sets: 3, reps: 15 },
      { name: 'Overhead Tricep Extension', sets: 3, reps: 12 },
    ],
    cardio: { name: 'تريدميل — مشي سريع', duration: 20 }
  },
  {
    id: 'mon', name: 'الاحد', label: 'الاحد', rest: false,
    title: 'ظهر + بايسبس', subtitle: 'قوة عضلية — Pull Day',
    exercises: [
      { name: 'Lat Pulldown', sets: 4, reps: 12 },
      { name: 'Seated Cable Row', sets: 4, reps: 12 },
      { name: 'Dumbbell Row أحادي', sets: 3, reps: 12 },
      { name: 'Barbell Curl', sets: 3, reps: 12 },
      { name: 'Hammer Curl', sets: 3, reps: 12 },
    ],
    cardio: { name: 'دراجة ثابتة', duration: 20 }
  },
  {
    id: 'tue', name: 'الاثنين', label: 'الاثنين', rest: true,
    title: 'يوم راحة', subtitle: 'النوم والتعافي جزء من التمرين',
    exercises: []
  },
  {
    id: 'wed', name: 'الثلاثاء', label: 'الثلاثاء', rest: false,
    title: 'أكتاف + كور', subtitle: 'قوة عضلية — Shoulders',
    exercises: [
      { name: 'Overhead Press', sets: 4, reps: 12 },
      { name: 'Lateral Raise', sets: 4, reps: 15 },
      { name: 'Front Raise', sets: 3, reps: 12 },
      { name: 'Face Pull بالكابل', sets: 3, reps: 15 },
      { name: 'Plank', sets: 3, reps: null, duration: 45 },
    ],
    cardio: { name: 'إيليبتيكال أو تريدميل', duration: 20 }
  },
  {
    id: 'thu', name: 'الاربعاء', label: 'الاربعاء', rest: false,
    title: 'أرجل كاملة', subtitle: 'قوة عضلية — Legs Day',
    exercises: [
      { name: 'Goblet Squat', sets: 4, reps: 12 },
      { name: 'Leg Press', sets: 4, reps: 15 },
      { name: 'Romanian Deadlift', sets: 3, reps: 12 },
      { name: 'Leg Curl ماكينة', sets: 3, reps: 15 },
      { name: 'Seated Leg Extension', sets: 3, reps: 15 },
      { name: 'Calf Raises', sets: 3, reps: 20 },
    ],
    cardio: { name: 'تريدميل خفيف', duration: 15 }
  },
  {
    id: 'fri', name: 'الخميس', label: 'الخميس', rest: false,
    title: 'كارديو + بطن', subtitle: 'حرق دهون — Cardio Day',
    exercises: [
      { name: 'Crunches', sets: 3, reps: 20 },
      { name: 'Leg Raises', sets: 3, reps: 15 },
      { name: 'Plank', sets: 3, reps: null, duration: 45 },
      { name: 'Russian Twist', sets: 3, reps: 20 },
    ],
    cardio: { name: 'تريدميل — مشي أو هرولة', duration: 35 }
  },
];

let currentDay = 0;
let data = JSON.parse(localStorage.getItem('gymData') || '{}');

function getKey(dayId, exIdx, field) {
  return `${dayId}_${exIdx}_${field}`;
}

function saveToStorage() {
  localStorage.setItem('gymData', JSON.stringify(data));
}

function renderTabs() {
  const tabs = document.getElementById('dayTabs');
  tabs.innerHTML = DAYS.map((d, i) => {
    const isDone = data[`${d.id}_done`];
    return `<div class="day-tab${i === currentDay ? ' active' : ''}${d.rest ? ' rest' : ''}${isDone ? ' done' : ''}" onclick="switchDay(${i})">
      <span class="day-name">${d.label}</span>
      <div class="day-dot"></div>
    </div>`;
  }).join('');
}

function switchDay(i) {
  currentDay = i;
  renderTabs();
  renderContent();
  updateProgress();
}

function renderContent() {
  const day = DAYS[currentDay];
  const content = document.getElementById('content');

  if (day.rest) {
    content.innerHTML = `
      <div class="day-header rest-card">
        <div class="rest-icon">😴</div>
        <div class="rest-title">${day.title}</div>
        <div class="rest-desc">${day.subtitle}<br><br>اشرب مياه كويس واهتم بالنوم 7-8 ساعات</div>
      </div>`;
    document.getElementById('saveBtn').textContent = 'تم ✓';
    return;
  }

  document.getElementById('saveBtn').textContent = 'حفظ تمرين اليوم 💾';

  let html = `<div class="day-header">
    <div class="day-title">${day.title}</div>
    <div class="day-subtitle">${day.subtitle}</div>
  </div>`;

  day.exercises.forEach((ex, i) => {
    const setsMeta = ex.reps ? `${ex.sets} جولات × ${ex.reps} تكرار` : `${ex.sets} جولات × ${ex.duration} ثانية`;
    const savedWeight = data[getKey(day.id, i, 'weight')] || '';
    const prevWeight = data[getKey(day.id, i, 'prevWeight')] || '';

    let setsHtml = `<div class="sets-header-row">
      <span>جولة</span><span>تكرار</span><span>وزن kg</span><span>✓</span>
    </div>`;

    for (let s = 0; s < ex.sets; s++) {
      const savedReps = data[getKey(day.id, i, `reps_${s}`)] || '';
      const savedSetWeight = data[getKey(day.id, i, `setweight_${s}`)] || '';
      const isDone = data[getKey(day.id, i, `setdone_${s}`)];
      setsHtml += `<div class="set-row">
        <div class="set-num">${s + 1}</div>
        <input type="number" class="set-input" placeholder="${ex.reps || ex.duration}" value="${savedReps}"
          oninput="saveSet('${day.id}', ${i}, ${s}, 'reps', this.value)">
        <input type="number" class="set-input" placeholder="0" value="${savedSetWeight}"
          oninput="saveSet('${day.id}', ${i}, ${s}, 'setweight', this.value)">
        <div class="set-done-btn${isDone ? ' done' : ''}" onclick="toggleSetDone('${day.id}', ${i}, ${s}, this)">${isDone ? '✓' : '○'}</div>
      </div>`;
    }

    html += `<div class="ex-card" id="ex_${i}">
      <div class="ex-header" onclick="toggleEx(${i})">
        <div class="ex-num">${i + 1}</div>
        <div class="ex-info">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-meta">${setsMeta}</div>
        </div>
        <div class="ex-arrow">⌄</div>
      </div>
      <div class="sets-body">
        ${setsHtml}
        <div class="weight-row">
          <span class="weight-label">أقصى وزن شيلته</span>
          <input type="number" class="weight-input" placeholder="0" value="${savedWeight}"
            oninput="saveWeight('${day.id}', ${i}, this.value)" id="w_${day.id}_${i}">
          <span class="weight-unit">kg</span>
        </div>
        ${prevWeight ? `<div class="prev-weight">آخر مرة: <span>${prevWeight} kg</span></div>` : ''}
      </div>
    </div>`;
  });

  if (day.cardio) {
    const savedDur = data[`${day.id}_cardio_dur`] || day.cardio.duration;
    const savedNote = data[`${day.id}_cardio_note`] || '';
    html += `<div class="cardio-card">
      <div class="cardio-title">${day.cardio.name}</div>
      <div class="cardio-row">
        <div class="cardio-field">
          <label>مدة (دقيقة)</label>
          <input type="number" class="cardio-input" value="${savedDur}"
            oninput="data['${day.id}_cardio_dur']=this.value; saveToStorage()">
        </div>
        <div class="cardio-field">
          <label>ملاحظة</label>
          <input type="text" class="cardio-input" placeholder="مثال: 6 كم/س" value="${savedNote}"
            oninput="data['${day.id}_cardio_note']=this.value; saveToStorage()">
        </div>
      </div>
    </div>`;
  }

  // Summary
  let totalSets = 0, doneSets = 0;
  day.exercises.forEach((ex, i) => {
    totalSets += ex.sets;
    for (let s = 0; s < ex.sets; s++) {
      if (data[getKey(day.id, i, `setdone_${s}`)]) doneSets++;
    }
  });

  html += `<div class="summary-section">
    <div class="summary-title">ملخص اليوم</div>
    <div class="summary-grid">
      <div class="summary-card"><div class="summary-val" id="sum-total">${totalSets}</div><div class="summary-lbl">إجمالي الجولات</div></div>
      <div class="summary-card"><div class="summary-val" id="sum-done" style="color:var(--accent2)">${doneSets}</div><div class="summary-lbl">جولات مكتملة</div></div>
    </div>
  </div>`;

  content.innerHTML = html;
}

function toggleEx(i) {
  const card = document.getElementById(`ex_${i}`);
  card.classList.toggle('expanded');
}

function saveSet(dayId, exIdx, setIdx, field, value) {
  data[getKey(dayId, exIdx, `${field}_${setIdx}`)] = value;
  saveToStorage();
}

function toggleSetDone(dayId, exIdx, setIdx, btn) {
  const key = getKey(dayId, exIdx, `setdone_${setIdx}`);
  data[key] = !data[key];
  btn.classList.toggle('done');
  btn.textContent = data[key] ? '✓' : '○';
  saveToStorage();
  updateProgress();
  updateSummary();
}

function updateSummary() {
  const day = DAYS[currentDay];
  if (day.rest) return;
  let totalSets = 0, doneSets = 0;
  day.exercises.forEach((ex, i) => {
    totalSets += ex.sets;
    for (let s = 0; s < ex.sets; s++) {
      if (data[getKey(day.id, i, `setdone_${s}`)]) doneSets++;
    }
  });
  const sumDone = document.getElementById('sum-done');
  if (sumDone) sumDone.textContent = doneSets;
}

function saveWeight(dayId, exIdx, value) {
  const key = getKey(dayId, exIdx, 'weight');
  data[key] = value;
  saveToStorage();
}

function updateProgress() {
  const day = DAYS[currentDay];
  if (day.rest) {
    document.getElementById('progressFill').style.width = '100%';
    document.getElementById('progressText').textContent = 'يوم راحة';
    document.getElementById('progressPct').textContent = '';
    return;
  }
  let total = 0, done = 0;
  day.exercises.forEach((ex, i) => {
    total += ex.sets;
    for (let s = 0; s < ex.sets; s++) {
      if (data[getKey(day.id, i, `setdone_${s}`)]) done++;
    }
  });
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = `${done} جولة مكتملة من ${total}`;
  document.getElementById('progressPct').textContent = pct + '%';
}

function saveDay() {
  const day = DAYS[currentDay];
  if (day.rest) return;
  data[`${day.id}_done`] = true;
  day.exercises.forEach((ex, i) => {
    const w = data[getKey(day.id, i, 'weight')];
    if (w) data[getKey(day.id, i, 'prevWeight')] = w;
  });
  saveToStorage();
  renderTabs();
  const btn = document.getElementById('saveBtn');
  btn.textContent = 'تم الحفظ ✓';
  btn.classList.add('saved');
  setTimeout(() => {
    btn.textContent = 'حفظ تمرين اليوم 💾';
    btn.classList.remove('saved');
  }, 2000);
  showToast('تم حفظ تمرين اليوم 💪');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// detect current day of week and start there
const jsDay = new Date().getDay(); // 0=Sun,1=Mon,...,6=Sat
const dayMap = { 0:1, 1:2, 2:4, 3:5, 4:6, 5:3, 6:0 };
currentDay = dayMap[jsDay] !== undefined ? dayMap[jsDay] : 0;

renderTabs();
renderContent();
updateProgress();
