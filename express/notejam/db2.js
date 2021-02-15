var mysql = require('mysql');
var async = require('async');

var settings = require('./settings');
var db = mysql.createConnection({
  host     : 'notejamdb2.cak73srtsjdz.eu-central-1.rds.amazonaws.com',
  user     : '***',
  password : '***',
  database : 'notejamdb',
  port     : 3306
});


var functions = {
  createTables: function(next) {
    async.series([
      function createUsers(callback) {
        /*db.connect(function(err) {
          if (err) {
            console.error('Database connection failed: ' + err.stack);
            return;
          }*/
            db.query("CREATE TABLE IF NOT EXISTS users (" +
            "id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL," +
            "email VARCHAR(75) NOT NULL," +
            "password VARCHAR(128) NOT NULL);",
            function(err, result) { console.log(err); console.log(result); callback(null); });
            
            //db.end();
        //})
      },
      function createPads(callback) {
        /*db.connect(function(err) {
          if (err) {
            console.error('Database connection failed: ' + err.stack);
            return;
          }*/
          db.query("CREATE TABLE IF NOT EXISTS pads (" +
              "id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL," +
              "name VARCHAR(100) NOT NULL," +
              "user_id INTEGER NOT NULL REFERENCES users(id));",
              function(err, result) { console.log(err); console.log(result); callback(null); })
              //db.end();
        //});
      },
      function createNotes(callback) {
        /*db.connect(function(err) {
          if (err) {
            console.error('Database connection failed: ' + err.stack);
            return;
          }*/
        db.query("CREATE TABLE IF NOT EXISTS notes (" +
            "id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL," +
            "pad_id INTEGER REFERENCES pads(id)," +
            "user_id INTEGER NOT NULL REFERENCES users(id)," +
            "name VARCHAR(100) NOT NULL," +
            "text text NOT NULL," +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
            "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);",
            function(err, result) { console.log(err); console.log(result); callback(null); });
            //db.end();
        //});
      }
    ],
    function(err, results) {
      //db.end();
      console.log(results)
      next();
    });
  },

  applyFixtures: function(next) {
    this.truncateTables(function() {
      async.series([
        function(callback) {
          db.connect(function(err) {
            if (err) {
              console.error('Database connection failed: ' + err.stack);
              return;
            }
          db.query("INSERT INTO users VALUES (1, 'user1@example.com', " +
                 "'$2a$10$mhkqpUvPPs.zoRSTiGAEKODOJMljkOY96zludIIw.Pop1UvQCTx8u')", [],
                function() { callback(null) });
                db.end();
        });
        },
        function(callback) {
          db.connect(function(err) {
            if (err) {
              console.error('Database connection failed: ' + err.stack);
              return;
            }
          db.query("INSERT INTO users VALUES (2, 'user2@example.com', " +
                 "'$2a$10$mhkqpUvPPs.zoRSTiGAEKODOJMljkOY96zludIIw.Pop1UvQCTx8u')", [],
                function() { callback(null) });
                db.end();
              });
        },
        function(callback) {
          db.connect(function(err) {
            if (err) {
              console.error('Database connection failed: ' + err.stack);
              return;
            }
          db.query("INSERT INTO pads VALUES (1, 'Pad 1', 1)", [],
                function() { callback(null) });
                db.end();
              });
        },
        function(callback) {
          db.connect(function(err) {
            if (err) {
              console.error('Database connection failed: ' + err.stack);
              return;
            }
          db.query("INSERT INTO pads VALUES (2, 'Pad 2', 1)", [],
                function() { callback(null) });
                db.end();
              });
        },
        function(callback) {
          db.connect(function(err) {
            if (err) {
              console.error('Database connection failed: ' + err.stack);
              return;
            }
          db.query("INSERT INTO notes VALUES (1, 1, 1, 'Note 1', 'Text', 1, 1)", [],
                function() { callback(null) });
                db.end();
              });
        },
        function(callback) {
          db.connect(function(err) {
            if (err) {
              console.error('Database connection failed: ' + err.stack);
              return;
            }
          db.query("INSERT INTO notes VALUES (2, 1, 1, 'Note 2', 'Text', 1, 1)", [],
                function() { callback(null) });
                db.end();
              });
        }
      ], function(err, results) {
        next();
      })
    });
  },

  truncateTables: function(next) {
    async.series([
      function(callback) {
        db.connect(function(err) {
          if (err) {
            console.error('Database connection failed: ' + err.stack);
            return;
          }
        db.query("DELETE FROM users;", [],
              function() { callback(null) });
              db.end();
              });
      },
      function(callback) {
        db.connect(function(err) {
          if (err) {
            console.error('Database connection failed: ' + err.stack);
            return;
          }
        db.query("DELETE FROM notes;", [],
              function() { callback(null) });
              db.end();
            });
      },
      function(callback) {
        db.connect(function(err) {
          if (err) {
            console.error('Database connection failed: ' + err.stack);
            return;
          }
        db.query("DELETE FROM pads;", [],
              function(result) { callback(null); });
              db.end();
            });
      }
    ], function(err, results) {
      next();
    })
  }
}


if (require.main === module) {

  functions.createTables(function() {
    db.end();
    console.log("DB successfully initialized");
  });
}

module.exports = functions;
