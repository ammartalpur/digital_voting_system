// Function to reset candidateId in localStorage
function resetCandidateId() {
  localStorage.setItem("candidateId", 0);
}

// Initialize id from localStorage or start from 0
let id = parseInt(localStorage.getItem("candidateId")) || 1;

// Function to add a candidate
function addCandidate() {
  const nameInput = document.getElementById("candidateName");
  const name = nameInput.value.trim();
  if (!name) return;

  let candidates = [];
  try {
    candidates = JSON.parse(localStorage.getItem("candidates")) || [];
  } catch (e) {
    console.error("Error parsing candidates from localStorage", e);
  }
  candidates.push({ id, name, totalVotes: 0 });
  localStorage.setItem("candidates", JSON.stringify(candidates));
  nameInput.value = ""; // Clear the input field
  id++; // Increment id by 1
  localStorage.setItem("candidateId", id); // Store the updated id in localStorage
  displayCandidates();
}

// Function to delete candidate by ID
function deleteCandidate(id) {
  let candidates = [];
  try {
    candidates = JSON.parse(localStorage.getItem("candidates")) || [];
  } catch (e) {
    console.error("Error parsing candidates from localStorage", e);
  }
  candidates = candidates.filter((candidate) => candidate.id !== id);
  localStorage.setItem("candidates", JSON.stringify(candidates));
  displayCandidates();
}

// Function to get candidate by ID
function getCandidateById(candidateId) {
  let candidates = [];
  try {
    candidates = JSON.parse(localStorage.getItem("candidates")) || [];
  } catch (e) {
    console.error("Error parsing candidates from localStorage", e);
  }
  return candidates.find((candidate) => candidate.id === candidateId) || null;
}

// Function to increment votes for a candidate by ID
function incrementVote(candidateId) {
  let candidates = [];
  try {
    candidates = JSON.parse(localStorage.getItem("candidates")) || [];
  } catch (e) {
    console.error("Error parsing candidates from localStorage", e);
  }
  const candidate = candidates.find(
    (candidate) => candidate.id === candidateId
  );
  if (candidate) {
    candidate.totalVotes += 1;
    localStorage.setItem("candidates", JSON.stringify(candidates));
    displayCandidates();
  }
}

// Function to display candidates in the table
function displayCandidates() {
  let candidates = [];
  try {
    candidates = JSON.parse(localStorage.getItem("candidates")) || [];
  } catch (e) {
    console.error("Error parsing candidates from localStorage", e);
  }
  const tbody = document.querySelector("#candidateTable tbody");
  tbody.innerHTML = "";
  candidates.forEach((candidate) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${candidate.id}</td>
      <td>${candidate.name}</td>
      <td><button onclick="deleteCandidate(${candidate.id})">Delete</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Initial display of candidates
// displayCandidates();

// Reset candidateId when the page loads

// Initial display of candidates
document.addEventListener("DOMContentLoaded", displayCandidates);
document.querySelector(".add").addEventListener("click", addCandidate);
document.querySelector(".reset").addEventListener("click", resetCandidateId);
