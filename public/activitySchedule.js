const baseURL1='http://flip3.engr.oregonstate.edu:5223/getTableData';
const baseURL2='http://flip3.engr.oregonstate.edu:5223/updateTable';
const baseURL3='http://flip3.engr.oregonstate.edu:5223/deleteActivity';
const change_event= new Event('change');
//const baseURL2='http://flip3.engr.oregonstate.edu:5223/enrollInActivity';
//const baseURL3='http://flip3.engr.oregonstate.edu:5223/getActivities';
//const dd2=document.getElementById('dropDown2');
//const idInputs=document.getElementsByName('dogID');
//document.addEventListener('DOMContentLoaded', getSelected("dogName", "dogName", baseURL,createDropDown));
document.addEventListener('DOMContentLoaded', getSelected("dropDown1", "activityName",baseURL1 , createTable));
//document.addEventListener('DOMContentLoaded', makeHidden);
//const submitButDogIDs=document.getElementById('submitDogID');

//when a change is made in a dropdown bar, send an ajax request to retrieve the data of the newly selected item
function getSelected(selectID, objectKey,url ,callback)
{
	document.getElementById(selectID).addEventListener('change',(event)=>
	{
		var request = new XMLHttpRequest();
		var val=document.getElementById(selectID.toString()).value;
		var context={};
		context[objectKey]=val;
		request.open("POST", url, true);
		request.setRequestHeader('Content-Type', 'application/json');
		request.addEventListener('load',function()
		{
			if(request.status >= 200 && request.status < 400)
			{
				if (selectID=="dropDown1")
				{
					deleteTable();
				}
				var response = JSON.parse(request.responseText);
				callback(response.rows);
			} 
			else 
			{
			  console.log(request.status);
			}
		});
		console.log(JSON.stringify(context));
		request.send(JSON.stringify(context));
		event.preventDefault;
	});
}



function createTable(rows)
{
	//var formInner=document.createElement("Form");
	var table = document.createElement("TABLE");
	//array for the type of each input
	//document.body.appendChild(formInner);
	table.setAttribute("id", "table1");
	document.getElementById("tableDiv").appendChild(table);
	document.getElementById("table1").style.border="thin solid #0000FF";
	if (rows.length==0)
	{
		return;
	}	
	createHeader();
	var key=Object.keys(rows[0]);
	for (var p in rows)
	{
		var row=document.createElement("TR");
		table.appendChild(row);

		var item=rows[p];
		row.setAttribute("id",p);
	
		//Add Cells for Data
		for (var i=0;i<4;i++)
		{
			var cell=createCells(p,item[key[i]]);
			//hide id column
			if (i==0)
			{
				cell.style.display='none';
			}
			row.appendChild(cell);
		}
		
		//Add Buttons
		var cell=createCells(p,"");
		row.appendChild(cell);
		var updateBut=createUpdateButton(p);
		var doneBut=createDoneButton(p);
		cell.appendChild(updateBut);
		cell.appendChild(doneBut);
		
		
		var cell=createCells(p,"");
		row.appendChild(cell);
		var deleteBut=createDeleteButton(p);
		cell.appendChild(deleteBut);
		//var cell=createCells(p,"");
		//row.appendChild(cell);
		//var addBut=createAddButton(p);
		//cell.appendChild(addBut);
	}
	setUpButtons();
	setDoneButtons();
	setDeleteButtons();
}

/*
add text input to table, comment out if not necessary
*/


function createHeader()
{
			//add header
		var hrow=document.createElement("TR");
		document.getElementById('table1').appendChild(hrow);
		var hcell=createCells('header',"ID");
		hcell.style.display="none";
		hrow.appendChild(hcell);
		hcell=createCells('header',"Activity Date");
		hrow.appendChild(hcell);
		hcell=createCells('header',"Activity Time");
		hrow.appendChild(hcell);
		hcell=createCells('header',"Activity Coordinator");
		hrow.appendChild(hcell);
		hrow.style.fontWeight="bold";
}





//Deletes Table
function deleteTable()
{	console.log("deleting table");
	if (document.getElementById('table1')!= 'undefined' && document.getElementById('table1') != null )
	{
		var allRows=document.getElementById('table1').children;
		for(var p in allRows)
		{
			var cells=allRows[p].children;
			//remove text
			for (var k in cells)
			{
				cells[k].textContent='';
			}
			while (allRows[p].firstChild) 
			{
				allRows[p].removeChild(allRows[p].lastChild);
			}
		}
		var tbl= document.getElementById('table1');
		while (tbl.firstChild) 
		{
			tbl.removeChild(tbl.lastChild);
		}
			tbl.parentNode.removeChild(tbl);
	}
	else
	{
		console.log("table not found");
		return;
	}
	
}


function createCells(inputID,itemText)
{
	var cellT=document.createElement("TD");
	var celltext=document.createElement("LABEL");
	celltext.innerHTML=itemText;
	cellT.appendChild(celltext);
	cellT.style.border="thin solid #0000FF";
	
	return cellT;
}



function createDeleteButton(inputID)
{
	var newSubmit=document.createElement("button");
	newSubmit.setAttribute('id', inputID);
	newSubmit.innerHTML='Delete';
	newSubmit.setAttribute("name", "delete");
	return newSubmit;
};


function createUpdateButton(inputID)
{
	var newSubmit=document.createElement("button");
	newSubmit.setAttribute("id", inputID);
	newSubmit.setAttribute("name", "update");
	newSubmit.innerHTML='Edit';
	return newSubmit;
};

