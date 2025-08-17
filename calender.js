document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  // Ambil data habits dari localStorage
  const habits = JSON.parse(localStorage.getItem("habits")) || [];

  // Konversi data habits jadi events untuk kalender
  const events = habits.map(habit => ({
    title: habit.name || "Habit",
    start: habit.date,  // format: YYYY-MM-DD
    allDay: true,
    color: "#4CAF50"
  }));

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    selectable: true,
    editable: true,
    events: events,

    // Klik tanggal buat nambah habit
    dateClick: function(info) {
      const habitName = prompt("Tambah habit untuk tanggal " + info.dateStr + ":");
      if (habitName) {
        calendar.addEvent({
          title: habitName,
          start: info.dateStr,
          allDay: true,
          color: "#2196F3"
        });

        // Simpan ke localStorage juga
        habits.push({ name: habitName, date: info.dateStr });
        localStorage.setItem("habits", JSON.stringify(habits));
      }
    },

    // Klik event buat hapus habit
    eventClick: function(info) {
      if (confirm("Hapus habit '" + info.event.title + "'?")) {
        info.event.remove();

        // Hapus juga dari localStorage
        const index = habits.findIndex(h => h.name === info.event.title && h.date === info.event.startStr);
        if (index > -1) {
          habits.splice(index, 1);
          localStorage.setItem("habits", JSON.stringify(habits));
        }
      }
    }
  });

  calendar.render();
});

