var http = require("http");
var fs = require("fs");
var qs = require("querystring");
var mongodb = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
require("events").EventEmitter.prototype._maxListeners = 100;

var mongodbServer = new mongodb.Server("localhost", 27017, { auto_reconnect: true, poolSize: 10 });
var db = new mongodb.Db('user', mongodbServer);
var userstatus =false;
var loginStatus = false;
var reigsterstatus = true;
var userN = "", passW="",eMa="", far1 = "", far2 ="", far3="";
var fav1status= false ,fav2status=false, fav3status=false;


var server = http.createServer(function(request, response) {
    if (request.method == "POST") {
		// Switch msg into a JSON object
        var formData = "", msg = "", obj = "";
        return request.on("data", function(data) {
			formData += data;
			return request.on("end", function() {
				var user;
				user = qs.parse(formData);
				msg = JSON.stringify(user);
				response.writeHead(200, {
				  "Content-Type": "application/json",
				  "Content-Length": msg.length
				});
				obj = JSON.parse(msg);
				// Prevent index page runs this part
        if (request.url == "/reigster.html") {
				var username = obj.username;
				var password = obj.password;
				var email = obj.email;

				db.open(function() {
					db.collection('user', function(err, collection) {

							collection.insert({
								username : username,
								password : password,
								email: email,
								fav: [fav1,fav2,fav3]
								}, function(err, data) {
									if (data) {
											console.log('Successfully Insert');
										} else {
											console.log('Failed to Insert');
										}
										});

						});
						return response.end();
					});
				}

        if (request.url == "/login.html" && password != "") {

					// Handle data received from login page
					var username = obj.username;
					var password = obj.password;
          var email = obj.email;
          var fav = obj.fav;
					// Get data from database
					MongoClient.connect("mongodb://localhost:27017/user", function (err, db) {
						db.collection("user", function (err, collection) {
							collection.find().toArray(function(err, items) {
								if (items != null) {
									// Check whether the user username exists
									for (var i=0; i<items.length; i++) {
										if (username == items[i].username ) {
											loginStatus = true;
											userN = items[i].username;
											passW = items[i].password;
											eMa = items[i].email;
                      fav1 = items[i].fav[0];
                      fav2 = items[i].fav[1];
                      fav3 = items[i].fav[2];
										}else{
											console.log("Login fail");
										userstatus = true;
									}
								}}
							});
						});
					});
				}

				if(request.url== "/logout.html") {
					if(obj.action =="logout") {
						loginStatus = false;
					}
				}



    if (request.url == "/member.html") {
		var uName = obj.userN;
    var favo = obj.fav;
    var action = obj.action;

    if(obj.action == "addFav1" && fav1status == false) {
                    MongoClient.connect("mongodb://localhost:27017/user", function (err, db) {
                    db.collection("user", function (err, collection) {

    								collection.update({"username" : uName}, { $set:{"fav.0":favo}}, function(err, result){
    									if(data){
                        fav1status = true;
                        console.log('Document Updated Successfully');
                      }else {
                        console.log('Failed to Updated');
                      }
    								});
    							});
    						});
    					}



    if(obj.action == "addFav2" && fav2status == false) {
                MongoClient.connect("mongodb://localhost:27017/user", function (err, db) {
                db.collection("user", function (err, collection) {
              	collection.update({"username" : uName}, { $set:{"fav.1":favo}}, function(err, result){

                  if(data){
                    console.log('Document Updated Successfully');
                    fav2status = true;
                  }else {
                    console.log('Failed to Updated');
                  }
              			});
              		});
              	});
              }


        if(obj.action == "addFav3" && fav3status == false) {
                    MongoClient.connect("mongodb://localhost:27017/user", function (err, db) {
                    db.collection("user", function (err, collection) {
                    collection.update({"username" : uName}, { $set:{"fav.2":favo}}, function(err, result){
                        if(data){
                          console.log('Document Updated Successfully');
                          fav3status = true;
                        }else {
                          console.log('Failed to Updated');
                        }
                        	});
                      	});
                      });
                    }


          if(obj.action == "remove1" && fav1status == true) {
                MongoClient.connect("mongodb://localhost:27017/user", function (err, db) {
                db.collection("user", function (err, collection) {
                collection.update({"username" : uName}, { $set:{"fav.0":null}}, function(err, result){
                  if(data){
                    console.log('Document remove Successfully');
                    fav1status = false;
                  }else {
                    console.log('Failed to remove');
                  }
                });
                });
                });
                }

                if(obj.action == "remove2" && fav2status == true) {
                    MongoClient.connect("mongodb://localhost:27017/user", function (err, db) {
                    db.collection("user", function (err, collection) {
                    collection.update({"username" : uName}, { $set:{"fav.1":null}}, function(err, result){
                      if(data){
                      console.log('Document remove Successfully');
                        fav2status = false;
                      }else {
                      console.log('Failed to remove');
                      }
                  });
                  });
                  });
                  }

                  if(obj.action == "remove3" && fav3status == true) {
                      MongoClient.connect("mongodb://localhost:27017/user", function (err, db) {
                      db.collection("user", function (err, collection) {
                      collection.update({"username" : uName}, { $set:{"fav.2":null}}, function(err, result){
                        if(data){
                        console.log('Document remove Successfully');
                          fav3status = false;
                        }else {
                        console.log('Failed to remove');
                        }
                    });
                    });
                    });
                    }

  }//close reigster.html


				});
				});
    } else {
		// Get
		fs.readFile("./" + request.url, function (err, data) {
			var dotoffset = request.url.lastIndexOf(".");
			var mimetype = dotoffset == -1
				? "text/plain"
				: {
					".html": "text/html",
					".ico" : "image/x-icon",
					".jpg" : "image/jpeg",
					".png" : "image/png",
					".gif" : "image/gif",
					".css" : "text/css",
					".js"  : "text/javascript"
				}[request.url.substr(dotoffset)];
			if (!err) {
				response.setHeader("Content-Type", mimetype);
				response.end(data);
				console.log(request.url, mimetype);
			} else {
				response.writeHead(302, {"Location": "http://localhost:9000/index.html"});
				response.end();
			}
		});
    }
});

server.listen(9000);

console.log("Server running at http://127.0.0.1:9000/");

// IO is used to send message between server an client
var io = require("socket.io").listen(server);
var userN = userN;
var fav1 = fav1;
var fav2 = fav2;
var fav3 = fav3;

function update() {
	if (loginStatus == true) {
		// Send message if login is successful
    io.emit("login_success",{ username: userN, password: passW, email: eMa, fav1: fav1 ,fav2:fav2, fav3:fav3});

    MongoClient.connect("mongodb://localhost:27017/user", function (err, db) {

      db.collection("user", function (err, collection) {

        collection.find().toArray(function(err, items) {

            for (var i=0; i<items.length; i++) {
              if (userN == items[i].username ) {
                userN = items[i].username;
                fav1 = items[i].fav[0];
                fav2 = items[i].fav[1];
                fav3 = items[i].fav[2];
              }
          }
        });
      });
    });

  } else {
		if (userstatus == true) {

			io.emit("login_fail", { message: "fail" });
			userstatus = false;
		}
		else{
		io.emit("logout",{message: "logout"});
		}
	}

}


setInterval(update, 1000); // 1000 = 1 second
