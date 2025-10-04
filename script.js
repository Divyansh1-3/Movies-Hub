const movies = [
      { title: "Attack on Titan", genre: "Anime", rating: 9.1, image: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg" },
      { title: "Breaking Bad", genre: "Series", rating: 9.5, image: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg" },
      { title: "Inception", genre: "Movie", rating: 8.8, image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg" },
      { title: "Naruto", genre: "Anime", rating: 8.4, image: "https://image.tmdb.org/t/p/w500/zAYRe2bJxpWTVrwwmBc00VFkAf4.jpg" },
      { title: "Stranger Things", genre: "Series", rating: 8.7, image: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg" },
      { title: "Avengers: Endgame", genre: "Movie", rating: 8.4, image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" }
];

let watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
let currentView = "home";
let currentPage = 1;
const perPage = 4;

const movieContainer = document.getElementById("movieContainer");
const genreFilter = document.getElementById("genreFilter");
const sortBy = document.getElementById("sortBy");
const modal = document.getElementById("movieModal");
const modalContent = modal.querySelector(".modal-content");
const pagination = document.getElementById("pagination");

function renderMovies(list) {
      movieContainer.innerHTML = "";
      const start = (currentPage - 1) * perPage;
      const end = start + perPage;
      const shown = list.slice(start, end);

      if (shown.length === 0) {
            movieContainer.innerHTML = "<p>No movies found.</p>";
            pagination.innerHTML = "";
            return;
      }

      shown.forEach(m => {
            const card = document.createElement("div");
            card.className = "card";
            const added = watchlist.includes(m.title);
            card.innerHTML = `
          <img src="${m.image}" alt="${m.title}">
          <h4>${m.title}</h4>
          <p>⭐ ${m.rating} | ${m.genre}</p>
          <button>${added ? "✓ Added" : "+ Add"}</button>
        `;
            card.querySelector("img").onclick = () => openModal(m);
            card.querySelector("button").onclick = () => toggleWatchlist(m);
            movieContainer.appendChild(card);
      });

      renderPagination(list.length);
}

function renderPagination(total) {
      pagination.innerHTML = "";
      const totalPages = Math.ceil(total / perPage);
      for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            if (i === currentPage) btn.style.background = "#007bff";
            btn.onclick = () => { currentPage = i; applyFilters(); };
            pagination.appendChild(btn);
      }
}

function toggleWatchlist(m) {
      const index = watchlist.indexOf(m.title);
      if (index === -1) watchlist.push(m.title);
      else watchlist.splice(index, 1);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      applyFilters();
}

function openModal(m) {
      modal.style.display = "flex";
      modalContent.innerHTML = `
        <h3>${m.title}</h3>
        <p>${m.genre}</p>
        <p>⭐ ${m.rating}</p>
        <button onclick="modal.style.display='none'">Close</button>
      `;
}

function applyFilters() {
      let list = currentView === "home" ? [...movies] : movies.filter(x => watchlist.includes(x.title));
      const genre = genreFilter.value;
      const sort = sortBy.value;
      if (genre !== "all") list = list.filter(m => m.genre === genre);
      if (sort === "ratingHigh") list.sort((a, b) => b.rating - a.rating);
      if (sort === "ratingLow") list.sort((a, b) => a.rating - b.rating);
      renderMovies(list);
}

document.getElementById("homeBtn").onclick = () => { currentView = "home"; currentPage = 1; applyFilters(); };
document.getElementById("watchlistBtn").onclick = () => { currentView = "watchlist"; currentPage = 1; applyFilters(); };
genreFilter.onchange = applyFilters;
sortBy.onchange = applyFilters;

window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
applyFilters();