class GrowingCirclesDAO {
    constructor(dbRef) {
        this.dbRef = dbRef;
        this.userRef = null;
	
		// !! TODO: This value to be dynamically set
		this.hardCodedCanvasSize = 700;
    }

    updateUserReference(userRef) {
        this.userRef = userRef;
    }

    drawGrowingCircles(containerID, sizeRef) {
        if (!userRef) {
            console.log("[GrowingCirclesDAO: growingCircles] - User is null");
            return;
        }

        this.dbRef
            .collection("TestResults")
            .doc(userRef.uid)
            .collection("GrowingCircles")
            .orderBy("TimeStampMS", "desc")
            .limit(3)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.populateAggregate(containerID, sizeRef, doc);
                });
            });
    }

    // !! TODO: Refactor to make reading easier
	populateAggregate(containerID, sizeRef, doc) {
        let parent = document.getElementById(containerID);

        let newDivContainer = document.createElement("div");
        let newCanvas = document.createElement("canvas");
        let caption = document.createElement("p");

        let xLocations = doc.data().XLocationsLeft;
        let yLocations = doc.data().YLocationsLeft;
        let zLocations = doc.data().ZLocationsLeft;
        let timeStamp = doc.data().TimeStampMS;
        //let testCanvasSize = doc.data().TestCanvasSize;

        // let ratio = sizeRef / testCanvasSize;
		let ratio = sizeRef / this.hardCodedCanvasSize;
        let ctx = newCanvas.getContext('2d');
        console.log(newCanvas.width + "This is the new canvas width");
        ctx.globalAlpha = 0.5;
        
        // console.log("Original: " + testCanvasSize);
        console.log("Ref: " + sizeRef);
        console.log("Ratio: " + ratio);
        
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(((350 * 207.22) / 700), ((350 * 207.22) / 700), 2, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();


        for (let i = 0; i < xLocations.length; i++) {
            let x = (207.22 * xLocations[i]) / 700;
            let y = (207.22 * yLocations[i]) / 700;
            let z = (207.22*zLocations[i])/700;
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(x, y, z, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();
            console.log("Point Drawn At: " + x + " " + y + " " + z);
        }

        let dateTakenMsg = "Date Taken: " + this.formatDate(timeStamp);
        let captionTextNode = document.createTextNode(dateTakenMsg);

        caption.appendChild(captionTextNode);

        newDivContainer.appendChild(newCanvas);
        newDivContainer.appendChild(caption);

        parent.appendChild(newDivContainer);

    }

    populateHistoryTable(targetTableID) {
        if (!userRef) {
            console.log("[GrowingCirclesDAO: populateGrowingCirclesTable] - User is null");
            return;
        }

        this.dbRef
            .collection("TestResults")
            .doc(userRef.uid)
            .collection("GrowingCircles")
            .orderBy("TimeStampMS", "desc")
            .limit(3)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let timeStamp = doc.data().TimeStampMS;
                    this.addRowToTableGC(timeStamp, targetTableID);

                    // console.log("TimeStamp: " + timeStamp);
                });
            });
    }

    // TODO: Refactor variable names below to be more readable
    addRowToTableGC(timeStamp, targetTableID) {
        let testName = "Growing Circles";
        let time = this.formatDate(timeStamp);
        let urlOfTest = "../tests/instructions_page.html?growing_circles";

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
		
		// Prototype 2 edit
		// return dateString + " at " + hoursString + ":" + minutesString + postfix;
		return dateString;
	}

}// class [ FirebaseDAO ]