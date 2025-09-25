if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

async function loadData() {
  const loadingElement = document.querySelector('.loading');
  const dataContainer = document.getElementById('data-container');
  
  loadingElement.style.display = 'block';
  
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    
    dataContainer.innerHTML = '';
    
    data.items.forEach(item => {
      const card = createCard(item);
      dataContainer.appendChild(card);
    });
    
    const metaInfo = document.createElement('div');
    metaInfo.className = 'col-12 mt-4';
    metaInfo.innerHTML = `
      <div class="alert alert-info">
        <strong>Data Info:</strong> 
        Total items: ${data.metadata.total} | 
        Last updated: ${data.metadata.lastUpdated} | 
        Version: ${data.metadata.version}
      </div>
    `;
    dataContainer.appendChild(metaInfo);
    
  } catch (error) {
    dataContainer.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">
          <strong>Error:</strong> Failed to load data. ${error.message}
        </div>
      </div>
    `;
  } finally {
    loadingElement.style.display = 'none';
  }
}

async function loadCards() {
  const response = await fetch('cards.json');
  const data = await response.json();
  return data
}

function createCard(item) {
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4 mb-4';
  
  const featuredBadge = item.featured ? 
    '<span class="badge bg-warning text-dark mb-2">Featured</span>' : '';
  
  col.innerHTML = `
    <div class="card h-100">
      <div class="card-body">
        ${featuredBadge}
        <h5 class="card-title">${item.title}</h5>
        <p class="card-text">${item.description}</p>
        <span class="badge bg-secondary">${item.category}</span>
      </div>
    </div>
  `;
  
  return col;
}

function installPrompt() {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const installBtn = document.createElement('button');
    installBtn.className = 'btn btn-success btn-sm ms-2';
    installBtn.textContent = 'Install App';
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        installBtn.remove();
      }
    });
    
    const navbar = document.querySelector('.navbar-brand');
    navbar.parentNode.appendChild(installBtn);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  installPrompt();
});