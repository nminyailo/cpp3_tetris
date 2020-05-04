function storeUsername() {
  localStorage.setItem("username", document.getElementById("username").value);
}

const username = localStorage.getItem("username");
document.getElementById("username").value = username != null ? username : null;
