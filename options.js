module.exports = {
  volumeOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "1.6", callback_data: "1600" },
          { text: "2.0", callback_data: "2000" },
        ],
      ],
    }),
  },

  backOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: "Оставить заявку",
            url: "https://t.me/yuristmir",
          },
        ],
        [{ text: "Посчитать еще", callback_data: "count" }],
      ],
    }),
  },

  startOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [[{ text: "Начать", callback_data: "start" }]],
    }),
  },

  typeOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "Бензин", callback_data: "fuel" },
          { text: "Дизель", callback_data: "disel" },
        ],
      ],
    }),
  },
};
