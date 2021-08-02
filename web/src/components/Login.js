import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { getAccessToken, setAccessToken } from "../AccessToken";

const LOGIN = gql`
  mutation Login($input: Login!) {
    login(input: $input)
  }
`;

const AUTHENTICATE = gql`
  mutation Authenticate {
    authenticate
  }
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessTokenStr, setAccessTokenStr] = useState(getAccessToken());

  // LOGIN
  const [login] = useMutation(LOGIN, {
    onError(err) {
      console.log(err);
      alert(err);
    },
  });

  //AUTHENTICATE
  const [authenticate] = useMutation(AUTHENTICATE, {
    onError(err) {
      console.log(err);
      alert(err);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const input = {
      username,
      password,
    };
    const response = await login({ variables: { input } });
    console.log(response);
    if (response.data) {
      setAccessToken(response.data.login);
      setAccessTokenStr(getAccessToken());
    }
    localStorage.setItem("user", username);
  };
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    console.log("authSubmit");
    console.log(getAccessToken());
    const response = await authenticate();
  };

  return (
    <div>
      <h1>Login</h1>
      <label>
        Username:
        <input
          type="text"
          placeholder="Name..."
          name="name"
          style={{ display: "block", margin: "10px 0px" }}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          placeholder="Name..."
          name="name"
          style={{ display: "block", margin: "10px 0px" }}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </label>
      <input
        type="submit"
        onClick={handleSubmit}
        value="Login"
        style={{
          display: "block",
          margin: "10px 0px",
          fontWeight: 700,
          height: "30px",
          width: "150px",
        }}
      />
      <input
        type="submit"
        onClick={handleAuthSubmit}
        value="Dummy Authenticate"
        style={{
          display: "block",
          margin: "10px 0px",
          fontWeight: 700,
          height: "30px",
          width: "150px",
        }}
      />
      <h5>{accessTokenStr ? accessTokenStr : "No Access Token Found"}</h5>
    </div>
  );
};

export default Login;
