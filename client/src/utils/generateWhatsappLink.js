function generateWhatsAppLink(products) {
    const phone = "5511947034640";

    // Monta a mensagem com quebras de linha reais (\n) — NÃO usar "%0A" manualmente
    let message = "✨ *Dália Semijoias* ✨\n";
    message += "Olá, gostaria de fazer um pedido:\n\n";

    let total = 0;

    products.forEach((p, i) => {
        const subtotal = Number(p.subtotal) || 0;
        const qty = Number(p.qty) || 0;

        message += `✨ *Item ${i + 1}*\n`;
        message += `🆔 ID: ${p.id}\n`;
        message += `📦 Nome: ${p.name}\n`;
        message += `🔢 Quantidade: ${qty}\n`;
        message += `💰 Subtotal: R$ ${subtotal.toFixed(2)}\n\n`;

        total += subtotal;
    });

    message += `✨ *Total do Pedido: R$ ${total.toFixed(2)}* ✨\n\n`;
    message += "Obrigado por comprar com a *Dália Semijoias* ✨💖";

    // Só aqui codificamos a mensagem para a URL
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encoded}`;
}

export default generateWhatsAppLink;
