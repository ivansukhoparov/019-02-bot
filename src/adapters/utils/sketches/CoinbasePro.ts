// // Coinbase Pro
//
//
// // WS
//
// const WebSocket = require('ws');
//
// // URL WebSocket API Coinbase Pro
// const wsUrl = 'wss://ws-feed.pro.coinbase.com';
//
// const ws = new WebSocket(wsUrl);
//
// ws.on('open', function open() {
//     console.log('Connected to Coinbase Pro WebSocket');
//
//     // Формирование сообщения для подписки на все торгуемые пары
//     // Необходимо получить список всех торгуемых пар с API и добавить их в массив
//     const subscribeMessage = {
//         type: 'subscribe',
//         channels: [{name: 'ticker', product_ids: ['BTC-USD', 'ETH-USD']}]  // Пример: подписка на BTC-USD и ETH-USD
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
//     console.log('Disconnected from Coinbase Pro WebSocket');
// });
//
// ws.on('error', function error(error) {
//     console.error('WebSocket error:', error);
// });
// // В этом примере:
// //
// //     Устанавливается соединение с WebSocket сервером Coinbase Pro.
// //     После открытия соединения отправляется JSON-сообщение для подписки на выбранные торговые пары (BTC-USD и ETH-USD в данном примере). Вы можете изменить список product_ids, чтобы подписаться на другие интересующие вас пары.
// //     При получении сообщения от сервера (новые данные по подписанным парам) данные выводятся в консоль.
// //     Обрабатываются события закрытия соединения и ошибки.
// //     Чтобы подписаться на все доступные торговые пары, вам нужно будет получить их полный список с REST API Coinbase Pro и включить их в сообщение подписки.
// //
// // HTTP
