import toast from "react-hot-toast";

export const FileType = {
  File: "/google-docs.png",
  Pdf: " /pdf.png",
  Zip: "/zip.png",
  Html: "/html.png",
};

export const findExtension = (url) => {
  if (!url || typeof url !== "string") {
    // console.error("Invalid URL passed to findExtension:", url);
    return "";
  }
  // return url.split(".").reverse()[0];
  const parts = url.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

export const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success("Copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy text:", err);
    });
};
