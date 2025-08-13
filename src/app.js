import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
// Firebase Auth
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
// Firebase Database
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


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
    getSbtn.addEventListener('click', () => {
    let email = document.querySelector("#semail").value.trim();
    let password = document.querySelector("#spass").value.trim();

    // Loading alert
    Swal.fire({
        title: 'Creating Account...',
        text: 'Please wait while we set things up for you.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user.email);
            // Success alert
            Swal.fire({
                icon: 'success',
                title: 'Account Created!',
                text: '✅ Successfully signed up!',
                timer: 1000,
                showConfirmButton: false
            });
            setTimeout(() => {
                window.location.replace("../html-files/login.html");
            }, 1000);
        })
        .catch((error) => {
            console.log(error.code, error.message);

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Enter a valid email and at least 6-digit password.'
            });
        });
});
}









  


// Login Method / Function

let lbtn = document.querySelector("#lbtn")
if (lbtn) {
  lbtn.addEventListener('click', () => {
    let email = document.querySelector("#lemail").value.trim()
    let password = document.querySelector("#lpass").value.trim()

    Swal.fire({
      title: 'Logging in...',
      text: 'Please wait a moment.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    





// This is For Admin Login
signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
if(email === 'adminbro@gmail.com'){         // check email This is Admin or Not
      const user = userCredential.user;
      window.location.replace("../html-files/admindashboard.html");

  }



// This is for Users Login
else if(email !== 'adminbro@gmail.com'){      // check email This is Admin or Not
          const user = userCredential.user;
        window.location.replace("../html-files/userDashboard.html");
}
})
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Enter Correct Email & Password Please Try Again'
      });

  });
})
}










// SignOut/Logout Method / Function
let logout = document.getElementById("logout");

if (logout) {
  logout.addEventListener("click", () => {
// Sweet Confirm 
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of this session.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout me",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        const auth = getAuth();
        signOut(auth).then(() => {
          Swal.fire({
            title: "Logged Out",
            text: "You have been successfully logged out.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
            window.location.replace("login.html");
        }).catch((error) => {
          Swal.fire("Error!", "Something went wrong during logout.", error);
        });
      }
    });

  });
}








// Database Add New Item


let addItemBtn = document.getElementById("addItemBtn");
if (addItemBtn) {
  let modalEl = document.getElementById("addModal");
  let modal = new bootstrap.Modal(modalEl);
    addItemBtn.addEventListener("click", async () => {
        let itemName = document.getElementById("iName").value;
        let itemPrice = document.getElementById("iPrice").value;
        let itemdes = document.getElementById("ides").value;
        let itemurl = document.getElementById("iurl").value;

        try {
            modal.hide();

            const docRef = await addDoc(collection(db, "items"), {
                itemName,
                itemPrice,
                itemdes,
                itemurl
            });

            console.log("Document written with ID: ", docRef.id);

            Swal.fire({
                title: "Success!",
                text: "Item has been added successfully.",
                icon: "success",
                confirmButtonText: "OK"
              }).then(() => {
                  window.location.reload();
              });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    });
}










// User Card Products/Itmes Print in Dom

let userCardPrint = document.getElementById("userCardPrint");
if(userCardPrint){

let prPrint = async()=>{
  
  userCardPrint.innerHTML = "";
  
  const querySnapshot = await getDocs(collection(db, "items"));
  querySnapshot.forEach((doc) => {
    
    let data =  doc.data();

      userCardPrint.innerHTML += `
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
prPrint()
}













// Admin Cards Products/Items Print in Dom

let adminCardPrint = document.getElementById("adminCardPrint");

if (adminCardPrint) {
    let prodctsPrinting = async () => {
        adminCardPrint.innerHTML = "";

        const querySnapshot = await getDocs(collection(db, "items"));
        querySnapshot.forEach((docSnap) => {
            let data = docSnap.data();

            adminCardPrint.innerHTML += `
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
                            <button class="btn btn-warning" onclick="editItem('${docSnap.id}', '${data.itemName}', '${data.itemPrice}', '${data.itemdes}', '${data.itemurl}')">Edit</button>
                            <button class="btn btn-danger" onclick="deleteItem('${docSnap.id}')">Delete</button>
                        </div>
                    </div>
                </section>
            `;
        });
    };


    // Edit Product Funtion
    window.editItem = (id, name, price, des, url) => {
        Swal.fire({
            title: "Edit Item",
            html: `
                <input id="swal-name" class="swal2-input" placeholder="Name" value="${name}">
                <input id="swal-price" type="number" class="swal2-input" placeholder="Price" value="${price}">
                <textarea id="swal-des" class="swal2-textarea" placeholder="Description">${des}</textarea>
                <input id="swal-url" class="swal2-input" placeholder="Image URL" value="${url}">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    name: document.getElementById("swal-name").value,
                    price: document.getElementById("swal-price").value,
                    des: document.getElementById("swal-des").value,
                    url: document.getElementById("swal-url").value
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await updateDoc(doc(db, "items", id), {
                    itemName: result.value.name,
                    itemPrice: result.value.price,
                    itemdes: result.value.des,
                    itemurl: result.value.url
                });
                Swal.fire("Updated!", "Item updated successfully.", "success");
                prodctsPrinting();
            }
        });
    };


    // Delete Product Funtion
    window.deleteItem = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete the item permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteDoc(doc(db, "items", id));
                Swal.fire("Deleted!", "Item deleted successfully.", "success");
                prodctsPrinting();
            }
        });
    };

    prodctsPrinting();
}























