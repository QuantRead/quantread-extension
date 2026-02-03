document.getElementById('beamBtn').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      // 1. Prioritize highlighted text if the user selected something specific
      const selection = window.getSelection().toString();
      if (selection) return selection;

      // 2. "Reading Mode" Logic: Target common article containers to avoid ads
      const articleSelectors = [
        'article', 
        'main', 
        '.article-content', 
        '.post-content', 
        '#story-content'
      ];
      
      for (const selector of articleSelectors) {
        const element = document.querySelector(selector);
        if (element) return element.innerText;
      }

      // 3. Fallback to body text if no article container is found
      return document.body.innerText;
    },
  }, (results) => {
    if (results && results[0].result) {
      // Clean up the text: remove double spaces and line breaks
      const cleanText = results[0].result
        .replace(/\n\s*\n/g, '\n') 
        .replace(/\s+/g, ' ')
        .trim();

      const text = encodeURIComponent(cleanText);
      window.open(`https://quantread-app.vercel.app/?text=${text}`);
    }
  });
});