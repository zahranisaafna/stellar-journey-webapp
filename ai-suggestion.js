function getAISuggestion() {
  const suggestions = [
    "Meditate for 10 minutes",
    "Drink 2 liters of water",
    "Write a journal entry",
    "Do 20 push-ups",
    "Read 10 pages of a book"
  ];
  return suggestions[Math.floor(Math.random() * suggestions.length)];
}

// Example use
console.log("AI Suggestion:", getAISuggestion());
  const habitForm = document.getElementById("habitForm");
  const habitList = document.getElementById("habitList");
  const calendarEl = document.getElementById("calendar");
  const quoteEl = document.getElementById("quote");


