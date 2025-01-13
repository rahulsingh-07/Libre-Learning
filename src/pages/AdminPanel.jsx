import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, updateDoc, deleteDoc, doc,getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL,deleteObject } from 'firebase/storage';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import emailjs from 'emailjs-com'; // Import EmailJS
import app, { db } from '../firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';

const AdminPanel = () => {
  const [pendingBooks, setPendingBooks] = useState([]);
  const [userId, setUserId] = useState('');
  const [editingBookId, setEditingBookId] = useState(null);
  const [bookBranch, setBookBranch] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(app);

  // Set session persistence and check admin status
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserSessionPersistence);
        checkAdminStatus();
      } catch (error) {
        toast.error("Error with session persistence:", error);
      }
    };

    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
        if (user.uid !== 'iimFL8tSBAbiYsilxQ1kydgI19i2') {
          navigate('/');
        } else {
          fetchPendingBooks();
        }
      } else {
        navigate('/');
      }
    };

    initializeAuth();
  }, [navigate, auth]);

  // Fetch books that are pending approval
  const fetchPendingBooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'books'));
      const books = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'pending') {
          books.push({ id: doc.id, ...data });
        }
      });
      setPendingBooks(books);
    } catch (error) {
      toast.error(`Error fetching pending books: ${error.message}`);
    }
  };

  // Approve a book (change status to 'accepted')
  const approveBook = async (bookId, userEmail, userName) => {
    try {
      const bookRef = doc(db, 'books', bookId);
      await updateDoc(bookRef, { status: 'accepted' });
      setPendingBooks(pendingBooks.filter(book => book.id !== bookId));

      // Send email to user notifying them about the approval
      sendEmail(userEmail, 'Book Accepted', 'Hello User,\n\nYour book has been accepted and approved for inclusion by {{from_name}}.', userName);
     
    } catch (error) {
      console.error('Error approving book:', error);
    }
  };

  // Reject a book
  const rejectBook = async (bookId, userEmail, userName) => {
    try {
     
      const bookRef = doc(db, 'books', bookId);
      const bookSnapshot = await getDoc(bookRef);
  
      if (!bookSnapshot.exists()) {
        toast.error("Book not found!");
        return;
      }
  
      const { pdfUrl } = bookSnapshot.data(); 
  
      if (pdfUrl) {
        const filePath = pdfUrl.split("/o/")[1].split("?")[0]; // Extract file path from URL
        const storageRef = ref(storage, decodeURIComponent(filePath)); // Decode the file path
  
        // Delete the PDF file from Firebase Storage
        await deleteObject(storageRef);
        console.log("PDF file deleted successfully from storage.");
      }
  
      // Delete the book document from Firestore
      await deleteDoc(bookRef);
  
      // Update the UI to remove the deleted book from the pending list
      setPendingBooks(pendingBooks.filter(book => book.id !== bookId));
  
      // Send email to user notifying them about the rejection
      sendEmail(userEmail, 'Book Rejected', 'Hello User,\n\nUnfortunately, your book has been rejected by {{from_name}}.', userName);
  
      toast.success("Book and PDF deleted successfully!");
    } catch (error) {
      toast.error("Error rejecting book: " + error.message);
    }
  };
  

  // Send email using EmailJS
  const sendEmail = (userEmail, subject, message, toName) => {
    const fromName = "Libre-Learning Admin"; 
    
    const personalizedMessage = message.replace('{{from_name}}', fromName).replace('{{to_name}}', toName);

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID, 
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
      {
        to_email: userEmail,  
        subject: subject,     
        message: personalizedMessage, 
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_ID
    )
    .then((response) => {
      toast.success('Email sent successfully:', response);
      console.log(userEmail);
    })
    .catch((error) => {
      toast.error('Error sending email:', error);
    });
  };

  // Edit the book branch (type)
  const editBookBranch = (bookId, currentBranch) => {
    setEditingBookId(bookId);
    setBookBranch(currentBranch);
  };

  // Save the edited book branch
  const saveBookBranch = async (bookId) => {
    try {
      const bookRef = doc(db, 'books', bookId);
      await updateDoc(bookRef, { branch: bookBranch });
      setPendingBooks(pendingBooks.map(book => book.id === bookId ? { ...book, branch: bookBranch } : book));
      setEditingBookId(null); // Stop editing
    } catch (error) {
      console.error('Error updating book branch:', error);
    }
  };

  // Render "Not Authorized" message if user is not an admin
  if (userId !== 'iimFL8tSBAbiYsilxQ1kydgI19i2') {
    return <div>Not Authorized</div>;
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto p-8 absolute top-2">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
      <h1 className="text-center font-bold text-2xl">Admin Panel - Pending Book Approvals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6 px-12">
        {pendingBooks.map((book) => (
          <div key={book.id} className="shadow-2xl relative border border-gray-300 p-4 w-full rounded-lg">
            <h2 className="font-bold text-lg mb-2">{book.title}</h2>
            <p><strong>Authors:</strong> {book.authors.join(', ')}</p>
            <p><strong>Book Type:</strong> 
              {editingBookId === book.id ? (
                <input
                  type="text"
                  value={bookBranch}
                  onChange={(e) => setBookBranch(e.target.value)}
                  className="border p-1 rounded"
                />
              ) : (
                book.branch
              )}
            </p>
            <p><strong>Publish Date:</strong> {book.publishDate}</p>
            {/* View PDF Button */}
            <a
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white p-2 mt-4 rounded-lg hover:bg-blue-600 transition block text-center"
            >
              View PDF
            </a>
            {/* Buttons to approve, reject, or edit the book */}
            <div className="mt-4 flex justify-between">
              {editingBookId === book.id ? (
                <button
                  className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition"
                  onClick={() => saveBookBranch(book.id)}
                >
                  Save
                </button>
              ) : (
                <button
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                  onClick={() => editBookBranch(book.id, book.branch)}
                >
                  Edit
                </button>
              )}
              <button
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
                onClick={() => approveBook(book.id, book.userEmail, book.userName)} // Pass user's name
              >
                Approve
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                onClick={() => rejectBook(book.id, book.userEmail, book.userName)} // Pass user's name
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
