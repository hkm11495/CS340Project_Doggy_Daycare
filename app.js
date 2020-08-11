const express = require('express');
const app = express();
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
const CORS=require('cors');
var port = process.argv[2];
var path = require('path');
var async=require('async');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(CORS());
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('mysql', mysql);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
//app.use('new_customer', require('./new_customer.js'));
//returns the activity name and activity cost from activitiesLookUp table



app.get('/',function(req,res,next){
    
	res.render('home')
});

app.get('/newCustomer', function(req, res){
	res.render('newCustomer');
});

app.get('/bill', function(req, res)
{
    mysql.pool.query("SELECT customerID, firstName,lastName,phoneNumber, email FROM customers", function (error, results) 
	{
		if(error)
		{
			console.log(error);
			res.end();
		}else
		{
			console.log(results);
			res.render('bill',{data:results});
		}
	});
	
});

//load dog information page
app.get('/dogInfo', function(req, res)
{
    mysql.pool.query("SELECT customerID, firstName,lastName,phoneNumber, email FROM customers", function (error, results) 
	{
		if(error)
		{
			console.log(error);
			res.end();
		}else
		{
			console.log(results);
			res.render('dogInfo',{data:results});
		}
	});
	
});



//render activities schedule page, prepopulate dropdowns.
app.get('/activitySchedule', function(req, res)
{
    var inserts=[req.body.dogID, req.body.overnight, req.body.duration, req.body.stayEnd, req.body.stayStart, req.body.stayCost];
	mysql.pool.query("SELECT activityName FROM activitiesLookUp", function (error, results) 
	{
		if(error)
		{
			console.log(error);
			res.end();
		}else
		{
			
			res.render('activitySchedule',{data:results});
		}
	});
});

//dog sign up page opens, prepopulate data in the page.
app.get('/dogSignUp', function(req, res){
    console.log('INSIDE dogSignUp Get');
	async.parallel([
		//get activities cost
        function(callback)
		{
            mysql.pool.query("SELECT activityName, activityCost, activityCap,location, activityDescription FROM activitiesLookUp", function (error, result1) {
                callback(error,result1);
            });
        },
		//get distinct dog names to populate dog drop down.
        function(callback)
		{
            mysql.pool.query("SELECT customerID, firstName, lastName, phoneNumber, email FROM customers ", function (error, result2) {
                callback(error,result2);
            });
        }
        ],
		function(err,results)
		{
            if(err)
			{
                res.render('500');
            }else
			{
				console.log(results);
                return res.render('dogSignUp',{data:results}); //both result1 and result2 will be in results
            }
        })
});

//get customer address and dogs
app.post('/getDogs', function(req,res)
{
	var q=`SELECT dogs.dogID, dogs.dogName, dogs.breed, dogs.age FROM dogs
	INNER JOIN owners ON dogs.dogID=owners.dogID
	INNER JOIN customers On owners.customerID=customers.customerID
	WHERE customers.customerID=?` 
	mysql.pool.query(q,[req.body.customerID] ,function (error, result) 
	{
		if(error)
		{
			console.log(error);
			res.end();
		}else
		{
			res.json({rows:result});
		}
	});
});

//gets a dogs stays and activities that they are signed up god
app.post('/getStaysActivities', function(req,res)
{
	console.log('getting stays and activities');
	console.log(req.body);
	var q=`SELECT activities.activityID,activitiesLookUp.activityName,activities.activityDate, activities.activityTime, activities.leadActivityCoordinator,activitiesLookUp.activityCost,
		stays.stayID,stays.overnight,stays.stayStart, stays.stayEnd, stays.duration, stays.stayCost FROM activitiesLookUp
		INNER JOIN activities ON activitiesLookUp.activityLookUpID=activities.activityLookUpID
		INNER JOIN dogActivities ON activities.activityID=dogActivities.activityID
		LEFT JOIN dogs ON dogActivities.dogID=dogs.dogID
		LEFT JOIN stays ON dogs.dogID=stays.dogID
		WHERE dogs.dogID=?`
	mysql.pool.query(q,[req.body.dogID] ,function (error, result) 
	{
		if(error)
		{
			console.log(error);
			res.end();
		}else
		{
			res.json({rows:result});
		}
	});
	
});

//get customer address and dogs
app.post('/getCustomerAddress', function(req,res)
{
	var q=`SELECT customersAddress.customerID, customersAddress.address, customersAddress.city, customersAddress.state, customersAddress.zipcode,dogs.dogName, dogs.breed, dogs.age FROM customersAddress 
	INNER JOIN customers ON customersAddress.customerID=customers.customerID
	INNER JOIN owners ON customers.customerID=owners.customerID
	INNER JOIN dogs ON owners.dogID=dogs.dogID
	WHERE customersAddress.customerID=?`
	mysql.pool.query(q,[req.body.customerID] ,function (error, result) 
	{
		if(error)
		{
			console.log(error);
			res.end();
		}else
		{
			res.json({rows:result});
		}
	});
});

