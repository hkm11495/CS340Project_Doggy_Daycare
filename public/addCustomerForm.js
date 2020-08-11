
var butO=document.getElementById("addCustomer");
var butD=document.getElementById("addDog");
var formNumOwner=1;
var formNumDog=1;

//Adds form if yes is clicked for Owner
butO.addEventListener("click",function(){
		formNumOwner=addForm("form","Customer ",formNumOwner);
});

//Adds form if yes is clicked for Owner
butD.addEventListener("click",function(){
		formNumDog=addForm("dog","Dog ",formNumDog);
});



//creates form
 function addForm(fname,title, formNum) {
		var formID=fname+formNum;
		formNum++;

        var elmnt = document.getElementById(formID);

		var cln = elmnt.cloneNode(true);
		cln.id=fname + formNum;
        document.body.appendChild(cln);
		cln.childNodes[1].textContent=(title + formNum);
		elmnt.parentNode.insertBefore(cln,elmnt.nextSibling);
		
		return formNum;
   
 }
 