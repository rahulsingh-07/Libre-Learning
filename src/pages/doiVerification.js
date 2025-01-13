export const verifyDOI = async (doi) => {
  try {
    // Make a request to CrossRef DOI API or another reliable source
    const response = await fetch(`https://api.crossref.org/works/${doi}`);
    
    if (!response.ok) {
      throw new Error('Invalid DOI or unable to fetch data.');
    }

    const data = await response.json();
    
    // Extract metadata from the response
    const metadata = data.message;

    // Ensure we have the necessary details
    return {
      valid: true,
      title: metadata.title?.[0] || "N/A", // First title in the array
      authors: metadata.author 
        ? metadata.author.map(author => `${author.given || ''} ${author.family || ''}`.trim()) 
        : ["N/A"], // Format authors as "FirstName LastName" or return "N/A"
      journal: metadata['container-title']?.[0] || "N/A", // Journal name
      publishedDate: metadata.published 
        ? metadata.published['date-parts']?.[0]?.[0] || 'Unknown' 
        : 'Unknown' // Year of publication
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message || 'An error occurred while verifying the DOI.'
    };
  }
};
