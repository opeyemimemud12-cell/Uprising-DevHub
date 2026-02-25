// Uprising DevHub - starter interactivity
(function(){
  const GENRES = [
    'Action','Adventure','Role-Playing (RPG)','Simulation','Strategy','Sports','Racing','Fighting','Shooter (FPS / TPS)','Platformer','Puzzle','Idle / Incremental','Horror / Survival','Sandbox / Open World','Music / Rhythm','Educational','Party / Casual','MMO / Online Multiplayer','Board / Card','Virtual Reality (VR)','Augmented Reality (AR)','Stealth','Arcade / Retro','Simulation Sports','Other / Experimental'
  ];

  // Elements
  const modal = document.getElementById('modal');
  const cta = document.getElementById('ctaSubmit');
  const closeModal = document.getElementById('closeModal');
  const submitForm = document.getElementById('submitForm');
  const screenshotsInput = document.getElementById('screenshots');
  const genreSelect = submitForm.querySelector('select[name="genre"]');
  const categoryContainer = document.getElementById('categoryContainer');
  const nextPageBtn = document.getElementById('nextPage');
  const searchInput = document.getElementById('searchInput');

  // Auth elements
  const authModal = document.getElementById('authModal');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const closeAuth = document.getElementById('closeAuth');
  const authForm = document.getElementById('authForm');
  const authTitle = document.getElementById('authTitle');
  const profileSection = document.getElementById('profileSection');
  const authSection = document.getElementById('authSection');
  const profileAvatar = document.getElementById('profileAvatar');
  const profileEmail = document.getElementById('profileEmail');
  const profileLogout = document.getElementById('profileLogout');
  const uploadGameBtn = document.getElementById('uploadGameBtn');
  let authMode = 'login'; // 'login' or 'signup'
  let currentUser = null;

  // Profile modal elements
  const profileModal = document.getElementById('profileModal');
  const closeProfile = document.getElementById('closeProfile');
  const profileForm = document.getElementById('profileForm');
  const profileFormEmail = document.getElementById('profileFormEmail');
  const profileFormBio = document.getElementById('profileFormBio');
  const cancelProfile = document.getElementById('cancelProfile');

  // Generate color from email string
  function getColorFromEmail(email){
    let hash = 0;
    for(let i=0;i<email.length;i++){ hash=((hash<<5)-hash)+email.charCodeAt(i); hash=hash&hash; }
    const hue = Math.abs(hash)%360;
    return `hsl(${hue},70%,60%)`;
  }

  // Load current user from localStorage
  function loadCurrentUser(){
    return JSON.parse(localStorage.getItem('udhub_currentUser')||'null');
  }

  // Save current user
  function saveCurrentUser(user){
    localStorage.setItem('udhub_currentUser', JSON.stringify(user));
    currentUser = user;
    updateAuthUI();
  }

  function updateAuthUI(){
    const cu = loadCurrentUser();
    if(cu){
      profileEmail.textContent = cu.email;
      profileAvatar.style.background = getColorFromEmail(cu.email);
      profileSection.classList.remove('hidden');
      authSection.classList.add('hidden');
      profileLogout.onclick = ()=>{ localStorage.removeItem('udhub_currentUser'); currentUser=null; location.reload(); };
      // Profile avatar click to open profile modal
      profileAvatar.onclick = ()=>{ openProfileModal(cu.email); };
    } else {
      profileSection.classList.add('hidden');
      authSection.classList.remove('hidden');
      loginBtn.textContent = 'Log in';
      loginBtn.disabled = false;
      signupBtn.textContent = 'Sign up';
    }
  }

  // Load user profile data
  function getUserProfile(email){
    const users = getUsers();
    return users[email] && users[email].profile ? users[email].profile : {bio:''};
  }

  // Save user profile data
  function saveUserProfile(email, profile){
    const users = getUsers();
    if(users[email]){ users[email].profile = profile; localStorage.setItem('udhub_users', JSON.stringify(users)); }
  }

  function openProfileModal(email){
    const profile = getUserProfile(email);
    profileFormEmail.value = email;
    profileFormBio.value = profile.bio || '';
    profileModal.classList.remove('hidden');
  }

  // Profile modal controls
  closeProfile.addEventListener('click', ()=>profileModal.classList.add('hidden'));
  cancelProfile.addEventListener('click', ()=>profileModal.classList.add('hidden'));
  profileForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const cu = loadCurrentUser();
    if(!cu) return;
    const profile = {bio: profileFormBio.value.trim()};
    saveUserProfile(cu.email, profile);
    alert('Profile updated!');
    profileModal.classList.add('hidden');
  });

  // Get all registered users
  function getUsers(){
    return JSON.parse(localStorage.getItem('udhub_users')||'{}');
  }

  // Register user
  function registerUser(email, password){
    const users = getUsers();
    if(users[email]){ return {ok:false, msg:'Email already registered'}; }
    users[email] = {email, password, profile:{bio:'', avatar:''}, createdAt:Date.now()};
    localStorage.setItem('udhub_users', JSON.stringify(users));
    return {ok:true, msg:'Account created!'};
  }

  // Login user
  function loginUser(email, password){
    const users = getUsers();
    if(!users[email]){ return {ok:false, msg:'User not found'}; }
    if(users[email].password!==password){ return {ok:false, msg:'Wrong password'}; }
    saveCurrentUser({email, createdAt:users[email].createdAt});
    return {ok:true, msg:'Logged in!'};
  }

  // Populate genres
  GENRES.forEach(g=>{ const o=document.createElement('option'); o.value=g; o.textContent=g; genreSelect.appendChild(o);});

  // Modal controls
  function openModal(){ modal.classList.remove('hidden'); }
  function closeModalFn(){ modal.classList.add('hidden'); }
  cta.addEventListener('click', openModal);
  uploadGameBtn.addEventListener('click', openModal);
  closeModal.addEventListener('click', closeModalFn);
  document.getElementById('cancelSubmit').addEventListener('click', closeModalFn);

  // Auth modal
  loginBtn.addEventListener('click', ()=>{authMode='login'; authTitle.textContent='Log in'; authModal.classList.remove('hidden'); authForm.reset();});
  signupBtn.addEventListener('click', ()=>{authMode='signup'; authTitle.textContent='Sign up'; authModal.classList.remove('hidden'); authForm.reset();});
  closeAuth.addEventListener('click', ()=>authModal.classList.add('hidden'));

  // Auth form submit
  authForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const email = authForm.querySelector('input[name="email"]').value.trim();
    const password = authForm.querySelector('input[name="password"]').value.trim();
    if(!email || !password){ alert('Email and password required'); return; }
    
    let result;
    if(authMode==='signup'){
      result = registerUser(email, password);
    } else {
      result = loginUser(email, password);
    }
    
    if(result.ok){
      alert(result.msg);
      authModal.classList.add('hidden');
      authForm.reset();
    } else {
      alert('Error: '+result.msg);
    }
  });

  // Screenshot validation: max 10, warn on duplicates by name
  screenshotsInput.addEventListener('change', (e)=>{
    const files = Array.from(e.target.files || []);
    if(files.length>10){ alert('You can upload up to 10 screenshots.'); screenshotsInput.value=''; }
    // warn duplicates
    const names = files.map(f=>f.name.toLowerCase());
    const dupes = names.filter((n,i)=>names.indexOf(n)!==i);
    if(dupes.length>0){ alert('Duplicate screenshot names detected: '+[...new Set(dupes)].join(', ')); }
  });

  // Simple storage hook (replace with cloud SDK e.g., Firebase or S3 + Firestore)
  function saveGameToCloud(game){
    // Store to localStorage per user
    const cu = loadCurrentUser();
    if(!cu){ alert('You must log in to submit games'); return false; }
    game.developer = cu.email;
    const key = 'udhub_games_'+cu.email;
    const data = JSON.parse(localStorage.getItem(key)||'[]');
    data.unshift(game);
    localStorage.setItem(key, JSON.stringify(data));
    console.info('Saved game to local storage for '+cu.email);
    return true;
  }

  function loadGames(){
    // Show all games (public browsing) - in real app, filter by privacy settings
    let allGames = [];
    const users = getUsers();
    Object.keys(users).forEach(email=>{
      const key = 'udhub_games_'+email;
      const games = JSON.parse(localStorage.getItem(key)||'[]');
      allGames = allGames.concat(games);
    });
    return allGames;
  }

  // Form submit -> create a card and store
  submitForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const fd = new FormData(submitForm);
    const title = fd.get('title').trim();
    const genre = fd.get('genre');
    const description = fd.get('description');
    const link = fd.get('link');
    const files = Array.from(screenshotsInput.files || []);

    if(!title || !genre){ alert('Title and genre required'); return; }

    // warn about lack of link
    if(!link) console.warn('No download link provided - game will be marked unavailable.');

    const game = {id:Date.now(), title, genre, description, link, screenshots:files.map(f=>f.name), developer:'', available:!!link, upvotes:0, comments:[]};
    if(!saveGameToCloud(game)) return;
    renderCategoryRows();
    closeModalFn();
    submitForm.reset();
    screenshotsInput.value='';
  });

  // UI: render categories with cards
  function createCard(game){
    const cu = loadCurrentUser();
    const card = document.createElement('div'); card.className='card';
    const shot = document.createElement('div'); shot.className='screenshot';
    shot.textContent = game.screenshots[0] || 'No screenshot';
    card.appendChild(shot);
    const title = document.createElement('div'); title.className='meta'; title.innerHTML = `<strong>${game.title}</strong> • ${game.developer}`;
    card.appendChild(title);
    const desc = document.createElement('div'); desc.className='desc'; desc.textContent = game.description || '';
    card.appendChild(desc);
    const actions = document.createElement('div'); actions.style.marginTop='8px';
    const view = document.createElement('button'); view.className='btn small'; view.textContent = game.available ? 'View / Download' : 'Unavailable'; view.disabled = !game.available;
    if(game.available){ view.addEventListener('click', ()=>{ window.open(game.link, '_blank'); }); }
    if(!game.available){ const overlay=document.createElement('div'); overlay.className='unavailable-overlay'; overlay.textContent='Unavailable'; card.style.position='relative'; card.appendChild(overlay); }
    actions.appendChild(view);
    const up = document.createElement('button'); up.className='btn small'; up.textContent='▲ '+(game.upvotes||0); up.style.marginLeft='8px'; up.addEventListener('click', ()=>{ game.upvotes=(game.upvotes||0)+1; up.textContent='▲ '+game.upvotes; saveUpdatedGame(game); });
    actions.appendChild(up);
    
    // Delete button - only for game uploader
    if(cu && cu.email===game.developer){
      const del = document.createElement('button'); del.className='btn small'; del.textContent='🗑️ Delete'; del.style.marginLeft='8px'; del.style.opacity='0.7'; del.addEventListener('click', ()=>{ if(confirm('Delete this game?')){ deleteGame(game.id); renderCategoryRows(); } });
      actions.appendChild(del);
    }
    
    card.appendChild(actions);

    // comment form
    const cform = document.createElement('form'); cform.style.marginTop='10px';
    const cin = document.createElement('input'); cin.placeholder='Comment'; cin.style.width='100%'; cform.appendChild(cin);
    cform.addEventListener('submit', (e)=>{ e.preventDefault(); if(!cin.value) return; game.comments = game.comments || []; game.comments.push({text:cin.value,at:Date.now()}); saveUpdatedGame(game); renderCategoryRows(); });
    card.appendChild(cform);

    return card;
  }

  function saveUpdatedGame(game){
    const all = loadGames();
    const i = all.findIndex(g=>g.id===game.id);
    if(i>=0) all[i]=game; else all.unshift(game);
    localStorage.setItem('udhub_games', JSON.stringify(all));
  }

  function deleteGame(gameId){
    const cu = loadCurrentUser();
    if(!cu) return;
    const key = 'udhub_games_'+cu.email;
    const games = JSON.parse(localStorage.getItem(key)||'[]');
    const filtered = games.filter(g=>g.id!==gameId);
    localStorage.setItem(key, JSON.stringify(filtered));
  }

  // Render category rows
  let page = 0;
  let searchQuery = '';

  function filterGamesBySearch(games){
    if(!searchQuery.trim()) return games;
    const query = searchQuery.toLowerCase();
    return games.filter(g=>
      g.title.toLowerCase().includes(query) ||
      g.description.toLowerCase().includes(query) ||
      g.genre.toLowerCase().includes(query) ||
      g.developer.toLowerCase().includes(query)
    );
  }

  // Generate gradient from category name
  function getGradientFromCategory(cat){
    let hash = 0;
    for(let i=0;i<cat.length;i++){ hash=((hash<<5)-hash)+cat.charCodeAt(i); hash=hash&hash; }
    const hue1 = Math.abs(hash)%360;
    const hue2 = (hue1+60)%360;
    return `linear-gradient(135deg, hsl(${hue1},80%,55%), hsl(${hue2},80%,55%))`;
  }

  function renderCategoryRows(){
    const allGames = loadGames();
    const filteredGames = filterGamesBySearch(allGames);
    categoryContainer.innerHTML='';
    const categoriesToShow = GENRES.slice(page*6, page*6+6);
    categoriesToShow.forEach(cat=>{
      const row = document.createElement('div'); row.className='category-row';
      const header = document.createElement('div'); header.className='category-header';
      const bubble = document.createElement('div'); bubble.className='category-bubble'; bubble.style.background = getGradientFromCategory(cat);
      const title = document.createElement('h3'); title.textContent = cat;
      bubble.appendChild(title);
      header.appendChild(bubble);
      const wrap = document.createElement('div'); wrap.className='carousel-wrap';
      const left = document.createElement('button'); left.className='arrow left'; left.textContent='◀';
      const right = document.createElement('button'); right.className='arrow right'; right.textContent='▶';
      const carousel = document.createElement('div'); carousel.className='carousel';

      // add items for this category
      const filtered = filteredGames.filter(g=>g.genre===cat);
      if(filtered.length===0){ const empty = document.createElement('div'); empty.className='card'; empty.textContent='No games in this category yet.'; carousel.appendChild(empty); }
      filtered.forEach(g=>carousel.appendChild(createCard(g)));

      // arrows
      left.addEventListener('click', ()=>{ carousel.scrollBy({left:-300,behavior:'smooth'}); });
      right.addEventListener('click', ()=>{ carousel.scrollBy({left:300,behavior:'smooth'}); });

      wrap.appendChild(left); wrap.appendChild(carousel); wrap.appendChild(right);
      row.appendChild(header); row.appendChild(wrap);
      categoryContainer.appendChild(row);
    });
  }

  // Search functionality
  // Search on Enter key
  searchInput.addEventListener('keypress', (e)=>{
    if(e.key==='Enter'){
      e.preventDefault();
      searchQuery = searchInput.value.trim();
      page = 0;
      renderCategoryRows();
      if(searchQuery){ 
        document.getElementById('categories').scrollIntoView({behavior:'smooth'}); 
      } else {
        alert('Please enter a game name to search');
      }
    }
  });

  // Clear search on Escape key
  searchInput.addEventListener('keydown', (e)=>{
    if(e.key==='Escape'){
      searchQuery = '';
      searchInput.value = '';
      page = 0;
      renderCategoryRows();
    }
  });

  nextPageBtn.addEventListener('click', ()=>{ page++; if(page*6>=GENRES.length) page=0; renderCategoryRows(); window.scrollTo({top:document.getElementById('categories').offsetTop,behavior:'smooth'}); });

  // Clear any old demo data from localStorage
  localStorage.removeItem('udhub_games_demo@uprising.dev');
  const demoUser = getUsers()['demo@uprising.dev'];
  if(demoUser){
    const users = getUsers();
    delete users['demo@uprising.dev'];
    localStorage.setItem('udhub_users', JSON.stringify(users));
  }

  updateAuthUI();
  renderCategoryRows();

  // Expose a window hook for real cloud integration
  window.Uprising = {
    saveGameToCloud: saveGameToCloud,
    loadGames: loadGames,
    replaceWithCloudSDK(){ console.info('Replace Uprising.saveGameToCloud with your cloud upload + DB write.'); }
  };

})();
