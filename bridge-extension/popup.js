const statusLine = document.getElementById("status");
const appImportUrl = "https://erikmaele.github.io/GMAT/#tab-import";

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
    return true;
  } catch (error) {
    setStatus(`Copy failed: ${error.message}`);
    return false;
  }
}

async function copyAndOpenApp() {
  const copied = await copyCapture();
  if (!copied) return;
  await chrome.tabs.create({ url: appImportUrl });
  setStatus("Copied. Paste into Import with Ctrl+V.");
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

document.getElementById("copy-open-capture").addEventListener("click", copyAndOpenApp);
document.getElementById("copy-capture").addEventListener("click", copyCapture);
document.getElementById("download-capture").addEventListener("click", downloadCapture);
