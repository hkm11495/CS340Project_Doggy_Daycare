
const baseURL3='http://flip3.engr.oregonstate.edu:5223/getCustomerAddress';
const idInputs=document.getElementsByName('dogID');
document.addEventListener('DOMContentLoaded', getSelected("custDrop", "customerID",baseURL3 , createTable));


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
				deleteTable();
				deleteTable2();
				var response = JSON.parse(request.responseText);
				console.log(response)
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

//create table when option is selected
function createTable(rows)
{
	console.log(rows);
	//var formInner=document.createElement("Form");
	var table = document.createElement("TABLE");
	console.log(rows);
	//document.body.appendChild(formInner);
	table.setAttribute("id", "table1");
	document.getElementById("tableRow").appendChild(table);
	document.getElementById("table1").style.border="thin solid #0000FF";
	createHeader();
	if (rows.length==0)
	{
		return;
	}	
	var key=Object.keys(rows[0]);
	var row=document.createElement("TR");
	table.appendChild(row);
	
	//var item=rows[p];
	var item=rows[0];
	//row.setAttribute("id",p);
	row.setAttribute("id",0);
	//Add Cells for Data
	for (var i=0;i<5;i++)
	{
		console.log(item[key[i]]);
		//var cell=createCells(p,item[key[i]]);
		var cell=createCells(0,item[key[i]]);
		//hide id column
		if (i==0)
		{
			cell.style.display='none';
		}
		row.appendChild(cell);
	}
	createTable2(rows);
}

function createTable2(rows)
{
	//var formInner=document.createElement("Form");
	var table = document.createElement("TABLE");
	console.log(rows);
	//document.body.appendChild(formInner);
	table.setAttribute("id", "table2");
	document.getElementById("tableRow").appendChild(table);
	document.getElementById("table2").style.border="thin solid #0000FF";
	var key=Object.keys(rows[0]);
	createHeader2();
	for (var p in rows)
	{
		var row=document.createElement("TR");
		table.appendChild(row);
		
		var item=rows[p];
		row.setAttribute("id",p);
		//Add Cells for Data
		for (var i=5;i<8;i++)
		{
			var cell=createCells(p,item[key[i]]);
			row.appendChild(cell);
		}
	}
}



function createHeader()
{
			//add header
		var hrow=document.createElement("TR");
		document.getElementById('table1').appendChild(hrow);
		var hcell=createCells('header',"customerID");
		hcell.style.display='none';
		hrow.appendChild(hcell);
		hcell=createCells('header',"Address");
		hrow.appendChild(hcell);
		hcell=createCells('header',"City");
		hrow.appendChild(hcell);
		hcell=createCells('header',"State");
		hrow.appendChild(hcell);
		hcell=createCells('header',"Zipcode");
		hrow.appendChild(hcell);
		hrow.style.fontWeight="bold";
}

function createHeader2()
{
			//add header
		var hrow=document.createElement("TR");
		document.getElementById('table2').appendChild(hrow);
		var hcell=createCells('header',"Dogs");
		hrow.appendChild(hcell);
		hcell=createCells('header',"Breed");
		hrow.appendChild(hcell);
		hcell=createCells('header',"Age");
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

//Deletes Table
function deleteTable2()
{	console.log("deleting table");
	if (document.getElementById('table2')!= 'undefined' && document.getElementById('table2') != null )
	{
		var allRows=document.getElementById('table2').children;
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
		var tbl= document.getElementById('table2');
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
	celltext=document.createElement("LABEL");
	celltext.innerHTML=itemText;
	cellT.appendChild(celltext);
	cellT.style.border="thin solid #0000FF";
	return cellT;
}
