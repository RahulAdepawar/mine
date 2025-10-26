
var maxParticleCount = 150; //set max confetti count
var particleSpeed = 2; //set the particle animation speed
var startConfetti; //call to start confetti animation
var stopConfetti; //call to stop adding confetti
var toggleConfetti; //call to start or stop the confetti animation depending on whether it's already running
var removeConfetti; //call to stop the confetti animation and remove all confetti immediately
var check_card_open = false;

function getTimeRemaining(endtime) {
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor((t / 1000) % 60);
	var minutes = Math.floor((t / 1000 / 60) % 60);
	var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	var days = Math.floor(t / (1000 * 60 * 60 * 24));
	return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	};
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  async function updateClock() { // 👈 Make this async
    var t = getTimeRemaining(endtime);

    daysSpan.innerHTML = ('0' + t.days).slice(-2);
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
      document.getElementsByClassName('first_section')[0].style.display = 'none';
      document.getElementById("clear_all_confirm").style.display = 'block';

      const ui = {
        confirm: async (message) => createConfirm(message)
      };

      const confirm = await ui.confirm('Kitna Pyaar Karte Ho 😒?');
      if (confirm) {
        alert('Nahi Bolte to dikhata hi nahi 😒...');

	    document.getElementsByClassName('second_section')[0].style.display = 'none';
		frame();
      } else {
        alert('Ab yeh fatake fut rahe yeh dekh ke sojao 😠😤😤');
      }
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

var deadline = new Date('October 27, 2025 00:00:00');
initializeClock('clockdiv', deadline);

function frame() {
	let element = document.getElementsByClassName("second_section")[0];
	Object.assign(element.style, {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-evenly",
		height: "100vh",
	});
}

// window.onload = frame();

document.getElementsByTagName('button')[0].addEventListener("click", next_page);

document.getElementsByClassName('birthdaycard')[0].addEventListener('click', () => {
	check_card_open = true;
});

function next_page() {

	if (!check_card_open) {
		alert("Pehle Card dekho. Uspe Tap/Click Karoge to open hoga.");
		return;
	}

	var colors = ["#2044e7ff", "#f21010ff"];
	var duration = 60 * 1000; // 15 minutes in milliseconds
	var endTime = Date.now() + duration;

	confetti({
		particleCount: 70,
		angle: 60,
		spread: 60,
		origin: { x: 0 },
		colors: colors,
	});
	confetti({
		particleCount: 70,
		angle: 140,
		spread: 60,
		origin: { x: 1 },
		colors: colors,
	});

	if (Date.now() < endTime) {
		requestAnimationFrame(frame);
	}

	document.body.removeAttribute("style");
	document.getElementsByTagName('button')[0].style.display = 'none';
	document.getElementsByClassName('birthdaycard')[0].style.display = 'none';
	document.getElementsByClassName('first-container')[0].style.display = 'block';

	const audio = document.getElementById('bg-music');

	if (audio.paused) {
		audio.play();
	} else {
		audio.pause();
	}
}

(function () {
	startConfetti = startConfettiInner;
	stopConfetti = stopConfettiInner;
	toggleConfetti = toggleConfettiInner;
	removeConfetti = removeConfettiInner;
	var colors = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"];
	var streamingConfetti = false;
	var animationTimer = null;
	var particles = [];
	var waveAngle = 0;

	function resetParticle(particle, width, height) {
		particle.color = colors[(Math.random() * colors.length) | 0];
		particle.x = Math.random() * width;
		particle.y = Math.random() * height - height;
		particle.diameter = Math.random() * 10 + 5;
		particle.tilt = Math.random() * 10 - 10;
		particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
		particle.tiltAngle = 0;
		return particle;
	}

	function startConfettiInner() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		window.requestAnimFrame = (function () {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) {
					return window.setTimeout(callback, 16.6666667);
				};
		})();
		var canvas = document.getElementById("confetti-canvas");
		if (canvas === null) {
			canvas = document.createElement("canvas");
			canvas.setAttribute("id", "confetti-canvas");
			canvas.setAttribute("style", "display:block;z-index:999999;pointer-events:none");
			document.body.appendChild(canvas);
			canvas.width = width;
			canvas.height = height;
			window.addEventListener("resize", function () {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
			}, true);
		}
		var context = canvas.getContext("2d");
		while (particles.length < maxParticleCount)
			particles.push(resetParticle({}, width, height));
		streamingConfetti = true;
		if (animationTimer === null) {
			(function runAnimation() {
				context.clearRect(0, 0, window.innerWidth, window.innerHeight);
				if (particles.length === 0)
					animationTimer = null;
				else {
					updateParticles();
					drawParticles(context);
					animationTimer = requestAnimFrame(runAnimation);
				}
			})();
		}
	}

	function stopConfettiInner() {
		streamingConfetti = false;
	}

	function removeConfettiInner() {
		stopConfetti();
		particles = [];
	}

	function toggleConfettiInner() {
		if (streamingConfetti)
			stopConfettiInner();
		else
			startConfettiInner();
	}

	function drawParticles(context) {
		var particle;
		var x;
		for (var i = 0; i < particles.length; i++) {
			particle = particles[i];
			context.beginPath();
			context.lineWidth = particle.diameter;
			context.strokeStyle = particle.color;
			x = particle.x + particle.tilt;
			context.moveTo(x + particle.diameter / 2, particle.y);
			context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
			context.stroke();
		}
	}

	function updateParticles() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		var particle;
		waveAngle += 0.01;
		for (var i = 0; i < particles.length; i++) {
			particle = particles[i];
			if (!streamingConfetti && particle.y < -15)
				particle.y = height + 100;
			else {
				particle.tiltAngle += particle.tiltAngleIncrement;
				particle.x += Math.sin(waveAngle);
				particle.y += (Math.cos(waveAngle) + particle.diameter + particleSpeed) * 0.5;
				particle.tilt = Math.sin(particle.tiltAngle) * 15;
			}
			if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
				if (streamingConfetti && particles.length <= maxParticleCount)
					resetParticle(particle, width, height);
				else {
					particles.splice(i, 1);
					i--;
				}
			}
		}
	}
})();

