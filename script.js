const NOMOR_WA = "6283134187322"; // GANTI NOMOR KAMU DISINI
let itemSelected = "";
let basePrice = 0;
let currentQty = 1;

// Navigasi Halaman
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    const items = document.querySelectorAll('.nav-item');
    items.forEach(i => i.classList.remove('active'));
    if(pageId === 'homePage') items[0].classList.add('active');
    if(pageId === 'orderPage') items[1].classList.add('active');
    if(pageId === 'historyPage') {
        items[2].classList.add('active');
        loadHistory();
    }
}

// Logika Produk
function pilihProduk(nama, harga) {
    itemSelected = nama;
    basePrice = harga;
    currentQty = 1;
    document.getElementById('displayProduk').innerText = nama;
    document.getElementById('qtyVal').innerText = currentQty;
    hitungTotal();
    showPage('orderPage');
}

function changeQty(delta) {
    currentQty += delta;
    if(currentQty < 1) currentQty = 1; // Kunci minimal 1
    document.getElementById('qtyVal').innerText = currentQty;
    hitungTotal();
}

function hitungTotal() {
    const total = basePrice * currentQty;
    document.getElementById('displayTotal').innerText = "Rp " + total.toLocaleString('id-ID');
}

// Proses Beli
function kirimWA() {
    const roblox = document.getElementById('playerId').value;
    const method = document.getElementById('methodInput').value;
    
    if(!roblox) return alert("Harap isi Username Roblox Anda!");
    if(!method) return alert("Harap pilih metode pembayaran!");
    if(!itemSelected) return alert("Pilih produk di halaman Home!");

    const total = basePrice * currentQty;
    const orderID = "TRX-" + Math.floor(Math.random() * 100000);
    const date = new Date().toLocaleDateString('id-ID');

    // Simpan Ke Riwayat Lokal
    let history = JSON.parse(localStorage.getItem('fishit_history')) || [];
    history.unshift({ id: orderID, item: itemSelected, qty: currentQty, total: total, date: date });
    localStorage.setItem('fishit_history', JSON.stringify(history));

    // Format WA
    const pesan = `Halo Admin FishIt! 👋%0A%0A` +
        `SAYA INGIN BELI ITEM:%0A` +
        `---------------------------%0A` +
        `🆔 Order: ${orderID}%0A` +
        `👤 User Roblox: ${roblox}%0A` +
        `📦 Produk: ${itemSelected}%0A` +
        `🔢 Jumlah: ${currentQty}%0A` +
        `💰 Total: Rp ${total.toLocaleString('id-ID')}%0A` +
        `💳 Metode: ${method}%0A%0A` +
        `*Saya akan segera mengirimkan BUKTI TRANSFER setelah pesan ini.*`;

    window.open(`https://wa.me/${NOMOR_WA}?text=${pesan}`, '_blank');
}

function loadHistory() {
    const container = document.getElementById('listTransaksi');
    const history = JSON.parse(localStorage.getItem('fishit_history')) || [];
    if(history.length === 0) {
        container.innerHTML = "<p style='text-align:center; opacity:0.4; margin-top:20px;'>Belum ada riwayat transaksi.</p>";
        return;
    }
    container.innerHTML = history.map(trx => `
        <div class="history-card">
            <div style="display:flex; justify-content:space-between; font-size:0.65rem; color:#888;">
                <span>${trx.date}</span>
                <span>${trx.id}</span>
            </div>
            <div style="font-weight:bold; margin: 5px 0;">${trx.item} (x${trx.qty})</div>
            <div style="color:#00d2ff; font-weight:bold">Rp ${trx.total.toLocaleString('id-ID')}</div>
        </div>
    `).join('');
}
