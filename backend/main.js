const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

var data = JSON.parse(fs.readFileSync("data.json"));
var users = JSON.parse(fs.readFileSync("users.json"));

const server = http.createServer((req, res) => {
    // if (req.method === 'GET') {
    //     res.writeHead(200, {
    //         'Content-Type': 'text/json'
    //     });
    //     if (req.url === "/") {
    //         res.write('{"response":"helo this is home"}');
    //         res.end();
    //     } else if (req.url === "/about") {
    //         res.write('{"response":"about page"}');
    //         res.end();
    //     } else {
    //         res.write('{"response":"page not found!"}');
    //         res.end();
    //     }
    // }
    // if (req.method === 'POST') {
    //     let body = '';
    //     req.on('data', chunk => {
    //         body += chunk;
    //     });
    //     req.on('end', () => {
    //         console.log(body);
    //         res.end('{"response":"ok"}');
    //     });
    // }

    if (incReq.method === 'POST'){
        let body = '';
        incReq.on('data', chunk => {
            body += chunk;
        });
        incReq.on('end', () => {
            res.end('{"response":"ok"}');
        });
        var chatHis = findChat(incReq.recipient, incReq.sender, data).chatHistory;
        chatHis[0].push(body);
        chatHis[0][chatHis.length - 1];
        var recipient = findUser(incReq.recipient, users);
        
        let method = 'POST'
        var options = {
            host: recipient[0].host,
            port: recipient[0].port,
            sender: incReq.sender,
            method: method
        };
        
        req = http.request(options, callback);
        outReq.write(body);
        outReq.end();
        data[chatHis[1]] = chatHis[0];
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function findChat(user1, user2, data){
    for (var i = 0; i < data.length; i ++){
        if (data[i].users.includes(user1) && data[i].users.includes(user2)){
            return [data[i], i];
        } 
    }
    return false;
}

function findUser(userName, userArray){
    for (var i = 0; i < userArray.length; i ++){
        if (userArray[i].userName === userName){
            return [userArray[i], i];
        } 
    }
}


callback = function (response) {
    var str = '';

    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        var response = JSON.parse(str).response;
    });
}
