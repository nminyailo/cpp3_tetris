class Highscore {
  getScoreboardData() {
    const scoreboardData = JSON.parse(localStorage.getItem("scoreboard"));

    if (!scoreboardData) return [];

    return scoreboardData
      .map(i => ((i.date = new Date(i.date)), i))
      .slice(0, 20)
      .sort((a, b) => b.level - a.level);
  }

  saveToScoreboard({ username, level }) {
    const scoreboardData = this.getScoreboardData();
    scoreboardData.push({ username, level, date: new Date() });

    localStorage.setItem("scoreboard", JSON.stringify(scoreboardData));
  }

  showScoreboard() {
    const dateTime = new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "long"
    });
    const table = document.getElementById("scoreboard-table").firstElementChild;

    for (const child of table.children) {
      if (child.classList.contains("generated")) {
        table.removeChild(child);
      }
    }
    const scoreboardData = this.getScoreboardData();

    for (const { username, level, date } of scoreboardData) {
      const row = document.createElement("tr");
      const usernameColumn = document.createElement("td");
      const levelColumn = document.createElement("td");
      const dateColumn = document.createElement("td");

      usernameColumn.innerText = username;
      levelColumn.innerText = level;
      dateColumn.innerText = dateTime.format(date);

      row.appendChild(dateColumn);
      row.appendChild(usernameColumn);
      row.appendChild(levelColumn);

      row.classList.add("generated");

      table.appendChild(row);
    }
  }
}
