function loadKosarica() {
  const savedKosarica = sessionStorage.getItem('kosarica');
  if (savedKosarica) {
    kosarica = JSON.parse(savedKosarica);
  }
}

function osvjeziKosaricu() {
  sessionStorage.setItem('kosarica', JSON.stringify(kosarica));
}

function ukloniIzKosarice(index) {
  kosarica.splice(index, 1);
  osvjeziKosaricu();
  renderKosarica(); 
}


function renderKosarica() {
  const cartList = document.getElementById('cart-list');
  cartList.innerHTML = '';
  kosarica.forEach((film, index) => {
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    const li = document.createElement('li');
    li.textContent = film.title;
    removeBtn.addEventListener('click', () => {
      ukloniIzKosarice(index);
    });
    li.appendChild(removeBtn);
    cartList.appendChild(li);
  });
}

document.getElementById('confirm-cart').addEventListener('click', () => {
  if (kosarica.length === 0) {
    alert('Vaša košarica je prazna!');
  } else {
    alert(`Uspješno ste dodali ${kosarica.length} filma u svoju košaricu za vikend maraton!`);
    kosarica = [];
    osvjeziKosaricu();
    renderKosarica();
  }
});

document.getElementById('back-to-home').addEventListener('click', () => {
  window.location.href = 'videoteka.html';
});

window.addEventListener('load', () => {
  loadKosarica();
  renderKosarica();
});