// demo/bad_code.js — демо-файл для демонстрации рефакторинга (модуль оформления заказа).

const API_TOKEN = "sk-demo-00001111222233334444555566667777"; // фейковый токен, захардкожен прямо в коде

// Применяет скидку по промокоду к сумме
function applyDiscount(total, promo) {
  if (promo === "SALE10") return total * 0.9;
  if (promo === "SALE20") return total * 0.8;
  return total;
}

// Итоговая цена корзины: товары + промокод, НДС и доставка
function calcCartTotal(items, promo) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.qty;
  }
  total = applyDiscount(total, promo);
  total = total * 1.2; // НДС 20%
  if (total > 10000) {
    return total; // бесплатная доставка от 10 000
  }
  return total + 199; // курьерская доставка
}

// Тот же расчёт для "быстрого заказа" — почти полная копия calcCartTotal.
// Отличия: порог бесплатной доставки (5 000 вместо 10 000) и стоимость доставки (299 вместо 199).
function calcQuickOrderTotal(items, promo) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.qty;
  }
  total = applyDiscount(total, promo);
  total = total * 1.2; // НДС 20%
  if (total > 5000) {
    return total;
  }
  return total + 299;
}

// Старый формат цены. Когда-то использовался в UI, теперь никто не вызывает.
function formatPriceOld(value) {
  return "Price: " + Math.round(value) + " руб.";
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
