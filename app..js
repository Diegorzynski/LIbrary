//book class - represents a book
class Book {    //<- not static
    constructor(title, author, isbn) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
    }
}
//UI class - handle UI tasks
class UI { // will have the methods static so no need to instatiate.
   static displayBooks (){
       
     const books = Store.getBooks();

     //loop through the array to add the books into the local storage
     books.forEach((book) => UI.addBookToList(book));
   }
     //create the row and paste it into the tbody
     static addBookToList(book){
       const list = document.querySelector('#book-list');
       //create a tablerow to add into the <tr>
       const row = document.createElement('tr') //method to creat a DOM element

       row.innerHTML = `
       <td>${book.title}</td>
       <td>${book.author}</td>
       <td>${book.isbn}</td>
       <td><a href='#' class="btn btn-danger btn-sm delete">X</a></td>
       `;
       //append the row to the list
       list.appendChild(row);
     }

     static deleteBook(el){
        if(el.classList.contains('delete')) {
          el.parentElement.parentElement.remove();      //because we want to remov the parent of the parent which is the row tr
        }

     }

     static showAlert(message, className){ // create a div from scratch and insert into the UI
      const div = document.createElement('div'); 
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#book-form');
      container.insertBefore(div, form);

    //make alert go away in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(),2000);
     }

     static clearFields(){
       document.querySelector('#title').value = "";
       document.querySelector('#author').value = "";
       document.querySelector('#isbn').value = "";
     }
   }

//STORE CLASS - for storage
class Store {
  static getBooks() {
      let books;
      //check if theres a item in localstorage
      if(localStorage.getItem('books') === null) {
        books = [];//if theres nothing books is an empty array
      } else {
        books = JSON.parse(localStorage.getItem('books'));
      }

      return books;
  }

  static addBook(book) {
      const books = Store.getBooks();
      books.push(book);
   // reset to localstorage 
      localStorage.setItem('books', JSON.stringify(books));
     }
      
  static removeBook(isbn){
        const books = Store.getBooks();

       books.forEach((book, index) => {
        if(book.isbn === isbn) {
          books.splice(index, 1);
        }
    });

    //reset localstorage with the book removed 
    localStorage.setItem('books', JSON.stringify(books));
  }
}



// DISPLAY A BOOK
document.addEventListener('DOMContentLoaded',UI.displayBooks) // when it loads it will call UI.display
// event - add a book 
document.querySelector('#book-form').addEventListener('submit', (e) => {

//prevent actual submit
e.preventDefault();
  //get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  //Validate 
  if (title === "" || author === "" || isbn == "") {
    UI.showAlert('Please fill in all fields', 'danger')
  } else {
    //instantiate book 
  const book = new Book(title, author, isbn);
  
  // Add Book to UI
  UI.addBookToList(book);

  // Add book to Store
  Store.addBook(book)

  //added succesfully 
  UI.showAlert('Book Added', 'success')

  // clear fields after submit
  UI.clearFields()
   }
});

// Remove a book
// we did an event propagation to target the whole list and not the first element, we would delete
// some info but book would still be there
document.querySelector('#book-list').addEventListener('click', (e) => {
  UI.deleteBook(e.target);

  //remove from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);


//deleted successfully
  UI.showAlert('Book Removed', 'success')
});

//https://youtu.be/JaMCxVWtW58?t=2213