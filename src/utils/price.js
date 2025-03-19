export function formatPrice(value) {
    if(!value) return 0;
    let formatter = new Intl.NumberFormat('vi-Vi', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 2
    });
    return formatter.format(value).slice(0, -5);
}

export function formatUSDPrice(value) {
    if(!value) return 0;
    return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
