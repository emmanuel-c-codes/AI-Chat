import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = { /* ... your config ... */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const game = new Chess();
let selectedSquare = null;

window.Auth = {
    signup: async (email, pass, username) => {
        try {
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            await setDoc(doc(db, "users", res.user.uid), { username, email });
            window.location.href = "dashboard.html";
        } catch (e) { alert("Error: " + e.message); }
    },
    login: async (email, pass) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            window.location.href = "dashboard.html";
        } catch (e) { alert("Error: " + e.message); }
    },
    logout: () => signOut(auth).then(() => window.location.href = "index.html")
};

window.Game = {
    search: async () => {
        const username = document.getElementById('search-u').value;
        const q = query(collection(db, "users"), where("username", "==", username));
        const res = await getDocs(q);
        const results = document.getElementById('search-results');
        if (!results) return;
        results.innerHTML = '';
        res.forEach(d => {
            const btn = document.createElement('button');
            btn.innerText = "REQUEST MATCH: " + d.data().username;
            btn.onclick = () => window.Game.request(d.id);
            results.appendChild(btn);
        });
    },
    request: async (oppId) => {
        if (!auth.currentUser) return alert("Must be logged in");
        await setDoc(doc(db, "matches", auth.currentUser.uid), { p1: auth.currentUser.uid, p2: oppId, status: "pending", fen: game.fen() });
        alert("Match requested!");
    }
};

window.renderBoard = () => {
    const b = document.getElementById('board');
    if (!b) return;
    b.innerHTML = '';
    const pieces = { w: { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' },
                     b: { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' } };
    game.board().forEach((row, i) => {
        row.forEach((sq, j) => {
            const squareName = String.fromCharCode(97 + j) + (8 - i);
            const cell = document.createElement('div');
            cell.className = `cell ${(i+j)%2===0 ? 'white-cell' : 'green-cell'}`;
            if(sq) {
                cell.innerText = pieces[sq.color][sq.type];
                cell.style.fontSize = "30px";
                cell.onclick = () => {
                    if (!selectedSquare) selectedSquare = squareName;
                    else {
                        try { game.move({ from: selectedSquare, to: squareName, promotion: 'q' }); selectedSquare = null; renderBoard(); } 
                        catch (e) { selectedSquare = squareName; }
                    }
                };
            }
            b.appendChild(cell);
        });
    });
};
document.addEventListener('DOMContentLoaded', renderBoard);