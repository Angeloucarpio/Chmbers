
function backupData() {
    try {
      const groups = JSON.parse(localStorage.getItem('groups')) || [];
  
      console.log('Groups data:', groups);  
  
      if (groups.length === 0) {
        alert('No data available to back up.');
        return;
      }

      const jsonData = JSON.stringify(groups, null, 2);
  

      console.log('JSON Data:', jsonData);
  
      
      const blob = new Blob([jsonData], { type: 'application/json' });
  

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'backup.JSON';  
  
      console.log('Triggering file download...');
  
      link.click();  
  
    } catch (error) {
      console.error('Error during backup:', error);
      alert('An error occurred while backing up data. Please try again.');
    }
  }
  