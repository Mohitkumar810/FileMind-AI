// ======================================
// FileMind AI - Login JavaScript
// Flask + MongoDB Backend
// ======================================

const API_URL = "http://127.0.0.1:5000";

let currentMode = "login";
let currentMethod = "email";


// ======================================
// PAGE LOAD
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    showLogin();

    selectMethod("email");

});


// ======================================
// LOGIN MODE
// ======================================

function showLogin() {

    currentMode = "login";

    document
        .getElementById("loginTab")
        .classList.add("active");

    document
        .getElementById("signupTab")
        .classList.remove("active");


    document.getElementById("title")
        .textContent = "Welcome back";

    document.getElementById("subtitle")
        .textContent =
        "Login to continue to your workspace";


    document
        .getElementById("nameBox")
        .classList.add("hidden");

    document
        .getElementById("confirmBox")
        .classList.add("hidden");


    document
        .getElementById("submitButton")
        .innerHTML =
        `Login <span>→</span>`;
}


// ======================================
// SIGN UP MODE
// ======================================

function showSignup() {

    currentMode = "signup";

    document
        .getElementById("loginTab")
        .classList.remove("active");

    document
        .getElementById("signupTab")
        .classList.add("active");


    document.getElementById("title")
        .textContent =
        "Create your account";

    document.getElementById("subtitle")
        .textContent =
        "Sign up to start using FileMind AI";


    document
        .getElementById("nameBox")
        .classList.remove("hidden");

    document
        .getElementById("confirmBox")
        .classList.remove("hidden");


    document
        .getElementById("submitButton")
        .innerHTML =
        `Create Account <span>→</span>`;
}


// ======================================
// EMAIL / PHONE
// ======================================

function selectMethod(method) {

    currentMethod = method;


    const emailTab =
        document.getElementById("emailTab");

    const phoneTab =
        document.getElementById("phoneTab");

    const emailBox =
        document.getElementById("emailBox");

    const phoneBox =
        document.getElementById("phoneBox");


    if (method === "email") {

        emailTab.classList.add("active");

        phoneTab.classList.remove("active");

        emailBox.classList.remove("hidden");

        phoneBox.classList.add("hidden");

    }

    else {

        emailTab.classList.remove("active");

        phoneTab.classList.add("active");

        emailBox.classList.add("hidden");

        phoneBox.classList.remove("hidden");

    }

}


// ======================================
// PASSWORD VISIBILITY
// ======================================

function togglePassword() {

    const password =
        document.getElementById("password");

    const eyeButton =
        document.getElementById("eyeButton");


    if (password.type === "password") {

        password.type = "text";

        eyeButton.textContent = "🙈";

    }

    else {

        password.type = "password";

        eyeButton.textContent = "👁";

    }

}


// ======================================
// FORM SUBMIT
// ======================================

async function handleSubmit(event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // ==================================
    // REGISTER
    // ==================================

    if (currentMode === "signup") {


        if (!name) {

            alert("Please enter your full name.");

            return;
        }


        if (
            currentMethod === "email" &&
            !email
        ) {

            alert("Please enter your email.");

            return;
        }


        if (
            currentMethod === "phone" &&
            !phone
        ) {

            alert("Please enter your phone number.");

            return;
        }


        if (!password) {

            alert("Please enter a password.");

            return;
        }


        if (password.length < 6) {

            alert(
                "Password must contain at least 6 characters."
            );

            return;
        }


        if (password !== confirmPassword) {

            alert(
                "Passwords do not match."
            );

            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/register`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            email:
                                currentMethod === "email"
                                    ? email
                                    : "",

                            phone:
                                currentMethod === "phone"
                                    ? phone
                                    : "",

                            password: password

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Registration failed."
                );

                return;
            }


            alert(
                "Account created successfully!"
            );


            showLogin();


            document.getElementById("password")
                .value = "";

            document.getElementById("confirmPassword")
                .value = "";


        }

        catch (error) {

            console.error(error);

            alert(
                "Cannot connect to the backend.\n\n" +
                "Please make sure Flask is running on port 5000."
            );

        }


        return;
    }


    // ==================================
    // LOGIN
    // ==================================

    if (!password) {

        alert("Please enter your password.");

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/login`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        email:
                            currentMethod === "email"
                                ? email
                                : "",

                        phone:
                            currentMethod === "phone"
                                ? phone
                                : "",

                        password: password

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Login failed."
            );

            return;
        }


        // Save logged-in user
        localStorage.setItem(
            "filemindUser",
            JSON.stringify(data.user)
        );


        localStorage.setItem(
            "filemindLoggedIn",
            "true"
        );


        alert(
            "Login successful!"
        );


        window.location.href =
            "index.html";


    }

    catch (error) {

        console.error(error);

        alert(
            "Cannot connect to the backend.\n\n" +
            "Please make sure Flask is running on port 5000."
        );

    }

}


// ======================================
// FORGOT PASSWORD
// ======================================

function forgotPassword() {

    alert(
        "Password reset functionality will be connected to the backend later."
    );

}


// ======================================
// CONTINUE AS GUEST
// ======================================

function continueAsGuest() {

    localStorage.setItem(
        "filemindGuest",
        "true"
    );


    window.location.href =
        "index.html";

}