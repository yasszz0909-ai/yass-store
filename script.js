const NOMOR_WA = "6283134187322"; // GANTI NOMOR WHATSAPP ANDA DI SINI
let itemSelected = "";
let basePrice = 0;
let currentQty = 1;

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    const items = document.querySelectorAll('.nav-item');
    items.forEach(i => i.classList.remove('active'));
    if(pageId === 'homePage') items[0].classList.add('active');
    if(pageId === 'orderPage') items[1].classList.add('active');
    if(pageId === 'historyPage') { items[2].classList.add('active'); loadHistory(); }
    window.scrollTo(0,0);
}

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
    if(currentQty < 1) currentQty = 1;
    document.getElementById('qtyVal').innerText = currentQty;
    hitungTotal();
}

function hitungTotal() {
    const total = basePrice * currentQty;
    document.getElementById('displayTotal').innerText = "Rp " + total.toLocaleString('id-ID');
}

function kirimWA() {
    const roblox = document.getElementById('playerId').value;
    const method = document.getElementById('methodInput').value;
    if(!roblox || !method || !itemSelected) return alert("Harap isi Username dan pilih Metode Bayar!");

    const total = basePrice * currentQty;
    const orderID = "TRX-" + Math.floor(Math.random() * 100000);
    
    // Simpan Riwayat
    let history = JSON.parse(localStorage.getItem('fhistory')) || [];
    history.unshift({ id: orderID, item: itemSelected, qty: currentQty, total: total, date: new Date().toLocaleDateString('id-ID') });
    localStorage.setItem('fhistory', JSON.stringify(history));

    const pesan = `Halo Admin FishIt!%0A%0A` +
        `🆔 ID Order: ${orderID}%0A` +
        `👤 User Roblox: ${roblox}%0A` +
        `📦 Produk: ${itemSelected}%0A` +
        `🔢 Jumlah: ${currentQty}%0A` +
        `💰 Total Bayar: Rp ${total.toLocaleString('id-ID')}%0A` +
        `💳 Metode: ${method}%0A%0A` +
        `*Minta Nope/Qris Min. Saya akan segera mengirim bukti transfer.*`;
    
    window.open(`https://wa.me/${NOMOR_WA}?text=${pesan}`, '_blank');
}

function loadHistory() {
    const container = document.getElementById('listTransaksi');
    const history = JSON.parse(localStorage.getItem('fhistory')) || [];
    container.innerHTML = history.length ? history.map(trx => `
        <div class="history-card">
            <div style="font-size:0.6rem; opacity:0.5">${trx.date} | ${trx.id}</div>
            <strong>${trx.item} (x${trx.qty})</strong>
            <div style="color:#00d2ff">Rp ${trx.total.toLocaleString('id-ID')}</div>
        </div>
    `).join('') : "<p style='text-align:center'>Belum ada transaksi</p>";
}
