import { useRef, useContext } from "react";

import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const checkPassword = (password) => {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password);
};

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    // add validation
    const passwordIsValid = checkPassword(enteredNewPassword);

    if (!passwordIsValid) {
      alert("Password doesn't meet the requirements. Please try again.");
      return;
    }

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCyA3jsUjk0y6NxwqCK7sZrWYl_3alnsiA",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        // assumption: Always succeeds!
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Password changed failed. Please try again.";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        alert("Password change was successful.");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
