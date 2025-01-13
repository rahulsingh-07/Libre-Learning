import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';

const DisplayDOIs = () => {
  const [doiList, setDoiList] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Search input state
  const [filteredPapers, setFilteredPapers] = useState([]); // Papers filtered by search term

  // Function to fetch research paper details from Firestore
  const fetchResearchPaperFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "research-papers")); 
      const papers = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.doi && data.pdfUrl) {
          papers.push({ 
            doi: data.doi,
            title: data.title,
            authors: data.authors || [], // Ensure authors is an array or set it to an empty array
            journal: data.journal,
            publishedDate: data.publishedDate,
            pdfUrl: data.pdfUrl
          });
        }
      });

      if (papers.length > 0) {
        setDoiList(papers);
        setFilteredPapers(papers); // Initially, filteredPapers will be all papers
        setError(null); 
      } else {
        setError("No DOIs or PDF URLs found in Firestore");
      }
    } catch (error) {
      setError("Failed to fetch DOIs and PDF URLs from Firestore");
      console.error("Error fetching DOI:", error);
    }
  };

  // Filter papers based on the search term
  useEffect(() => {
    const filtered = doiList.filter(paper =>
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPapers(filtered);
  }, [searchTerm, doiList]);

  useEffect(() => {
    fetchResearchPaperFromFirestore(); 
  }, []);

  return (
    <div className="mx-auto p-6 bg-[#d5f9d5]">
      <div className="  mb-6 mt-2 flex justify-center">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search paper title or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-lg w-[80vw] shadow-black shadow-2xl"
        />
      </div>
      <h1 className="text-2xl font-serif mb-6">Research Papers </h1>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-2 sm:px-4'>
        {filteredPapers.length > 0 ? (
          filteredPapers.map((paper, index) => (
            <div key={index} className=" bg-[#236228] text-white shadow-2xl relative   p-4 w-full rounded-lg transition transform hover:scale-105">
              <h2 className='font-bold text-lg mb-2'>{paper.title}</h2>
              <p className=''><strong>Authors:</strong> {paper.authors?.join(", ") || "N/A"}</p>
              <p className=''><strong>Publish Date:</strong> {paper.publishedDate || "Unknown"}</p>
              <p className=''><strong>Journal:</strong> {paper.journal || "Unknown"}</p>

              {/* Display PDF link */}
              {paper.pdfUrl && (
                <div className='flex justify-center my-4'>
                  <a
                    className='bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out'
                    href={paper.pdfUrl} target="_blank" rel="noopener noreferrer"
                  >
                    Download PDF
                  </a>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No research papers match your search.</p>
        )}
      </div>
    </div>
  );
};

export default DisplayDOIs;
