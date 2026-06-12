const Exportacao = {
    exportarExcel() {
        if(window.db.aparelhos.length === 0) return alert("Não há dados para exportar.");
        const dadosExportacao = window.db.aparelhos.map(ap => ({
            "ID do Aparelho": ap.id, "País": ap.pais, "Número": ap.numero, "Business Manager": ap.bm,
            "Página": ap.pagina, "Oferta": ap.oferta, "Status": ap.status.toUpperCase(),
            "Tags": ap.tags ? ap.tags.join(', ') : '', "Observações": ap.obs || '',
            "Criado em": ap.dataCriacao || '', "Última Alteração": ap.ultimaAlteracao || ''
        }));
        const worksheet = XLSX.utils.json_to_sheet(dadosExportacao);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ativos Operacionais");
        XLSX.writeFile(workbook, `Operacoes_SaaS_${new Date().toISOString().slice(0,10)}.xlsx`);
        Historico.registrar('Exportação', 'Sistema', 'Base de dados exportada para XLSX.');
    }
};
