import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFSIqcnP5U0CMjQZtIS3jK5VTVcHGLPRw",
  authDomain: "client-cc4df.firebaseapp.com",
  projectId: "client-cc4df",
  storageBucket: "client-cc4df.firebasestorage.app",
  messagingSenderId: "600063857476",
  appId: "1:600063857476:web:9abfe8219251f56e67fd11",
  measurementId: "G-MNM99NCKH9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch and display data
async function loadEntries() {
    const list = document.getElementById('entries-list');
    list.innerHTML = ''; 
    const q = query(collection(db, "entries"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
        const data = doc.data();
        const div = document.createElement('div');
        div.className = "bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500";
        div.innerHTML = `
            <p class="font-bold text-blue-900">${data.win}</p>
            <p class="text-gray-600 text-sm mt-1">${data.gratitude}</p>
        `;
        list.appendChild(div);
    });
}

// Attach Save Function to Window
window.saveEntry = async () => {
    const gratitude = document.getElementById('gratitude').value;
    const win = document.getElementById('win').value;
    const status = document.getElementById('status');

    if (!gratitude || !win) return alert("Fill in both fields!");

    try {
        await addDoc(collection(db, "entries"), {
            gratitude, win, timestamp: new Date()
        });
        
        document.getElementById('gratitude').value = '';
        document.getElementById('win').value = '';
        status.classList.remove('hidden');
        setTimeout(() => status.classList.add('hidden'), 2000);
        
        loadEntries(); // Refresh the list
    } catch (e) {
        console.error(e);
        alert("Error saving!");
    }
};

// Initial load
loadEntries();