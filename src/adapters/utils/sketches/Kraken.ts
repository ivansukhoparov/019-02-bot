    //
    // // Kraken
    //
    // // WS
    // const WebSocket = require('ws');
    //
    // // URL WebSocket API Kraken
    // const wsUrl = 'wss://ws.kraken.com';
    //
    // const ws = new WebSocket(wsUrl);
    //
    // ws.on('open', function open() {
    //     console.log('Connected to Kraken WebSocket');
    //
    //     // Подписка на все торгуемые пары
    //     // Для Kraken нужно отправить сообщение с типом подписки и именами пар
    //     // Примечание: получите полный список пар с REST API Kraken для подписки на все пары
    //     const subscribeMessage = {
    //         event: 'subscribe',
    //         pair: ['XBT/USD', 'ETH/USD'], // Пример пар, замените на нужные или получите полный список через REST API
    //         subscription: {
    //             name: 'ticker'
    //         }
    //     };
    //
    //     ws.send(JSON.stringify(subscribeMessage));
    // });
    //
    // ws.on('message', function incoming(data) {
    //     console.log('Received data:', data);
    // });
    //
    // ws.on('close', function close() {
    //     console.log('Disconnected from Kraken WebSocket');
    // });
    //
    // ws.on('error', function error(error) {
    //     console.error('WebSocket error:', error);
    // });
    // // Этот код выполняет следующие действия:
    // //
    // //     Устанавливается соединение с WebSocket сервером Kraken.
    // //     После открытия соединения отправляется сообщение для подписки на выбранные торговые пары (XBT/USD и ETH/USD в данном примере). Вы можете изменить массив pair, чтобы включить другие интересующие вас пары.
    // //     При получении сообщения от сервера (новые данные по подписанным парам) данные выводятся в консоль.
    // //     Обрабатываются события закрытия соединения и ошибки.
    // //     Чтобы подписаться на все доступные торговые пары, вам нужно будет получить их полный список с REST API Kraken и включить их в сообщение подписки.
    // //
    // //
    // //
    // // HTTP
    //
    //
    // const fetch = require('node-fetch');
    //
    // async function getAllTradableAssetsOnKraken() {
    //     const url = "https://api.kraken.com/0/public/AssetPairs"; // URL для получения всех торговых пар
    //
    //     try {
    //         const response = await fetch(url);
    //         if (!response.ok) {
    //             throw new Error(`Error! Status: ${response.status}`);
    //         }
    //
    //         const data = await response.json();
    //         return data.result; // Информация о торговых парах находится в ключе "result"
    //     } catch (error) {
    //         console.error('Ошибка при запросе к Kraken API:', error);
    //         return null;
    //     }
    // }
    //
    // // Вызываем функцию и выводим результат
    // getAllTradableAssetsOnKraken().then(data => {
    //     if (data) {
    //         console.log('Торгуемые пары на Kraken:', data);
    //     }
    // });
    // // Этот код отправляет запрос к конечной точке REST API Kraken, которая предоставляет информацию о всех торговых парах. Ответ затем обрабатывается и выводится в консоль.
    // //
    // //     Обратите внимание, что URL и структура ответа могут изменяться, поэтому рекомендуется проверить последнюю документацию Kraken API для получения актуальной информации.
    // //
    // //
