// ═══════════════════════════════════════════════
// NOMOS AI — My Wakili
// JavaScript: nomos-script.js
// Links to: nomos-index.html
// ═══════════════════════════════════════════════
// ── Page Router ──
let currentPage = 'landing';
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg = document.getElementById('page-'+id);
  if(pg){pg.classList.add('active');currentPage=id;window.scrollTo(0,0)}
  document.getElementById('navbar').style.display = id==='dashboard'?'none':'flex';
  if(id==='dashboard'){setTimeout(()=>startReveal(),100)}
}

// ── Navbar scroll ──
window.addEventListener('scroll',()=>{
  const nb=document.getElementById('navbar');
  if(nb) nb.classList.toggle('scrolled',window.scrollY>20);
});

// ── Mobile nav ──
function toggleMobileNav(){
  document.getElementById('navbar').classList.toggle('mobile-nav-open');
}
document.addEventListener('click',e=>{
  const nb=document.getElementById('navbar');
  if(nb && !nb.contains(e.target)) nb.classList.remove('mobile-nav-open');
});

// ── Scroll to section ──
function scrollToSection(id){
  if(currentPage!=='landing') showPage('landing');
  setTimeout(()=>{
    const el=document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
  },currentPage==='landing'?0:300);
}

// ── Command Bar ──
function showCmd(){document.getElementById('cmdOverlay').classList.add('open');setTimeout(()=>document.getElementById('cmdInput').focus(),100)}
function hideCmd(){document.getElementById('cmdOverlay').classList.remove('open');document.getElementById('cmdInput').value=''}
function closeCmdOverlay(e){if(e.target===document.getElementById('cmdOverlay'))hideCmd()}
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();showCmd()}
  if(e.key==='Escape') hideCmd();
});
function filterCmd(v){}
function cmdKeyNav(e){if(e.key==='Escape')hideCmd()}

// ── Scroll Reveal ──
function startReveal(){
  const els=document.querySelectorAll('.page.active [data-reveal]');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){en.target.classList.add('revealed');obs.unobserve(en.target)}
    });
  },{threshold:.1});
  els.forEach(el=>{el.classList.remove('revealed');obs.observe(el)});
}
window.addEventListener('load',startReveal);

// ── Stat bars ──
function animateBars(){
  document.querySelectorAll('.sc-fill[data-w]').forEach(el=>{
    el.style.width=el.dataset.w+'%';
  });
}
const barObs=new IntersectionObserver(entries=>{
  entries.forEach(en=>{if(en.isIntersecting){animateBars();barObs.disconnect()}});
},{threshold:.3});
const statsEl=document.getElementById('stats');
if(statsEl) barObs.observe(statsEl);

// ── Testimonials ──
let testiIdx=0;
function goTesti(n){
  document.querySelectorAll('.testi-card').forEach((c,i)=>{c.classList.toggle('visible',i===n)});
  document.querySelectorAll('.tn-dot').forEach((d,i)=>{d.classList.toggle('active',i===n)});
  testiIdx=n;
}
function nextTesti(){goTesti((testiIdx+1)%3)}
function prevTesti(){goTesti((testiIdx+2)%3)}
setInterval(()=>{if(currentPage==='landing') nextTesti()},5000);

// ── User type selection (landing) ──
function selectUserType(el,type){
  document.querySelectorAll('.ut-card').forEach(c=>c.classList.remove('active-type'));
  el.classList.add('active-type');
}

// ── User type picker (register page) ──
function pickType(el,type){
  document.querySelectorAll('.utype-btn').forEach(b=>b.classList.remove('selected'));
  el.classList.add('selected');
}

// ════════════════════════════════════════
// ★ VALIDATION HELPERS
// ════════════════════════════════════════
function showErr(inputId, errId, message){
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if(inp) inp.classList.add('error');
  if(err){ if(message) err.textContent = message; err.classList.add('show'); }
}
function clearErr(inputEl, errId){
  if(inputEl) inputEl.classList.remove('error');
  const err = document.getElementById(errId);
  if(err) err.classList.remove('show');
  // also hide the top-level alert
  const alert = inputEl && inputEl.closest('.auth-card') && inputEl.closest('.auth-card').querySelector('.form-alert');
  if(alert) alert.classList.remove('show');
}
function clearTermsErr(){
  document.getElementById('regTerms').closest('label').style.color='';
  document.getElementById('regTermsErr').classList.remove('show');
  const alert = document.getElementById('regAlert');
  if(alert) alert.classList.remove('show');
}
function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

