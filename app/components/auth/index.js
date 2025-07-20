import React, { useState } from "react";
import { AppForm, FormBtn, FormInput } from "../shared/Form";
import * as Yup from "yup";
import Button from "../shared/Button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";
import { auth, db } from "@/app/utils/firebase";
import Firebase from "firebase";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required().label("Email"),
  password: Yup.string().required().label("Password"),
  checkbox: Yup.string().label("Remember me"),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handelLoginSignUP = (values) => {
    setLoading(true);
    setTimeout(() => {
      if (isLogin) {
        logIn(values.email, values.password);
      } else {
        signUp(values.email, values.password);
      }
      setLoading(false);
    }, 500);
  };
  // login whith facebook
  const loginWithFacebook = () => {
    const provider = new Firebase.auth.FacebookAuthProvider();
    auth
      .signInWithPopup(provider)
      .then((result) => {
        // /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;
        // IdP data available in result.additionalUserInfo.profile.
        // ...

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;

        // ...
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  // login with goole
  const loginWithGoogle = () => {
    const provider = new Firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then((userCredential) => {
        addUserToDatabase(userCredential.user);
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });
  };

  // login with email and password
  const logIn = (email, password) => {
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      alert(error.message);
      console.log(error);
    });
  };
  const signUp = (email, password) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        addUserToDatabase(userCredential.user);
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });
  };

  const addUserToDatabase = async (user) => {
    const { uid, displayName, email, photoURL } = user;
    const userRef = await db.collection("users").doc(uid).get();
    if (!userRef.exists) {
      db.collection("users").doc(uid).set({
        uid,
        name: displayName,
        email,
        image: photoURL,
      });
    }
  };

  return (
    <div className="p-5">
      <div className="mx-auto max-w-[400px] bg-slate-100 rounded-md">
        <div className="p-6 pt-8 my-6 md:my-8">
          <div className="flex justify-center space-x-4 uppercase font-semibold text-xl text-center border-b-2 border-slate-400 pb-6">
            <h1
              className={`${
                isLogin ? "text-slate-700" : "text-slate-400"
              } cursor-pointer text-3xl md:text-4xl`}
              onClick={() => setIsLogin(true)}
            >
              login
            </h1>
            <h1
              className={`${
                !isLogin ? "text-slate-700" : "text-slate-400"
              } cursor-pointer text-3xl md:text-4xl`}
              onClick={() => setIsLogin(false)}
            >
              register
            </h1>
          </div>
          <h2 className="text-sub-title pt-8 pb-6">
            {isLogin ? "Login to Your Account" : "Create Your Account"}
          </h2>

          <AppForm
            initialValues={{
              email: "",
              password: "",
              checkbox: "",
            }}
            onSubmit={handelLoginSignUP}
            validationSchema={validationSchema}
          >
            <FormInput name="email" placeholder="Email" type="email" />
            <FormInput name="password" placeholder="Password" type="password" />
            <FormBtn
              title={isLogin ? "LOGIN" : "SIGN UP"}
              onClick={handelLoginSignUP}
              loading={loading}
            />
          </AppForm>
          <div className="flex justify-center gap-4 flex-col items-center py-6">
            <div className="flex justify-center flex-col border-b-2 w-full pb-4">
              {isLogin ? (
                <>
                  <p className="text-center text-sub-title pb-2">
                    You don&apos;t have any account?
                  </p>
                  <span
                    className="text-title hover:hover-primary cursor-pointer m-auto w-fit"
                    onClick={() => setIsLogin(false)}
                  >
                    Register Now
                  </span>
                </>
              ) : (
                <>
                  <p className="text-center text-sub-title pb-2">
                    Already have an account?
                  </p>
                  <span
                    className="text-title hover:hover-primary cursor-pointer m-auto w-fit"
                    onClick={() => setIsLogin(true)}
                  >
                    LogIn here
                  </span>
                </>
              )}
            </div>

            <p className="pb-2">
              Or
              <span className="text-primary pl-2">Continue with</span>
            </p>
            <Button
              onClick={loginWithGoogle}
              icon={<FcGoogle size={25} />}
              title="Google"
              className={"bg-slate-800 text-white w-full text-lg"}
            />
            <Button
              onClick={loginWithFacebook}
              icon={<FaFacebookSquare size={20} />}
              title="Facebook"
              className={"bg-blue-500 text-white w-full text-lg"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
