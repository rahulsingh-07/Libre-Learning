import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebaseConfig';

const BookDetails = () => {
  const { branch } = useParams(); 
  const [booksData, setBooksData] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  const fetchBooksFromFirestore = async () => {
    try {
      const q = query(
        collection(db, "books"), 
        where("branch", "==", branch),
        where("status", "==", "accepted") 
      );
      const querySnapshot = await getDocs(q);
      const books = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        books.push({
          title: data.title || "N/A",
          authors: data.authors || ["N/A"],
          publishDate: data.publish_date || "N/A",
          pageCount: data.number_of_pages || "N/A",
          coverImage: data.coverImage || null,
          pdfUrl: data.pdfUrl || null,
          previewLink: data.previewLink || null
        });
      });

      if (books.length > 0) {
        setBooksData(books);
        setFilteredBooks(books);
        setError(null);
      } else {
        setError("No approved books found for this branch");
      }
    } catch (error) {
      setError("Failed to fetch books from Firestore");
      console.error("Error fetching books:", error);
    }
  };
  
  useEffect(() => {
    fetchBooksFromFirestore();
  }, [branch]);

  useEffect(() => {
    const filtered = booksData.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredBooks(filtered);
  }, [searchTerm, booksData]);

  return (
    <div className='bg-[#f7d4a9]'>
      <h1 className="text-center font-bold text-2xl pt-4">Books for {branch}</h1>
      <div className="mb-6 mt-2 flex justify-center">
        <input
          type="text"
          placeholder="Search book title or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-lg w-[80vw] shadow-black shadow-2xl"
        />
      </div>

      {filteredBooks.length === 0 && searchTerm && (
        <div className="text-center text-red-600 font-semibold">
          No books found. <a 
            href={`https://www.google.com/search?q=${encodeURIComponent(searchTerm + " book")}`} 
            target="_blank" rel="noopener noreferrer" 
            className="text-blue-500 underline">Search on Google</a>
        </div>
      )}

      {error && <div>{error}</div>}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4 sm:px-12'>
        {filteredBooks.length > 0 && filteredBooks.map((book, index) => (
          <div key={index} className="shadow-2xl flex gap-2 relative border border-gray-300 bg-[#c48443] p-2 w-full rounded-lg transition transform hover:scale-105 text-xs sm:text-base">
            <div className="flex justify-center ">
              <img className="rounded-lg shadow-md max-w-full h-auto" src={book.coverImage} alt={book.title} />
            </div>
            <div>
              <h2 className='font-bold text-lg mb-2'>{book.title}</h2>
              <p className='text-gray-700'><strong>Authors:</strong> {book.authors.join(", ")}</p>
              <p className='text-gray-700'><strong>Publish Date:</strong> {book.publishDate}</p>
              <p className='text-gray-700'><strong>Number of Pages:</strong> {book.pageCount}</p>
              {book.pdfUrl && (
                <div className='flex justify-center my-4'>
                  <a
                    className='bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out'
                    href={book.pdfUrl} target="_blank" rel="noopener noreferrer"
                  >
                    Download PDF
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookDetails;
