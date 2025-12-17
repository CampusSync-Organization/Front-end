import React, { useState, useRef } from "react";

const ImageModal = ({ isOpen, onClose, imgSrc, onUpload }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Main Image */}
        <img
          src={imgSrc}
          alt="Profile Full Screen"
          className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl mb-6"
        />

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onUpload}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-400 transition-colors shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Update Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProfileHeader = ({ user }) => {
  const [avatar, setAvatar] = useState(user.avatar);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      setIsModalOpen(false); // Close modal after selection? Or keep open to show new image? Closing for now to simulate "done".
    }
  };

  return (
    <>
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imgSrc={avatar}
        onUpload={handleUploadClick}
      />

      <div className="w-full bg-white rounded-2xl shadow-md p-8 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          <div
            className="relative group cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              className="w-32 h-32 rounded-xl object-cover shadow-sm transition-opacity group-hover:opacity-90"
              src={avatar}
              alt={`${user.firstName} ${user.lastName}`}
            />
            {/* Small camera icon always visible on hover or maybe just a subtle overlay hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white drop-shadow-lg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          <div className="flex flex-col items-center sm:items-start pt-2">
            <h1 className="text-slate-900 text-3xl font-bold font-['Inter'] mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-slate-600 text-lg font-medium font-['Inter'] mb-3">
              {user.college} • {user.faculty}
            </p>
            <div className="mt-1">
              <span className="text-slate-800 text-base font-bold font-['Inter'] px-3 py-1 bg-slate-100 rounded-md">
                GPA : {user.gpa.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
