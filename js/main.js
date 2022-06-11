"use strict";

const hamburgerButton = document.querySelector(".hamburger");
const mobileNavigation = document.querySelector(".navbar__list-mobile");
const navItems = [...document.querySelectorAll(".navbar__list-mobile a")];
const navLogo = document.querySelector(".navbar__logo");
const exampleButtons = [
	...document.querySelectorAll(".example__navigation-desktop-button"),
];
const exampleImage = document.querySelector(".example__image");
const formNameInput = document.querySelector(".order__input--name");
const formRodoInput = document.querySelector(".order__input--rodo");
const formRegulationsInput = document.querySelector(
	".order__input--regulations"
);
const formSurrNameInput = document.querySelector(".order__input--surrname");
const formEmailInput = document.querySelector(".order__input--email");
const formAmountInput = document.querySelector(".order__input--amount");
const formSubmitButton = document.querySelector(".order__submit");
const formTotalPrice = document.querySelector(".order__total-price");
const formTotalAmount = document.querySelector(".order__total-amount");
const formCurrentPrice = document.querySelector(".order__current-price");
const formCheckboxError = document.querySelector(".order__checkbox-error");
const googleCaptcha = document.querySelector(".g-recaptcha");
const modal = document.querySelector(".modal");
const modalButton = document.querySelector(".modal__button");
let activeExampleButton = document.querySelector(
	".example__navigation-desktop-button--active"
);

const handleMobileNavigation = () => {
	hamburgerButton.classList.toggle("hamburger--active");
	mobileNavigation.classList.toggle("navbar__list--active");
	document.body.classList.toggle("sticky-body");
};

const handleNavbarLogo = () => {
	if (hamburgerButton.classList.contains("hamburger--active")) {
		handleMobileNavigation();
	}
};

const handleModal = () => {
	modal.classList.toggle("modal--active");
	document.body.classList.toggle("sticky-body");
};

const toggleActiveExampleButton = e => {
	activeExampleButton.classList.remove(
		"example__navigation-desktop-button--active"
	);
	e.target.classList.add("example__navigation-desktop-button--active");
	activeExampleButton = e.target;
};

const changeExampleImage = e => {
	exampleImage.src = `./assets/mobile/${e.target.dataset.example}.webp`;
	toggleActiveExampleButton(e);
};

const showErrorMessage = (input, message) => {
	const errorText = input.nextElementSibling;
	errorText.classList.add("order__error-text--active");
	errorText.textContent = message;
	input.dataset.error = "true";
};

const clearErrorMessage = input => {
	const errorText = input.nextElementSibling;
	errorText.classList.remove("order__error-text--active");
	errorText.textContent = "";
	input.dataset.error = "false";
};

const checkInputValue = inputArray => {
	inputArray.forEach(input => {
		if (input.value.trim()) {
			clearErrorMessage(input);
		} else {
			showErrorMessage(
				input,
				`Pole ${input.previousElementSibling.textContent.slice(
					0,
					-1
				)} jest wymagane.`
			);
		}
	});
};

const checkIfNumber = value => isFinite(value) && value % 1 === 0 && value > 0;

const checkEmail = email => {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.value)
		? clearErrorMessage(email)
		: showErrorMessage(email, "Podaj poprawny adres email.");
};

const checkAmount = input =>
	checkIfNumber(parseInt(input.value))
		? clearErrorMessage(input)
		: showErrorMessage(input, "Podaj poprawną ilość.");

const showCheckboxError = () => {
	formCheckboxError.classList.add("order__checkbox-error--active");
	formCheckboxError.dataset.error = "true";
};
const clearCheckboxError = () => {
	formCheckboxError.classList.remove("order__checkbox-error--active");
	formCheckboxError.dataset.error = "false";
};

const checkCheckbox = inputs => {
	clearCheckboxError();
	inputs.forEach(input => {
		if (!input.checked) {
			showCheckboxError();
		}
	});
};

