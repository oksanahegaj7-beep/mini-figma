// demo/bad_code.js — демо-файл для демонстрации рефакторинга (модуль оформления заказа).

// Промежуточные множители скидки по промокодам: SALE10 -10%, SALE20 -20%
const PROMO_MULTIPLIER = {
  SALE10: 0.9,
  SALE20: 0.8,
};

// НДС: 20% к цене
const VAT_MULTIPLIER = 1.2;

// Токен сервиса квитанций. Не хранится в коде — приходит из окружения (см. .env.example).
const API_TOKEN = process.env.RECEIPT_API_TOKEN;

// Применяет скидку по промокоду к сумме
function applyDiscount(total, promo) {
  const multiplier = PROMO_MULTIPLIER[promo];
  return multiplier === undefined ? total : total * multiplier;
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
  total = total * VAT_MULTIPLIER;
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
