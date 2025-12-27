// Paste konfigurasi dari Firebase tadi di sini
const firebaseConfig = {
  apiKey: "AIzaSyDYxvr8BSkomWhCryoX0EMBBZ8F0StKcck",
  authDomain: "yass-37d12.firebaseapp.com",
  projectId: "yass-37d12",
  storageBucket: "yass-37d12.firebasestorage.app",
  messagingSenderId: "993699961486",
  appId: "1:993699961486:web:af36b1e2a7885ed796c7df",
  measurementId: "G-LS6RGLRCYP"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 1. Fungsi untuk memulai Login (Metode Redirect)
function loginGoogle(event) {
    if (event) event.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Menggunakan Redirect agar tidak diblokir browser HP
    auth.signInWithRedirect(provider);
}

// Letakkan ini di script.js setelah inisialisasi Firebase
auth.getRedirectResult().then((result) => {
    if (result && result.user) {
        // Login Berhasil
        const user = result.user;
        alert("Selamat datang, " + user.displayName);
        
        // Update tampilan agar loading berhenti
        document.getElementById('loginBtn').innerHTML = `<img src="${user.photoURL}" style="width:30px; border-radius:50%;">`;
    }
}).catch((error) => {
    console.error("Gagal Login:", error.message);
    // Jika error, pastikan loading tidak stuck
});

}

const products = [
    { cat: 'robux', name: '1 Robux', price: 170, img: 'robux.png', desc: 'Dikirim melalui sistem gamepass. Robux Masuk Setelah 5-7 Hari!' },
    { cat: 'robux', name: '100 Robux', price: 18000, img: 'robux.png', desc: 'Dikirim melalui sistem gamepass. Robux Masuk Setelah 5-7 Hari!' },
    { cat: 'robux', name: '500 Robux', price: 87000, img: 'robux.png', desc: 'Dikirim melalui sistem gamepass. Robux Masuk Setelah 5-7 Hari!' },
    { cat: 'robux', name: '1000 Robux', price: 150000, img: 'robux.png', desc: 'Dikirim melalui sistem gamepass. Robux Masuk Setelah 5-7 Hari!' },
    { cat: 'fish', name: 'El Shark Gran Maja', price: 15000, img: 'maja.png', desc: 'Stok Sangat Terbatas! Pengiriman via trade in-game.' },
    { cat: 'fish', name: 'Frostborn Shark', price: 5000, img: 'frostborn.png', desc: 'Stok terbatas, Pengiriman via trade in-game.' },
    { cat: 'fish', name: 'Giant Squid', price: 5000, img: 'giant_squid.png', desc: 'Pengiriman via trade in-game.' },
    { cat: 'fish', name: 'Great Whale', price: 6500, img: 'great_whale.png', desc: 'Pengiriman via trade in-game.' },
    { cat: 'fish', name: 'Enchant Stone 10x', price: 1100, img: 'stone.png', desc: 'Batu Enchant 10 pcs.' }, 
    { cat: 'fish', name: 'Coin 1M', price: 5000, img: 'coin.png', desc: '1m Coin Fish It! Via Gift ikan Mythic!' }, 
    { cat: 'fish', name: 'Joki Afk 1 jam', price: 1000, img: 'time.png', desc: 'Jasa AFK selama 1 jam.' }, 
    { cat: 'robux', name: 'Akun VC (Email Bisa ganti)', price: 45000, img: 'person.png', desc: 'Akun Roblox sudah Voice Chat (VC). Email Bisa Di Ganti. ' }
];

let currentProduct = {};
let currentQty = 1;

const darkModeBtn = document.getElementById('darkModeBtn');
darkModeBtn.onclick = () => {
    document.body.classList.toggle('dark-mode');
    const icon = darkModeBtn.querySelector('i');
    if(document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
};

if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    darkModeBtn.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

function renderProducts(filter = 'all') {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    products.forEach((p) => {
        if (filter === 'all' || p.cat === filter) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="icon"><img src="${p.img}" onerror="this.src='https://via.placeholder.com/60'"></div>
                <h3>${p.name}</h3>
                <p class="price">Rp ${p.price.toLocaleString('id-ID')}</p>
            `;
            card.onclick = () => bukaCheckout(p);
            grid.appendChild(card);
        }
    });
}

function filterCat(cat, element) {
    document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    renderProducts(cat);
}

function bukaCheckout(p) {
    currentProduct = p;
    currentQty = 1;
    document.getElementById('checkoutName').innerText = p.name;
    document.getElementById('checkoutPriceLabel').innerText = "Rp " + p.price.toLocaleString('id-ID');
    document.getElementById('unitPrice').innerText = "Rp " + p.price.toLocaleString('id-ID');
    document.getElementById('checkoutImg').src = p.img;
    document.getElementById('productDesc').innerText = p.desc;
    document.getElementById('checkoutQty').innerText = currentQty;
    updateTotal();
    document.getElementById('checkoutPage').style.display = "flex";
}

function updateQty(delta) {
    if (currentQty + delta >= 1) {
        currentQty += delta;
        document.getElementById('checkoutQty').innerText = currentQty;
        updateTotal();
    }
}

function updateTotal() {
    const total = currentProduct.price * currentQty;
    document.getElementById('checkoutTotal').innerText = "Rp " + total.toLocaleString('id-ID');
}

function tutupCheckout() {
    document.getElementById('checkoutPage').style.display = "none";
}

function prosesKeWhatsApp() {
    const wa = "6283898578903";
    const user = document.getElementById('checkoutUser').value;
    const payment = document.getElementById('paymentMethod').value;
    const total = document.getElementById('checkoutTotal').innerText;
    
    if (!user) return alert("Harap isi Username Anda!");

    const pesan = `*⚡ PESANAN BARU - YASS STORE ⚡*
------------------------------------------
📝 *Detail Produk:*
> *Item:* ${currentProduct.name}
> *Jumlah:* ${currentQty}x
> *Harga Satuan:* Rp ${currentProduct.price.toLocaleString('id-ID')}

👤 *Informasi Pembeli:*
> *Username:* ${user}
> *Metode:* ${payment}

💵 *Total Pembayaran:*
*${total}*
------------------------------------------
_Mohon segera diproses ya Min, terima kasih!_`;

    window.open(`https://api.whatsapp.com/send?phone=${wa}&text=${encodeURIComponent(pesan)}`, "_blank");
}


window.onload = () => {
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        renderProducts();
    }, 1200);
};

document.getElementById('searchInput').addEventListener('keyup', function() {
    let k = this.value.toLowerCase();
    document.querySelectorAll('.card').forEach(c => {
        c.style.display = c.innerText.toLowerCase().includes(k) ? "block" : "none";
    });
});