// User Email print in Dom
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

















const addCardPrint   = document.getElementById("addCardPrint");
const orderBtnprint  = document.getElementById("orderBtnprint");


let objItems = [];

function addtoList(id, name, price, imgUrl) {
  Swal.fire({
    title: "Are you sure?",
    text: "This item will be added to your order list!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Add",
    cancelButtonText: "Cancel"
  }).then((result) => {
    if (result.isConfirmed) {
      
      // Check if product already exists in cart
      let existingItem = objItems.find(item => item.id === id);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        objItems.push({ id, name, price, imgUrl, qty: 1 });
      }

      renderCart();
    }
  });
}
window.addtoList = addtoList;


// Quantity Funtion
function changeQty(id, type) {
  let item = objItems.find(i => i.id === id);
  if (item) {
    if (type === "plus") {
      item.qty += 1;
    } else if (type === "minus" && item.qty > 1) {
      item.qty -= 1;
    }
    renderCart();
  }
}
window.changeQty = changeQty;

function renderCart() {
  addCardPrint.innerHTML = "";
  objItems.forEach(item => {
    addCardPrint.innerHTML += `
      <div class="border p-2">
        <p>${item.name}</p>
        <p><b>Rs:</b>${item.price}</p>
        <p><b>Qty:</b> 
        <br>
          <button onclick="changeQty('${item.id}','minus')">-</button>
          ${item.qty}
          <button onclick="changeQty('${item.id}','plus')">+</button>
        </p>
        <img src="${item.imgUrl}" width="90px" alt="${item.name}">
      </div>
    `;
  });

  if (objItems.length > 0) {
    orderBtnprint.innerHTML = `
      <button class="btn btn-success" onclick="orderPlace()">Place Order</button>
    `;
  } else {
    orderBtnprint.innerHTML = "";
  }
}


// Order Place Funtion
async function orderPlace() {
      // Loading alert
    Swal.fire({
        title: 'Order Now...',
        text: 'Please wait...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

  if (objItems.length === 0) {
    Swal.fire("No items!", "Please add some products before placing an order.", "info");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "order"), {
      items: objItems,
      createdAt: new Date()
    });

    Swal.fire({
      title: "Success!",
      text: "Your order has been placed successfully.",
      icon: "success",
      confirmButtonText: "OK"
    }).then(() => {
      objItems = [];
      addCardPrint.innerHTML = "";
      orderBtnprint.innerHTML = "";
    });

  } catch (e) {
    console.error("Error adding order:", e);
    Swal.fire("Error!", "Failed to place order.", "error");
  }
}
window.orderPlace = orderPlace;

















// check User Login and Not

onAuthStateChanged(auth, (user) => {
  let currentPage = window.location.pathname;

  // Agar login nahi hai
  if (!user && !currentPage.includes("login.html") && !currentPage.includes("signup.html")) {
    window.location.replace("../html-files/login.html");
    return;
  }

  // Agar login hai aur login/signup page pe aaya hai to redirect user
  if (user && (currentPage.includes("login.html") || currentPage.includes("signup.html"))) {
    if (user.email === "adminbro@gmail.com") {
      window.location.replace("../html-files/admindashboard.html");
    } else {
      window.location.replace("../html-files/userDashboard.html");
    }
    return;
  }

  // Agar current page admin dashboard hai lekin user admin nahi hai
  if (currentPage.includes("admindashboard.html") && user.email !== "adminbro@gmail.com") {
    alert("Access Denied! Only Admin Allowed.");
    window.location.replace("../html-files/userDashboard.html");
    return;
  }

  // Agar current page user dashboard hai lekin user admin hai
  if (currentPage.includes("userDashboard.html") && user.email === "adminbro@gmail.com") {
    window.location.replace("../html-files/admindashboard.html");
    return;
  }
});














