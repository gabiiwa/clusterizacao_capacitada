fs = require('fs');
fs.readFile('instancias/Sparse82/Sparse82_01.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});