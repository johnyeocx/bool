import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import axios from "axios";
import { Link } from "react-router-dom";

const GET_URL = gql`
  mutation UploadPhoto($input: String!) {
    uploadPhoto(input: $input)
  }
`;

const ADD_PHOTOS = gql`
  mutation AddPhotos($input: AddPhotos!) {
    addPhotos(input: $input)
  }
`;

function Event({ currentEvent, setCurrentEvent }) {
  const [toUpload, setToUpload] = useState();

  const [uploadPhoto] = useMutation(GET_URL, {
    onError(err) {
      console.log(err);
    },
  });

  const [addPhotos] = useMutation(ADD_PHOTOS, {
    onError(err) {
      console.log(err);
    },
  });

  if (!currentEvent) {
    return <div>Click on an event</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let urlArray = [];
    var bar = new Promise((resolve, reject) => {
      for (let i = 0; i < toUpload.length; i++) {
        let file = toUpload[i];
        uploadPhoto({
          variables: { input: currentEvent.id },
        }).then((data) => {
          const url = data.data.uploadPhoto;
          console.log(url);
          urlArray = [url[1]];
          axios.put(url[0], file, {
            headers: { "Content-Type": file.type },
          });
          addPhotos({
            variables: {
              input: {
                eventId: currentEvent.id,
                photoUrls: urlArray,
              },
            },
          });
          setCurrentEvent({
            ...currentEvent,
            photos: [...currentEvent.photos, url[1]],
          });
        });
      }
    });

    bar.then(() => {
      console.log(urlArray);
    });
  };
  console.log(currentEvent.photos);

  return (
    <div>
      <h2>{currentEvent.name}</h2>
      <h3>{currentEvent.date}</h3>
      <h3>{currentEvent.description}</h3>
      <form>
        <label>
          Add new photos:
          <input
            type="file"
            style={{ display: "block", margin: "10px 0px" }}
            multiple
            onChange={(e) => {
              setToUpload(e.target.files);
            }}
          />
        </label>
        <input
          type="submit"
          onClick={handleSubmit}
          value="Add Photos"
          style={{
            display: "block",
            margin: "10px 0px 30px",
            fontWeight: 700,
            height: "30px",
            width: "150px",
          }}
        />
      </form>
      <h3>Photos: </h3>
      <div
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "start",
          flexDirection: "row",
        }}
      >
        {currentEvent.photos
          ? currentEvent.photos.map((photo) => {
              return (
                <img
                  src={photo}
                  alt=""
                  style={{
                    height: "150px",
                    width: "150px",
                    objectFit: "cover",
                    borderRadius: "10%",
                    display: "flex",
                    marginRight: "30px",
                    marginBottom: "10px",
                  }}
                />
              );
            })
          : "no photos in this event"}
      </div>
      <Link
        to={`/event-chat`}
        onClick={() => {
          console.log("moving pages");
        }}
      >
        Chat
      </Link>
      {/* <p key={i}>{event.name}</p> */}
    </div>
  );
}

export default Event;