function createDoneButton(inputID)
{
	var newSubmit=document.createElement("button");
	newSubmit.setAttribute("id", inputID);
	newSubmit.setAttribute("name", "done");
	newSubmit.innerHTML='Done';
	newSubmit.style.display="none";
	return newSubmit;
};


function createAddButton(inputID)
{
	var newSubmit=document.createElement("button");
	newSubmit.setAttribute("id", inputID);
	newSubmit.setAttribute("name", "add");
	newSubmit.innerHTML='Enroll';
	return newSubmit;
};


//assigns onclick function for update buttons
function setUpButtons()
{	
	const upButtons = document.querySelectorAll('button[name="update"]');
	upButtons.forEach(
	function(currentBtn)
	{
		currentBtn.addEventListener('click', function(event)
		{
			event.preventDefault();
			var tableRow=(this.parentElement.parentElement);
			var cells=tableRow.children;
			//Edit Button Is Clicked

				var inputTypes=["number", "date", "time", "text"];
				currentBtn.style.display="none";
				currentBtn.parentNode.childNodes[2].style.display="block";
				console.log(currentBtn.parentNode.children);
				//-2 to keep buttons visible
				console.log(cells);
				for (var i=0; i< cells.length-2; i++)
				{
					var cellInput=document.createElement("INPUT");
					cellInput.setAttribute("type", inputTypes[i]);
					cellInput.value=cells[i].textContent;
					cells[i].appendChild(cellInput);
					//cells[i].textContent="";
					cells[i].childNodes[0].innerHTML="";
				}
		},false);
	});
};

function setDoneButtons()
{	
	const doneButtons = document.querySelectorAll('button[name="done"]');
	doneButtons.forEach(function(currentBtn)
	{
		currentBtn.addEventListener('click', function(event)
		{
			event.preventDefault();
			//var tableRow=(this.parentElement.parentElement);
			//var cells=tableRow.children;
			//currentBtn.style.display="block";
			reload_update(this.parentElement.parentElement,(this.parentElement.parentElement).children);
		},false);
	});
}

function reload_update(tableRow,cells, Btn)
{
	var data={};
	var keys= ["activityID", "activityDate", "activityTime", "leadActivityCoordinator"]
	for (var i=0; i< cells.length-2; i++)
	{
		data[keys[i]]=cells[i].childNodes[1].value;
			
	}
	var request = new XMLHttpRequest();
	request.open("POST", baseURL2, true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.addEventListener('load',function()
	{
		if(request.status >= 200 && request.status < 400)
		{
			console.log('inside post, request successful');
			//createNew table based on selected value in dropDown
			document.getElementById('dropDown1').dispatchEvent(change_event);
		} 
		else 
		{
		  console.log(request.status);
		}
	});
	console.log(JSON.stringify(data));
	request.send(JSON.stringify(data));
	event.preventDefault();
}



////assigns onclick function for delete buttons
function setDeleteButtons()
{	
	const deleteButtons = document.querySelectorAll('button[name="delete"]');
	//Adds event handler to all delete buttons
	deleteButtons.forEach(function(currentBtn){
	currentBtn.addEventListener('click', function(event){
		var tableRow=(this.parentElement.parentElement);
		var cells=tableRow.children;
		console.log(cells[0].textContent);
		reload_delete(cells[0].textContent);
	  },false);
	})
};

function reload_delete(deleteID)
{
	var data={};
	data["activityID"]=deleteID;
	var request = new XMLHttpRequest();
	request.open("POST", baseURL3, true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.addEventListener('load',function()
	{
		if(request.status >= 200 && request.status < 400)
		{
			console.log('inside post, request successful');
			//createNew table based on selected value in dropDown
			document.getElementById('dropDown1').dispatchEvent(change_event);
		} 
		else 
		{
		  console.log(request.status);
		}
	});
	console.log(JSON.stringify(data));
	request.send(JSON.stringify(data));
	event.preventDefault();
}
/*
function setAddButtons()
{	
	const addButtons = document.querySelectorAll('button[name="add"]');
	//Adds event handler to all delete buttons
	addButtons.forEach(function(currentBtn){
	currentBtn.addEventListener('click', 
	function(event)
	{
	  selectActivity(this.id, this.parentElement.parentElement)
	  //handleEvent(this.id,this.parentElement.parentElement,"addForm")
	//ajax call to submit add ID
	  },false);
	})
};

//post to select Dog
function selectActivity(buttonID, tableRow)
{
	var children=tableRow.children;
	var data={};
	data[activityID]=children[0].textContent;
	data[dogID]=idInputs[0].value;
	var request = new XMLHttpRequest();
	request.open("POST", baseURL2, true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.addEventListener('load',function()
	{
		if(request.status >= 200 && request.status < 400)
		{
			console.log('submit was successful')
		} 
		else 
		{
		  console.log(request.status);
		}
	});
	console.log(JSON.stringify(data));
	request.send(JSON.stringify(data));
	event.preventDefault();
}

*/


function convertSQL(dateTimeString)
{
	var dateArray=dateTimeString.split("T")
	var date=dateArray[0].toString();
	var time=date.split("-");	
	var year=time[0];
	var month=time[1];
	var day=time[2];
	return (month +'-'+ day +'-'+ year);
}

function reformatDate(datestring)
{
	var time=datestring.split("-");	
	var year=time[2];
	var month=time[0];
	var day=time[1];
	
	return (year + '-' + month + '-' + day);
}

