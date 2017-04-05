      if (request.url == "/member.html") {
    	if (obj.action = "A1"){
        console.log("yooo");
        var fav1 = obj.favourite;
          db.open(function() {
          db.collection('user', function (err, collection) {
            collection.find().toArray(function(err, items) {
            for (var i=0; i<items.length; i++) {
              if (username == items[i].username) {
              collection.update({username: userN, password : passW, email : eM}, { $set: {
                                                  fav:[fav1,'a','null']
			  }
                                                function(err, result){
                                                  if(err) throw err;
                                                  console.log('Document Updated Successfully');
                                                  });
              collection.remove({id:user}, function(err, result) {

                  if(err) throw err;

                  console.log('Document Removed Successfully');
			  }
			  };
			  };
			};
			});
		  });
		  });
		}
	  }
		  
		  
			  
			  