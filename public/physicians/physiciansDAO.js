var newPatients = document.getElementById('newPatients');
checkForRequests();

async function checkForRequests() {
	var db = firebase.firestore();
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

const signOut = document.querySelector('.sign-out');
		// sign out
		signOut.addEventListener('click', () => {
			firebase.auth().signOut()
				.then(() => console.log('signed out'));
			window.location = '../index.html';
		});