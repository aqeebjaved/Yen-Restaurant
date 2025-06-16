import { TextInput, Alert } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "../firebase";
import { updateStart, updateSuccess, updateFailure } from "../redux/user/userSlice";
import { enqueueSnackbar } from "notistack";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setImageFileUploadError(null);
    } else {
      setImageFileUploadError("File size must be under 2MB.");
    }
  };

  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);

  const uploadImage = () => {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      () => {
        setImageFileUploadError("Failed to upload image.");
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImageFileUrl(url);
          setFormData((prev) => ({ ...prev, profilePicture: url }));
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);

    if (imageFileUploading) return setUpdateUserError("Wait for the image to finish uploading.");
    if (Object.keys(formData).length === 0) {
      enqueueSnackbar("No changes made.", { variant: "info" });
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/employee/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        enqueueSnackbar("Profile updated successfully!", { variant: "success" });
      }
    } catch (err) {
      dispatch(updateFailure(err.message));
      setUpdateUserError(err.message);
    }
  };

  const fields = [
    { id: "firstname", label: "First Name", type: "text" },
    { id: "lastname", label: "Last Name", type: "text" },
    { id: "username", label: "Username", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "phone", label: "Phone", type: "text" },
    { id: "address", label: "Address", type: "text" },
    { id: "nic", label: "NIC", type: "text" },
    { id: "password", label: "Password", type: "password" },
  ];

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6 py-8 bg-white shadow-2xl rounded-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => filePickerRef.current.click()}
            className="relative w-36 h-36 cursor-pointer group rounded-full border-4 border-cyan-600 shadow-lg overflow-hidden"
          >
            <input
              type="file"
              accept="image/*"
              hidden
              ref={filePickerRef}
              onChange={handleImageChange}
            />
            {imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={6}
                className="absolute inset-0"
              />
            )}
            <img
              src={imageFileUrl || currentUser.profilePicture || "https://via.placeholder.com/150"}
              alt="avatar"
              className={`w-full h-full object-cover transition-opacity ${
                imageFileUploading ? "opacity-50" : "opacity-100"
              }`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all" />
          </div>
          <p className="text-sm mt-2 text-gray-600">Click to change profile photo</p>
        </div>

        {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}

        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(({ id, label, type }) => (
            <div key={id}>
              <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700">
                {label}
              </label>
              <TextInput
                id={id}
                type={type}
                placeholder={label}
                defaultValue={currentUser[id]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-cyan-700 hover:bg-cyan-900 text-white font-semibold rounded-md py-2 mt-4 transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {updateUserError && (
        <Alert color="failure" className="mt-6">
          {updateUserError}
        </Alert>
      )}
    </div>
  );
}
