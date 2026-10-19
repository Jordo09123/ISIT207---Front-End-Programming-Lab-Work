// github api personal access token goes here so more requests can be made per hour otherwise its only 60 per hour
const HEADERS = { Authorization: "YOUR_TOKEN_HERE" };
const USERS_URL = "https://api.github.com/users?per_page=100";
const cache = new Map();
let allUsers = [];         

// Task 1a read all users from github and cache into a localstorage

async function fetchAllUsers() {
    const saved = localStorage.getItem("usersList");
    if (saved) return JSON.parse(saved);

    const res = await fetch(USERS_URL, { headers: HEADERS });
    const data = await res.json();
    localStorage.setItem("usersList", JSON.stringify(data));
    return data;
}

// fetch full user profile 
async function getUser(url) {
    if (cache.has(url)) return cache.get(url);

    const res = await fetch(url, { headers: HEADERS });
    const data = await res.json();
    cache.set(url, data);
    return data;
}

// Task 1b pick six random users and show them in cards

function pickSix() {
    const shuffled = [...allUsers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
}

function cardHTML(user) {
    return `
        <div class="card">
            <img src="${user.avatar_url}" alt="Avatar of ${user.login}">
            <p><button class="username" data-url="${user.url}">${user.login}</button></p>
            <p>Blog: ${user.blog || "NULL"}</p>
            <p>Location: ${user.location || "NULL"}</p>
            <p>Site Admin: ${user.site_admin}</p>
        </div>
    `;
}

async function loadSix() {
    const picked = pickSix();
    const profiles = await Promise.all(picked.map(u => getUser(u.url)));
    document.getElementById("cards").innerHTML = profiles.map(cardHTML).join("");
}


// task 1b and 1d profile to be shown on main page with details and to be able to click and close on profile for popup

async function openProfile(url) {
    const overlay = document.getElementById("overlay");
    const body = document.getElementById("modalBody");

    body.innerHTML = "<p>Loading...</p>";
    overlay.classList.add("open");

    const user = await getUser(url);
    body.innerHTML = `
        <img src="${user.avatar_url}" alt="Avatar of ${user.login}">
        <h2>${user.login}</h2>
        <p><strong>Name:</strong> ${user.name || "NULL"}</p>
        <p><strong>Bio:</strong> ${user.bio || "NULL"}</p>
        <p><strong>Homepage:</strong> ${user.blog || "NULL"}</p>
        <p><strong>Location:</strong> ${user.location || "NULL"}</p>
        <p><strong>Site admin:</strong> ${user.site_admin}</p>
        <p><strong>Public repos:</strong> ${user.public_repos}</p>
        <p><strong>Followers:</strong> ${user.followers}
            &nbsp; <strong>Following:</strong> ${user.following}</p>
        <p><strong>Member since:</strong> ${user.created_at ? user.created_at.slice(0, 10) : "NULL"}</p>
        <p><a href="${user.html_url}" target="_blank" rel="noopener">Open GitHub profile</a></p>`;
}

function closeProfile() {
    document.getElementById("overlay").classList.remove("open");
}

// task 1c load six users every 20 seconds

(async () => {
    allUsers = await fetchAllUsers();
    await loadSix();
    setInterval(loadSix, 20000);
})();



// task 1e user look up

async function searchUser() {
    const input = document.getElementById("searchInput");
    const status = document.getElementById("searchStatus");
    const username = input.value.trim();
    status.textContent = "";

    if (!username) {
        status.textContent = "Please enter a username.";
        return;
    }

    const url = "https://api.github.com/users/" + encodeURIComponent(username);
    
    try {
        await getUser(url);     // throws if the user doesn't exist
        openProfile(url);       // same pop-up as 1d
    } catch (err) {
        status.textContent = err.message;
    }
}

// event listeners for each function

document.getElementById("searchBtn").addEventListener("click", searchUser);
document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchUser();
});

document.getElementById("cards").addEventListener("click", e => {
    const btn = e.target.closest(".username");
    if (btn) openProfile(btn.dataset.url);
});

document.getElementById("closeBtn").addEventListener("click", closeProfile);

document.getElementById("overlay").addEventListener("click", e => {
    if (e.target.id === "overlay") closeProfile();
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeProfile();
});