/*
  ============================================================
  script.js : makes your website DO things
  ============================================================
  In JavaScript, comments are // (one line) or /* ... * / (many lines).

  HTML = the nouns (things on the page)
  CSS  = the adjectives (how they look)
  JS   = the verbs (what they do)

  JavaScript reaches into the page through the DOM (Document
  Object Model), the browser's live map of your HTML.
  "document" is our entry point to it.
*/


// ===================== 1. AUTO-UPDATING YEAR =====================

// document.getElementById('year') finds the element with id="year"
// (the empty <span> in the footer). "const" stores it in a named
// box called yearSpan. const means this box will always hold
// this same element and won't be reassigned.
const yearSpan = document.getElementById('year');

// new Date() creates an object holding the current date and time.
// .getFullYear() pulls out just the year, e.g. 2026.
// .textContent sets the text inside the span to that year.
// Result: the footer always shows the current year automatically.
yearSpan.textContent = new Date().getFullYear();


// ===================== 2. MOBILE MENU =====================

// document.querySelector() finds the FIRST element matching a CSS
// selector. It's the same selector syntax as in style.css, which
// is why learning CSS selectors pays off twice.
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

// addEventListener means "when THIS happens, run THIS code".
//   'click'      = the event to listen for
//   function(){} = the code to run each time it happens
// The browser waits and runs the function on every click.
menuButton.addEventListener('click', function () {

  // classList.toggle('open') adds the class "open" if it's missing,
  // or removes it if it's there. In style.css, .nav.open has
  // display:block, so this shows and hides the menu.
  // toggle also returns true if the class is now ON, false if OFF.
  // We save that answer in isOpen.
  const isOpen = nav.classList.toggle('open');

  // Keep the accessibility info accurate so screen readers
  // announce "menu expanded" or "collapsed".
  // setAttribute(name, value) changes an HTML attribute.
  // String(isOpen) turns true/false into the text "true"/"false".
  menuButton.setAttribute('aria-expanded', String(isOpen));
});


// ===================== 3. CLOSE MENU AFTER TAPPING A LINK =====================
// On a phone, after you tap "Projects", the menu should get out
// of the way instead of covering the page.

// querySelectorAll finds ALL matching elements (here, every link
// inside .nav) and gives back a list of them.
const navLinks = document.querySelectorAll('.nav a');

// forEach runs the given function once for each item in the list.
// "link" is the name we give the current item on each round.
navLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    nav.classList.remove('open');                     // hide the menu
    menuButton.setAttribute('aria-expanded', 'false'); // and record that it's closed
  });
});
