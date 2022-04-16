import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ButtonPrimary } from "../components/buttonPrimary";
import { TextField } from "../components/textField";
import { Link } from "react-router-dom";
import { gql, useApolloClient } from "@apollo/client";
import globals from "../globals";
import useTitle from "../hooks/useTitle";
import useCurrentUser from "../hooks/useCurrentUser";

interface Props {
  signIn: boolean;
}

const signInMutation = (email: string, password: string) => gql`
mutation {
  login(email: "${email}", password: "${password}") {
    accessToken
    refreshToken
  }
}
`;

const signUpMutation = (email: string, password: string, name: string) => gql`
mutation {
  register(email: "${email}", password: "${password}", name: "${name}") {
    accessToken
    refreshToken
  }
}
`;

export default function Auth({ signIn }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const client = useApolloClient();
  const user = useCurrentUser(false);
  const navigate = useNavigate();

  useTitle("Flavory - " + signIn ? "Sign In" : "Sign Up");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 8 && !signIn) {
      setError("Password has to be at least 8 characters.");
      return;
    }
    const mutation = signIn
      ? signInMutation(email, password)
      : signUpMutation(email, password, name);
    try {
      const res = await client.mutate({
        mutation: mutation,
      });
      if (res.errors) {
        setError(res.errors[0].message);
        return;
      }
      const { accessToken, refreshToken } = signIn
        ? res.data.login
        : res.data.register;
      localStorage.setItem("refreshToken", refreshToken);
      globals.accessToken = accessToken;
      navigate("/feed");
    } catch (e: any) {
      setError((e + "").replace("Error: ", ""));
      return;
    }
  };

  if (user) {
    return <Navigate to="/feed" />;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-100 flex flex-col space-y-9 bg-white px-8 pt-10 pb-24 shadow-lg shadow-primary-200">
        <span className="h1 text-center">Flavory</span>
        <form
          className="flex flex-col justify-center space-y-9"
          onSubmit={submit}
        >
          {!signIn && (
            <TextField
              type="text"
              label="Name"
              value={name}
              setValue={setName}
              required={!signIn}
            />
          )}
          <TextField
            type="email"
            label="Email"
            value={email}
            setValue={setEmail}
            required
          />
          <TextField
            type="password"
            label="Password"
            value={password}
            setValue={setPassword}
            required
          />
          {error && <span className="h6 text-error">{error}</span>}
          <ButtonPrimary className="mx-auto">
            {signIn ? "Sign In" : "Sign Up"}
          </ButtonPrimary>
          <p className="h5 !mt-[60px]">
            {signIn ? "Don't have an account? " : "Already have an account? "}
            {
              <Link
                to={signIn ? "/signUp" : "/signIn"}
                className="text-primary-900"
              >
                Click Here
              </Link>
            }
          </p>
        </form>
      </div>
    </div>
  );
}
