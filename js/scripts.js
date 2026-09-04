// superman video buttons

var video = document.querySelector("#superman-video");
function PlayPause() {
    if (video.paused)
        video.play();
    else
        video.pause();
}

function Big() {
    video.style.width = "500px";
    video.style.height = "auto";
}

function Small() {
    video.style.width = "100px";
    video.style.height = "auto";
}

function Normal() {
    video.style.width = "200px";
    video.style.height = "auto";
}

// javascript timer to change picture every 3 seconds

let adImages = ['images/lego-ad.jpg', 'images/lego-ad2.jpg'];

let index = 0;
const imageElement = document.querySelector('.lego-ad');

function imageChange() {
    imageElement.src = adImages[index];
    index = (index + 1) % adImages.length;
}

window.onload = function() {
    setInterval(imageChange, 3000);
};

// drop down feature for the read more button

const historyExtra = document.querySelector('.extra');
const readMoreButton = document.getElementById('read-more-button');

readMoreButton.addEventListener('click', function() {
    historyExtra.classList.toggle('expanded');

    // if and else statement to change button text when clicked
    if (historyExtra.classList.contains('expanded')) {
        readMoreButton.textContent = 'Read Less';
    } else {
        readMoreButton.textContent = 'Read More';
    }
});


// form validator
const newsletterForm = document.getElementById('newsletter-form');
const nameInput = document.getElementById('signup-name');
const emailInput = document.getElementById('signup-email');
const agreeCheckbox = document.getElementById('signup-agreement');

newsletterForm.onsubmit = function(event) {
    // prevent the form from submitting if validation fails
    event.preventDefault(); 

    // set default to true, if any of the if's are true, it will be false
    let isValid = true;

    // clear old messages
    document.getElementById('name-error').textContent = "";
    document.getElementById('email-error').textContent = "";
    document.getElementById('agreement-error').textContent = "";
    document.getElementById('signup-success-text').textContent = "";

    if (nameInput.value === "") {
        document.getElementById('name-error').textContent = "Please enter your name.";
        isValid = false;
    }

    if (emailInput.value === "") {
        document.getElementById('email-error').textContent = "Please enter your email.";
        isValid = false;
    }

    if (!agreeCheckbox.checked) {
        document.getElementById('agreement-error').textContent = "You must agree to receive emails.";
        isValid = false;
    }

    if (isValid) {
        document.getElementById('signup-success-text').textContent = "Thanks for subscribing!";
        newsletterForm.reset();
    }
};

// random fact generator
const legoFacts = [
  "Lego produces over 20 billion pieces every year.",
  "The word 'Lego' comes from the Danish 'leg godt', meaning 'play well'.",
  "There are more Lego minifigures than people on Earth.",
  "Lego bricks made today are compatible with bricks from 1958.",
  "The Lego Group was founded in 1932 by Ole Kirk Christiansen.",
  "Lego is the world's largest tyre manufacturer by volume, making tiny tyres for its sets."
];

const factButton = document.getElementById('fact-button');
const factText = document.getElementById('fact-text');

function showFact() {
    const randomIndex = Math.floor(Math.random() * legoFacts.length);
    factText.textContent = legoFacts[randomIndex];
}