const checkForm = e => {
	e.preventDefault();
	checkInputValue([
		formNameInput,
		formSurrNameInput,
		formEmailInput,
		formAmountInput,
	]);
	checkEmail(formEmailInput);
	checkAmount(formAmountInput);
	checkCheckbox([formRodoInput]);
	checkCaptcha(googleCaptcha);
	const submitForm = inputArray => {
		let errors = 0;
		inputArray.forEach(input => {
			if (input.dataset.error === "true") {
				errors++;
			}
		});
		if (errors === 0) {
			const totalOrderPrice = parseInt(inputArray[3].value) * 95;

			const emailData = {
				personName: inputArray[0].value,
				personSurrName: inputArray[1].value,
				personEmail: inputArray[2].value,
				orderAmount: inputArray[3].value,
				orderPrice: totalOrderPrice,
			};
			emailjs
				.send("default_service", "template_62zoe7t", emailData)
				.then(() => {
					handleModal();
					emailjs.send("default_service", "template_h4o6b34", emailData);
				});

			clearForm(inputArray);
		}
	};

	submitForm([
		formNameInput,
		formSurrNameInput,
		formEmailInput,
		formAmountInput,
		googleCaptcha,
		formCheckboxError,
	]);
};
const checkCaptcha = input =>
	input.dataset.error === "false"
		? clearErrorMessage(input)
		: showErrorMessage(input, "Zaznacz odpowiednie pole.");

const countTotalOrderPrice = e => {
	const amountNumber = parseInt(e.target.value);
	if (checkIfNumber(amountNumber)) {
		updateTotalOrderPrice(amountNumber * 95);
		updateTotalOrderAmount(amountNumber);
	} else {
		updateTotalOrderPrice(0);
	}
};
const clearForm = inputArray => {
	formTotalAmount.textContent = "0";
	formTotalPrice.textContent = "0";
	formRodoInput.checked = false;
	grecaptcha.reset();
	googleCaptcha.dataset.error = 'true';
	inputArray.forEach(input => (input.value = ""));
};

const updateCurrentPrice = () => (formCurrentPrice.textContent = 95);

const updateTotalOrderAmount = totalAmount =>
	(formTotalAmount.textContent = totalAmount);

const updateTotalOrderPrice = totalPrice =>
	(formTotalPrice.textContent = totalPrice);

function updateCaptchaStatus() {
	googleCaptcha.dataset.error = "false";
}

const setIntersectionObserver = () => {
	const imageObserver = new IntersectionObserver((entries, imgObserver) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const lazyImage = entry.target;
				lazyImage.src = lazyImage.dataset.src;
				lazyImage.classList.remove("lazy-load-image");
				imgObserver.unobserve(lazyImage);
			}
		});
	});
	const arr = document.querySelectorAll("img.lazy-load-image");
	arr.forEach(v => {
		imageObserver.observe(v);
	});
};

const initLibrary = (src, isAsync) => {
	const head = document.head;
	const scriptTag = document.createElement("script");
	scriptTag.type = "text/javascript";
	scriptTag.src = src;
	head.append(scriptTag);

	if (isAsync) {
		scriptTag.async = true;
		scriptTag.defer = true;
	}
};

const initLibraries = () => {
	initLibrary("https://www.google.com/recaptcha/api.js", true);
	initLibrary(
		"https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js",
		false
	);

	googleCaptcha.dataset.error = "true";

	setTimeout(() => {
		emailjs.init("user_HpC2yJwhQIejkLboKnih9");
	}, 2000);
	formNameInput.removeEventListener("focus", initLibraries);
};

document.addEventListener("DOMContentLoaded", () => {
	navItems.forEach(item =>
		item.addEventListener("click", handleMobileNavigation)
	);
	exampleButtons.forEach(button =>
		button.addEventListener("click", changeExampleImage)
	);
	hamburgerButton.addEventListener("click", handleMobileNavigation);
	navLogo.addEventListener("click", handleNavbarLogo);
	formSubmitButton.addEventListener("click", checkForm);
	formAmountInput.addEventListener("keyup", countTotalOrderPrice);
	modalButton.addEventListener("click", handleModal);
	formNameInput.addEventListener("focus", initLibraries);
	updateCurrentPrice();
	setIntersectionObserver();
});
