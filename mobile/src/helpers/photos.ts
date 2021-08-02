export const getBlob = async (fileUri: string) => {
  const resp = await fetch(fileUri);
  const imageBody = await resp.blob();
  return imageBody;
};

export const uploadImage = async (uploadUrl: string, data: string) => {
  const imageBody = await getBlob(data);

  return fetch(uploadUrl, {
    method: "PUT",
    body: imageBody,
  });
};
