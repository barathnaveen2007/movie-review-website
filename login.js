const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", loginUser);

async function loginUser() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Fill all fields");
        return;
    }

    try {

        const response = await fetch("/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
            window.location.href = "home.html";
        }

    } catch (error) {
        alert("Unable to connect to the server.");
        console.error(error);
    }

}