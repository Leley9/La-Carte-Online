// Attendre que le DOM soit entièrement chargé
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM entièrement chargé et analysé.');

  // Initialisation de Mapbox
  mapboxgl.accessToken = 'pk.eyJ1Ijoid2FsbGVsZSIsImEiOiJjbTRjMDhtNjkwNW9kMmtzOGIxbjJoY2YyIn0.epw_clbHNtGowUjqvtbKiw'; // token Mapbox valide
  
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [5.484289, 51.438174],
    zoom: 12.29
  });
  
  // SVG pour les marqueurs personnalisés
  const markerSVG = `
  <svg width="27" height="36" viewBox="0 0 27 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.2 35.3232C12.643 35.3158 12.0957 35.1764 11.6031 34.9163C11.1105 34.6562 10.6867 34.283 10.3664 33.8272C9.944 33.264 0 20.2224 0 13.2C0 9.69914 1.39071 6.34167 3.86619 3.86619C6.34167 1.39071 9.69914 0 13.2 0C16.7009 0 20.0583 1.39071 22.5338 3.86619C25.0093 6.34167 26.4 9.69914 26.4 13.2C26.4 20.24 16.456 33.264 16.0336 33.8272C15.7133 34.283 15.2895 34.6562 14.7969 34.9163C14.3043 35.1764 13.757 35.3158 13.2 35.3232ZM13.2 1.76C10.1674 1.76465 7.26025 2.97143 5.11584 5.11584C2.97143 7.26025 1.76465 10.1674 1.76 13.2C1.76 19.624 11.6512 32.56 11.7568 32.7536C11.919 32.986 12.1349 33.1757 12.3862 33.3068C12.6374 33.4378 12.9166 33.5062 13.2 33.5062C13.4834 33.5062 13.7626 33.4378 14.0138 33.3068C14.2651 33.1757 14.481 32.986 14.6432 32.7536C14.7488 32.6128 24.64 19.624 24.64 13.2C24.6353 10.1674 23.4286 7.26025 21.2842 5.11584C19.1398 2.97143 16.2326 1.76465 13.2 1.76Z" fill="#FFF200"/>
    <path d="M13.1991 19.36C11.9807 19.36 10.7898 18.9988 9.77675 18.3219C8.76375 17.645 7.9742 16.683 7.50797 15.5574C7.04173 14.4318 6.91974 13.1932 7.15743 11.9983C7.39511 10.8034 7.9818 9.70576 8.84329 8.84426C9.70478 7.98277 10.8024 7.39609 11.9973 7.1584C13.1922 6.92072 14.4308 7.04271 15.5564 7.50894C16.682 7.97518 17.644 8.76472 18.3209 9.77773C18.9978 10.7907 19.3591 11.9817 19.3591 13.2C19.3591 14.8338 18.7101 16.4006 17.5548 17.5558C16.3996 18.711 14.8328 19.36 13.1991 19.36ZM13.1991 8.80004C12.3288 8.80004 11.4781 9.0581 10.7546 9.54158C10.031 10.0251 9.46702 10.7122 9.134 11.5162C8.80097 12.3202 8.71384 13.2049 8.88361 14.0584C9.05339 14.912 9.47245 15.696 10.0878 16.3113C10.7031 16.9267 11.4872 17.3457 12.3407 17.5155C13.1942 17.6853 14.0789 17.5981 14.8829 17.2651C15.6869 16.9321 16.3741 16.3681 16.8575 15.6446C17.341 14.921 17.5991 14.0703 17.5991 13.2C17.5991 12.0331 17.1355 10.9139 16.3103 10.0888C15.4852 9.26361 14.366 8.80004 13.1991 8.80004Z" fill="#FFF200"/>
  </svg>
  `;
  
  let activeMarkers = [];
  
  // Initialisation de Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyAQWtxBZbZ2TcsCmP8TyfsNnAV2pNOboZo",
    authDomain: "la-carte-1e859.firebaseapp.com",
    projectId: "la-carte-1e859",
    storageBucket: "la-carte-1e859.firebasestorage.app",
    messagingSenderId: "791686374946",
    appId: "1:791686374946:web:752cd7badc436dfa7b4c7b"
  };
  
  // Initialiser Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  // Sélection des éléments du DOM pour l'authentification
  const authModal = document.getElementById('authModal');
  const openAuthModalBtn = document.getElementById('openAuthModalBtn');
  const closeAuthModalBtn = document.getElementById('closeAuthModal');
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  
  // Sélection des autres éléments du DOM
  const modal = document.getElementById('modal'); // Modal d'ajout de marqueur
  const profileModal = document.getElementById('profileModal'); // Modal profil
  const addMarkerBtn = document.getElementById('addMarkerBtn');
  const closeBtn = document.getElementById('closeBtn');
  const menuButton = document.getElementById('menuButton');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const topLeftControls = document.getElementById('topLeftControls');
  const topRightControls = document.getElementById('topRightControls');
  const menuButtonContainer = document.getElementById('menuButtonContainer');
  
  const form = document.getElementById('placeForm');
  const profileButton = document.getElementById('profileButton');
  const closeProfileModal = document.getElementById('closeProfileModal');
  const profileForm = document.getElementById('profileForm');
  const profileFilterBtn = document.getElementById('profileFilterBtn');
  const profileInfoModal = document.getElementById('profileInfoModal');
  const closeProfileInfoModal = document.getElementById('closeProfileInfoModal');
  
  // Gestion de l'ouverture du modal d'authentification