// ── LOGIN VALIDATION ──
function validateLogin(){
  let valid = true;
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;

  // Reset
  ['loginEmail','loginPass'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.classList.remove('error');
  });
  ['loginEmailErr','loginPassErr'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.classList.remove('show');
  });
  document.getElementById('loginAlert').classList.remove('show');

  if(!email || !isValidEmail(email)){
    showErr('loginEmail','loginEmailErr','Please enter a valid email address.');
    valid = false;
  }
  if(!pass){
    showErr('loginPass','loginPassErr','Password is required.');
    valid = false;
  }

  if(!valid){
    document.getElementById('loginAlert').classList.add('show');
    return;
  }
  showPage('dashboard');
}

// ── REGISTER VALIDATION ──
function validateRegister(){
  let valid = true;

  // Reset all
  ['regFirst','regLast','regEmail','regPass','regPass2'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.classList.remove('error');
  });
  ['regFirstErr','regLastErr','regEmailErr','regPassErr','regPass2Err','regTermsErr'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.classList.remove('show');
  });
  document.getElementById('regAlert').classList.remove('show');

  const first = document.getElementById('regFirst').value.trim();
  const last  = document.getElementById('regLast').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass  = document.getElementById('regPass').value;
  const pass2 = document.getElementById('regPass2').value;
  const terms = document.getElementById('regTerms').checked;

  if(!first){
    showErr('regFirst','regFirstErr','First name is required.');
    valid = false;
  }
  if(!last){
    showErr('regLast','regLastErr','Last name is required.');
    valid = false;
  }
  if(!email || !isValidEmail(email)){
    showErr('regEmail','regEmailErr','A valid email address is required.');
    valid = false;
  }
  if(!pass || pass.length < 8){
    showErr('regPass','regPassErr','Password must be at least 8 characters.');
    valid = false;
  }
  if(!pass2 || pass !== pass2){
    showErr('regPass2','regPass2Err','Passwords do not match.');
    valid = false;
  }
  if(!terms){
    document.getElementById('regTermsErr').classList.add('show');
    valid = false;
  }

  if(!valid){
    document.getElementById('regAlert').classList.add('show');
    // Scroll to first error
    const firstErr = document.querySelector('#page-register .form-input.error');
    if(firstErr) firstErr.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  showPage('dashboard');
}

// ── Dashboard ──
let dashOpen=true;
function toggleSidebar(){
  dashOpen=!dashOpen;
  document.getElementById('dashSidebar').classList.toggle('collapsed',!dashOpen);
  document.getElementById('dashMain').classList.toggle('full',!dashOpen);
  if(window.innerWidth<=1100){
    document.getElementById('dashSidebar').classList.toggle('open',dashOpen);
    document.getElementById('dashSidebar').classList.remove('collapsed');
    document.getElementById('dashMain').classList.remove('full');
  }
}
const tabs={overview:'Overview',chat:'AI Legal Chat',cases:'My Cases',documents:'Document Vault',lawyers:'Lawyer Matching',health:'Legal Health Check',assess:'Case Assessment',gendoc:'Generate Document',settings:'Settings'};
function switchDashTab(tab){
  document.querySelectorAll('.dash-panel').forEach(p=>p.classList.remove('active'));
  const panel=document.getElementById('panel-'+tab);
  if(panel) panel.classList.add('active');
  document.querySelectorAll('.ds-nav-item').forEach(item=>{
    item.classList.toggle('active',item.getAttribute('onclick')&&item.getAttribute('onclick').includes("'"+tab+"'"));
  });
  const titleEl=document.getElementById('dashTitle');
  const bcEl=document.getElementById('dashBreadcrumb');
  if(titleEl) titleEl.textContent=tabs[tab]||tab;
  if(bcEl) bcEl.textContent=tabs[tab]||tab;
  window.scrollTo(0,0);
  if(window.innerWidth<=1100 && dashOpen){toggleSidebar()}
}

