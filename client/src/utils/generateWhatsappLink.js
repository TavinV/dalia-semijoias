function generateWhatsAppLink(products) {
    const phone = "5511950231230";

    let message = "🌸 *Dália Semijoias* 🌸%0A";
    message += "Olá, gostaria de fazer um pedido:%0A%0A";

    let total = 0;

    products.forEach((p, i) => {
        message += `💎 *Item ${i + 1}*%0A`;
        message += `🆔 ID: ${p.id}%0A`;
        message += `📦 Nome: ${p.name}%0A`;
        message += `🔢 Quantidade: ${p.qty}%0A`;
        message += `💰 Subtotal: R$ ${p.subtotal.toFixed(2)}%0A%0A`;
        total += p.subtotal;
    });

    message += `✨ *Total do Pedido: R$ ${total.toFixed(2)}* ✨%0A%0A`;
    message += "Obrigado por comprar com a *Dália Semijoias* 🌸💖";

    return `https://wa.me/${phone}?text=${message}`;
}

export default generateWhatsAppLink;
