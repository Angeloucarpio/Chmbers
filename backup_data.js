
function backupData() {
    try {
      // Retrieve the data from localStorage
      const groups = JSON.parse(localStorage.getItem('groups')) || [];
  
      console.log('Groups data:', groups);  // Log the data to ensure it's being retrieved properly
  
      // Check if there are no groups to back up
      if (groups.length === 0) {
        alert('No data available to back up.');
        return;
      }
  
      // Convert groups data to JSON string with formatting
      const jsonData = JSON.stringify(groups, null, 2);
  
      // Log the JSON data for verification
      console.log('JSON Data:', jsonData);
  
      // Create a Blob with the correct MIME type for JSON
      const blob = new Blob([jsonData], { type: 'application/json' });
  
      // Create a link to trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'group_transactions_backup.json';  // Filename: group_transactions_backup.json
  
      console.log('Triggering file download...');
  
      link.click();  // Initiate the download
  
    } catch (error) {
      console.error('Error during backup:', error);
      alert('An error occurred while backing up data. Please try again.');
    }
  }
  