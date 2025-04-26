let sviFilmovi = [];
fetch('filmovi.csv') 
  .then(res => res.text())
  .then(csv => {
    const rezultat = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true
    });
    sviFilmovi = rezultat.data.map(film => ({
      title: film.title,
      year: Number(film.year),
      genres: film.genres,
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
  for(const film of filmovi) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${film.title}</td>
      <td>${film.year}</td>
      <td>${film.genres}</td>
      <td>${film.duration}</td>
      <td>${film.rating}</td>
      <td>${film.directors}</td>
      <td>${film.country}</td>
    `;
    tbody.appendChild(row);
  }
}
const rangeInput = document.getElementById('filter-rating');
const ratingDisplay = document.getElementById('rating-value');
  rangeInput.addEventListener('input', () => {
  ratingDisplay.textContent = rangeInput.value;
});
function filtriraj() {
  const zanr = document.getElementById('filter-genre').value;
  const godinaOd = parseInt(document.getElementById('filter-year-from').value);
  const drzava = document.getElementById('filter-country').value;
  const ocjena = parseFloat(document.getElementById('filter-rating').value);
  const filtriraniFilmovi = sviFilmovi.filter(film => {
    const zadovoljavaZanr = zanr ? film.genres.includes(zanr) : true;
    const zadovoljavaGodina = godinaOd ? film.year >= godinaOd : true;
    const zadovoljavaDrzava = drzava ? film.country === drzava : true;
    const zadovoljavaOcjenu = film.rating >= ocjena;
    return zadovoljavaZanr && zadovoljavaGodina && zadovoljavaDrzava && zadovoljavaOcjenu;
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
      <td><button class="add-to-cart">Dodaj</button></td>
    `;
    const addButton = row.querySelector('.add-to-cart');
    addButton.addEventListener('click', () => dodajUKosaricu(film));
    tbody.appendChild(row);
  }
}

let kosarica = [];

function dodajUKosaricu(film) {
  if (!kosarica.includes(film)) {
    kosarica.push(film);
    osvjeziKosaricu();
  } else
    alert(`${film.title} je već u vašoj košarici.`);
}

function osvjeziKosaricu() {
  const lista = document.getElementById('lista-kosarice');
  lista.innerHTML = '';
  kosarica.forEach((film, index) => {
    const li = document.createElement('li');
    li.textContent=film.title;
    const ukloniBtn = document.createElement('button');
    ukloniBtn.textContent = 'Ukloni';
    ukloniBtn.addEventListener('click', () => {
      ukloniIzKosarice(index);
    });
    li.appendChild(ukloniBtn);
    lista.appendChild(li);
  });
}

function ukloniIzKosarice(index) {
  kosarica.splice(index, 1);
  osvjeziKosaricu();
}

document.getElementById('potvrdi-kosaricu').addEventListener('click', () => {
  if (kosarica.length==0) {
    alert('Košarica je prazna.');
  }
  else {
    alert('Uspjesno ste potvrdili svoju košaricu. Broj filmova za maraton: ' + kosarica.length);
    kosarica = [];
    osvjeziKosaricu();
  }
})