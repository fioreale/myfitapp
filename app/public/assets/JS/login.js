function checkSecret(event) {
  // ─── Get The Entered Secret ──────────────────────────────────────────

  const secret = document.getElementById("secret").value;

  const storedHash =
    "641ce1c6afce2f35205ca6cc7278e9716bc464804f3b9793709238959183a5ff";

  const encoder = new TextEncoder();
  const data = encoder.encode(secret);

  crypto.subtle.digest("SHA-256", data).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    if (hashHex === storedHash) {
      window.location.href = "main.html";
    } else {
      console.log("Password is incorrect");
    }
  });

  event.preventDefault();
}

let form = document.getElementById("loginForm");

form.addEventListener("submit", checkSecret, true);