if (openAuthModalBtn && authModal) {
  openAuthModalBtn.addEventListener('click', () => {
    console.log('Ouverture du modal d\'authentification');
    authModal.classList.remove('hidden');
  });
} else {
  console.warn('Bouton d\'ouverture du modal d\'authentification ou modal introuvable.');
}

// Gestion de la fermeture du modal d'authentification
if (closeAuthModalBtn && authModal) {
  closeAuthModalBtn.addEventListener('click', () => {
    console.log('Fermeture du modal d\'authentification');
    authModal.classList.add('hidden');
  });
} else {
  console.warn('Bouton de fermeture du modal d\'authentification ou modal introuvable.');
}

  
  // Gestion de l'inscription
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value.trim();
      console.log(`Tentative d'inscription avec l'email: ${email}`);
  
      try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert('Inscription réussie !');
        signupForm.reset();
        authModal.classList.add('hidden');
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        alert(error.message);
      }
    });
  } else {
    console.warn('Formulaire d\'inscription introuvable.');
  }
  

  // Gestion de la connexion
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
       // Vérif connexion
       if (auth.currentUser) {
        alert('Vous êtes déjà connecté(e) !');
        authModal.classList.add('hidden');
        console.log('DEBUG => auth.currentUser existe, modal devrait être fermée');
        return;
      }
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    console.log(`Tentative de connexion avec l'email: ${email}`);

    try {
      // Authentification Firebase
      await auth.signInWithEmailAndPassword(email, password);
      alert('Connexion réussie !');
      
      // Réinitialise le formulaire
      loginForm.reset();
      // Ferme la modal d'authentification
      authModal.classList.add('hidden');
      
      // Affiche les boutons de la carte (si tu veux un retour immédiat)
      if (addMarkerBtn) addMarkerBtn.style.display = 'block';
      if (profileButton) profileButton.style.display = 'block';
      // Masque le bouton "Se connecter / S'inscrire" s'il existe
      if (openAuthModalBtn) openAuthModalBtn.style.display = 'none';

      // (Optionnel) Charger la carte ou ses marqueurs si cela n’a pas été fait
      // loadMarkers(); // si la logique de chargement n'est pas déjà dans onAuthStateChanged

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      alert(error.message);
    }
  });
} else {
  console.warn('Formulaire de connexion introuvable.');
}

  
  // Fonction pour ajouter un profil à Firestore
  async function addProfile(profile) {
    try {
      await db.collection('profiles').add({
        ...profile,
        userId: auth.currentUser.uid, // Associer le profil à l'utilisateur connecté
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('Profil ajouté à Firestore:', profile);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du profil :', error);
      throw error;
    }
  }
  
  // Fonction pour récupérer tous les profils depuis Firestore
  async function getAllProfiles() {
    try {
      const snapshot = await db.collection('profiles').orderBy('createdAt', 'desc').get();
      const profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Profils récupérés de Firestore:', profiles);
      return profiles;
    } catch (error) {
      console.error('Erreur lors de la récupération des profils :', error);
      throw error;
    }
  }
  
  // Fonction pour supprimer un profil par ID
  async function deleteProfile(id) {
    try {
      await db.collection('profiles').doc(id).delete();
      console.log(`Profil avec ID ${id} supprimé de Firestore.`);
    } catch (error) {
      console.error('Erreur lors de la suppression du profil :', error);
      throw error;
    }
  }
  
  // Fonction pour ajouter un marqueur à Firestore
  // --> On retourne l'ID créé par Firestore
  async function addMarker(markerData) {
    try {
      const docRef = await db.collection('markers').add({
        ...markerData,
        userId: auth.currentUser.uid, // Associer le marqueur à l'utilisateur connecté
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('Marqueur ajouté à Firestore:', markerData);
      return docRef.id; // On retourne l'id Firestore
    } catch (error) {
      console.error('Erreur lors de l\'ajout du marqueur :', error);
      throw error;
    }
  }
  
  // Fonction pour récupérer tous les marqueurs depuis Firestore
  async function getAllMarkers() {
    try {
      const snapshot = await db.collection('markers').orderBy('createdAt', 'desc').get();
      const markers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Marqueurs récupérés de Firestore:', markers);
      return markers;
    } catch (error) {
      console.error('Erreur lors de la récupération des marqueurs :', error);
      throw error;
    }
  }
  
  // Fonction pour supprimer un marqueur par ID
  async function deleteMarker(id) {
    try {
      await db.collection('markers').doc(id).delete();
      console.log(`Marqueur avec ID ${id} supprimé de Firestore.`);
    } catch (error) {
      console.error('Erreur lors de la suppression du marqueur :', error);
      throw error;
    }
  }
  
  // Fonction pour charger les marqueurs depuis Firestore
  async function loadMarkers() {
    try {
      const markers = await getAllMarkers();
      markers.forEach(markerData => {
        const markerElement = document.createElement('div');
        markerElement.innerHTML = markerSVG;
  
        const popupHTML = `
          <div class="popup-content">
            <h3>${markerData.title}</h3>
            <p class="popup-category"><strong>Catégorie:</strong> ${markerData.category}</p>
            <p class="popup-description">${markerData.description}</p>
            <button class="delete-marker" aria-label="Delete Marker">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </button>
          </div>
        `;
  
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([markerData.lng, markerData.lat])
          .setPopup(new mapboxgl.Popup().setHTML(popupHTML))
          .addTo(map);
  
        activeMarkers.push(marker);
  
        marker.getPopup().on('open', () => {
          const deleteButton = marker.getPopup().getElement().querySelector('.delete-marker');
          if (deleteButton) {
            deleteButton.addEventListener('click', async () => {
              if (confirm(`Êtes-vous sûr de vouloir supprimer ce marqueur ?`)) {
                try {
                  // On supprime d'abord de Firestore
                  await deleteMarker(markerData.id);
                  // Puis on le retire de la carte
                  marker.remove();
                  alert('Marqueur supprimé avec succès !');
                } catch (error) {
                  alert('Erreur lors de la suppression du marqueur.');
                }
              }
            });
          }
        });
      });
      console.log('Tous les marqueurs ont été chargés sur la carte.');
    } catch (error) {
      console.error('Erreur lors du chargement des marqueurs :', error);
      alert('Erreur lors du chargement des marqueurs.');
    }
  }
  
  // Fonction pour charger les catégories depuis Firestore
  async function loadCategories() {
    try {
      const snapshot = await db.collection('categories').get();
      const categories = snapshot.docs.map(doc => doc.data().name);
      saveCategoriesToStorage(categories);
      console.log('Catégories chargées depuis Firestore:', categories);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories :', error);
      alert('Erreur lors du chargement des catégories.');
    }
  }
  
  // Fonction pour sauvegarder les catégories dans Firestore
  async function saveCategoriesToFirestore(categories) {
    try {
      const batch = db.batch();
      categories.forEach(category => {
        const docRef = db.collection('categories').doc();
        batch.set(docRef, { name: category });
      });
      await batch.commit();
      console.log('Catégories par défaut ajoutées à Firestore.');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des catégories :', error);
      throw error;
    }
  }
  
  // Fonction pour sauvegarder les catégories dans Firestore si aucune n'existe
  async function saveCategoriesToStorage(categories) {
    try {
      const snapshot = await db.collection('categories').get();
      if (snapshot.empty) {
        // Si aucune catégorie n'existe, en ajouter quelques-unes par défaut
        const defaultCategories = ['Restaurants', 'Bars', 'Musées', 'Parcs'];
        await saveCategoriesToFirestore(defaultCategories);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des catégories :', error);
    }
  }
  
  // Fonction pour peupler le dropdown des catégories
  async function populateCategoryDropdown() {
    const categorySelect = document.getElementById('category');
    if (!categorySelect) {
      console.warn('Élément select pour les catégories introuvable.');
      return;
    }
    categorySelect.innerHTML = '';
  
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Sélectionnez une catégorie';
    categorySelect.appendChild(defaultOption);
  
    try {
      const snapshot = await db.collection('categories').get();
      snapshot.forEach(doc => {
        const category = doc.data().name;
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
      console.log('Dropdown des catégories peuplé.');
    } catch (error) {
      console.error('Erreur lors du chargement des catégories :', error);
    }
  }
  
  // Fonction pour filtrer les marqueurs par catégorie
  async function filterMarkersByCategory(category) {
    console.log(`Filtrage des marqueurs par catégorie: ${category}`);
    // Supprimer tous les marqueurs actuels de la carte
    activeMarkers.forEach(marker => marker.remove());
    activeMarkers = [];
  
    try {
      const snapshot = await db.collection('markers')
        .where('category', '==', category)
        .orderBy('createdAt', 'desc')
        .get();
  
      const markers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`Marqueurs filtrés pour la catégorie "${category}":`, markers);
  
      markers.forEach(markerData => {
        const markerElement = document.createElement('div');
        markerElement.innerHTML = markerSVG;
  
        const popupHTML = `
          <div class="popup-content">
            <h3>${markerData.title}</h3>
            <p class="popup-category"><strong>Catégorie:</strong> ${markerData.category}</p>
            <p class="popup-description">${markerData.description}</p>
            <button class="delete-marker" aria-label="Delete Marker">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </button>
          </div>
        `;
  
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([markerData.lng, markerData.lat])
          .setPopup(new mapboxgl.Popup().setHTML(popupHTML))
          .addTo(map);
  
        activeMarkers.push(marker);
  
        marker.getPopup().on('open', () => {
          const deleteButton = marker.getPopup().getElement().querySelector('.delete-marker');
          if (deleteButton) {
            deleteButton.addEventListener('click', async () => {
              if (confirm(`Êtes-vous sûr de vouloir supprimer ce marqueur ?`)) {
                try {
                  await deleteMarker(markerData.id);
                  marker.remove();
                  alert('Marqueur supprimé avec succès !');
                } catch (error) {
                  alert('Erreur lors de la suppression du marqueur.');
                }
              }
            });
          }
        });
      });
    } catch (error) {
      console.error('Erreur lors du filtrage des marqueurs :', error);
      alert('Erreur lors du filtrage des marqueurs.');
    }
  }
  
  // Fonction pour attacher les événements de filtrage des catégories
  function attachCategoryFilterEvents() {
    const dropdownItems = document.querySelectorAll('#dropdownMenu .dropdown-item');
    if (dropdownItems.length === 0) {
      console.warn('Aucun élément avec la classe .dropdown-item trouvé dans #dropdownMenu.');
    }
    dropdownItems.forEach(item => {
      item.addEventListener('click', () => {
        const selectedCategory = item.getAttribute('data-category');
        if (selectedCategory) {
          filterMarkersByCategory(selectedCategory);
          dropdownMenu.classList.add('hidden');
        } else {
          console.warn('Catégorie sélectionnée invalide.');
        }
      });
    });
    console.log('Événements de filtrage des catégories attachés.');
  }
  
  // Fonction pour restaurer les contrôles sur mobile
  function restoreControlsOnMobile() {
    if (window.innerWidth <= 480) {
      if (topLeftControls) {
        topLeftControls.style.display = 'flex';
        topLeftControls.style.zIndex = '9999';
      }
      if (topRightControls) topRightControls.style.display = 'flex';
      if (addMarkerBtn) addMarkerBtn.style.display = 'block';
      if (profileButton) profileButton.style.display = 'block';
      if (menuButton) menuButton.style.display = 'inline-block';
  
      const profileFilterBtn = document.getElementById('profileFilterBtn');
      if (profileFilterBtn) profileFilterBtn.style.display = 'inline-block';
    }
  }
  
  // Fonction pour gérer l'ouverture et la fermeture du modal d'ajout de marqueur
  if (addMarkerBtn && modal) {
    addMarkerBtn.addEventListener('click', () => {
      console.log('Ouverture du modal d\'ajout de marqueur');
      modal.classList.remove('hidden');
    });
  } else {
    console.warn('Bouton d\'ajout de marqueur ou modal introuvable.');
  }
  
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      console.log('Fermeture du modal d\'ajout de marqueur');
      modal.classList.add('hidden');
    });
  } else {
    console.warn('Bouton de fermeture du modal d\'ajout de marqueur ou modal introuvable.');
  }
  
  // Soumission du formulaire d'ajout de marqueur
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value.trim();
      const description = document.getElementById('description').value.trim();
      const category = document.getElementById('category').value;
      let address = document.getElementById('address').value.trim();
  
      console.log(`Ajout d'un marqueur: ${title}, ${description}, ${category}, ${address}`);
  
      if (!address) {
        alert("Veuillez entrer une adresse.");
        return;
      }
  
      address = address + ", Paris, France";
      const encodedAddress = encodeURIComponent(address);
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;
  
      try {
        const response = await fetch(nominatimUrl);
        const data = await response.json();
  
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
  
          if (isNaN(lat) || isNaN(lon)) {
            alert("Coordonnées invalides. Essayez une autre adresse.");
            return;
          }
  
          // Création du marker sur la carte
          const markerElement = document.createElement('div');
          markerElement.innerHTML = markerSVG;
  
          const popupHTML = `
            <div class="popup-content">
              <h3>${title}</h3>
              <p class="popup-category"><strong>Catégorie:</strong> ${category}</p>
              <p class="popup-description">${description}</p>
              <button class="delete-marker" aria-label="Delete Marker">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>
          `;
  
          const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([lon, lat])
            .setPopup(new mapboxgl.Popup().setHTML(popupHTML))
            .addTo(map);
  
          activeMarkers.push(marker);
          marker.category = category;
  
          // Enregistrer ce marqueur en base Firestore
          const newMarker = {
            title,
            description,
            lat,
            lng: lon,
            category,
            userId: auth.currentUser.uid
          };
          const docId = await addMarker(newMarker);
          
          // On stocke l'ID dans l'objet marker pour pouvoir le supprimer
          marker.docId = docId;
  
          // Gérer la suppression du marqueur (créé "à la volée")
          marker.getPopup().on('open', () => {
            const deleteButton = marker.getPopup().getElement().querySelector('.delete-marker');
            if (deleteButton) {
              deleteButton.addEventListener('click', async () => {
                if (confirm(`Êtes-vous sûr de vouloir supprimer ce marqueur ?`)) {
                  try {
                    await deleteMarker(marker.docId); // On utilise l'ID stocké
                    marker.remove();
                    alert('Marqueur supprimé avec succès !');
                  } catch (error) {
                    alert('Erreur lors de la suppression du marqueur.');
                  }
                }
              });
            }
          });
  
          // Fermer la modale et reset le formulaire
          modal.classList.add('hidden');
          form.reset();
  
          // Restaurer l'affichage des contrôles sur mobile
          restoreControlsOnMobile();
          console.log('Marqueur ajouté avec succès.');
        } else {
          alert("Aucun résultat trouvé pour cette adresse.");
        }
      } catch (error) {
        console.error("Erreur lors du géocodage Nominatim :", error);
        alert("Erreur lors de la récupération des coordonnées.");
      }
    });
  } else {
    console.warn('Formulaire d\'ajout de marqueur introuvable.');
  }
  
  // Gestion du profil : ouverture et fermeture des modals
  if (profileButton && profileModal) {
    profileButton.addEventListener('click', () => {
      console.log('Ouverture du modal de profil');
      profileModal.classList.remove('hidden');
    });
  } else {
    console.warn('Bouton de profil ou modal de profil introuvable.');
  }
  
  if (closeProfileModal && profileModal) {
    closeProfileModal.addEventListener('click', () => {
      console.log('Fermeture du modal de profil');
      profileModal.classList.add('hidden');
    });
  } else {
    console.warn('Bouton de fermeture du modal de profil ou modal introuvable.');
  }
  
  // Soumission du formulaire de profil
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('userName').value.trim();
      const description = document.getElementById('userDescription').value.trim();
      const photo = document.getElementById('profilePhoto').files[0];
      console.log(`Ajout d'un profil: ${name}, ${description}, ${photo ? photo.name : 'Pas de photo'}`);
  
      if (!name) {
        alert('Le nom est requis.');
        return;
      }
  
      let photoDataUrl = null;
  
      if (photo) {
        try {
          photoDataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve(event.target.result);
            };
            reader.onerror = () => {
              reject('Erreur lors de la lecture de l\'image.');
            };
            reader.readAsDataURL(photo);
          });
        } catch (error) {
          console.error(error);
          alert('Erreur lors de la lecture de l\'image.');
          return;
        }
      }
  
      const newProfile = {
        name,
        description,
        photo: photoDataUrl // Stocker l'URL de l'image
      };
  
      try {
        await addProfile(newProfile);
        alert('Profil enregistré avec succès !');
        profileForm.reset();
        profileModal.classList.add('hidden');
        restoreControlsOnMobile();
        console.log('Profil ajouté avec succès.');
      } catch (error) {
        alert('Erreur lors de l\'enregistrement du profil.');
      }
    });
  } else {
    console.warn('Formulaire de profil introuvable.');
  }
  
  // Affichage des profils dans une modal
  if (profileFilterBtn) {
    profileFilterBtn.addEventListener('click', async () => {
      console.log('Tentative d\'affichage des profils.');
      try {
        const profiles = await getAllProfiles();
  
        const profileInfoContainer = document.getElementById('profileInfoContainer');
        if (!profileInfoContainer) {
          console.warn('Conteneur des informations de profil introuvable.');
          return;
        }
        profileInfoContainer.innerHTML = '';
  
        if (profiles.length > 0) {
          profiles.forEach(profileData => {
            const { id, name, description, photo, userId } = profileData;
  
            const singleProfileContainer = document.createElement('div');
            singleProfileContainer.style.border = '1px solid #ccc';
            singleProfileContainer.style.borderRadius = '5px';
            singleProfileContainer.style.padding = '10px';
            singleProfileContainer.style.marginBottom = '10px';
            singleProfileContainer.style.display = 'flex';
            singleProfileContainer.style.alignItems = 'center';
            singleProfileContainer.style.gap = '10px';
            singleProfileContainer.style.flexWrap = 'wrap'; // Adaptation mobile
  
            // Photo de profil
            if (photo) {
              const img = document.createElement('img');
              img.src = photo;
              img.alt = 'Photo de profil';
              img.style.width = '50px';
              img.style.height = '50px';
              img.style.objectFit = 'cover';
              img.style.borderRadius = '50%';
              singleProfileContainer.appendChild(img);
            }
  
            const textContainer = document.createElement('div');
            textContainer.style.flex = '1';
            const nameEl = document.createElement('h4');
            nameEl.textContent = name;
            nameEl.style.margin = '0';
  
            const descEl = document.createElement('p');
            descEl.textContent = description;
            descEl.style.margin = '0';
  
            textContainer.appendChild(nameEl);
            textContainer.appendChild(descEl);
  
            singleProfileContainer.appendChild(textContainer);
  
            // Bouton de suppression (visible uniquement pour le propriétaire)
            if (auth.currentUser && auth.currentUser.uid === userId) {
              const deleteBtn = document.createElement('button');
              deleteBtn.textContent = 'Supprimer';
              deleteBtn.style.marginLeft = 'auto';
              deleteBtn.style.backgroundColor = '#ff4d4d';
              deleteBtn.style.color = '#fff';
              deleteBtn.style.border = 'none';
              deleteBtn.style.padding = '5px 10px';
              deleteBtn.style.borderRadius = '3px';
              deleteBtn.style.cursor = 'pointer';
              deleteBtn.setAttribute('data-id', id);
              singleProfileContainer.appendChild(deleteBtn);
  
              // Événement de suppression
              deleteBtn.addEventListener('click', async () => {
                if (confirm(`Êtes-vous sûr de vouloir supprimer le profil de ${name} ?`)) {
                  try {
                    await deleteProfile(id);
                    alert('Profil supprimé avec succès !');
                    // Rafraîchir la liste des profils
                    profileFilterBtn.click();
                  } catch (error) {
                    alert('Erreur lors de la suppression du profil.');
                  }
                }
              });
            }
  
            profileInfoContainer.appendChild(singleProfileContainer);
          });
        } else {
          const noProfileEl = document.createElement('p');
          noProfileEl.textContent = "Aucun profil n'a été enregistré.";
          profileInfoContainer.appendChild(noProfileEl);
        }
  
        // Afficher la modal des profils
        profileInfoModal.classList.remove('hidden');
        console.log('Modal des profils affichée.');
      } catch (error) {
        console.error('Erreur lors de la récupération des profils :', error);
        alert('Erreur lors de la récupération des profils.');
      }
    });
  } else {
    console.warn('Bouton de filtrage des profils introuvable.');
  }
  
  // Gestion de la fermeture de la modal des profils
  if (closeProfileInfoModal) {
    closeProfileInfoModal.addEventListener('click', () => {
      profileInfoModal.classList.add('hidden');
      console.log('Fermeture de la modal des profils.');
    });
  } else {
    console.warn('Bouton de fermeture de la modal des profils introuvable.');
  }
  
  // Gestion des menus déroulants
  if (menuButton && dropdownMenu) {
    menuButton.addEventListener('click', () => {
      dropdownMenu.classList.toggle('hidden');
      console.log('Menu déroulant togglé.');
    });
  
    document.addEventListener('click', (event) => {
      if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.add('hidden');
        console.log('Menu déroulant caché.');
      }
    });
  } else {
    console.warn('Bouton de menu ou menu déroulant introuvable.');
  }
  
  // Écouteur d'état de connexion
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log('Utilisateur connecté:', user.email);
      if (addMarkerBtn) addMarkerBtn.style.display = 'block';
      if (profileButton) profileButton.style.display = 'block';
      if (openAuthModalBtn) openAuthModalBtn.style.display = 'flex';
      // Charger les marqueurs dès qu'un utilisateur est connecté
      loadMarkers();
    } else {
      console.log('Utilisateur déconnecté');
      if (addMarkerBtn) addMarkerBtn.style.display = 'none';
      if (profileButton) profileButton.style.display = 'none';
      if (openAuthModalBtn) openAuthModalBtn.style.display = 'block';
      // Supprimer les marqueurs de la carte si nécessaire
      activeMarkers.forEach(marker => marker.remove());
      activeMarkers = [];
    }
  });
  
  // Charger les catégories et peupler le dropdown au chargement initial
  loadCategories().then(() => {
    populateCategoryDropdown();
    attachCategoryFilterEvents();
  });
});
