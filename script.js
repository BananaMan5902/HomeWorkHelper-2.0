let categories = {
  "Phy Ed": ["sport", "exercise", "run", "fitness", "gym"],
  "Math": ["math", "algebra", "geometry", "equation", "solve", "graph"],
  "English": ["essay", "grammar", "novel", "poem", "literature"],
  "Social Studies": ["history", "government", "war", "culture", "map"],
  "Health": ["nutrition", "health", "sleep", "diet", "mental"],
  "Science": ["biology", "chemistry", "physics", "lab", "experiment"],
  "Custom": []
};

// AI similarity scoring
function similarityScore(text, keywords) {
  text = text.toLowerCase();
  let score = 0;

  keywords.forEach(word => {
    if (text.includes(word)) score += 1;
  });

  return score;
}

// Main AI Sorting Function
function sortData() {
  const text = document.getElementById("inputText").value;
  const lines = text.split("\n").filter(l => l.trim() !== "");

  lines.forEach(line => {
    let bestCategory = null;
    let bestScore = 0;

    for (let cat in categories) {
      let score = similarityScore(line, categories[cat]);

      if (score > bestScore) {
        bestScore = score;
        bestCategory = cat;
      }
    }

    // If AI is unsure
    if (bestScore < 1 || bestCategory === "Custom") {
      bestCategory = prompt(
        "AI is unsure about this item:\n" +
        line +
        "\nPlease type category:"
      );

      if (!categories[bestCategory]) {
        categories[bestCategory] = [];
      }

      learnKeyword(bestCategory, line);
    }

    saveData(bestCategory, line);
  });

  document.getElementById("inputText").value = "";
  displayAll();
}

// AI Learning Memory
function learnKeyword(category, text) {
  let words = text.toLowerCase().split(" ");

  words.forEach(word => {
    if (word.length > 4 && !categories[category].includes(word)) {
      categories[category].push(word);
    }
  });
}

// Storage System
function saveData(category, text) {
  let stored = JSON.parse(localStorage.getItem(category)) || [];

  if (!stored.includes(text)) {
    stored.push(text);
  }

  localStorage.setItem(category, JSON.stringify(stored));
}

// Display folders
function displayAll() {
  const results = document.getElementById("results");
  results.innerHTML = "";

  for (let cat in categories) {
    let data = JSON.parse(localStorage.getItem(cat)) || [];

    if (data.length === 0) continue;

    let folder = document.createElement("div");
    folder.className = "category";

    let title = document.createElement("h3");
    title.textContent = "📁 " + cat;

    folder.appendChild(title);

    data.forEach(item => {
      let p = document.createElement("p");
      p.textContent = "• " + item;
      folder.appendChild(p);
    });

    results.appendChild(folder);
  }
}

displayAll();
