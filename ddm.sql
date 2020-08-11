/***SELECT QUERIES***/

/*From customers*/
SELECT customerID, firstName,lastName,phoneNumber, email FROM customers;
SELECT customerID, firstName,lastName,phoneNumber, email FROM customers;
SELECT customerID, firstName, lastName, phoneNumber, email FROM customers;
SELECT customerID FROM customers WHERE firstName=? and lastName=?;

/*Join M->M, joins dogs and customes*/
SELECT dogs.dogID, dogs.dogName, dogs.breed, dogs.age FROM dogs
	INNER JOIN owners ON dogs.dogID=owners.dogID
	INNER JOIN customers On owners.customerID=customers.customerID
	WHERE customers.customerID=?;

/*Join M->M, joins dogs and their stays and activities*/
SELECT activities.activityID,activitiesLookUp.activityName,activities.activityDate, activities.activityTime, activities.leadActivityCoordinator,activitiesLookUp.activityCost,
	stays.stayID,stays.overnight,stays.stayStart, stays.stayEnd, stays.duration, stays.stayCost 
	FROM activitiesLookUp
	INNER JOIN activities ON activitiesLookUp.activityLookUpID=activities.activityLookUpID
	INNER JOIN dogActivities ON activities.activityID=dogActivities.activityID
	LEFT JOIN dogs ON dogActivities.dogID=dogs.dogID
	LEFT JOIN stays ON dogs.dogID=stays.dogID
	WHERE dogs.dogID=?;

/*Join M->M, Joins customers, customersAddress with dogs*/
SELECT customersAddress.customerID, customersAddress.address, customersAddress.city, customersAddress.state, customersAddress.zipcode,dogs.dogName, dogs.breed, dogs.age 
	FROM customersAddress 
	INNER JOIN customers ON customersAddress.customerID=customers.customerID
	INNER JOIN owners ON customers.customerID=owners.customerID
	INNER JOIN dogs ON owners.dogID=dogs.dogID
	WHERE customersAddress.customerID=?;

/*Join 1->M, joinactivities and activitiesLookUp*/
SELECT activities.activityID, activities.activityDate,activities.activityTime, activities.leadActivityCoordinator 
	FROM activities 
	INNER JOIN activitiesLookUp ON activities.activityLookUpID=activitiesLookUp.activityLookUpID 
	AND activitiesLookUp.activityName=?;

/*Join 1->M, joinactivities and activitiesLookUp*/
SELECT activities.activityID, activities.activityDate,activities.activityTime, activities.leadActivityCoordinator 
	FROM activities 
	INNER JOIN activitiesLookUp ON activities.activityLookUpID=activitiesLookUp.activityLookUpID 
	AND activitiesLookUp.activityName=?;


SELECT activityLookUpID FROM activitiesLookUp WHERE activityName=?;
SELECT dogID FROM dogs WHERE dogName=? and age=? and breed=?;
SELECT activityName FROM activitiesLookUp;

/*INSERT QUERIES*/
INSERT INTO stays (dogID, overnight, duration, stayEnd, stayStart, stayCost) VALUES (?,?,?,?,?,?);
INSERT INTO customers (firstName, lastName, phoneNumber, email) VALUES (?,?,?,?);
INSERT INTO customersAddress (customerID, address, city, state, zipcode) VALUES (?,?,?,?,?);
INSERT INTO dogs (dogName, age, breed) VALUES (?,?,?);
INSERT INTO owners (customerID, dogID) VALUES ?;
INSERT INTO activities (activityLookUpID, activityDate,activityTime,leadActivityCoordinator) VALUES (?,?,?,?);
INSERT INTO dogActivities (dogID, activityID) VALUES(?,?);
INSERT INTO activitiesLookUp (activityName, activityCap, activityCost, location, activityDescription) VALUES (?,?,?,?,?);

/*Update Query*/
UPDATE activities SET activityDate=?, activityTime=?, leadActivityCoordinator=? WHERE activityID=?;

/*Delete Query for M:M*/
UPDATE dogActivities set activityID = NULL WHERE activityID=?;
DELETE FROM activities WHERE activityID=?;
