const voiceButton = document.getElementById("voiceButton");
const output = document.getElementById("output");

voiceButton.addEventListener("click", () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            output.textContent = "Listening...";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            output.textContent = `You said: "${transcript}"`;

            if (transcript.includes("open")) {
                const site = transcript.replace("open ", "").trim();
                searchWebsite(site);
            }
        };

        recognition.onerror = (event) => {
            output.textContent = "Error occurred: " + event.error;
        };

        recognition.start();
    } else {
        output.textContent = "Speech recognition is not supported in this browser.";
    }
});

function searchWebsite(query) {
    const searchUrl = `https://www.google.com/search?q=${query}`;
    document.getElementById("embeddedSite").src = searchUrl;
}

///for wesite layout

function describeWebsite(query) {
    const url = `https://www.${query.replace(/\s/g, "")}.com`;

    fetch(`/fetch-structure/?url=${url}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                output.textContent = "Could not retrieve website structure.";
            } else {
                let description = `Website: ${data.title}. ${data.description}`;

                if (data.headings.length > 0) {
                    description += ` The main headings are: ${data.headings.join(", ")}.`;
                }
                if (data.buttons.length > 0) {
                    description += ` It has buttons such as: ${data.buttons.slice(0, 5).join(", ")}.`;
                }
                if (data.links.length > 0) {
                    description += ` There are ${data.links.length} links on the page.`;
                }

                output.textContent = description;
                speakText(description);
            }
        })
        .catch(error => {
            output.textContent = "Failed to fetch website details.";
        });
}

function speakText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
}
