let express = require('express');
let router = express.Router();

let fs = require('fs');

/* GET camera listing. */
router.get('/', function(req, res, next) {
  fs.readFile('data/cameras-defb.csv', 'utf8', function (error, data) {
    if (error) {
      return console.log(error);
    }
    res.send(data);
  });
});

module.exports = router;
