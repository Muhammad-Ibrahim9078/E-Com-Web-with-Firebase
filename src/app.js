import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
// Firebase Auth
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
// Firebase Database
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";






const firebaseConfig = {
    apiKey: "AIzaSyClUj8OZbs_rHI_nj10cmUeorLB_XLV6H8",
    authDomain: "project-5211b.firebaseapp.com",
    projectId: "project-5211b",
    storageBucket: "project-5211b.firebasestorage.app",
    messagingSenderId: "934446735313",
    appId: "1:934446735313:web:629c9f306e0bd974e08af0",
    measurementId: "G-EV0G3ZNCHS"
};

// Firebase Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Firebase Database
const db = getFirestore(app);




// Signup Method / Function

let getSbtn = document.querySelector('#sbtn')

if (getSbtn) {
  
  let popup = document.getElementById("popup");
  let popupText = document.getElementById("popup-text");
  
    
    getSbtn.addEventListener('click', () => {
      
      
      
      let email = document.querySelector("#semail").value.trim()
      let password = document.querySelector("#spass").value.trim()
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        
              popup.style.display = "flex";
              popupText.innerText = "Logging in...";
                const user = userCredential.user;
                console.log(user.email)
                popupText.innerText = "✅ Successfully Create Account!";
            setTimeout(() => {
                popup.style.display = "none";
                window.location.replace("../Other Files/login.html");
            }, 1000);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                alert("Enter Correct Email OR 6 Digits Password")
                // setTimeout(2000, window.location.reload())

            });
    })

   
  }


// Login Method / Function


let lbtn = document.querySelector("#lbtn")



if (lbtn) {
  
  let popup = document.getElementById("popup");
  let popupText = document.getElementById("popup-text");
  
  lbtn.addEventListener('click', () => {
    
    let email = document.querySelector("#lemail").value.trim()
    let password = document.querySelector("#lpass").value.trim()
    
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    if(email === 'adminbro@gmail.com'){         // check email This is Admin or Not
      popup.style.display = "flex";
      popupText.innerText = "Logging in...";
                const user = userCredential.user;
                console.log(`${user.email} login success`)
                popupText.innerText = "✅ Successfully Logged In!";
            setTimeout(() => {
                popup.style.display = "none";
                window.location.replace("dashboard.html");
            }, 1000);
          }
  else if(email !== 'adminbro@gmail.com'){      // check email This is Admin or Not
    popup.style.display = "flex";
      popupText.innerText = "Logging in...";
                const user = userCredential.user;
                console.log(`${user.email} login success`)
                popupText.innerText = "✅ Successfully Logged In!";
            setTimeout(() => {
                popup.style.display = "none";
                window.location.replace("../Other Files/userDashboard.html");
            }, 1000);
    

  }

  })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                alert("Enter Correct Email OR 6 Digits Password")
            });

    })

}



// SignOut/Logout Method / Function


let logout = document.getElementById("logout");
if(logout){
logout.addEventListener("click", ()=>{
  const auth = getAuth();
signOut(auth).then(() => {
  // Sign-out successful.
  console.log("logout")
  window.location.replace("../Other Files/login.html");
}).catch((error) => {
  // An error happened.
});
})
}










// Database

let addItemBtn = document.getElementById("addItemBtn");

if(addItemBtn){
addItemBtn.addEventListener("click", async()=>{
  let itemName = document.getElementById("iName").value;
  let itemPrice = document.getElementById("iPrice").value;
  let itemdes = document.getElementById("ides").value;
  let itemurl = document.getElementById("iurl").value;

try {
  const docRef = await addDoc(collection(db, "items"), {
    itemName,
    itemPrice,
    itemdes,
    itemurl
  });
  console.log("Document written with ID: ", docRef.id);
  prodctsPrinting()

  // page Reload agter some Seconds
  setTimeout(() => {
    window.location.reload();
  }, 100);
} catch (e) {
  console.error("Error adding document: ", e);

}})
}










// Products/Itmes Print 
let prodctsPrinting = async()=>{
  let itemsPrint = document.getElementById("itemsPrint");

  itemsPrint.innerHTML = ""
  

const querySnapshot = await getDocs(collection(db, "items"));
querySnapshot.forEach((doc, index) => {
  // console.log(doc.data());
  let data =  doc.data();

  itemsPrint.innerHTML += `
     <section class="card bg-base-100 shadow-sm m-2" style="width: 300px;">
  <figure style="width: 100%; height: 200px; overflow: hidden;">
    <img
      src="${data.itemurl}"
      alt="${data.itemName}"
      style="width: 100%; height: 100%; object-fit: contain; display: block; margin: 0 auto;"
    />
  </figure>
  <div class="card-body" style="padding: 10px;">
    <h1 class="card-title">${data.itemName}</h1>
    <p><b>Description:</b><br>${data.itemdes}</p>
    <h4 class="card-title">Rs: ${data.itemPrice}</h4>
    <div class="card-actions justify-end">
      <button class="btn btn-primary" onclick="addtoList('${doc.id}', '${data.itemName}', '${data.itemPrice}', '${data.itemurl}')">Add To list</button>
    </div>
  </div>
</section>`

});
}
prodctsPrinting()





let emailinthis = ()=>{
  
onAuthStateChanged(auth, (user) => {
  let emailPr = document.getElementById("emailPr");
 if (user) {
    // Sirf currently logged-in user ki email
    emailPr.innerHTML = user.email;
  }
});
}
emailinthis()















// addToList Function / Method


function addtoList(id, name, price, imgUrl){

alert("Addeed Successfuly")
  let addCardPrint = document.getElementById("addCardPrint");

  addCardPrint.innerHTML = `
  <p> ${name} </p>
  <p><b>Price:</b> ${price} </p>
  <img src="${imgUrl}" width="50px" height="50px" alt="${name}">
  `
  
}

window.addtoList = addtoList;