useLocalStorage = true;
window.isOnline = () => this.navigator.onLine;

var news_storage_DB = [];
var news_storage_LS = [];

const newsTitle = document.getElementById('news_title');
const newsText = document.getElementById('news_content');
const newsImage = document.getElementById('news_image');
const newsForm = document.getElementById('newsForm');


class News {
  constructor(title, text, image) {
      this.title = title;
      this.text = text;
      this.image = image;
  }
}

const magic = () => {
  event.preventDefault();
  var news = new News(newsTitle.value, newsText.value, newsImage.value)
  if(!isOnline() && useLocalStorage) {
    save_news_DB(news)
  }

  newsText.value = '';
  newsTitle.value = '';
}

const dbConfig = () => {
  var openRequest = indexedDB.open("test2", 3);
  openRequest.onupgradeneeded = function(e) {
      console.log('runing onupgradeneed');
      var db = openRequest.result;
      var storage = db.createObjectStore('news', {keyPath: 'title'});
      storage.createIndex('title', 'title', { unique: false });
      storage.createIndex('text', 'text', { unique: false });
      storage.createIndex('image', 'image', { unique: false });
  }
  openRequest.onsuccess = function(event) {
      var db = openRequest.result;
      var transaction = db.transaction('news', 'readwrite');    
      var storage = transaction.objectStore('news');
      storage.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
              news_storage_DB.push(cursor.value);
              cursor.continue();
          }
      }
  }
  openRequest.onerror = function(e) {
      console.log('Error');
      console.log(e);
  }
}

const save_news_DB = (news) =>{
  var openRequest = indexedDB.open("test2", 3);
  openRequest.onerror = function(event) {
      alert('error')
  }
  openRequest.onsuccess = function(event) {
      var db = openRequest.result;
      var transaction = db.transaction(['news'], 'readwrite')
      var storage = transaction.objectStore('news');
      var tryAdd = storage.put(news);
      tryAdd.onsuccess = function(event) {
      }
  }
 }

function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function(e) {
        $('#image-container').attr('src', e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  };
  
  $("#news_image").change(function() {
    readURL(this);
  });

  

  window.addEventListener('DOMContentLoaded', dbConfig);
  
  
  
  

