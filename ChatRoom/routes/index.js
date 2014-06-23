module.exports = function Route(app){
  app.get('/', function(req, res){
    res.render('index', {title:'Nathan\'s Chat Room'});
  });
  var convo = [];
  var counter = 0;
  //new user added!
  app.io.route('add_user',function(req){
  	req.session.name = req.data.user_name;
  	req.session.id = req.sessionID;
  	req.session.save(function(){
  		req.io.broadcast('new_user',{name:req.data.user_name});
  		req.io.emit('welcome',{name:req.data.user_name,msg:convo});	
  	});
  });
  //disconnected user
  app.io.route('disconnect',function(req){
  	req.io.broadcast('user_gone',{name:req.session.name});
  });
  //new message made
  app.io.route('new_message',function(req){
  	convo.push("<p><span id='name"+counter+"''>"+ req.session.name +" says: </span>"+ req.data.message +"</p>");
  	app.io.broadcast('view_message',{msg:convo[convo.length - 1],id:req.sessionID,count:counter});
  	counter += 1;

  });

  app.io.route('get_sess',function(req){
  	req.io.emit('sess',{id:req.sessionID});
  });

 //you will add more routes and logic here but this is how to write the default route for your project
}