let sviFilmovi = [];
fetch('data/filmovi.csv') 
  .then(res => res.text())
  .then(csv => {
    const rezultat = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true
    });
    sviFilmovi = rezultat.data.map(film => ({
      title: film.title,
      year: Number(film.year),
      genres: film.genres.replace(/;/g, ', '),
      duration: Number(film.duration),
      rating: Number(film.rating),
      directors: film.directors,
      country: film.country
    }));
    prikaziPocetneFilmove(sviFilmovi);
    prikaziFiltriraneFilmove(sviFilmovi);
  })
  .catch(error => {
    console.error('Error fetching the CSV file:', error);
  });

  function prikaziPocetneFilmove(filmovi) {
    const tbody = document.querySelector('#filmovi-tablica tbody');
    tbody.innerHTML = ''; 
    for (const film of filmovi) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${film.title}</td>
        <td>${film.year}</td>
        <td>${film.genres}</td>
        <td>${film.duration}</td>
        <td>${film.rating}</td>
        <td>${film.directors}</td>
        <td>${film.country}</td>
        <td><button class="add-to-cart">+</button></td>
      `;
      const addButton = row.querySelector('.add-to-cart');
      addButton.addEventListener('click', () => dodajUKosaricu(film));
      tbody.appendChild(row);
    }
  }

const ratingMinInput = document.getElementById('filter-rating-min');
const ratingMaxInput = document.getElementById('filter-rating-max');
const ratingMinValue = document.getElementById('rating-min-value');
const ratingMaxValue = document.getElementById('rating-max-value');

ratingMinInput.addEventListener('input', () => {
  ratingMinValue.textContent = ratingMinInput.value;
});

ratingMaxInput.addEventListener('input', () => {
  ratingMaxValue.textContent = ratingMaxInput.value;
});

function filtriraj() {
  const zanr = document.getElementById('filter-genre').value;
  const godinaOd = parseInt(document.getElementById('filter-year-from').value);
  const godinaDo = parseInt(document.getElementById('filter-year-to').value);
  const drzava = document.getElementById('filter-country').value;
  const ocjenaMin = parseFloat(document.getElementById('filter-rating-min').value);
  const ocjenaMax = parseFloat(document.getElementById('filter-rating-max').value);
  const filtriraniFilmovi = sviFilmovi.filter(film => {
    const zadovoljavaZanr = zanr ? film.genres.includes(zanr) : true;
    const zadovoljavaGodina =
      (!godinaOd || film.year >= godinaOd) &&
      (!godinaDo || film.year <= godinaDo);
    const zadovoljavaOcjenu =
      (!ocjenaMin || film.rating >= ocjenaMin) &&
      (!ocjenaMax || film.rating <= ocjenaMax);
    const zadovoljavaDrzava = drzava ? film.country === drzava : true;

    return zadovoljavaZanr && zadovoljavaGodina && zadovoljavaOcjenu && zadovoljavaDrzava;
  });
  prikaziFiltriraneFilmove(filtriraniFilmovi);
}

document.getElementById('primijeni-filtere').addEventListener('click', filtriraj);

function prikaziFiltriraneFilmove(filmovi) {
  const tbody = document.querySelector('#filmovi-tablica tbody');
  tbody.innerHTML = ''; 
  if (filmovi.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="8">Nema filmova koji zadovoljavaju odabrane kriterije.</td>`;
    tbody.appendChild(row);
    return;
  }
  for (const film of filmovi) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${film.title}</td>
      <td>${film.year}</td>
      <td>${film.genres}</td>
      <td>${film.duration}</td>
      <td>${film.rating}</td>
      <td>${film.directors}</td>
      <td>${film.country}</td>
      <td><button class="add-to-cart">+</button></td>
    `;
    const addButton = row.querySelector('.add-to-cart');
    addButton.addEventListener('click', () => dodajUKosaricu(film));
    tbody.appendChild(row);
  }
}

document.getElementById('resetiraj-filtere').addEventListener('click', () => {
  document.getElementById('filter-genre').value = '';
  document.getElementById('filter-year-from').value = '';
  document.getElementById('filter-year-to').value = '';
  document.getElementById('filter-country').value = '';
  document.getElementById('filter-rating-min').value = 0;
  document.getElementById('filter-rating-max').value = 10;

  document.getElementById('rating-min-value').textContent = '0';
  document.getElementById('rating-max-value').textContent = '10';

  prikaziPocetneFilmove(sviFilmovi);
});

let kosarica = [];

function loadKosarica() {
  const savedKosarica = sessionStorage.getItem('kosarica');
  if (savedKosarica) {
    kosarica = JSON.parse(savedKosarica); 
  }
}

window.addEventListener('load', loadKosarica);

function dodajUKosaricu(film) {
  console.log('Before adding:', kosarica);
  if (!kosarica.some(item => item.title === film.title)) {
    kosarica.push(film); 
    console.log('After adding:', kosarica);
    osvjeziKosaricu(); 
  } else {
    alert(`${film.title} je već u vašoj košarici.`); 
  }
}

function osvjeziKosaricu() {
  sessionStorage.setItem('kosarica', JSON.stringify(kosarica));
}

function ukloniIzKosarice(index) {
  kosarica.splice(index, 1);
  osvjeziKosaricu();
}

document.getElementById('view-cart').addEventListener('click', () => {
  window.location.href = 'cart.html';
});