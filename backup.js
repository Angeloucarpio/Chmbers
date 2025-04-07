function downloadBackup() {
    const groups = localStorage.getItem('groups') || '[]'; 
    const masterLogs = localStorage.getItem('masterLogs') || '[]'; 
    
    const data = {
      groups: JSON.parse(groups),
      masterLogs: JSON.parse(masterLogs), 
      exportedAt: new Date().toLocaleString() 
    };
  
   
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); 
  
   
    const link = document.createElement("a");
    link.href = url;
    link.download = "transaction_backup.json"; 
    link.click(); 
  
    URL.revokeObjectURL(url); 
  }
  