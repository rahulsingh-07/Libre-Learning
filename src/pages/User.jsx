import React, { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { verifyISBN } from './isbnVerification';
import { verifyDOI } from './doiVerification';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "./context/AuthContext";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf'; // Import getDocument and GlobalWorkerOptions
import { motion } from 'framer-motion';

// Set the worker source for pdf.js
GlobalWorkerOptions.workerSrc = `./node_modules/pdfjs-dist/build/pdf.worker.js`;

const User = () => {
  const { dispatch } = useContext(AuthContext);
  const [dpUrl, setDpUrl] = useState(null);
  const [ISBN, setISBN] = useState('');
  const [doi, setDoi] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userBooks, setUserBooks] = useState([]); // Books uploaded by the user
  const [userPapers, setUserPapers] = useState([]); // Research papers uploaded by the user
  const [user, setUser] = useState(null); // User state
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const googleProfilePic = user.photoURL;
        setDpUrl(googleProfilePic);
        fetchUserUploads(user.uid);
      } else {
        navigate("/login");

      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserUploads = async (userId) => {
    const booksQuery = query(collection(db, 'books'), where('userId', '==', userId));
    const papersQuery = query(collection(db, 'research-papers'), where('userId', '==', userId));

    const booksSnapshot = await getDocs(booksQuery);
    const papersSnapshot = await getDocs(papersQuery);

    const books = booksSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    const papers = papersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    setUserBooks(books);
    setUserPapers(papers);
  };

  // Function to upload PDF to Firebase Storage
  const uploadPdf = async (file, folderName) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `${folderName}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // Function to extract text from PDF using pdf.js
  const extractTextFromPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise; // Load the PDF document
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i); // Get the page
      const content = await page.getTextContent(); // Get text content
      const pageText = content.items.map(item => item.str).join(' '); // Extract text
      text += pageText + '\n'; // Combine the text from each page
    }
    return text;
  };

  // Handle adding ISBN and verifying it against PDF content
  const handleAddISBN = async () => {
    try {
      const isbnVerification = await verifyISBN(ISBN);
      if (!isbnVerification.valid) {
        toast.error(isbnVerification.error);
        return;
      }

      if (!pdfFile) {
        toast.error("Please upload a PDF file for the book.");
        return;
      }
      // Extract relevant details from isbnVerification
      const { title, authors, publish_date, number_of_pages, coverImage } = isbnVerification;

      // const pdfText = await extractTextFromPdf(pdfFile);

      // if (!pdfText.includes(title) && !pdfText.includes(ISBN)) {
      //   toast.error('The ISBN number does not match the content in the PDF.');
      //   return;
      // }
      //Check if the ISBN already exists in Firestore
      const booksRef = collection(db, 'books');
      const q = query(booksRef, where('ISBN', '==', ISBN));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If a book with the same ISBN exists, show an error message
        toast.error('Book is already present in the store.');
        return;
      }
      const pdfUrl = await uploadPdf(pdfFile, 'books');

      const docRef = await addDoc(collection(db, 'books'), {
        ISBN,
        title,              // Add the title from verification
        authors,            // Add authors
        publish_date,      // Add publish date
        number_of_pages,
        coverImage,
        pdfUrl,
        branch: selectedBranch,
        userId: user.uid,
        status: 'pending',
        userEmail: user.email,
        uploadedAt: new Date(),
      });
      //console.log("Document written with ID: ", docRef.id);
      toast.success('ISBN and PDF added successfully!');
      fetchUserUploads(user.uid);
    } catch (error) {
      toast.error('Error adding ISBN: ' + error.message);
    }
  };

  // Handle adding DOI and verifying it against PDF content
  const handleAddDOI = async () => {
    try {
      const doiVerification = await verifyDOI(doi);
      if (!doiVerification.valid) {
        toast.error(doiVerification.error);
        return;
      }

      if (!pdfFile) {
        toast.error("Please upload a PDF file for the research paper.");
        return;
      }
      // Extract relevant details from doiVerification
      const { title, authors, journal, publishedDate } = doiVerification;

      const pdfText = await extractTextFromPdf(pdfFile);
      const researchpaperRef = collection(db, 'research-papers');
      const q = query(researchpaperRef, where('doi', '==', doi));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If a book with the same ISBN exists, show an error message
        toast.error('Research paper is already present in the store.');
        return;
      }
      else if (!pdfText.includes(doi)) {
        toast.error('The DOI number does not match the content in the PDF.');
        return;
      }

      const pdfUrl = await uploadPdf(pdfFile, 'research');

      const docRef = await addDoc(collection(db, 'research-papers'), {
        doi,
        title,
        authors,
        journal,
        publishedDate,
        pdfUrl,
        userId: user.uid,
        uploadedAt: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);
      toast.success('DOI and PDF added successfully!');
      fetchUserUploads(user.uid);
    } catch (error) {
      toast.error('Error adding DOI: ' + error.message);
    }
  };

  const handleDelete = async (id, collectionName) => {
    try {
      // Get the document from Firestore
      const docRef = doc(db, collectionName, id);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        toast.error("Document not found!");
        return;
      }

      // Extract the PDF URL
      const { pdfUrl } = docSnapshot.data();

      if (pdfUrl) {
        // Get the file path from the URL and delete the file from Firebase Storage
        const filePath = decodeURIComponent(pdfUrl.split("/o/")[1].split("?")[0]); // Extract the file path
        const storageRef = ref(storage, filePath);

        await deleteObject(storageRef);
        console.log("PDF file deleted successfully from storage.");
      }

      // Delete the document from Firestore
      await deleteDoc(docRef);
      toast.success("Deleted successfully!");

      // Refresh user uploads
      fetchUserUploads(user.uid);
    } catch (error) {
      toast.error("Error deleting document: " + error.message);
    }
  };


  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
      localStorage.removeItem("sessionExpiry");
      navigate("/");
      toast.success("Logout successfully")
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className=" mx-auto bg-[#F4F5D7] ">
      <div className=' mx-auto '>
        <div className="max-w-4xl mx-auto p-8 absolute top-2  ">
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
        {/* <h2 className="text-3xl font-bold mb-6">Manage Books and Research Papers</h2> */}

        <div className="  shadow-2xl  bg-[#F4F5D7] mb-6">
          <div className="flex bg-[#E8B75E] p-6 h-auto rounded-b-3xl mb-4 justify-between">
            <img
              src={dpUrl || "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fprofile-icon&psig=AOvVaw3CoGpGFMHSu_66dFf08A5-&ust=1732621942670000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJibq_G194kDFQAAAAAdAAAAABAE"}
              alt="Profile"
              className="w-30 h-30 rounded-full cursor-pointer"
            />

            <div>
              <button className='bg-red-600 rounded-lg p-3' onClick={handleLogout}>Logout</button>
            </div>
          </div>
          <div className='px-2 sm:px-6'>
            {/* Radio Buttons for Branch */}
            <div className="mb-4 pb-4 ">
              <h2 className="text-3xl font-mono mb-6">Manage Books and Research Papers</h2>
              <label className="block font-semibold mb-2">Select Book type</label>

              <div className=" bloc sm:flex gap-4  p-2">
                {['CSE', 'ECE', 'CIVIL', 'EEE', 'MAC', 'Literature', 'Other'].map((branch) => (
                  <label key={branch} className="flex items-center">
                    <input
                      type="radio"
                      name="branch"
                      value={branch}
                      checked={selectedBranch === branch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="mr-2"
                    />
                    {branch}
                  </label>
                ))}
              </div>

            </div>
            {/* ISBN Input */}
            <div>
              <label className="block  font-semibold">Book ISBN</label>
              <div className='block sm:flex'>
                <input
                  type="text"
                  value={ISBN}
                  onChange={(e) => setISBN(e.target.value)}
                  className="border px-2  rounded border-gray-500 mb-4"
                  placeholder="Enter book ISBN"
                />
                {/* PDF Upload for Book */}
                <input
                  type="file"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="border p-2 rounded w-full mb-4"
                  accept="application/pdf"
                />
              </div>
            </div>



            <div className='shadow-2xl'>
              <motion.button
                onClick={handleAddISBN}
                whileTap={{ scale: 0.95 }} // Slightly reduce the scale on tap
                whileHover={{
                  scale: 1.1, // Scale up on hover for a more pronounced effect
                  backgroundColor: "#3b82f6", // Change background color on hover
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)", // Add a shadow effect on hover
                }}
                transition={{
                  type: "spring", // Spring-based animation for smooth effect
                  stiffness: 400, // Stronger stiffness for a snappy effect
                  damping: 20, // Reduced damping for more bounce
                  duration: 0.3,
                }}
                className="my-4  bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                Upload Book
              </motion.button>
            </div>

            {/* DOI Input */}
            <div className="mt-6">
              <label className="block  font-semibold">Research Paper DOI</label>
              <div className='block sm:flex'>
                <input
                  type="text"
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  className="border border-gray-500 p-2 rounded  mb-4"
                  placeholder="Enter DOI of the research paper"
                />
                {/* PDF Upload for Research Paper */}
                <input
                  type="file"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="border p-2 rounded w-full mb-4"
                  accept="application/pdf"
                />
              </div>

            </div>
            <div>
              <motion.button
                onClick={handleAddDOI}
                whileTap={{ scale: 0.95 }} // Slightly reduce the scale on tap
                whileHover={{
                  scale: 1.1, // Scale up on hover for a more pronounced effect
                  backgroundColor: "#3b82f6", // Change background color on hover
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)", // Add a shadow effect on hover
                }}
                transition={{
                  type: "spring", // Spring-based animation for smooth effect
                  stiffness: 400, // Stronger stiffness for a snappy effect
                  damping: 20, // Reduced damping for more bounce
                  duration: 0.3,
                }}
                className="my-4  bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                Upload Book
              </motion.button>
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full mt-4">
                <div
                  className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-l-full"
                  style={{ width: `${uploadProgress}%` }}>
                  {uploadProgress.toFixed(0)}%
                </div>
              </div>
            )}
          </div>



        </div>
      </div>
      {/* fetch */}
      <div className='bg-slate-950  rounded-t-3xl overflow-hidden'>
        <div className="  mb-6 text-slate-300">
          <h3 className="text-2xl  font-bold mb-4 text-white bg-slate-800  border-none p-4 border-2 rounded-t-md  shadow-2xl">Uploaded Books</h3>
          {userBooks.length === 0 ? (
            <p>No books uploaded yet.</p>
          ) : (
            <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-2 sm:p-6'>
              {userBooks.map(book => (
                <li key={book.id} className="bg-slate-800 shadow-lg flex gap-2  border border-slate-800  p-2 w-full rounded-lg transition transform hover:scale-105">
                  <div className="flex justify-center ">
                    <img className=" rounded-lg shadow-md max-w-full h-auto" src={book.coverImage} alt={book.title} />
                  </div>
                  <div >
                    <p><strong>Title:</strong> {book.title}</p>
                    <p><strong>Authors:</strong> {book.authors.join(', ')}</p>
                    <p><strong>Publish Date:</strong> {book.publish_date}</p>
                    <p><strong>ISBN:</strong> {book.ISBN}</p>
                    <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-800 text-white rounded-lg p-2 mt-3">View PDF</a>
                    <button
                      onClick={() => handleDelete(book.id, 'books')}
                      className="bg-red-500 hover:bg-red-800 ml-2 text-white rounded-lg p-2 px-4 mt-3 "
                    >
                      Delete
                    </button>

                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-6 text-slate-300">
          <h3 className="text-2xl  font-bold mb-4 text-white bg-slate-800  border-none p-4 border-2 rounded-t-md  shadow-2xl">Uploaded Research Papers</h3>
          {userPapers.length === 0 ? (
            <p>No research papers uploaded yet.</p>
          ) : (
            <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-2 sm:p-6'>
              {userPapers.map(paper => (
                <li key={paper.id} className="bg-slate-800 shadow-lg gap-2  border border-slate-800  p-2 w-full rounded-lg transition transform hover:scale-105">
                  <p><strong>Title:</strong> {paper.title}</p>
                  <p><strong>Authors:</strong> {paper.authors.join(', ')}</p>
                  <p><strong>Journal:</strong> {paper.journal}</p>
                  <p><strong>Publish Date:</strong> {paper.publishedDate}</p>
                  <p><strong>DOI:</strong> {paper.doi}</p>
                  <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-800 text-white rounded-lg p-2 mt-3">View PDF</a>
                  <button
                    onClick={() => handleDelete(paper.id, 'research-papers')}
                    className="bg-red-500 hover:bg-red-800 ml-2 text-white rounded-lg p-2 px-4 mt-3"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
