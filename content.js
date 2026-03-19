function convertWebPToPNG(imgElement) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Full resolution for export
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;

    ctx.drawImage(imgElement, 0, 0);

    // Ensure Preview Fits Inside Extenson
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";

    // Convert to PNG
    const pngDataURL = canvas.toDataURL("image/png");

    // Button
    const btn = document.createElement("button");
    btn.textContent = "Convert to PNG";
    btn.style.marginTop = "10px";
    btn.style.backgroundColor = "#4CAF50";
    btn.style.color = "white";
    btn.style.padding = "5px 10px";
    btn.style.cursor = "pointer";

    btn.addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = pngDataURL;
        a.download = "converted.png";
        a.click();
    });

    // Insert canvas + button
    imgElement.parentElement.insertBefore(canvas, imgElement.nextSibling);
    imgElement.parentElement.insertBefore(btn, canvas.nextSibling);
}

// Find WebP images
document.querySelectorAll("img").forEach(img => {
    if (img.src.endsWith(".webp") || img.currentSrc.includes("webp")) {
        const tempImg = new Image();
        tempImg.crossOrigin = "Anonymous";
        tempImg.src = img.src;

        tempImg.onload = () => convertWebPToPNG(tempImg);
    }
});
