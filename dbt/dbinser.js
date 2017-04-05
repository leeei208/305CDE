var mongodb = require('mongodb');

var mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize: 10 });
var db = new mongodb.Db('user', mongodbServer);

/* open db */
db.open(function() {
    /* Select 'user' collection */
    db.collection('user', function(err, collection) {
        /* Insert a data */
        collection.insert({
            name: 'Fred Chien',
			password :'uccu',
            email: 'cfsghost@gmail.com'
           
            
        }, function(err, data) {
            if (data) {
                console.log('Successfully Insert');
            } else {
                console.log('Failed to Insert');
            }
        });

        /* Querying */

    });
});