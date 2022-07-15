const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

var data = JSON.parse(fs.readFileSync("data.json"));

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

    if (req.method === 'POST'){
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            res.end('{"response":"ok"}');
        });
        findChat(req.recipient, req.sender).chatHistory.push(body);
        // track down recipient and send the new chat to them
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function findChat(user1, user2, data){
    for (var i = 0; i < data.length; i ++){
        if (data[i].users.includes(user1) && data[i].users.includes(user2)){
            return data[i];
        } 
    }
    return false;
}