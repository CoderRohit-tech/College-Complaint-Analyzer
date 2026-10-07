function analyzeComplaint(text) {

    const lowerText = text.toLowerCase().trim();

    let category = "Other";
    let sentiment = "Normal";
    let priority = "Low";


   
    //  CATEGORY DETECTION
    
    const categoryKeywords = {

        "IT/Wi-Fi": [
            "wifi",
            "wi-fi",
            "internet",
            "network",
            "computer",
            "computer lab",
            "server",
            "software",
            "website",
            "portal",
            "login",
            "printer",
            "projector"
        ],

        "Library": [
            "library",
            "book",
            "books",
            "librarian",
            "reading",
            "study room",
            "journal",
            "magazine"
        ],

        "Infrastructure": [
            "fan",
            "light",
            "electricity",
            "classroom",
            "bench",
            "desk",
            "building",
            "chair",
            "roof",
            "ceiling",
            "floor",
            "door",
            "window",
            "ac",
            "air conditioner"
        ],

        "Hostel": [
            "hostel",
            "hostel room",
            "room",
            "bathroom",
            "washroom",
            "water",
            "mess",
            "warden",
            "bed"
        ],

        "Canteen": [
            "canteen",
            "food",
            "meal",
            "lunch",
            "breakfast",
            "dinner",
            "hygiene",
            "restaurant",
            "food quality"
        ],

        "Transport": [
            "bus",
            "transport",
            "driver",
            "college bus",
            "bus stop",
            "vehicle"
        ],

        "Academic": [
            "teacher",
            "professor",
            "faculty",
            "lecture",
            "class",
            "exam",
            "marks",
            "attendance",
            "assignment",
            "syllabus",
            "timetable"
        ]
    };


    /* =====================================================
       CATEGORY SCORING
    ===================================================== */

    let bestCategory = "Other";
    let bestScore = 0;

    for (const [categoryName, keywords] of Object.entries(categoryKeywords)) {

        let score = 0;

        for (const keyword of keywords) {

            if (lowerText.includes(keyword)) {
                score++;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestCategory = categoryName;
        }
    }

    category = bestCategory;


    
    //   SENTIMENT DETECTION

    const negativeWords = [
        "poor",
        "very poor",
        "bad",
        "worst",
        "terrible",
        "dirty",
        "broken",
        "damaged",
        "slow",
        "not working",
        "does not work",
        "doesn't work",
        "problem",
        "issue",
        "unavailable",
        "failure",
        "failed",
        "unsafe",
        "unacceptable",
        "disappointed",
        "complaint"
    ];


    const positiveWords = [
        "good",
        "great",
        "excellent",
        "working",
        "clean",
        "satisfied",
        "thank",
        "thanks"
    ];


    let negativeScore = 0;
    let positiveScore = 0;


    for (const word of negativeWords) {

        if (lowerText.includes(word)) {
            negativeScore++;
        }
    }


    for (const word of positiveWords) {

        if (lowerText.includes(word)) {
            positiveScore++;
        }
    }


    if (negativeScore > positiveScore) {
        sentiment = "Negative";
    } else {
        sentiment = "Normal";
    }


    //   PRIORITY DETECTION

    const criticalWords = [
        "fire",
        "accident",
        "emergency",
        "life threatening",
        "life-threatening",
        "electric shock",
        "short circuit",
        "dangerous",
        "unsafe",
        "injury",
        "injured"
    ];


    const highPriorityWords = [
        "very poor",
        "completely broken",
        "not working",
        "urgent",
        "immediately",
        "serious",
        "multiple days",
        "many days",
        "blocked",
        "unavailable",
        "security issue"
    ];


    const mediumPriorityWords = [
        "problem",
        "issue",
        "slow",
        "delay",
        "broken",
        "poor"
    ];


    // Critical
    for (const word of criticalWords) {

        if (lowerText.includes(word)) {
            priority = "Critical";
            break;
        }
    }


    // High
    if (priority !== "Critical") {

        for (const word of highPriorityWords) {

            if (lowerText.includes(word)) {
                priority = "High";
                break;
            }
        }
    }


    // Medium
    if (
        priority !== "Critical" &&
        priority !== "High"
    ) {

        for (const word of mediumPriorityWords) {

            if (lowerText.includes(word)) {
                priority = "Medium";
                break;
            }
        }
    }


    //   SUMMARY GENERATION

    let summary = text.trim();

    // Remove extra spaces
    summary = summary.replace(/\s+/g, " ");


    // Keep summary short
    if (summary.length > 200) {
        summary = summary.substring(0, 197) + "...";
    }


    //   RETURN AI RESULT

    return {
        category,
        sentiment,
        priority,
        summary
    };
}


module.exports = analyzeComplaint;