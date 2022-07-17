var http = require('http');
const crypto = require('crypto');

//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
let method = 'POST'
var options = {
    host: 'localhost',
    port: '3000',
    recipient: 'nuts',
    sender: 'dees',
    method: method,
    intentions: 'SENDMESSAGE or CREATEUSER or GETMESSAGES'
};

callback = function (response) {
    var str = '';

    //another chunk of data has been received, so append it to `str`
    response.on('data', function (chunk) {
        str += chunk;
    });

    //the whole response has been received, so we just print it out here
    response.on('end', function () {
        console.log(JSON.parse(str).response);
    });
}

req = http.request(options, callback);
req.write('{"response":"deez"}');
req.end();