/*
//recieves dogID, returns the database information which has that ID.
app.post('/dogSignUp', function(req, res){
	console.log('INSIDE dogSignUp Post');
    async.parallel([
		function(callback)
		{
            mysql.pool.query("SELECT dogID, dogName, breed, age FROM dogs WHERE dogName=?",[req.body.dogName] ,function (error, result6) {
				callback(error,result6);
            });
        }
        ],
		function(err,content)
		{
            if(err)
			{
                res.render('500');
            }else
			{
				console.log(content);
				return  res.json({rows:content}); //both result1, result2, and result 3 will be in results
            }
        })
});
*/

//delete activity from database based on ID
app.post('/deleteActivity',function(req, res)
{
	"UPDATE dogActivities set activityID = NULL WHERE activityID=?"
	mysql.pool.query("UPDATE dogActivities set activityID = NULL WHERE activityID=?", [req.body.activityID], function(error, results)
	{
		if(error)
		{
			console.log(error);
			res.end();
		}
		else
		{
			//set activityID values to NUll in dogActivities since they can no longer participate
			mysql.pool.query("DELETE FROM activities WHERE activityID=?", [req.body.activityID], function(error, results)
			{
				if(error)
				{
					console.log(error);
					res.end();
				}
				else
				{
					return  res.send('databases successfully updated'); //both result1, result2, and result 3 will be in results
				}
			});
		}
	});
});


//enroll dog in activity in activity sign up
app.post('/enrollInActivity', function(req,res)
{
	var query="INSERT INTO dogActivities (dogID, activityID) VALUES(?,?)"
	console.log(req.body)
	mysql.pool.query(query,[req.body.dogID, req.body.activityID] ,function(error,result)
	{
		if(error)
		{
			console.log(error);
			res.end();
		}
		else
		{
			
			console.log('dog enrolled')
			res.redirect('dogSignUp');
		}
	});
});


//add new activity to activities look up table
app.post('/newActivityLookUp', function(req, res)
{
	var query="INSERT INTO activitiesLookUp (activityName, activityCap, activityCost, location, activityDescription) VALUES (?,?,?,?,?)";
	var inserts=[req.body.activityName,req.body.activityCap,req.body.activityCost, req.body.location, req.body.activityDescription];
	mysql.pool.query(query,inserts ,function(error,result)
	{
		if(error)
		{
			console.log(error);
			res.end();
		}
		else
		{
			res.redirect('activitySchedule');
		}
	});
});

//returns activityLookUpID given name
function getActivityLookUpID(name,callback) 
{
	mysql.pool.query("SELECT activityLookUpID FROM activitiesLookUp WHERE activityName=?", [name], (err, result)=>
	{
		if(err)
		{
			callback(err);
		}
		else
		{
			callback(null, result[0].activityLookUpID)
		}
	});
}

//add new activity to activities look up table
app.post('/submitNewActivity', function(req, res)
{
	getActivityLookUpID(req.body.activityName, function(err, data)
	{
		if (err)
		{
			console.log(err);
			res.end();
		}
		else
		{
			var inserts=[data, req.body.activityDate, req.body.activityTime,req.body.leadActivityCoordinator];
			mysql.pool.query("INSERT INTO activities (activityLookUpID, activityDate,activityTime,leadActivityCoordinator) VALUES (?,?,?,?)", inserts, (err, result)=>
			{
				if(err)
				{
					callback(err);
				}
				else
				{
					res.redirect('activitySchedule');
				}
			});
		}
	});
});

//populate activities table in dogSignUp page
app.post('/getActivities', function(req,res)
{
	var query="SELECT activities.activityID, activities.activityDate,activities.activityTime, activities.leadActivityCoordinator FROM activities INNER JOIN activitiesLookUp ON activities.activityLookUpID=activitiesLookUp.activityLookUpID AND activitiesLookUp.activityName=?";
	mysql.pool.query(query,[req.body.activityName] ,function(error,result)
	{
		if(error)
		{
			console.log(error);
			res.end();
		}
		else
		{
			return  res.json({rows:result});
		}
	});
});

