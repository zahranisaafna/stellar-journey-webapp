document.addEventListener("DOMContentLoaded", () => {
  const habitForm = document.getElementById("habitForm");
  const dailyChecklist = document.getElementById("dailyChecklist");
  const calendarEl = document.getElementById("calendar");
  const quoteEl = document.getElementById("quote");

  // Ambil data habit dari localStorage, jika tidak ada pakai array kosong
  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  // Fungsi untuk render habit list dan checklist
  function renderHabits() {
    const habitList = document.getElementById('habitList');
    const dailyChecklist = document.getElementById('dailyChecklist');
    habitList.innerHTML = '';
    dailyChecklist.innerHTML = '';

    habits.forEach((habit, idx) => {
      // List habit dengan kolom music, ukuran lebih besar & rapi
      const li = document.createElement('li');
      li.style.marginBottom = "24px";
      li.style.padding = "12px";
      li.style.background = "#fff8e1";
      li.style.borderRadius = "8px";
      li.style.boxShadow = "0 2px 6px rgba(78,52,46,0.08)";
      li.innerHTML = `
        <div style="font-size:1.1rem;">
          <strong>${habit.name || ''}</strong>
          ${habit.category ? ' - ' + habit.category : ''}
          ${habit.priority ? ' (' + habit.priority + ')' : ''}
          ${habit.date ? ' on ' + habit.date : ''}
        </div>
        ${habit.note ? `<div style="margin:6px 0 0 0;"><em>${habit.note}</em></div>` : ''}
        ${habit.music ? `
          <div style="margin-top:10px;">
            <span style="color:#6d4c41;font-weight:500;">Music:</span><br>
            <div style="margin-top:6px;">${renderMusic(habit.music)}</div>
          </div>
        ` : ''}
      `;
      habitList.appendChild(li);

      // Checklist harian
      const checkLi = document.createElement('li');
      checkLi.style.marginBottom = "8px";
      checkLi.innerHTML = `<input type="checkbox" id="habit${idx}"><label for="habit${idx}" style="margin-left:6px;">${habit.name || ''}</label>`;
      dailyChecklist.appendChild(checkLi);
    });

    // Tambahkan event listener untuk update progress saat checklist diubah
    habits.forEach((_, idx) => {
      const checkbox = document.getElementById(`habit${idx}`);
      if (checkbox) {
        checkbox.addEventListener("change", updateMonthlyProgress);
      }
    });

    // Update progress pertama kali
    updateMonthlyProgress();
  }

  // Fungsi untuk render embed/link music dengan ukuran lebih besar
  function renderMusic(link) {
    if (link.includes("spotify.com")) {
      const embedUrl = link.replace("/track/", "/embed/track/");
      return `<iframe src="${embedUrl}" width="320" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
    } else if (link.includes("youtu")) {
      let videoId = link.split("v=")[1] || link.split("/").pop();
      if (videoId && videoId.includes("&")) videoId = videoId.split("&")[0];
      return `<iframe width="320" height="80" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      return `<a href="${link}" target="_blank">${link}</a>`;
    }
  }

  // Panggil fungsi saat halaman dimuat
  renderHabits();

  // CRUD Habit (Form Page)
  if (habitForm) {
    habitForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newHabit = {
        id: Date.now(),
        name: document.getElementById("name").value,
        category: document.getElementById("category").value,
        priority: document.getElementById("priority").value,
        date: document.getElementById("date").value,
      };
      habits.push(newHabit);
      localStorage.setItem("habits", JSON.stringify(habits));
      window.location.href = "index.html";
    });
  }

  // FullCalendar Integration
  if (calendarEl) {
    let calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: habits.filter(h => h.date).map(h => ({
        title: h.name,
        start: h.date,
        color: h.priority === "high" ? "red" : h.priority === "medium" ? "orange" : "green"
      }))
    });
    calendar.render();
  }

  // Chart.js Monthly Overview
  if (document.getElementById("habitChart")) {
    const ctx = document.getElementById("habitChart");
    const categories = ["Wellness", "Health", "Productivity", "Learning", "Social", "Other"];
    const counts = categories.map(cat => habits.filter(h => h.category === cat).length);

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: categories,
        datasets: [{
          label: "Habits this month",
          data: counts
        }]
      }
    });
  }

  // Quotes (Static List)
  const quotes = [
    "Small steps every day lead to big changes.",
    "Consistency beats intensity.",
    "Focus on progress, not perfection.",
    "Your habits shape your future.",
    "Discipline is choosing between what you want now and what you want most."
  ];
  if (quoteEl) {
    quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
  }

  // Clock
  function updateClock() {
    if (document.getElementById("clock") && document.getElementById("date")) {
      const now = new Date();
      document.getElementById("clock").textContent = now.toLocaleTimeString();
      document.getElementById("date").textContent = now.toDateString();
    }
  }
  if (document.getElementById("clock")) {
    setInterval(updateClock, 1000);
    updateClock();
  }

  function updateMonthlyProgress() {
    const total = habits.length;
    let checked = 0;
    habits.forEach((_, idx) => {
      const checkbox = document.getElementById(`habit${idx}`);
      if (checkbox && checkbox.checked) checked++;
    });
    const percent = total === 0 ? 0 : Math.round((checked / total) * 100);
    document.getElementById("progressBar").style.width = percent + "%";
    document.getElementById("progressText").textContent = `${percent}% completed`;
  }
});
