// Public settings for the Way To Go NJ website.
// This file is safe to commit. Firebase web config values are public by design;
// access is controlled by the Firestore security rules and your admin login,
// neither of which lives in this repository. See SETUP.md.
window.WTG_CONFIG = {
  // Social pages. Paste the full address of each page you have. Leave the
  // rest empty and that icon stays hidden.
  social: {
    facebook: "https://www.facebook.com/share/1C38nJPyfz/",
    instagram: "https://www.instagram.com/waytogonj",
    tiktok: "",
    linkedin: "https://www.linkedin.com/company/waytogonj",
    youtube: "",
    nextdoor: "",
    whatsapp: "https://wa.me/17326081939",
    indeed: "",
    x: ""
  },

  // Paste the object from Firebase console > Project settings > Your apps > Config.
  // Until apiKey and projectId are filled in, the forms and the admin hub show a
  // "not switched on yet" message instead of sending anything.
  firebase: {
    apiKey: "AIzaSyDSUkn0pYMSFnwtKZVjXJm-B2x3-Ko4ADg",
    authDomain: "way-to-go-nj.firebaseapp.com",
    projectId: "way-to-go-nj",
    storageBucket: "way-to-go-nj.firebasestorage.app",
    messagingSenderId: "918016064462",
    appId: "1:918016064462:web:ad2ad5f9649412e802c99f"
  }
};
