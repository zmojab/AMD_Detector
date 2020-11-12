var newPatients = document.getElementById('newPatients');
var db = firebase.firestore();
checkForRequests();

async function checkForRequests() {

    await firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let id = user.uid;
            db.collection("users").doc(id)
                .get()
                .then(doc => {
                    let array = doc.data().patientRequests;
                    if (array.length > 0) {
                        newPatients.innerHTML = "New Patients (" + array.length + ")";
                    }

                });
        }
    });

}