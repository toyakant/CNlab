// Handle file input and progress bar
document.getElementById('upload-btn').addEventListener('click', function () {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    
    if (file) {
      document.getElementById('file-name').textContent = `File: ${file.name}`;
      document.getElementById('file-details').classList.remove('hidden');
      
      // Display progress bar
      const progressBar = document.getElementById('progress-bar');
      const progressContainer = document.getElementById('progress-container');
      progressContainer.classList.remove('hidden');
      progressBar.style.width = '0%'; // Reset progress
  
      let progress = 0;
      const interval = setInterval(() => {
        if (progress >= 100) {
          clearInterval(interval);
          progressContainer.classList.add('hidden');
        } else {
          progress += 10; // Simulate progress
          progressBar.style.width = `${progress}%`;
        }
      }, 200); // Simulate every 200ms
  
      // Store the file for later use
      window.fileToShare = file;
    } else {
      alert("Please select a file.");
    }
  });
  
  // Drag and drop file upload
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  
  dropZone.addEventListener('click', () => fileInput.click());
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = '#333';
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.style.backgroundColor = '#1A1A1A';
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    fileInput.files = files; // Simulate file selection
    fileInput.dispatchEvent(new Event('change'));
  });
  
  // Show preview for images or text files
  fileInput.addEventListener('change', function () {
    const file = this.files[0];
    const preview = document.createElement('div');
    preview.id = 'file-preview';
    
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = '100%';
      preview.appendChild(img);
    } else if (file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = document.createElement('p');
        text.textContent = e.target.result;
        preview.appendChild(text);
      };
      reader.readAsText(file);
    }
  
    document.body.appendChild(preview);
  });
  
  // Generate the download link and handle expiration
  document.getElementById('share-btn').addEventListener('click', function () {
    if (window.fileToShare) {
      // Create a download URL for the file using Blob
      const file = window.fileToShare;
      const fileURL = URL.createObjectURL(file);
  
      // Show the link and update it with the URL
      const downloadLink = document.getElementById('download-link');
      downloadLink.href = fileURL;
      downloadLink.style.display = 'inline';
      downloadLink.textContent = `Download ${file.name}`;
      
      // Show the share section
      document.getElementById('share-section').classList.remove('hidden');
  
      // Set expiration time (24 hours)
      const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const expirationDate = new Date().getTime() + expirationTime;
  
      // Show the expiration time
      updateExpiration(expirationDate);
  
      // Set an interval to check if the link has expired
      const expirationInterval = setInterval(function() {
        const currentTime = new Date().getTime();
        if (currentTime > expirationDate) {
          // Hide the download link after 24 hours
          downloadLink.style.display = 'none';
          document.getElementById('expiry-info').textContent = "This link has expired.";
          clearInterval(expirationInterval);
        }
      }, 1000); // Check every second
    } else {
      alert("No file uploaded.");
    }
  });
  
  // Update expiration time
  function updateExpiration(expirationDate) {
    const expiryInfo = document.getElementById('expiry-info');
    const interval = setInterval(function() {
      const currentTime = new Date().getTime();
      const timeRemaining = expirationDate - currentTime;
  
      if (timeRemaining <= 0) {
        clearInterval(interval);
        expiryInfo.textContent = "This link has expired.";
      } else {
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        expiryInfo.textContent = `Expires in ${hours}h ${minutes}m ${seconds}s`;
      }
    }, 1000);
  }
  