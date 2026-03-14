function generateWhatsAppLink(products) {
    const phone = "5511947034640";

    let message = "Olá! ✨️\n";
    message += "Gostaria de fazer um pedido:\n\n";

    let total = 0;

    products.forEach((p) => {
        const subtotal = Number(p.subtotal) || 0;
        const qty = Number(p.qty) || 0;
        const itemName = p.name.toLowerCase();

        message += `${itemName} = ${subtotal.toFixed(2).replace('.', ',')}`;
        
        if (qty > 1) {
            message += ` (${qty}x)`;
        }
        
        message += "\n";
        total += subtotal;
    });

    message += `\nTotal = ${total.toFixed(2).replace('.', ',')}`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encoded}`;
}

export default generateWhatsAppLink;