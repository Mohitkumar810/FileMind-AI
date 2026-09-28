// ===============================
// FileMind AI - Main JavaScript
// ===============================

let uploadedFiles = [];


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const fileInput = document.getElementById("fileInput");

    if (fileInput) {
        fileInput.addEventListener("change", function (event) {
            handleFiles(event.target.files);
        });
    }

    loadHistory();

});


// ===============================
// SIDEBAR
// ===============================

function toggleSidebar() {

    const sidebar = document.getElementById("sidebar");

    if (sidebar) {
        sidebar.classList.toggle("open");
    }

}


// ===============================
// NEW CHAT
// ===============================

function newChat() {

    const chatMessage = document.getElementById("chatMessage");
    const questionInput = document.getElementById("questionInput");

    if (questionInput) {
        questionInput.value = "";
    }

    if (chatMessage) {

        chatMessage.innerHTML = `
            <div class="assistant-avatar">✦</div>

            <div class="message-content">

                <p>
                    New chat started. Upload a document and ask me
                    anything about it.
                </p>

                <div class="suggested-questions">

                    <button onclick="setQuestion('Summarize this file')">
                        Summarize this file
                    </button>

                    <button onclick="setQuestion('What are the main points?')">
                        Main points
                    </button>

                    <button onclick="setQuestion('Explain this file')">
                        Explain this file
                    </button>

                </div>

            </div>
        `;
    }

}


// ===============================
// SEARCH
// ===============================

function focusSearch() {

    const input = document.getElementById("questionInput");

    if (input) {
        input.focus();
        input.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

}


// ===============================
// SHOW FILES
// ===============================

function showFiles() {

    const fileArea = document.getElementById("fileArea");

    if (fileArea) {
        fileArea.scrollIntoView({
            behavior: "smooth"
        });
    }

}


// ===============================
// SHOW HISTORY
// ===============================

function showHistory() {

    const history = document.querySelector(".history");

    if (history) {
        history.scrollIntoView({
            behavior: "smooth"
        });
    }

}


// ===============================
// SETTINGS
// ===============================

function openSettings() {

    alert(
        "Settings\n\n" +
        "FileMind AI settings are currently running in demo mode."
    );

}


// ===============================
// PROFILE
// ===============================

function openProfile() {

    alert(
        "Profile\n\n" +
        "You are currently using the FileMind AI demo."
    );

}


// ===============================
// APPEARANCE
// ===============================

function toggleAppearance() {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "filemindDarkMode",
        isDark ? "true" : "false"
    );

}


// Load saved appearance

if (localStorage.getItem("filemindDarkMode") === "true") {

    document.body.classList.add("dark");

}


// ===============================
// DRAG AND DROP
// ===============================

function handleDragOver(event) {

    event.preventDefault();

    const container =
        document.getElementById("uploadContainer");

    if (container) {
        container.classList.add("dragging");
    }

}


function handleDragLeave(event) {

    event.preventDefault();

    const container =
        document.getElementById("uploadContainer");

    if (container) {
        container.classList.remove("dragging");
    }

}


function handleDrop(event) {

    event.preventDefault();

    const container =
        document.getElementById("uploadContainer");

    if (container) {
        container.classList.remove("dragging");
    }

    const files = event.dataTransfer.files;

    handleFiles(files);

}


// ===============================
// HANDLE FILES
// ===============================

function handleFiles(files) {

    if (!files || files.length === 0) {
        return;
    }

    const allowedTypes = [
        "pdf",
        "txt",
        "csv",
        "png",
        "jpg",
        "jpeg"
    ];

    for (const file of files) {

        const extension =
            file.name.split(".").pop().toLowerCase();

        if (!allowedTypes.includes(extension)) {

            alert(
                `${file.name}\n\nThis file type is not supported.`
            );

            continue;
        }

        const exists = uploadedFiles.some(
            item =>
                item.name === file.name &&
                item.size === file.size
        );

        if (!exists) {

            uploadedFiles.push(file);

            addToHistory(file);

        }

    }

    displayFiles();

}


// ===============================
// DISPLAY FILES
// ===============================

function displayFiles() {

    const fileList =
        document.getElementById("fileList");

    const fileCount =
        document.getElementById("fileCount");

    if (!fileList || !fileCount) {
        return;
    }

    fileList.innerHTML = "";

    fileCount.textContent =
        `${uploadedFiles.length} ${
            uploadedFiles.length === 1 ? "file" : "files"
        }`;

    uploadedFiles.forEach((file, index) => {

        const item =
            document.createElement("div");

        item.className = "file-item";

        item.innerHTML = `

            <div class="file-icon">
                ${getFileIcon(file.name)}
            </div>

            <div class="file-info">

                <strong>${escapeHTML(file.name)}</strong>

                <small>
                    ${formatFileSize(file.size)}
                </small>

            </div>

            <button
                class="remove-file"
                onclick="removeFile(${index})">

                ×

            </button>
        `;

        fileList.appendChild(item);

    });


    if (uploadedFiles.length > 0) {

        generateDemoSummary(uploadedFiles[0]);

    }

}


// ===============================
// REMOVE FILE
// ===============================

function removeFile(index) {

    if (index < 0 || index >= uploadedFiles.length) {
        return;
    }

    uploadedFiles.splice(index, 1);

    displayFiles();

    if (uploadedFiles.length === 0) {
        resetSummary();
    }

}