// ── Dashboard Chat ──
const aiResponses=[
  "Under the <strong style='color:var(--g300)'>Distress for Rent Act (Cap. 293)</strong> and <strong>Landlord and Tenant Act</strong>, your landlord cannot evict you without serving proper notice — at least 30 days for monthly tenancy. Do you need me to draft a formal notice?",
  "Based on Kenya's <strong style='color:var(--g300)'>Employment Act 2007, Section 45</strong>, wrongful dismissal without proper cause or procedure entitles you to compensation of up to 12 months' salary. Have you been given a termination letter?",
  "For land disputes in Kenya, the <strong style='color:var(--g300)'>Land Act 2012</strong> and <strong>Environment and Land Court</strong> have jurisdiction. I recommend starting with mediation before formal litigation. Shall I research relevant precedents?",
  "I've found <strong style='color:var(--g300)'>3 relevant case precedents</strong> in the Kenya Law Reports that support your position. The strongest is <em>Muthoni v. Housing Board [2022]</em> which established tenant protections against illegal rent increases.",
  "Your case has a <strong style='color:var(--g300)'>72% success probability</strong> based on similar cases in our database. I recommend sending a formal demand letter first — I can generate one for you right now. Would you like to proceed?"
];
let aiIdx=0;
function sendDashChat(){
  const input=document.getElementById('dcwInput');
  const msgs=document.getElementById('dcwMessages');
  const text=input.value.trim();
  if(!text) return;
  const uDiv=document.createElement('div');
  uDiv.className='dcw-msg u';
  uDiv.innerHTML=`<div class="dcw-bub user">${text}</div><div class="hv-av usr" style="width:30px;height:30px;font-size:.68rem;flex-shrink:0">JM</div>`;
  msgs.appendChild(uDiv);
  input.value='';
  msgs.scrollTop=msgs.scrollHeight;
  const typDiv=document.createElement('div');
  typDiv.className='dcw-msg';
  typDiv.id='dash-typing';
  typDiv.innerHTML=`<div class="hv-av ai" style="width:30px;height:30px;font-size:.68rem;flex-shrink:0">N</div><div class="dcw-bub ai"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(typDiv);
  msgs.scrollTop=msgs.scrollHeight;
  setTimeout(()=>{
    const t=document.getElementById('dash-typing');
    if(t) t.remove();
    const aDiv=document.createElement('div');
    aDiv.className='dcw-msg';
    aDiv.innerHTML=`<div class="hv-av ai" style="width:30px;height:30px;font-size:.68rem;flex-shrink:0">N</div><div class="dcw-bub ai">${aiResponses[aiIdx%aiResponses.length]}</div>`;
    msgs.appendChild(aDiv);
    aiIdx++;
    msgs.scrollTop=msgs.scrollHeight;
  },1800);
}
document.addEventListener('keydown',e=>{
  if(e.key==='Enter' && document.activeElement && document.activeElement.id==='dcwInput') sendDashChat();
});

// ── Case Assessment ──
function runAssessment(){
  const btn=document.getElementById('assessBtn');
  btn.textContent='🧠 Analysing…';btn.disabled=true;
  setTimeout(()=>{
    btn.textContent='🔍 Run AI Assessment';btn.disabled=false;
    document.getElementById('assessResult').style.display='block';
  },2200);
}

// ── Generate Document ──
function generateDoc(){
  const btn=document.getElementById('genBtn');
  btn.textContent='⏳ Generating…';btn.disabled=true;
  setTimeout(()=>{
    btn.textContent='📄 Generate Document';btn.disabled=false;
    document.getElementById('genResult').style.display='block';
  },1800);
}
function setDocType(el,title){
  document.querySelectorAll('.doc-row').forEach(r=>r.style.borderColor='');
  el.style.borderColor='rgba(201,168,76,.35)';el.style.background='rgba(201,168,76,.06)';
  document.getElementById('genDocTitle').textContent=title;
  document.getElementById('genResult').style.display='none';
}

// Init
showPage('landing');
