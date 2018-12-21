useLocalStorage = true;
window.isOnline = () => this.navigator.onLine;

var comments_storage_LS = [];
var comments_storage_DB = [];

const message_nickname = document.getElementById('message_nickname');
const message_content = document.getElementById('message_content');
if(isOnline()){
    load_comments_DB();
}


class Comment {
    constructor(name, body, time) {
        this.name = name;
        this.body = body;
        this.time = time;
    }
}
const magic = () => {
    event.preventDefault();
    var comment = new Comment(message_content.value, message_nickname.value);

    if (!isOnline()  && useLocalStorage) {
        save_comments_DB(comment);
    }

    message_content.value = '';
    message_nickname.value = '';
}

const dbConfig = () => {
    var openRequest = indexedDB.open("test", 5);
    openRequest.onupgradeneeded = function(e) {
        console.log('runing onupgradeneed');
        var db = openRequest.result;
        var storage = db.createObjectStore('comments', {keyPath: 'name'});
        storage.createIndex('name', 'name', { unique: false });
        storage.createIndex('body', 'body', { unique: false });
    }
    openRequest.onsuccess = function(event) {
        var db = openRequest.result;
        var transaction = db.transaction('comments', 'readwrite');    
        var storage = transaction.objectStore('comments');
        storage.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            
            if (cursor) {
                comments_storage_DB.push(cursor.value);
                cursor.continue();
            }
        }
    }
    openRequest.onerror = function(e) {
        console.log('Error');
        console.log(e);
    }
}

const save_comments_DB = (comment) =>{
    var openRequest = indexedDB.open("test", 5);
    openRequest.onerror = function(event) {
        alert('error')
    }
    openRequest.onsuccess = function(event) {
        var db = openRequest.result;
        var transaction = db.transaction(['comments'], 'readwrite')
        var storage = transaction.objectStore('comments');
    
        var tryAdd = storage.put(comment);
        tryAdd.onsuccess = function(event) {
            
        }
    }
   }

   function load_comments_DB() {
    var openRequest = indexedDB.open("test", 5);
    openRequest.onerror = function(event) {
        console.log('db not working')
      };
      openRequest.onsuccess = function(event) {
        db = event.target.result;
        var transaction = db.transaction(["comments"]);
        var objectStore = transaction.objectStore("comments");
        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                comments_storage_DB.push(cursor.value);
                cursor.continue();
                render_comments_DB()
            }
      };
    }
}

function load_comments_LS()  {
    if (localStorage.getItem('comments')) comments_storage_LS = JSON.parse(localStorage.getItem('comments'));
    render_comments_LS();
}


function render_comments_LS() {
    let commentField = document.getElementById('ss');
    let out = '';
    comments_storage_LS.forEach(function(item){
        out += `<div class="request">
            <div class="fan-message-text"><p class=""> ${item.name}</p></div>
            <p class="nickname">Author is ${item.body} </p>
        </div>`;
    });
    commentField.innerHTML = out;
}

function render_comments_DB() {
    let commentField = document.getElementById('ss');
    let out = '';
    comments_storage_DB.forEach(function(item){
        out += `<div class="request">
            <div class="fan-message-text"><p class=""> ${item.name}</p></div>
            <p class="nickname">Author is ${item.body} </p>
        </div>`;
    });
    commentField.innerHTML = out;
}

const onOnline = () => {
    alert('Local storage working.')
}


const onOffline = () => {
    alert('Database working.')
}

window.addEventListener('DOMContentLoaded', dbConfig); 
window.addEventListener('online', onOnline);
window.addEventListener('offline', onOffline);