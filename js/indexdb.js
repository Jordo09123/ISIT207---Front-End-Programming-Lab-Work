// index DB setup
let db;
let openRequest = indexedDB.open("DeveloperDB", 1);

openRequest.onupgradeneeded = function() {
    db = openRequest.result;
    if (!db.objectStoreNames.contains("developers")) {
        db.createObjectStore("developers", {keyPath: "developerId"});
    }
};

openRequest.onerror = function() {
    console.error("Error", openRequest.error);
};

openRequest.onsuccess = function() {
    db = openRequest.result;
    showAll();
};


// show a message in div with error styling

function showMessage(text, isError) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.className = isError ? "err" : "ok";
}

// 4b: show all developers in the table

function showAll() {
    let transaction = db.transaction("developers");
    let developers = transaction.objectStore("developers");
    let request = developers.getAll();

    request.onsuccess = function() {
        const rows = request.result;
        let html = "";

        for (let i = 0; i < rows.length; i++) {
            html += "<tr><td>" + rows[i].developerId + "</td>" + "<td>" + rows[i].homepage + "</td>" + "<td>" + rows[i].location + "</td></tr>";
        }

        document.getElementById("list").innerHTML = html
    };
}

// 4a, 4b, 4c and 4g

// 4a add developer
function addDeveloper() {
    const developerId = document.getElementById("devId").value.trim();
    const homepage = document.getElementById("devUrl").value.trim();
    const location = document.getElementById("devLoc").value.trim();

    // 4g 
    // page url must start with http:// or https://
    if (!/^https?:\/\//i.test(homepage)) {
        alert("Homepage URL must start with http:// or https://")
        return;
    }

    // 4b add developer to the store / indexedDB
    let transaction = db.transaction("developers", "readwrite");
    let developers = transaction.objectStore("developers");
    let developer = { developerId: developerId, homepage: homepage, location: location };
    let request = developers.add(developer);

    request.onsuccess = function() {
        document.getElementById("devId").value = "";
        document.getElementById("devUrl").value = "";
        document.getElementById("devLoc").value = "";
    };

    // 4c error if dupilcate developer
    request.onerror = function(event) {
        if (request.error.name == "ConstraintError") {
            console.log("DeveloperID already exists");
            showMessage("DeveloperID already exists", true);
            event.preventDefault();
        } else {
            showMessage("Error adding the developer " + request.error.message, true);
        }
    };

    transaction.oncomplete = function() {
        showAll();
    };
}

// 4d: delete the last data entry

function deleteLast() {
    let transaction = db.transaction("developers", "readwrite");
    let developers = transaction.objectStore("developers");
    let request = developers.openCursor(null, "prev");
    let deleted = null;

    request.onsuccess = function() {
        let cursor = request.result;
        if (cursor) {
            deleted = cursor.key;
            cursor.delete();
        }
    };

    transaction.oncomplete = function() {
        if (deleted !== null) {
            showMessage("Deleted last entry: " + deleted, false);
        } else {
            showMessage("No entries to be deleted", true);
        }
        showAll();
    }
}

// 4e: delete all data entries 

function deleteAll() {
    if (!confirm("Delete all developers?")) return;

    let transaction = db.transaction("developers", "readwrite");
    transaction.objectStore("developers").clear();
    transaction.oncomplete = function() {
        showMessage("All developers deleted", false);
        showAll();
    };
}

// 4f:remove by dev ID

function removeById() {
    const id = document.getElementById("removeId").value.trim();

    if (!id) {
        showMessage("Enter developerID to remove", true);
        return;
    }

    let transaction = db.transaction("developers", "readwrite");
    let developers = transaction.objectStore("developers");
    let found = false;

    // check if the developer exists 
    let check = developers.getKey(id);
    check.onsuccess = function() {
        if (check.result !== undefined) {
            found = true;
            developers.delete(id);
        }
    };


    transaction.oncomplete = function() {
        if (found) {
            showMessage("Developer " + id + " removed", false);
            document.getElementById("removeId").value = "";
        } else {
            showMessage("Developer " + id + " not found", true);
        }
        showAll();
    };
}

document.getElementById("addBtn").addEventListener("click", addDeveloper);
document.getElementById("delLastBtn").addEventListener("click", deleteLast);
document.getElementById("delAllBtn").addEventListener("click", deleteAll);
document.getElementById("removeBtn").addEventListener("click", removeById);