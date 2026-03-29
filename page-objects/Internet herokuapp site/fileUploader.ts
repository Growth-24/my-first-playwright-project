import { Page, Locator} from '@playwright/test';

export class fileUploader {
    readonly page: Page;
    readonly chooseFileBtn: Locator;
    readonly uploadBtn: Locator;
    readonly uploadBox: Locator;
    readonly fileInput: Locator;
  


    constructor(page: Page) {

        this.page = page;
        this.chooseFileBtn = page.getByRole('button', { name: 'Choose File' });
        this.uploadBtn = page.getByRole('button', { name: 'Upload' });
        this.uploadBox = page.locator('#drag-drop-upload');

        // - this is the html ID for the choose file button, that opens the file browser when clicked and we combine it with setInputFiles that handles 
        // the file path selection automatically so the test doesnt get stuck in the file browser 
        this.fileInput = page.locator('#file-upload'); 

    }

    async goto() { 

        await this.page.goto('https://the-internet.herokuapp.com/upload');
        
    }

    async selectFile(filePath: string) {
        // removed the this.chooseFileBtn.click() because .setInputFiles() handles everything. If i kept it, it would try to open
        // the file browser and then get stuck because Playwright cannot interact with the desktop file browser.

     await this.fileInput.setInputFiles(filePath);
        
    }

    async uploadFile() {

        await this.uploadBtn.click();
        
    }

    async dragAndDrop(filePaths: string[]) {

      // 1. Create a "DataTransfer" object (what the browser sees during a real drop)
        const dataTransfer = await this.page.evaluateHandle((files) => {
            const dt = new DataTransfer();
            files.forEach(file => {
            const fileObj = new File([""], file);
            dt.items.add(fileObj);
            });
            return dt;
        }, filePaths);

         // 2. Dispatch the 'drop' event directly to that div
        await this.uploadBox.dispatchEvent('drop', { dataTransfer });
        
    }


};


// Upload File Object Notes:

// For the selectFile method, this is selecting the file you want to upload.

// For the uploadFile method, this will upload the selected file by clicking the upload button




// Drag and Drop method notes:

// Normally, when you drag a file, the browser creates a hidden object called DataTransfer. This object acts like a "clipboard" that holds the file data while your mouse is moving.

// new DataTransfer(): You created a fake version of that "clipboard" in the browser's memory.

// new File([""], file): You told the browser, "Pretend there is a file here with this name."

// dispatchEvent('drop', ...): This is the "Magic" step. Instead of physically moving a mouse, you sent a high-priority message directly to the <div>. You basically tapped the div on the shoulder and said: "Hey, a user just dropped these files on you. Here is the clipboard data to prove it."

// Because the website is programmed to listen for the 'drop' event, it immediately starts processing the files as if a real human had done it.