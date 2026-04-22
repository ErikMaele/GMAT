const statusLine = document.getElementById("status");

function setStatus(message) {
  statusLine.textContent = message;
}

async function captureVisiblePage() {
  return chrome.tabs.captureVisibleTab(undefined, { format: "png" });
}

async function copyCapture() {
  setStatus("Capturing visible tab...");
  try {
    const dataUrl = await captureVisiblePage();
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob
      })
    ]);
    setStatus("Copied. Open the GMAT Optimizer Import tab and paste.");
  } catch (error) {
    setStatus(`Copy failed: ${error.message}`);
  }
}

async function downloadCapture() {
  setStatus("Capturing visible tab...");
  try {
    const dataUrl = await captureVisiblePage();
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    await chrome.downloads.download({
      url: dataUrl,
      filename: `gmat-result-${stamp}.png`,
      saveAs: false
    });
    setStatus("Downloaded PNG. Drop it into the Import tab.");
  } catch (error) {
    setStatus(`Download failed: ${error.message}`);
  }
}

document.getElementById("copy-capture").addEventListener("click", copyCapture);
document.getElementById("download-capture").addEventListener("click", downloadCapture);
