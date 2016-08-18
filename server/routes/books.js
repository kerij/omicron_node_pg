var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';

router.get('/', function(req, res) {
  //Retrieve books from database
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM books', function (err, result){
      done(); //closes connection

      if (err) {
        res.sendStatus(500);
      }

      res.send(result.rows);
    })
  });
});

router.post('/', function(req, res){
  var book = req.body;

  pg.connect(connectionString, function(err, client, done){
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO books(author, title, published, edition, publisher, genre)'
                + 'VALUES ($1, $2, $3, $4, $5, $6)',
                [book.author, book.title, book.published, book.edition, book.publisher, book.genre],
                function (err, result) {
                  done();

                  if (err) {
                    console.log(err);
                    res.sendStatus(500);
                  } else {res.sendStatus(201);
                  }


                });
  });
});

router.put('/:id', function(req, res){
  var id = req.params.id;
  var book = req.body;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('UPDATE books' +
                ' SET title = $1, ' +
                ' author = $2,' +
                ' published = $3,' +
                ' edition = $4,' +
                ' publisher = $5,' +
                ' genre = $6' +
                ' WHERE id = $7',
              [book.title, book.author, book.published, book.edition, book.publisher, book.genre, id],
            function (err, result){
              done();
              if (err) {
                console.log('err', err);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            });
  });
});

router.delete('/:id', function (req, res) {
  var id = req.params.id;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('DELETE FROM books ' +
                'WHERE id = $1',
                [id],
                function (error, result) {
                  done();

                  if (err) {
                    res.sendStatus(500);
                    return;
                  }

                  res.sendStatus(200);
                });
  });
});

router.get('/:genre', function (req, res) {
  var genre = req.params.genre
  console.log(genre);

  pg.connect (connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM books ' +
                'WHERE genre = $1', [genre],
                function (err, result) {
                  done();

                  if (err) {
                    res.sendStatus(500);
                  } else {
                    res.send(result.rows);
                  }
                });
  });
});

module.exports = router;
