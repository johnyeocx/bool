import { useState } from "react";
import { useQuery, gql } from "@apollo/client";

const USER = gql`
  query User($username: String!) {
    user(username: $username) {
      email
      username
      profileImg
    }
  }
`;

const SearchUser = () => {
  const [user, setUser] = useState("");
  const [checkTextField, setCheckTextField] = useState("");

  const { loading, error, data } = useQuery(USER, {
    variables: { username: user },
  });

  if (loading) return <p>Loading...</p>;
  let input;

  return (
    <div>
      <h1>Search a User</h1>
      <form>
        <p>{error ? error.message : "Found"}</p>
        <input
          type="text"
          placeholder="Your User to Check"
          name="name"
          style={{ display: "block", margin: "10px 0px" }}
          value={checkTextField}
          onChange={(e) => {
            setCheckTextField(e.target.value);
          }}
        />
        <button
          style={{ margin: "10px 0px 10px" }}
          onClick={(e) => {
            e.preventDefault();
            setUser(checkTextField);
          }}
        >
          Check
        </button>
        <h2>Username: {error ? null : data.user.username}</h2>
        <h2>Email: {error ? null : data.user.email}</h2>
        <img
          src={error ? "error" : data.user.profileImg}
          alt="no user"
          height="100px"
          width="100px"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </form>
    </div>
  );
};

export default SearchUser;
