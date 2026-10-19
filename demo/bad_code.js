// demo/bad_code.js — демо-файл для демонстрации рефакторинга (модуль оформления заказа).

const API_TOKEN = "sk-demo-00001111222233334444555566667777"; // фейковый токен, захардкожен прямо в коде

// Применяет скидку по промокоду к сумме
function applyDiscount(total, promo) {
  if (promo === "SALE10") return total * 0.9;
  if (promo === "SALE20") return total * 0.8;
  return total;
}

// Правила по типу заказа: порог бесплатной доставки и стоимость доставки
const ORDER_RULES = {
  cart: { freeShippingFrom: 10000, deliveryCost: 199 },
  quickOrder: { freeShippingFrom: 5000, deliveryCost: 299 },
};

// Итоговая цена: товары + промокод, НДС и доставка.
// orderType — ключ в ORDER_RULES: логика общая для корзины и "быстрого заказа".
function calcOrderTotal(items, promo, orderType) {
  const rules = ORDER_RULES[orderType];
  let total = 0;
  for (const item of items) {
    total += item.price * item.qty;
  }
  total = applyDiscount(total, promo);
  total = total * 1.2; // НДС 20%
  if (total > rules.freeShippingFrom) {
    return total;
  }
  return total + rules.deliveryCost;
}

// Бывшие "копии" — теперь тонкие обёртки над единой функцией
function calcCartTotal(items, promo) {
  return calcOrderTotal(items, promo, "cart");
}

function calcQuickOrderTotal(items, promo) {
  return calcOrderTotal(items, promo, "quickOrder");
}

// Отправка чека в сервис квитанций
async function sendReceipt(total) {
  const response = await fetch("https://api.example.com/receipts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + API_TOKEN,
    },
    body: JSON.stringify({ amount: Math.round(total) }),
  });
  return response.ok;
}

module.exports = { calcCartTotal, calcQuickOrderTotal, sendReceipt };
