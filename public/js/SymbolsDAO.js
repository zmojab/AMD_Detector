class SymbolsDAO {
	constructor(dbRef) {
		this.dbRef = dbRef;
		this.userRef = null;
		
		// !! TODO: This value to be dynamically set
		this.hardCodedCanvasSize = 600;
	}
	
	updateUserReference(userRef) {
		this.userRef = userRef;
	}
	
	populateAggregate(leftCanvasID, rightCanvasID, sizeRef) {
		if (!userRef) {
			console.log("[FullBarsDAO: drawFullBars] - User is null");
			return;
		}
		
		// Update limit() to just 1
		this.dbRef
			.collection("TestResults")
			.doc(userRef.uid)
			.collection("Symbols")
			.orderBy("TimeStampMS", "desc")
			.limit(3)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					this.drawToCanvas(leftCanvasID, rightCanvasID, sizeRef, doc);
				});
			});
	}
	
	// !! TODO: Error handling (especially getting values from Firebase)
	// !! TODO: Refactor to make reading easier
	drawToCanvas(leftCanvasID, rightCanvasID, sizeRef, doc) {
		let leftCanvas = document.getElementById(leftCanvasID);
		let rightCanvas = document.getElementById(rightCanvasID);
		
		if (!leftCanvas || !rightCanvas){
			if (!leftCanvas){
				console.log("LEFT Canvas - null");
			}
			
			if (!rightCanvas){
				console.log("RIGHT Canvas - null");
			}
			
			return;
		}
		
		let ctxLeft = leftCanvas.getContext('2d');
		let ctxRight = rightCanvas.getContext('2d');
		
		// TODO: Error handling for discrepancy between Symbols[] and Locations[] lengths
		let leftResultSymbols = doc.data().LeftResultsSymbols;
		let leftXLocations = doc.data().LeftXLocations;
		let leftYLocations = doc.data().LeftYLocations;
		let rightResultSymbols = doc.data().RightResultsSymbols;
		let rightXLocations = doc.data().RightXLocations;
		let rightYLocations = doc.data().RightXLocations;
		// let timeStamp = doc.data().TimeStampMS;
		// let testCanvasSize = doc.data().TestCanvasSize;
		
		// CHECK: Using leftCanvas width sufficient?
		let ratio = leftCanvas.width / this.hardCodedCanvasSize;
		
		// CHECK: Alpha Needed?
		// ctxLeft.globalAlpha = 0.5;
		// ctxRight.globalAlpha = 0.5;
		ctxLeft.fillStyle = "red";
		ctxRight.fillStyle = "red";
		
		// NOTE: The font size (see below) of 35 is hardcoded in symbols_test.js
		if (leftResultSymbols) {
			
			ctxLeft.font = (ratio * 100) + "px Arial";
			
			for (let i = 0; i < leftXLocations.length; i++) {
				let symbol = leftResultSymbols[i];
				let xPos = leftXLocations[i] * ratio;
				let yPos = leftYLocations[i] * ratio;
				
				ctxLeft.fillText(symbol, xPos, yPos);
			}
		}
		
		// !! TODO: Right canvas has nothing on it when printing to the webpage
		if (rightResultSymbols) {
			
			ctxRight.font = (ratio * 100) + "px Arial";
			
			for (let i = 0; i < leftYLocations.length; i++) {
				let symbol = rightResultSymbols[i];
				let xPos = rightXLocations[i] * ratio;
				let yPos = rightYLocations[i] * ratio;
				
				ctxRight.fillText(symbol, xPos, yPos);
			}
		}
	}
	
	// CHECK: How can I make this more modular for different tables?
	populateHistoryTable(targetTableID) {
		if (!userRef) {
			console.log("[SymbolsDAO: populateFullBarsTable] - User is null");
			return;
		}
		
		this.dbRef
			.collection("TestResults")
			.doc(userRef.uid)
			.collection("Symbols")
			.orderBy("TimeStampMS", "desc")
			.limit(3)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					let timeStamp = doc.data().TimeStampMS;
					this.addRowToTable(timeStamp, targetTableID);
				});
			});
	}
	
	// TODO: Refactor variable names below to be more readable
	addRowToTable(timeStamp, targetTableID) {
		let testName = "Symbols";
		let time = this.formatDate(timeStamp);
		let urlOfTest = "../tests/instructions_page.html?symbols";
		
		// ID of which table to put the data into (HTML Attribute ID)
		let tableBody = document.getElementById(targetTableID);
		
		// Table Row
		let row = document.createElement("tr");
		
		// Table Columns
		let columnTestName = document.createElement("td");
		let columnTime = document.createElement("td");
		let columnURL = document.createElement("td");
		
		// Will be a child of columnURL so we can add hyperlink
		let linkForURL = document.createElement("a");
		
		// Text to be put in the Columns
		let textTestName = document.createTextNode(testName);
		let textTime = document.createTextNode(time);
		let textURL = document.createTextNode("Take this Test");
		
		// Set href attribute for link to test
		linkForURL.appendChild(textURL);
		linkForURL.setAttribute("href", urlOfTest);
		
		// Put the Text into their respective Columns
		columnTestName.appendChild(textTestName);
		columnTime.appendChild(textTime);
		columnURL.appendChild(linkForURL);
		
		// Add each the Columns to the Row
		row.appendChild(columnTestName);
		row.appendChild(columnTime);
		row.appendChild(columnURL);
		
		// Add the Row to the Table
		tableBody.appendChild(row);
	}
	
	formatDate(milliseconds) {
		let date = new Date(milliseconds);
		
		let dateString = date.toDateString();
		let hoursString = date.getUTCHours();
		let minutesString = date.getUTCMinutes();
		let postfix = hoursString > 11 ? "PM" : "AM";
		
		if (hoursString === 0){
			hoursString = 12;
		}
		
		minutesString = minutesString < 10 ? "0" + minutesString : minutesString;
		hoursString = hoursString % 12;
		
		// return dateString + " at " + hoursString + ":" + minutesString + postfix;
		return dateString;
	}
	
}// class [ SymbolsDAO ]
