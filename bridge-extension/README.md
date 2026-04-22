# GMAT Optimizer Capture Bridge

Prototype Chrome extension for user-triggered visible-page capture.

It is deliberately narrow:

- captures only the currently visible tab after the user clicks the extension
- copies the screenshot to the clipboard or downloads a PNG
- does not store credentials
- does not run hidden background scraping
- does not upload screenshots

Workflow:

1. Open a visible TTP, GMAT Club, or mba.com result page.
2. Click the extension.
3. Choose **Copy Screenshot**.
4. Open the GMAT Optimizer Import tab and paste.
5. Run OCR and confirm the parsed batch.

This is the preferred bridge direction unless TTP or mba.com offers an official export/API route.
