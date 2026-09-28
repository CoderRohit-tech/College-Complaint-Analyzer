function analyzeComplaint(text) {

    const lowerText = text.toLowerCase();

    let category = "Other";
    let sentiment = "Normal";


    // CATEGORY DETECTION

    if (
        lowerText.includes("wifi") ||
        lowerText.includes("internet") ||
        lowerText.includes("network") ||
        lowerText.includes("computer")
    ) {
        category = "IT/Wi-Fi";

    } else if (
        lowerText.includes("library") ||
        lowerText.includes("book") ||
        lowerText.includes("librarian") ||
        lowerText.includes("reading")
    ) {
        category = "Library";

    } else if (
        lowerText.includes("fan") ||
        lowerText.includes("light") ||
        lowerText.includes("classroom") ||
        lowerText.includes("bench") ||
        lowerText.includes("desk") ||
        lowerText.includes("building")
    ) {
        category = "Infrastructure";

    } else if (
        lowerText.includes("hostel") ||
        lowerText.includes("room") ||
        lowerText.includes("bathroom") ||
        lowerText.includes("water")
    ) {
        category = "Hostel";

    } else if (
        lowerText.includes("canteen") ||
        lowerText.includes("food") ||
        lowerText.includes("meal") ||
        lowerText.includes("hygiene")
    ) {
        category = "Canteen";
    }


    // NEGATIVE SENTIMENT

    const negativeWords = [
        "poor",
        "very poor",
        "bad",
        "worst",
        "terrible",
        "dirty",
        "broken",
        "slow",
        "not working",
        "problem",
        "issue"
    ];


    for (const word of negativeWords) {

        if (lowerText.includes(word)) {

            sentiment = "Negative";

            break;
        }
    }


    return {
        category: category,
        sentiment: sentiment
    };
}


module.exports = analyzeComplaint;