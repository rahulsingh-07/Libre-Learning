export const verifyISBN = async (isbn) => {
    const cleanedISBN = isbn.replace(/[^0-9X]/gi, ''); // Clean the ISBN input

    // Validate the length of the cleaned ISBN
    if (cleanedISBN.length !== 10 && cleanedISBN.length !== 13) {
        return { valid: false, error: "Invalid ISBN length." };
    }

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanedISBN}`);

        const data = await response.json();

        if (data.totalItems > 0) {
            const bookDetails = data.items[0].volumeInfo;
           
            return {
                valid: true,
                title: bookDetails.title || "N/A",
                authors: bookDetails.authors || ["N/A"],
                publish_date: bookDetails.publishedDate || "N/A",
                number_of_pages: bookDetails.pageCount || "N/A",
                coverImage: bookDetails.imageLinks?.thumbnail || null
            };
        }
       
        return { valid: false, error: "Book not found or invalid ISBN." };
    } catch (error) {
        console.error("Error during ISBN verification:", error);
        return { valid: false, error: "Error connecting to the verification service." };
    }
};
