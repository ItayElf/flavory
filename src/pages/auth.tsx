import { FormEvent, useState } from "react";
import { ButtonPrimary } from "../components/buttonPrimary";
import { TextField } from "../components/textField";
import { Link } from "react-router-dom";

interface Props {
  signIn: boolean;
}

export function Auth({ signIn }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-full items-center justify-center">
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
              required={signIn}
            />
          )}
          <TextField
            type="text"
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
          <ButtonPrimary className="mx-auto">
            {signIn ? "Sign In" : "Sign Up"}
          </ButtonPrimary>
          <p className="h5 !mt-[60px]">
            {signIn ? "Don't have an account? " : "Already have an account? "}
            {
              <Link to={"#"} className="text-primary-900">
                Click Here
              </Link>
            }
          </p>
        </form>
      </div>
    </div>
  );
}
