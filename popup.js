const pasteArea = document.getElementById("pasteArea");
const downloadButton = document.getElementById("downloadButton");
const imagePreview = document.createElement("img"); // This will display the thumbnail
const previewContainer = document.createElement("div"); // Container for the preview image
previewContainer.style.textAlign = "center"; // Center the preview image in the container

// Append the preview container to the popup
document.body.insertBefore(previewContainer, downloadButton); // Position it above the download button

// Add event listener for the "paste" event
pasteArea.addEventListener("paste", (e) => {
  const items = e.clipboardData.items;
  let imageBlob = null;

  // Loop through clipboard items to find image
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") === 0) {
      imageBlob = items[i].getAsFile();
      break;
    }
  }

  // If an image was pasted, process it
  if (imageBlob) {
    const img = new Image();
    const reader = new FileReader();
    
    // Convert image to base64 string using FileReader
    reader.onload = function (event) {
      img.src = event.target.result;
      img.onload = function () {
        // Clear the preview container to ensure no old images are behind
        previewContainer.innerHTML = ""; // Remove any previous preview image

        // Show the thumbnail preview
        const aspectRatio = img.width / img.height;
        const maxWidth = 200; // Maximum width for the thumbnail
        const maxHeight = 150; // Maximum height for the thumbnail
        let thumbnailWidth = maxWidth;
        let thumbnailHeight = maxWidth / aspectRatio;

        // Ensure the thumbnail doesn't exceed the max height
        if (thumbnailHeight > maxHeight) {
          thumbnailHeight = maxHeight;
          thumbnailWidth = maxHeight * aspectRatio;
        }

        // Set the thumbnail size
        imagePreview.src = img.src;
        imagePreview.width = thumbnailWidth;
        imagePreview.height = thumbnailHeight;
        imagePreview.alt = "Image Preview";

        // Append the image preview to the container
        previewContainer.appendChild(imagePreview);

        // Enable download button
        downloadButton.disabled = false;

        // When the user clicks the button, convert to PNG and download
        downloadButton.onclick = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "converted.png";
            a.click();
            URL.revokeObjectURL(url);
          }, "image/png");
        };
      };
    };
    reader.readAsDataURL(imageBlob);
  } else {
    alert("Please copy an image to paste.");
  }
});