    //
    // // Bitfinex
    //
    //
    //
    // // WS
    // const WebSocket = require('ws');
    //
    // const ws = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
    //
    // ws.on('open', function open() {
    //     console.log('Connected to Bitfinex WebSocket');
    //
    //     // Подписка на все торгуемые пары
    //     // Для Bitfinex формат сообщения для подписки: { event: 'subscribe', channel: 'ticker', symbol: 'tBTCUSD' }
    //     // Вы можете добавить другие пары в массив или подписаться на 'ticker' для всех пар
    //     const symbols = ['tBTCUSD', 'tETHUSD']; // Пример для нескольких пар
    //     symbols.forEach(symbol => {
    //         ws.send(JSON.stringify({ event: 'subscribe', channel: 'ticker', symbol }));
    //     });
    // });
    //
    // ws.on('message', function incoming(data) {
    //     console.log(data); // Обработка и вывод данных
    // });
    //
    // ws.on('close', function close() {
    //     console.log('Disconnected from Bitfinex WebSocket');
    // });
    //
    // ws.on('error', function error(error) {
    //     console.error('WebSocket error:', error);
    // });
    // // В этом примере:
    // //
    // //     Устанавливается соединение с WebSocket сервером Bitfinex.
    // //     После открытия соединения отправляется сообщение для подписки на определенные торговые пары (в данном примере tBTCUSD и tETHUSD). Вы можете изменить массив symbols, чтобы добавить другие пары, которые вас интересуют.
    // //     При получении сообщения от сервера (новые данные тикера для подписанной пары) данные выводятся в консоль.
    // //     Обрабатываются события закрытия соединения и ошибки.
    // //     Обратите внимание, что для подписки на все торгуемые пары вам нужно будет получить их список от Bitfinex и добавить соответствующие символы в массив symbols или использовать другой метод, предусмотренный в API Bitfinex.
    //
    // // HTTP
    //
    //