// ===============================
// FILE ICON
// ===============================

function getFileIcon(fileName) {

    const extension =
        fileName.split(".").pop().toLowerCase();

    switch (extension) {

        case "pdf":
            return "📕";

        case "txt":
            return "📄";

        case "csv":
            return "📊";

        case "png":
        case "jpg":
        case "jpeg":
            return "🖼️";

        default:
            return "📄";
    }

}


// ===============================
// FILE SIZE
// ===============================

function formatFileSize(bytes) {

    if (bytes === 0) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const index =
        Math.floor(Math.log(bytes) / Math.log(1024));

    return (
        parseFloat(
            (bytes / Math.pow(1024, index)).toFixed(2)
        ) +
        " " +
        units[index]
    );

}


// ===============================
// HISTORY
// ===============================

function addToHistory(file) {

    let history =
        JSON.parse(
            localStorage.getItem("filemindHistory") || "[]"
        );

    history.unshift({
        name: file.name,
        size: file.size,
        date: new Date().toLocaleString()
    });

    history =
        history.slice(0, 10);

    localStorage.setItem(
        "filemindHistory",
        JSON.stringify(history)
    );

    loadHistory();

}


function loadHistory() {

    const historyList =
        document.getElementById("historyList");

    if (!historyList) {
        return;
    }

    const history =
        JSON.parse(
            localStorage.getItem("filemindHistory") || "[]"
        );

    if (history.length === 0) {

        historyList.innerHTML = `
            <div class="history-item">
                <span>📄</span>
                <span>No files yet</span>
            </div>
        `;

        return;
    }

    historyList.innerHTML = "";

    history.forEach(file => {

        const item =
            document.createElement("div");

        item.className = "history-item";

        item.innerHTML = `
            <span>📄</span>
            <span title="${escapeHTML(file.name)}">
                ${escapeHTML(file.name)}
            </span>
        `;

        historyList.appendChild(item);

    });

}


// ===============================
// SUMMARY
// ===============================

function generateDemoSummary(file) {

    const summary =
        document.getElementById("summary");

    const status =
        document.getElementById("summaryStatus");

    if (!summary || !status) {
        return;
    }

    status.textContent = "Analyzing...";

    summary.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">
                ⏳
            </div>

            <h3>
                Analyzing your file...
            </h3>

            <p>
                FileMind AI is preparing a summary.
            </p>

        </div>
    `;

    setTimeout(function () {

        status.textContent = "Ready";

        summary.innerHTML = `

            <h3>File Summary</h3>

            <p style="margin-top:10px; line-height:1.7; color:#666;">

                <strong>${escapeHTML(file.name)}</strong>
                has been uploaded successfully.

                This frontend demo recognizes the file and
                prepares the interface for AI analysis.

                To generate a real AI summary from PDF, TXT,
                CSV, or image content, a backend/API needs to
                be connected.

            </p>

        `;

    }, 1000);

}


function resetSummary() {

    const summary =
        document.getElementById("summary");

    const status =
        document.getElementById("summaryStatus");

    if (status) {
        status.textContent = "Ready";
    }

    if (summary) {

        summary.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ✦
                </div>

                <h3>
                    Your summary will appear here
                </h3>

                <p>
                    Upload a document to let FileMind
                    AI generate a concise summary.
                </p>

            </div>

        `;

    }

}


// ===============================
// CHAT
// ===============================

function setQuestion(question) {

    const input =
        document.getElementById("questionInput");

    if (!input) {
        return;
    }

    input.value = question;

    input.focus();

}


function handleQuestionKey(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        askQuestion();

    }

}


function askQuestion() {

    const input =
        document.getElementById("questionInput");

    const chatMessage =
        document.getElementById("chatMessage");

    if (!input || !chatMessage) {
        return;
    }

    const question =
        input.value.trim();

    if (!question) {
        return;
    }

    if (uploadedFiles.length === 0) {

        alert(
            "Please upload a file first."
        );

        return;
    }

    const userMessage =
        document.createElement("div");

    userMessage.style.marginTop = "15px";
    userMessage.style.padding = "12px";
    userMessage.style.background = "#f4f1ff";
    userMessage.style.borderRadius = "10px";
    userMessage.style.color = "#555";

    userMessage.innerHTML =
        `<strong>You:</strong> ${escapeHTML(question)}`;

    chatMessage.appendChild(userMessage);

    input.value = "";

    setTimeout(function () {

        const answer =
            document.createElement("div");

        answer.style.marginTop = "15px";
        answer.style.padding = "12px";
        answer.style.background = "#f7f7f9";
        answer.style.borderRadius = "10px";
        answer.style.color = "#555";

        answer.innerHTML = `

            <strong>FileMind AI:</strong>

            <p style="margin-top:7px;">

                I received your question about
                <strong>
                    ${escapeHTML(uploadedFiles[0].name)}
                </strong>.

                The frontend is working correctly.
                A backend AI service is required to
                provide real document-based answers.

            </p>

        `;

        chatMessage.appendChild(answer);

        answer.scrollIntoView({
            behavior: "smooth"
        });

    }, 700);

}


// ===============================
// SECURITY HELPER
// ===============================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}