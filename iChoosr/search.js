let fs = require('fs');

let args = process.argv.slice(2); // skipping first 2 arguments

if (args.length !== 2) {
    console.log("You didn't enter a command and a search criteria");
} else {

    switch (args[0]) {
        case "--name":
            let name = args[1];
            getData(name);
            break;
        default:
            console.log("Sorry this command does not exist");
    }
}

function getData(name) {
    fs.readFile('data/cameras-defb.csv', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }
        let splittedData = data.split(/\r?\n/);

        let cameras = [];

        splittedData.forEach(row => cameras.push(row.split(';')));

        find(cameras, name);
    });
}

function getDataViaServer(name) {
    let http = require('http');

    let options = {
        hostname: "localhost",
        port: 3000,
        path: "/cameras",
        method: "GET"
    }

    let req = http.request(options, res => {
        res.on('data', d => {
            d = d.toString();
            let splittedData = d.split(/\r?\n/);

            let cameras = [];

            splittedData.forEach(row => cameras.push(row.split(';')));

            find(cameras, name);
        })
    })

    req.on('error', error => {
        console.error(error);
    })

    req.end();
}

function find(data, name) {
    data.splice(0, 1);

    let found = [];
    data.forEach( function (row) {
        if (row[0].includes(name)) {
            found.push(row);
        }});

    if (found.length === 0) {
        console.log("Nothing found!");
    } else {
        found.forEach(function (row) {
            if (row.length > 1) { // crash fix
                let number = row[0].split('-')[2].substring(0, 3);
                console.log(number + " | " + row[0] + " | " + row[1] + " | " + row[2]);
            }
        })
    }
}