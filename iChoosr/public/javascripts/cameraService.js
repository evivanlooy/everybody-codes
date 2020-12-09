function getColumns() {
    let cameras = [];

    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    let url = "http://localhost:3000" + "/cameras";
    xmlhttp.open("GET", url, false);
    xmlhttp.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200) {
            let data = xmlhttp.response.toString();
            let splittedData = data.split(/\r?\n/);

            splittedData.forEach(row => cameras.push(row.split(';')));

            cameras.splice(0, 1);

            sortAndFill(cameras);
            initMap(cameras);
        }
    }
    xmlhttp.send();
}

function sortAndFill(data) {
    let fizz = []; // 3
    let buzz = []; // 5
    let fizzbuzz = []; // 3 & 5
    let other = [] // other

    data.forEach( function (row) {
        if (row.length > 1) { // crash fix
            let number = row[0].split('-')[2].substring(0, 3);

            if (number % 15 === 0) {
                fizzbuzz.push(row);
            }
            else if (number % 3 === 0) {
                fizz.push(row);
            }
            else if (number % 5 === 0) {
                buzz.push(row);
            }
            else {
                other.push(row);
            }
        }
    });

    fillColumn(fizz, "column3");
    fillColumn(buzz, "column5")
    fillColumn(fizzbuzz, "column15")
    fillColumn(other, "columnOther")
}

function fillColumn(data, columnName) {
    let table = document.getElementById(columnName);
    let tbody = table.children[1];

    data.forEach( function (row) {
        let tr = tbody.insertRow();
        let number = tr.insertCell();
        number.innerText = row[0].split('-')[2].substring(0, 3);

        let name = tr.insertCell();
        name.innerText = row[0];

        let lat = tr.insertCell();
        lat.innerText = row[1];

        let long = tr.insertCell();
        long.innerText = row[2];
    })
}

function initMap(data) {
    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: { lat: 52.0907, lng: 5.1214 },
    });

    if(data) { // check undefined
        data.forEach(function (row) {
            if (row.length > 1) { // crash fix
                new google.maps.Marker({
                    position: {lat: parseFloat(row[1]), lng: parseFloat(row[2])},
                    map,
                    title: row[0],
                });
            }
        })
    }

}