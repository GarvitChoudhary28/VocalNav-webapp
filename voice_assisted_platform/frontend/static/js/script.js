function greetUser() {
     setTimeout(() => {
         window.speechSynthesis.cancel(); // Force reset
         let speech = new SpeechSynthesisUtterance("hello user! Welcome to the Vocalnav. Please enter or say a website name you want to explore.");
         speech.onend = () => {
             console.log("Speech finished.");
         };
         window.speechSynthesis.speak(speech);
     }, 500); // Reduced delay for faster response
 }
 
 // Ensure it works even on page reload
 document.addEventListener("visibilitychange", () => {
     if (document.visibilityState === "visible") {
         greetUser();
     }
 });
 
 window.onload = greetUser;
 
 
 
      function loadWebsite() {
          var url = document.getElementById("websiteUrl").value;
          if (url) {
              if (!url.startsWith("http://") && !url.startsWith("https://")) {
                  url = "https://" + url;
              }
              document.getElementById("embeddedSite").src = url;
          } else {
              alert("Please enter a valid URL");
          }
      }     
      function startVoiceRecognition() {
          const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
          recognition.onstart = function() {
              console.log("Voice recognition started...");
          };
          recognition.onresult = function(event) {
              const transcript = event.results[0][0].transcript;
              document.getElementById("websiteUrl").value = transcript;
              loadWebsite();
          };
          recognition.start();
      }     
      //for hover-speak
      function speakText(text) {
       window.speechSynthesis.cancel();
       const speech = new SpeechSynthesisUtterance(text);
       window.speechSynthesis.speak(speech);
     }
     
     document.querySelectorAll('.hover-speak').forEach(div => {
       div.addEventListener('mouseenter', () => {
         const message = div.getAttribute('data-speech');
         if (message) speakText(message);
       });
     
       div.addEventListener('mouseleave', () => {
         window.speechSynthesis.cancel();
       });
     })     
        
  // Layout descriptions for known websites
  const layoutDescriptions = {
    "udemy.com": "This is udemy. The top has a navigation bar, middle shows  a landing page. and list of varius education field, followed by various courses with there prices and course details",
    "wikipedia.com": "This is Wikipedia. The top contains the search bar. The center has the article content. Left sidebar has categories.",
    "example.com": "This is an example layout with header, body and footer.",
    // Add more known websites here...
  };

  // Get the iframe
  const iframe = document.getElementById("embeddedSite");

  iframe.addEventListener("mouseenter", () => {
    try {
      const url = new URL(iframe.src);
      const domain = url.hostname.replace('www.', '');

      const description = layoutDescriptions[domain];

      if (description) {
        speakText(description);
      } else {
        speakText(" Sorry, unable to describe this website.  ");
      }
    } catch (e) {
        speakText("Sorry, unable to describe this website.");
    }
  });

  // Function to read the layout description aloud
  function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.cancel(); // stop previous speech
    window.speechSynthesis.speak(utterance);
  }  