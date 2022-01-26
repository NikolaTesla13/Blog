// import { hash } from "argon2";

export default function RegisterForm() {
  async function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("confirm-password").value;

    if (password != passwordConfirm) {
      document.getElementById("error").innerText =
        "Error: passwords don't match.";
      return;
    }

    // const hashedPassword = await hash(password);

    const user = {
      name: name,
      email: email,
      password: password,
    };

    console.log(user);
  }

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <table>
          <tbody>
            <tr>
              <th style={{ textAlign: "left" }}>
                <h3>Register</h3>
              </th>
              <th></th>
            </tr>
            <tr>
              <td>
                <label htmlFor="name">Name</label>
              </td>
              <td>
                <input type="text" id="name" />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="email">Email</label>
              </td>
              <td>
                <input type="email" id="email" />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="password">Password</label>
              </td>
              <td>
                <input type="password" id="password" />
              </td>
            </tr>
            <tr>
              <td>
                <label
                  htmlFor="confirm-password"
                  style={{ marginRight: 2 + "rem" }}
                >
                  Confirm Password
                </label>
              </td>
              <td>
                <input type="password" id="confirm-password" />
              </td>
            </tr>
          </tbody>
        </table>
        <input
          type="submit"
          value="Register"
          style={{
            fontSize: 1 + "rem",
            marginTop: 1 + "rem",
            marginBottom: 1 + "rem",
            cursor: "pointer",
          }}
        />
      </form>
      <p id="error"></p>
    </div>
  );
}
