const TelegramApi = require("node-telegram-bot-api");
const fs = require("fs");
const token = "6645864492:AAEUpLS9D9TT9hKEGIG3-4q3oju0LHCxfu0";
const {
  volumeOptions,
  backOptions,
  startOptions,
  typeOptions,
} = require("./options");
const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "Начать" },
  { command: "/count", description: "Посчитать стоимость автомобиля" },
]);
let isActiveCount = false;

let data = {
  price: null,
  volume: null,
  year: null,
  type: null,
};

const start = () => {
  const imageBuffer = fs.readFileSync("./assets/flag.gif");

  bot.addListener("message", async (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from;
    const message = msg.text;

    if (message === "/start") {
      await bot.sendAnimation(chatId, imageBuffer);

      return bot.sendMessage(
        chatId,
        `Добро пожаловать <b>${
          user.first_name || user.username
        }</b>\nПредлагаем посчитать стоимость выбранного автомобиля из Кореи.`,
        {
          ...startOptions,
          parse_mode: "HTML",
        }
      );
    }

    const cycle = async () => {
      if (!isActiveCount) {
        isActiveCount = true;
        await bot.sendMessage(chatId, "Укажите цену авто в KRW(воны)");
        return;
      } else if (data.price === null) {
        if (Number(message) / 1) {
          data["price"] = message;

          return bot.sendMessage(
            chatId,
            "Укажите объем двигателя.",
            volumeOptions
          );
        } else {
          await bot.sendMessage(
            chatId,
            "Неверный формат цены авто, укажите повторно."
          );
        }

        return;
      } else if (
        data.price !== null &&
        data.volume !== null &&
        data.year === null
      ) {
        if (Number(message) / 1 && message.length === 4) {
          data["year"] = message;

          return bot.sendMessage(chatId, "Укажите тип двигателя.", typeOptions);
        } else {
          await bot.sendMessage(
            chatId,
            "Неверный формат года выпуска авто, укажите повторно. (пример: 2020)"
          );
        }

        return;
      }
    };

    if (message === "/count") {
      isActiveCount = false;
      data = {
        price: null,
        volume: null,
        year: null,
        type: null,
      };

      cycle();
      return;
    }
    if (message !== "/count" && isActiveCount) {
      cycle();
      return;
    }

    return bot.sendMessage(chatId, "Я тебя не понимаю, давай еще раз ");
  });

  bot.on("callback_query", async (msg) => {
    const cycle = async () => {
      if (!isActiveCount) {
        isActiveCount = true;
        await bot.sendMessage(chatUid, "Укажите цену авто в KRW(воны)");
        return;
      } else if (data.price === null) {
        if (Number(message) / 1) {
          data["price"] = message;

          return bot.sendMessage(
            chatUid,
            "Укажите объем двигателя.",
            volumeOptions
          );
        } else {
          await bot.sendMessage(
            chatUid,
            "Неверный формат цены авто, укажите повторно."
          );
        }

        return;
      } else if (
        data.price !== null &&
        data.volume !== null &&
        data.year === null
      ) {
        if (Number(message) / 1 && message.length === 4) {
          data["year"] = message;

          return bot.sendMessage(
            chatUid,
            "Укажите тип двигателя.",
            typeOptions
          );
        } else {
          await bot.sendMessage(
            chatUid,
            "Неверный формат года выпуска авто, укажите повторно. (пример: 2020)"
          );
        }

        return;
      }
    };

    const chatUid = msg.message.chat.id;

    // -- Обьем двигателя
    if (msg.data === "2000" || msg.data === "1600") {
      data["volume"] = msg.data;
      return bot.sendMessage(chatUid, "Укажите год выпуска авто.");
    }

    // -- Тип двигателя

    if (msg.data === "fuel" || msg.data === "disel") {
      const euroPrice = 100;
      const wonPrice = 0.069;

      const constantPrice = {
        docs: Math.round(1800000 * wonPrice),
        stoyanka: Math.round(440000 * wonPrice),
        osmotr: Math.round(300000 * wonPrice),
        price: Math.round(data["price"] * wonPrice),
        poshlina: Math.round(data["volume"] * euroPrice),
        register: 15000,
        broker: 20000,
        svx: 45000,
        lab: 20000,
        konosament: 2000,
        expert: 300,
        peregon: 3000,
      };
      const resultPrice = Object.values(constantPrice).reduce((a, b) => a + b);
      data["type"] = msg.data;

      const resultMessage = `Фрахт. Документы. Перегон авто до порта <b>${constantPrice.docs} рублей</b>\nСтояночные по факту <b>${constantPrice.stoyanka} рублей</b>\nОсмотр, транспортные расходы <b>${constantPrice.osmotr} рублей</b>\nВременная регистрация  <b>${constantPrice.register} рублей</b>\nБрокер  <b>${constantPrice.broker} рублей</b>\nСВХ (склад временного хранения) <b>${constantPrice.svx} рублей</b>\nЛаборатория  <b>${constantPrice.lab} рублей</b>\nКоносамент <b>${constantPrice.konosament} рублей</b>\nЭкспертиза  <b>${constantPrice.expert} рублей</b>\nПерегон из СВХ/Лаборатория/Стоянка  <b>${constantPrice.peregon} рублей</b>\nЦена Автомобиля <b>${constantPrice.price} рублей</b>\nТаможенная пошлина + утилизационный сбор: <b>${constantPrice.poshlina} рублей</b>\n\n\nИтоговая стоимость: <b>${resultPrice} рублей</b>`;
      return bot.sendMessage(chatUid, resultMessage, {
        ...backOptions,
        parse_mode: "HTML",
      });
    }

    // -- Реинициализировать цикл

    if (msg.data === "count") {
      isActiveCount = false;
      data = {
        price: null,
        volume: null,
        year: null,
        type: null,
      };

      cycle();
      return;
    }

    if (msg.data === "start") {
      cycle();
      return;
    }

    if (msg.data === "request") {
    }
  });
};

start();
