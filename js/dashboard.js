const Dashboard = {
    atualizar() {
        const ap = window.db.aparelhos;
        document.getElementById('dash-total').innerText = ap.length;
        document.getElementById('dash-operando').innerText = ap.filter(a => a.status === 'operando').length;
        document.getElementById('dash-aquecendo').innerText = ap.filter(a => a.status === 'aquecendo').length;
        document.getElementById('dash-banida').innerText = ap.filter(a => a.status === 'banida').length;
    }
};