//populate activities table in activities Schedule page
app.post('/getTableData', function(req,res)
{
	var query="SELECT activities.activityID, activities.activityDate,activities.activityTime, activities.leadActivityCoordinator FROM activities INNER JOIN activitiesLookUp ON activities.activityLookUpID=activitiesLookUp.activityLookUpID AND activitiesLookUp.activityName=?";
	mysql.pool.query(query,[req.body.activityName] ,function(error,result)
	{
		if(error)
		{
			console.log(error);
			res.end();
		}
		else
		{
			return  res.json({rows:result});
		}
	});
});

//update activities table enroll
app.post('/updateTable', function(req,res)
{
	var query="UPDATE activities SET activityDate=?, activityTime=?, leadActivityCoordinator=? WHERE activityID=?";
	mysql.pool.query(query,[req.body.activityDate, req.body.activityTime, req.body.leadActivityCoordinator, req.body.activityID] ,function(error,result)
	{
		if(error)
		{
			console.log(error);
			res.end();
		}
		else
		{
			console.log('request was successful, activities updated.');
			res.send('update complete');
		}
	});
})

//recieves dogID, returns the database information which has that ID.
app.post('/submitStay', function(req, res)
{
	var inserts=[req.body.dogID, req.body.overnight, req.body.duration, req.body.stayEnd, req.body.stayStart, req.body.stayCost];
	mysql.pool.query("INSERT INTO stays (dogID, overnight, duration, stayEnd, stayStart, stayCost) VALUES (?,?,?,?,?,?)",inserts,function (error, results) 
	{
		if(error)
		{
			console.log(error);
			res.end();
		}else
		{
			console.log(results);
			res.redirect('dogSignUp');
		}
	});
});


//get customerID
function getCustomerID(fName, lName, callback) 
{
		mysql.pool.query("SELECT customerID FROM customers WHERE firstName=? and lastName=?", [fName, lName], (err, result)=>
			{
				if(err)
				{
					callback(err);
				}
				else
				{
					callback(null, result[0].customerID)
				}
		});
}

//returns dogID 
function getdogID(name, age, breed ,callback) 
{
		mysql.pool.query("SELECT dogID FROM dogs WHERE dogName=? and age=? and breed=?", [name, age, breed], (err, result)=>
			{
				if(err)
				{
					callback(err);
				}
				else
				{
					callback(null, result[0].dogID)
				}
		});
}

//POST request the inserts data into customers and customersAddress databases
app.post('/newCustomer', function(req, res){
	var mysql = req.app.get('mysql');
	var custID='';
	console.log("inside post")
	var sqlInsert = "INSERT INTO customers (firstName, lastName, phoneNumber, email) VALUES (?,?,?,?)";
	var inserts1 = [req.body.firstName, req.body.lastName, req.body.phoneNumber, req.body.email];
	var sqlInsert2 ="INSERT INTO customersAddress (customerID, address, city, state, zipcode) VALUES (?,?,?,?,?)"
	var sql1 = mysql.pool.query(sqlInsert,inserts1,function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}else{
			//Get the customer ID of the user just submitted
			getCustomerID(req.body.firstName, req.body.lastName, function(err, data)
			{
				if (err)
				{
					console.log(err);
					res.end();
				}
				else
				{
					custID=data;
					var inserts2 = [custID, req.body.address, req.body.city, req.body.state, req.body.zipcode];
					//insert customer Address
					var sql2 = mysql.pool.query(sqlInsert2,inserts2,function(error, results, fields){
						if(error)
						{
							res.write(JSON.stringify(error));
							res.end();
						}
						else
						{
							res.json(custID);
						}
					});
				}
			});
		}
	});
});



//POST request the inserts data into dogs
app.post('/newDog', function(req, res){
	var mysql = req.app.get('mysql');
	var custID='';
	console.log("inside post dogs")
	var sqlInsert = "INSERT INTO dogs (dogName, age, breed) VALUES (?,?,?)";
	var inserts1 = [req.body.dogName, req.body.age, req.body.breed];
	var sql1 = mysql.pool.query(sqlInsert,inserts1,function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}else{
			//Get the customer ID of the user just submitted
			getdogID(req.body.dogName, req.body.age, req.body.breed, function(err, data)
			{
				if (err)
				{
					console.log(err);
					res.end();
				}
				else
				{
					dogID=data;
					res.json(dogID);
				}
			});
		}
	});
});

//combine insert for owners table 
app.post('/owners', function(req, res){
	var mysql = req.app.get('mysql');
	var array=[]
	var data=req.body;
	for (var i=0; i < data.length; i++)
	{
		console.log(data[i]);
		array.push([data[i].customerID, data[i].dogID]);
	}
	console.log(array);
	var sqlInsert="INSERT INTO owners (customerID, dogID) VALUES ?";
	
	var sql1 = mysql.pool.query(sqlInsert,[array],function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}else
		{
			res.redirect('newCustomer');
		}
	});
});



app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))