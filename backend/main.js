const http = require('http');
const fs = require('fs');
const crypto = require('crypto');

const hostname = '127.0.0.1';
const port = 3000;

const sha256 = crypto.createHash('sha256');

var data = JSON.parse(fs.readFileSync("data.json"));
var users = JSON.parse(fs.readFileSync("users.json"));

const server = http.createServer((incReq, res) => {

    if (incReq.method === 'GET' && intentions === 'GETMESSAGES') {

        sha256.update(incReq.token);
        var user = findUser(incReq.sender, users);

        if (sha256.digest('hex') === user[0].publicToken) { // the user will have the original token, send the token hashed twice and the server has the token stored hashed 2 times.
            res.writeHead(200, {
                'Content-Type': 'text/json'
            });
            for (var i = 0; i < incReq.fetchChats.length; i++) {
                var chatWith = incReq.fetchChats[i].chatWith;
                var chat = findChat(chatWith, incReq.sender, data)
                res.write(JSON.stringify(chat.filter(element => element > incReq.fetchChats[i].afterStamp)));
            }
        }
        else {
            res.writeHead(401);
        }
        res.end();

        // client must provide the following for this request:
        // token
        // sender
        // fetchChats [{afterStamp, chatWith}]
        // intentions
    }

    if (incReq.method === 'POST' && incReq.intentions === 'CREATEUSER') {

        var userNameUnused = true;
        for (var i = 0; i < users.length; i++) {
            if (users[i].userName === incReq.userName) {
                userNameUnused = false;
            }
        }

        if (userNameUnused && userName.length <= 16) {
            var user = {
                "userName": incReq.userName,
                "host": incReq.host,
                "port": incReq.port,
                "publicToken": incReq.publicToken
            }
            users.push(user);
            fs.writeFileSync('./users.json', JSON.stringify(users));
            res.end('{"response":"ok, user created"}');
        }

        else{
            res.end('{"response":"invalid username"}')
        }

        // client must provide the following for this request:
        // token
        // host
        // port
        // publicToken
        // intentions
        // userName
    }

    if (incReq.method === 'POST' && incReq.intentions === 'SENDMESSAGE') {
        let body = '';
        incReq.on('data', chunk => {
            body += chunk;
        });
        incReq.on('end', () => {
            res.end('{"response":"ok"}');
        });

        var chatHis = findChat(incReq.recipient, incReq.sender, data).chatHistory;
        body = JSON.parse(body)
        body.stamp = chatHis[0][chatHis.length - 1].stamp + 1;
        data[chatHis[1]] = chatHis[0].chatHistory.push(body);

        fs.writeFileSync('./data.json', JSON.stringify(data));
        
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

        // client must provide the following for this request:
        // host
        // port
        // sender
        // recipient
        // intentions
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function findChat(user1, user2, data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].users.includes(user1) && data[i].users.includes(user2)) {
            return [data[i], i];
        }
    }
    return false;
}

function findUser(userName, userArray) {
    for (var i = 0; i < userArray.length; i++) {
        if (userArray[i].userName === userName) {
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
