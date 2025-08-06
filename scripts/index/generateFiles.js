export default class GenerateFiles {
  //fields
  #data;
  #rootPath = "";
  #currentPath = "";
  #folders = new Set();

  //constructor
  constructor() {
    console.log("filegenarator gestart");
    this.fetchData();
  }

  async fetchData() {
    const url = "scripts/testdata/data.json";
    //const url = "http://192.168.0.147:3000/api/files?client=testdata";
    console.log("fetch aangevraagd");
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      this.#data = await response.json();
      console.log(this.#data);

      // Bepaal root path op basis van eerste file
      if (this.#data.length > 0) {
        const firstPath = this.#data[0].path;
        this.#rootPath = "/" + firstPath.split("/")[1]; // bijv. "/klant123" of "/john_doe"
        this.#currentPath = this.#rootPath;
        console.log("Root path bepaald als:", this.#rootPath);
      }
    } catch (error) {
      console.log("message: ", error);
    }

    this.toHtml();
  }

  toHtml() {
    this.filesToHtml();
    this.initEvents();
    this.calcSize();
  }

  filesToHtml() {
    const container = document.getElementById("tab-recent-file-container");
    const empty = document.getElementById("recent-titles");
    const returnBtn = document.getElementById("return-wrapper");

    // Clear container
    container.innerHTML = "";
    this.#folders.clear();

    if (this.#data.length === 0) {
      empty.style.display = "flex";
      container.style.display = "none";
      return;
    } else {
      empty.style.display = "none";
      container.style.display = "flex";
    }

    // Show/hide return button
    if (this.#currentPath === this.#rootPath) {
      returnBtn.style.display = "none";
    } else {
      returnBtn.style.display = "flex";
    }

    // Filter files/folders voor huidige path
    const currentItems = this.getItemsInCurrentPath();

    currentItems.forEach((item) => {
      if (item.isFolder) {
        this.buildFolder("folder", item.file, item.name);
      } else {
        const fileType = item.file.type.split("/")[1];
        this.buildFile(fileType, item.file);
      }
    });
  }

  getItemsInCurrentPath() {
    const items = [];
    const processedFolders = new Set();

    this.#data.forEach((file) => {
      // Check of file in huidige path zit
      if (!file.path.startsWith(this.#currentPath + "/")) {
        return;
      }

      // Krijg relatieve path vanaf huidige locatie
      const relativePath = file.path.substring(this.#currentPath.length + 1);
      const pathParts = relativePath.split("/");

      if (pathParts.length === 1) {
        // Direct file in huidige folder
        items.push({
          isFolder: false,
          name: file.name,
          file: file,
        });
      } else {
        // File zit in subfolder
        const folderName = pathParts[0];

        if (!processedFolders.has(folderName)) {
          processedFolders.add(folderName);

          // Vind de meest recente modified date van bestanden in deze folder
          const folderFiles = this.#data.filter((f) =>
            f.path.startsWith(this.#currentPath + "/" + folderName + "/")
          );

          const latestFile = folderFiles.reduce((latest, current) =>
            new Date(current.modified) > new Date(latest.modified)
              ? current
              : latest
          );

          items.push({
            isFolder: true,
            name: folderName,
            file: latestFile, // Voor modified date
          });
        }
      }
    });

    return items;
  }

  buildFile(type, file) {
    const container = document.getElementById("tab-recent-file-container");

    const itemWrapper = document.createElement("div");
    itemWrapper.classList.add("item-wrapper");
    itemWrapper.dataset.type = "file";
    itemWrapper.dataset.path = file.path;

    const iconWrapper = document.createElement("div");
    iconWrapper.classList.add("fileIcon-wrapper");

    const icon = document.createElement("img");
    icon.classList.add("fileIcon");
    icon.src = this.getSource(type);

    const titlesWrapper = document.createElement("div");
    titlesWrapper.classList.add("file_titels");

    const titelSpan = document.createElement("span");
    titelSpan.classList.add("file-titel");
    titelSpan.textContent = file.name;

    titelSpan.onclick = () => {
      this.download(file);
    };

    const datumSpan = document.createElement("span");
    datumSpan.classList.add("file-datum");

    const date = new Date(file.modified);
    datumSpan.textContent = date.toLocaleDateString("nl-BE");

    titlesWrapper.appendChild(titelSpan);
    titlesWrapper.appendChild(datumSpan);

    itemWrapper.appendChild(iconWrapper);
    iconWrapper.appendChild(icon);
    itemWrapper.appendChild(titlesWrapper);

    container.appendChild(itemWrapper);
    itemWrapper.onclick = () => {
      this.selectedSize(file);
    };
    itemWrapper.ondblclick = () => {
      this.requestDownload();
    };
    this.download(file);
  }

  buildFolder(type, file, foldername) {
    const container = document.getElementById("tab-recent-file-container");

    const itemWrapper = document.createElement("div");
    itemWrapper.classList.add("item-wrapper");
    itemWrapper.dataset.type = "folder";
    itemWrapper.dataset.folderName = foldername;

    const iconWrapper = document.createElement("div");
    iconWrapper.classList.add("fileIcon-wrapper");

    const icon = document.createElement("img");
    icon.classList.add("fileIcon");
    icon.src = this.getSource(type);

    const titlesWrapper = document.createElement("div");
    titlesWrapper.classList.add("file_titels");

    const titelSpan = document.createElement("span");
    titelSpan.classList.add("file-titel");
    titelSpan.textContent = foldername;

    const datumSpan = document.createElement("span");
    datumSpan.classList.add("file-datum");

    const date = new Date(file.modified);
    datumSpan.textContent = date.toLocaleDateString("nl-BE");

    titlesWrapper.appendChild(titelSpan);
    titlesWrapper.appendChild(datumSpan);

    itemWrapper.appendChild(iconWrapper);
    iconWrapper.appendChild(icon);
    itemWrapper.appendChild(titlesWrapper);

    container.appendChild(itemWrapper);

    // Dubbelklik event voor folder navigatie
    itemWrapper.ondblclick = () => {
      this.navigateToFolder(foldername);
    };

    titelSpan.onclick = () => {
      this.navigateToFolder(foldername);
    };
  }

  navigateToFolder(folderName) {
    this.#currentPath = this.#currentPath + "/" + folderName;
    console.log("Navigating to:", this.#currentPath);
    this.filesToHtml();
    this.initEvents();
    this.calcSize();
  }

  navigateBack() {
    if (this.#currentPath !== this.#rootPath) {
      const pathParts = this.#currentPath.split("/");
      pathParts.pop(); // Remove laatste deel
      this.#currentPath = pathParts.join("/");
      console.log("Navigating back to:", this.#currentPath);
      this.filesToHtml();
      this.initEvents();
      this.calcSize();
    }
  }

  getSource(type) {
    switch (type.toLowerCase()) {
      case "pdf":
        return "icons/fileIcons/pdf.svg";
      case "docx":
        return "icons/fileIcons/docx.svg";
      case "mp3":
        return "icons/fileIcons/mp3.svg";
      case "wav":
        return "icons/fileIcons/wav.svg";
      case "svg":
        return "icons/fileIcons/svg.svg";
      case "mp4":
        return "icons/fileIcons/mp4.svg";
      case "mov":
        return "icons/fileIcons/mov.svg";
      case "zip":
        return "icons/fileIcons/zip.svg";
      case "png":
        return "icons/fileIcons/photo.svg";
      case "jpg":
        return "icons/fileIcons/photo.svg";
      case "jpeg":
        return "icons/fileIcons/photo.svg";
      case "heic":
        return "icons/fileIcons/photo.svg";
      case "webp":
        return "icons/fileIcons/photo.svg";
      case "psd":
        return "icons/fileIcons/psd.svg";
      case "folder":
        return "icons/fileIcons/folder.svg";
      default:
        return "icons/fileIcons/file.svg"; // fallback icon
    }
  }

  initEvents() {
    const items = document.querySelectorAll(".item-wrapper");
    const downloadContainer = document.getElementById("download");
    const mailContainer = document.getElementById("mail");
    const binContainer = document.getElementById("bin");
    const popup = document.getElementById("popup-id");
    const returnBtn = document.getElementById("return-wrapper");

    downloadContainer.classList.remove("enabled");
    downloadContainer.classList.add("disabled");
    mailContainer.classList.remove("enabled");
    mailContainer.classList.add("disabled");
    binContainer.classList.remove("enabled");
    binContainer.classList.add("disabled");
    // Item selection events
    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();

        // Deselecteer alles
        items.forEach((i) => i.classList.remove("active"));

        // Selecteer huidig item
        item.classList.add("active");

        if (item.dataset.type === "file") {
          downloadContainer.classList.remove("disabled");
          downloadContainer.classList.add("enabled");
          mailContainer.classList.remove("disabled");
          mailContainer.classList.add("enabled");
          binContainer.classList.remove("disabled");
          binContainer.classList.add("enabled");
        } else {
          downloadContainer.classList.remove("enabled");
          downloadContainer.classList.add("disabled");
          mailContainer.classList.remove("enabled");
          mailContainer.classList.add("disabled");
          binContainer.classList.remove("enabled");
          binContainer.classList.add("disabled");
        }

        popup?.classList.add("active");
      });
    });

    // Document click to deselect
    document.addEventListener("click", (e) => {
      const clickedInsideItem = [...items].some(
        (item) =>
          item.contains(e.target) ||
          downloadContainer.contains(e.target) ||
          mailContainer.contains(e.target) ||
          binContainer.contains(e.target)
      );

      if (!clickedInsideItem) {
        items.forEach((i) => i.classList.remove("active"));
        popup?.classList.remove("active");
        downloadContainer.classList.remove("enabled");
        downloadContainer.classList.add("disabled");
        mailContainer.classList.remove("enabled");
        mailContainer.classList.add("disabled");
        binContainer.classList.remove("enabled");
        binContainer.classList.add("disabled");
        this.calcSize();
      }
    });

    // Return button event
    if (returnBtn) {
      returnBtn.onclick = () => {
        this.navigateBack();
      };
    }
  }

  // Helper method om geselecteerde file te krijgen
  getSelectedFile() {
    const activeItem = document.querySelector(".item-wrapper.active");
    if (activeItem && activeItem.dataset.type === "file") {
      const filePath = activeItem.dataset.path;
      return this.#data.find((file) => file.path === filePath);
    }
    return null;
  }

  // Helper method om huidige path te krijgen
  getCurrentPath() {
    return this.#currentPath;
  }
  calcSize() {
    const items = document.getElementById("items");
    console.log("Current path:", this.#currentPath);

    // Tel alleen directe items in huidige folder (zoals in filesToHtml)
    let nItems = this.#data.filter((file) => {
      // Check of file in huidige path zit
      if (!file.path.startsWith(this.#currentPath + "/")) {
        return false;
      }

      // Krijg relatieve path vanaf huidige locatie
      const relativePath = file.path.substring(this.#currentPath.length + 1);
      const pathParts = relativePath.split("/");

      // Alleen directe items (files + folders op dit niveau)
      return pathParts.length === 1;
    }).length;

    // Tel ook folders (unieke folder namen op dit niveau)
    const folderNames = new Set();
    this.#data.forEach((file) => {
      if (!file.path.startsWith(this.#currentPath + "/")) {
        return;
      }

      const relativePath = file.path.substring(this.#currentPath.length + 1);
      const pathParts = relativePath.split("/");

      if (pathParts.length > 1) {
        folderNames.add(pathParts[0]);
      }
    });

    nItems += folderNames.size;

    items.innerText = nItems;

    const word = document.getElementById("itemsword");
    if (nItems <= 1) {
      word.innerText = " item, ";
    } else {
      word.innerText = " items, ";
    }

    // Bereken totale size van alle bestanden in huidige path (inclusief subfolders)
    let size = this.#data
      .filter((file) => {
        return file.path.startsWith(this.#currentPath + "/"); // RETURN toegevoegd!
      })
      .reduce((pv, item) => pv + item.size, 0);

    console.log("Totale grootte:", size);

    const omvang = document.getElementById("storage");
    omvang.innerText = this.formatBytes(size);
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  selectedSize(item) {
    const items = document.getElementById("items");
    const omvang = document.getElementById("storage");
    const word = document.getElementById("itemsword");
    items.innerText = "1";
    word.innerText = " item, ";
    omvang.innerText = this.formatBytes(item.size);
  }

  download(file) {
    console.log("downloader gelinkt");
    const download = document.getElementById("download");
    const mail = document.getElementById("mail");
    const remove = document.getElementById("bin");
    download.onclick = (file) => {
      this.requestDownload();
    };
    mail.onclick = () => {
      console.log("gemaild");
    };
  }

  requestDownload(file) {
    console.log("file bezig met downloaden");
  }
}
