let dropDown = document.getElementById("patientList");
let patients = [];

(function () {
	let patient1 = {
		id: "Ii4NKqGowiVtH14FK8O3b7Wfuri1",
		firstName: "John",
		lastName: "Doe",
	}
	
	let patient2 = {
		id: "NqP2JTgoCpYPixkCFVkvFyHUs7x1",
		firstName: "Smitty",
		lastName: "WerbenJagermanJensen",
	}
	console.log("PUSHING USERS");
	patients.push(patient1);
	patients.push(patient2);
}());


(function () {
	console.log("PUSHING TO DROPDOWN");
	
	for (let i = 0; i < patients.length; i++) {
		let p = patients[i];
		let a = document.createElement("a");
		let patientName = document.createTextNode(p.firstName + " " + p.lastName);
		
		a.appendChild(patientName);
		a.setAttribute("href", URIBuilder(p));
		
		dropDown.appendChild(a);
	}
	
}());

(function () {

}());

function URIBuilder(p) {
	let uri = new URLSearchParams();
	uri.append("DATA", "True");
	uri.append("PATIENT_ID", p.id);
	uri.append("FIRST", p.firstName);
	uri.append("LAST", p.lastName);
	return "./physiciansDash.html?" + uri.toString();
}