const pasteArea = document.getElementById("pasteArea");
const pasteMessage = document.getElementById("pasteMessage");
const previewContainer = document.getElementById("previewContainer");
const downloadButton = document.getElementById("downloadButton");

let pngDataUrl = null;

pasteArea.addEventListener("click", () => {
  pasteArea.focus();
});

document.addEventListener("paste", async (event) => {
  event.preventDefault();

  const items = event.clipboardData?.items;
  if (!items) return;

  for (const item of items) {
    if (item.type.startsWith("image/")) {
      const blob = item.getAsFile();
      if (!blob) return;

      const objectUrl = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        pngDataUrl = canvas.toDataURL("image/png");

        canvas.style.display = "block";
        canvas.style.maxWidth = "100%";
        canvas.style.height = "auto";

        previewContainer.innerHTML = "";
        previewContainer.appendChild(canvas);

        pasteMessage.style.display = "none";
        downloadButton.disabled = false;

        URL.revokeObjectURL(objectUrl);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        console.error("Failed to load pasted image.");
      };

      img.src = objectUrl;
      break;
    }
  }
});

downloadButton.addEventListener("click", () => {
  if (!pngDataUrl) return;

  const a = document.createElement("a");
  a.href = pngDataUrl;
  a.download = "converted.png";
  a.click();
});
