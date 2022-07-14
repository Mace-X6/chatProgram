const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/json'
        });
        if (req.url === "/") {
            res.write('{"response":"helo this is home"}');
            res.end();
        } else if (req.url === "/about") {
            res.write('{"response":"about page"}');
            res.end();
        } else {
            res.write('{"response":"page not found!"}');
            res.end();
        }
    }
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            console.log(body);
            res.end('{"response":"ok"}');
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

agent = new http.Agent();

agent.createConnection