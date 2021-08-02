import { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const CREATE_USER = gql`
  mutation CreateUser($input: NewUser!) {
    createUser(input: $input)
  }
`;

function CreateUser() {
  const [createUser] = useMutation(CREATE_USER, {
    onError(err) {
      console.log(err);
      alert(err);
    },
  });
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    profileImg: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = {
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      profileImg: newUser.profileImg,
    };
    console.log(newUser.profileImg);
    const response = createUser({ variables: { input: input } });
  };

  return (
    <div>
      <form>
        <h1>Create A New User</h1>
        <label>
          Username:
          <input
            type="text"
            placeholder="Name..."
            name="name"
            style={{ display: "block", margin: "10px 0px" }}
            onChange={(e) => {
              setNewUser({ ...newUser, username: e.target.value });
            }}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            placeholder="Name..."
            name="name"
            style={{ display: "block", margin: "10px 0px" }}
            onChange={(e) => {
              setNewUser({ ...newUser, email: e.target.value });
            }}
          />
        </label>
        <label>
          Password:
          <input
            type="text"
            placeholder="Name..."
            name="name"
            style={{ display: "block", margin: "10px 0px" }}
            onChange={(e) => {
              setNewUser({ ...newUser, password: e.target.value });
            }}
          />
        </label>
        <label>
          Display Image:
          <input
            type="file"
            style={{ display: "block", margin: "10px 0px 50px" }}
            onChange={(e) => {
              setNewUser({ ...newUser, profileImg: e.target.files[0] });
            }}
          />
        </label>
        <input
          type="submit"
          onClick={handleSubmit}
          value="Create User"
          style={{
            display: "block",
            margin: "10px 0px",
            fontWeight: 700,
            height: "30px",
            width: "150px",
          }}
        />
      </form>
    </div>
  );
}

export default CreateUser;
