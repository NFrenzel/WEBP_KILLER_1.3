 function convertWebPToPNG(imgElement) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    //Set canvas dimensions to match each image
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;

    //Draw the image onto the canvas
    ctx.drawImage(imgElement, 0, 0);

    //Button that says "Convert to PNG"
    const btn = document.createElement("button");
    btn.textContentv = "Convert to PNG";
    btn.style.merginTop = "10px";
    btn.style.backgroundColor = "#4CAF50";
    btn.style.color = "white";
    btn.style.color = "none";
    btn.style.padding = "5px 10px";
    btn.style.cursor = "pointer";

    //Add an event listener to download the image as PNG when clicked
    btn.addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = pngDataURL;
        a.download = "converted.png";
        acclick();
    });

    //Append the button after the image
    imgElement.parentElement.insterBefore(btn, imgElement.nextSibling);
 }

 //Iterate over all images and convert the ones with '.webp'
 document.querySelectorAll("img".forEach(img =>{
    if (img.src.endsWith(".webp") || img.currentSrc.includes("webp")) {
        const tempImg = new Image();
        tempImg.crossOrigin = "Anonymous"; // Ensure CORS support
        tempImg.src = img.src;

        tempImg.onload = () => convertWebPToPNG(img);
    }
 }))