chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convertToPNG",
    title: "Convert to PNG",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertToPNG" && info.srcUrl && tab?.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: convertImage,
      args: [info.srcUrl]
    });
  }
});

async function convertImage(srcUrl) {
  let imageObjectUrl = null;
  let downloadObjectUrl = null;

  try {
    const response = await fetch(srcUrl);

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
    }

    const sourceBlob = await response.blob();
    imageObjectUrl = URL.createObjectURL(sourceBlob);

    const img = new Image();

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Image failed to load."));
      img.src = imageObjectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get 2D canvas context.");
    }

    ctx.drawImage(img, 0, 0);

    const pngBlob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas conversion to PNG failed."));
          return;
        }
        resolve(blob);
      }, "image/png");
    });

    downloadObjectUrl = URL.createObjectURL(pngBlob);

    const a = document.createElement("a");
    a.href = downloadObjectUrl;
    a.download = getPngFileName(srcUrl);
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("PNG conversion failed:", error);
    alert("Failed to convert image to PNG. Check the console for details.");
  } finally {
    if (imageObjectUrl) {
      URL.revokeObjectURL(imageObjectUrl);
    }
    if (downloadObjectUrl) {
      URL.revokeObjectURL(downloadObjectUrl);
    }
  }
}

function getPngFileName(srcUrl) {
  try {
    const url = new URL(srcUrl);
    const fileName = url.pathname.split("/").pop() || "converted";
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    return `${baseName}.png`;
  } catch {
    return "converted.png";
  }
}