// PArty Popper js
const popString = document.getElementById("popper-string");
const popPaper = document.getElementById("popper-paper");
const popBody = document.getElementById("popper-body");
const popContainer = document.getElementById("popper-container");

// popString.addEventListener("click", StringRespondClick);

function StringRespondClick() {
	popBody.addEventListener("click", BodyRespondClick)
	popBody.classList.add('active')
	popString.removeEventListener("click", StringRespondClick)
	popString.classList.add('active')
	popPaper.classList.add('active')
	confetti({
		colors: ['#35ABCD'],
		angle: 45,
		particleCount: 500,
		spread: 150,
		origin: {
			y: .825,
			x: .1,
		}
	});
}

function BodyRespondClick() {
	popBody.removeEventListener("click", BodyRespondClick)
	popString.addEventListener("click", StringRespondClick)
	popString.classList.remove('active')
	popString.classList.add('active2')
	popPaper.classList.remove('active')
	popBody.classList.remove('active')
	popBody.classList.add('active2')
	popPaper.classList.add('active2')
}

const createConfirm = (message) => {
	return new Promise((resolve, reject) => {
		const confirmBox = document.querySelector('.confirm');
		const confirmMessage = document.getElementById('confirmMessage');
		const btnYes = document.getElementById('confirmYes');
		const btnNo = document.getElementById('confirmNo');

		// Set message
		confirmMessage.textContent = message;

		// Remove any previous event listeners
		btnYes.replaceWith(btnYes.cloneNode(true));
		btnNo.replaceWith(btnNo.cloneNode(true));

		// Re-select after cloning
		const newYes = document.getElementById('confirmYes');
		const newNo = document.getElementById('confirmNo');
		newYes.value = "Bohot";
		newNo.value = "Bilkul Nahi";

		// Show the confirm box
		confirmBox.style.display = 'block';

		// Handle buttons
		newYes.addEventListener('click', () => {
			confirmBox.style.display = 'none';
			resolve(true);
		});

		newNo.addEventListener('click', () => {
			confirmBox.style.display = 'none';
			resolve(false);
		});
	});
};

// const save = async () => {
	
// };
