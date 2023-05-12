import { app as firebase } from './firebase-config';
import { getFirestore, setDoc, doc, collection, onSnapshot, getDocs, Timestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

console.log(firebase);

const db = getFirestore(firebase);
const auth = getAuth(firebase);

// Viewer Functionality 

const landingView = document.getElementById('landing-view');
const signupView = document.getElementById('join-view');
const loginView = document.getElementById('login-view');
const appView = document.getElementById('app-view');
const settingsView = document.getElementById('settings-view');

const loginBtnNav = document.querySelector('.login-btn-nav');
const signupBtnNav = document.querySelector('.join-btn-nav');
const signupBtnHero = document.querySelector('.join-btn-hero');

const loginLink = document.getElementById('login-link');
const signupLink = document.getElementById('signup-link');

loginLink.addEventListener('click', () => {

  landingView.style.display = 'none';
  loginView.style.display = 'flex';
  loginError.style.display = 'none';
  signupView.style.display = 'none';
  appView.style.display = 'none';

});

signupLink.addEventListener('click', () => {

  landingView.style.display = 'none';
  loginView.style.display = 'none';
  signupView.style.display = 'flex';
  signupError.style.display = 'none';
  appView.style.display = 'none';

})

loginBtnNav.addEventListener('click', () => {

  landingView.style.display = 'none';
  loginView.style.display = 'flex';
  loginError.style.display = 'none';
  signupView.style.display = 'none';
  appView.style.display = 'none';

});

signupBtnNav.addEventListener('click', () => {

  landingView.style.display = 'none';
  loginView.style.display = 'none';
  signupView.style.display = 'flex';
  signupError.style.display = 'none';
  appView.style.display = 'none';

});

signupBtnHero.addEventListener('click', () => {

  landingView.style.display = 'none';
  loginView.style.display = 'none';
  signupView.style.display = 'flex';
  signupError.style.display = 'none';
  appView.style.display = 'none';

});

// Authentication Functionality

const provider = new GoogleAuthProvider();
const signInWithGoogleBtn = document.getElementById('google');
const loginWithGoogleBtn = document.getElementById('google-btn');

signInWithGoogleBtn.addEventListener('click', () => {

  signInWithPopup(auth, provider)
    .then((result) => {
      console.log('signed in with google!')
      console.log(result)
    })
    .catch((err) => {
      console.log(err.message)
    })

})

loginWithGoogleBtn.addEventListener('click', () => {

  signInWithPopup(auth, provider)
    .then((result) => {
      console.log('signed in with google!')
      console.log(result)
    })
    .catch((err) => {
      console.log(err.message)
    })

})

const logoutBtn = document.getElementById('sign-out');
const signupForm = document.querySelector('.signup');

const signupError = document.getElementById('signup-error');

signupForm.addEventListener('submit', (e) => {

  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user created: ', cred.user)
      signupForm.reset()
      signupError.style.display = 'none';
      location.reload()
    })
    .catch((err) => {
      console.log(err.message)
      signupError.style.display = 'flex';
      signupError.innerText = err.message;
    })

})

const loginForm = document.querySelector('.login');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', (e) => {

  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user logged in: ', cred.user);
      loginError.style.display = 'none';
      location.reload();
    })
    .catch((err) => {
      console.log(err.message);
      loginError.style.display = 'flex';
      loginError.innerText = err.message;
    })

})

logoutBtn.addEventListener('click', () => {

  signOut(auth).then(() => {
    console.log('logged out!')
  })

})

onAuthStateChanged(auth, user => {

  if (user) {

    signInWithGoogleBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    loginForm.style.display = 'none';
    landingView.style.display = 'none';
    loginView.style.display = 'none';
    signupView.style.display = 'none';
    appView.style.display = 'flex';


  } else {

    signInWithGoogleBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    loginForm.style.display = 'flex';
    landingView.style.display = 'flex';
    loginView.style.display = 'none';
    signupView.style.display = 'none';
    appView.style.display = 'none';


  }

})

// Adding Memories + Database Functionality

const colRef = collection(db, 'entries');

const addMemoryForm = document.querySelector('.add-memory');
addMemoryForm.addEventListener('submit', async e => {

  e.preventDefault();

  const docRef = doc(colRef);

  if (!addMemoryForm.memory.value || addMemoryForm.memory.value === '') {
    alert('Please Fill Out All Form Fields!')
  } else {
    if (auth.currentUser) {
      await setDoc(docRef, {
        message: addMemoryForm.memory.value,
        user: auth.currentUser.uid,
        time: Timestamp.fromDate(new Date())
      })
      location.reload()
    } else {
      alert('Please Login To Add A Memory!')
    }
  }

})

const parent = document.querySelector('ul');

window.addEventListener('load', () => {

  getDocs(colRef)
  .then((snapshot) => {
    let entries = [];
    snapshot.docs.forEach((doc) => {
      const content = { ...doc.data() }
      if (content.user === auth.currentUser.uid) {
        entries.push(content)
        const container = document.createElement('li');
        container.innerText = content.message
        parent.appendChild(container);
      } else {
        console.log('data not for current user')
      }
    });
    console.log(entries)
  })
  .catch(err => {
    console.log(err.message)
  })

})
