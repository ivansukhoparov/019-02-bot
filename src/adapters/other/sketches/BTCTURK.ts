//
// // BTCTURK
//
// // WS
// const WebSocket = require('ws');
//
// // Замените этот URL на актуальный WebSocket URL, предоставленный BTCTurk
// const wsUrl = 'wss://api.btcturk.com/websocket'; // Пример, проверьте документацию API для точного URL
//
// // Создаем новый экземпляр WebSocket
// const ws = new WebSocket(wsUrl);
//
// ws.on('open', function open() {
//     console.log('Connected to BTCTurk WebSocket');
//
//     // Отправьте сообщение для подписки на интересующие вас каналы или пары
//     // Пример: ws.send(JSON.stringify({ event: 'subscribe', ... }));
// });
//
// ws.on('message', function incoming(data) {
//     console.log(data); // Обрабатывайте получаемые данные
// });
//
// ws.on('close', function close() {
//     console.log('Disconnected from BTCTurk WebSocket');
// });
//
// ws.on('error', function error(error) {
//     console.error('WebSocket error:', error);
// });
//
// // HTTP
//
// const fetch = require('node-fetch');
//
// async function getAllTradableAssetsOnBTCTurk() {
//     const url = "https://api.btcturk.com/api/v2/ticker"; // Проверьте актуальный URL в документации BTCTurk API
//
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`Error! status: ${response.status}`);
//         }
//
//         const data = await response.json();
//         return data.data;  // В зависимости от структуры ответа, возможно потребуется изменить этот путь
//     } catch (error) {
//         console.error('Ошибка при запросе к BTCTurk API:', error);
//         return null;
//     }
// }
//
// // Вызываем функцию и выводим результат
// getAllTradableAssetsOnBTCTurk().then(data => {
//     if (data) {
//         console.log('Торгуемые монеты на BTCTurk:', data);
//     }
// });
