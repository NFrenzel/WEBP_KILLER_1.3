chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "convertToPNG",
      title: "Convert to PNG",
      contexts: ["image"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "convertToPNG" && info.srcUrl) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: convertImage,
        args: [info.srcUrl]
      });
    }
  });
  
  function convertImage(srcUrl) {
    fetch(srcUrl)
      .then(res => res.blob())
      .then(blob => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(blob => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "converted.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }, "image/png");
        };
        img.src = URL.createObjectURL(blob);
      });
  }