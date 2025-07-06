/* ========= CORE ========= */
document.addEventListener("DOMContentLoaded", () => {
  /* theme */
  const themeBtn = document.getElementById("themeToggle"),
        modeSw  = document.getElementById("modeSwitch");
  const setDark = (dark) => {
    document.body.classList.toggle("light", !dark);
    const sunMoon = dark ? "☀️" : "🌙";
    themeBtn.textContent = sunMoon;
    modeSw.checked = dark ? false : true;
    localStorage.setItem("zenTheme", dark ? "dark" : "light");
  };
  setDark(localStorage.getItem("zenTheme") !== "light");
  themeBtn.onclick = () => setDark(document.body.classList.contains("light"));
  modeSw.onchange  = () => setDark(!modeSw.checked);

  /* sidebar toggle */
  const side   = document.getElementById("sidebar"),
        hamBtn = document.getElementById("hamBtn");
  const toggleSidebar = () => {
    side.classList.toggle("closed");
    document.body.classList.toggle("sidebar-closed");
  };
  hamBtn.onclick = toggleSidebar;

  /* navigation */
  const pages = {
    welcome : document.getElementById("welcomeSection"),
    func    : document.getElementById("funcSection"),
    preset  : document.getElementById("presetSection"),
    about   : document.getElementById("aboutSection")
  };
  function show(k){
    Object.values(pages).forEach(p=>p.classList.add("hidden"));
    pages[k].classList.remove("hidden");
    window.scrollTo({top:0});
    if(k==="func")  renderBugs();
    if(k==="preset")renderPresets();
  }
  document.querySelectorAll("[data-page]").forEach(link=>{
    link.onclick=e=>{
      e.preventDefault();
      document.querySelectorAll("[data-page]")
        .forEach(a=>a.classList.toggle("active",a===link));
      show(link.dataset.page);
      toggleSidebar();
    };
  });

  /* ===== Func Bug (menggunakan bugData dari func.js) ===== */
  let bugRendered=false;
  function renderBugs(){
    if(bugRendered) return;
    if(typeof bugData==="undefined"){toast("⚠️ bugData kosong",true);return;}
    const wrap=document.getElementById("bugContainer");
    bugData.forEach((b,i)=>{
      wrap.insertAdjacentHTML("beforeend",
        `<div class="bug">
          <span>${b.title}</span>
          <button onclick="copyBug(${i})">Copy</button>
        </div>`);
    });
    bugRendered=true;
  }
  window.copyBug=i=>{
    navigator.clipboard.writeText(atob(bugData[i].funcB64))
      .then(()=>toast("✅ Copied!"))
      .catch(()=>toast("❌ Gagal",true));
  };

  /* ===== Preset AM ===== */
  let presetRendered=false;
  function renderPresets(){
    if(presetRendered) return;
    const list=document.getElementById("presetList");
    presetData.forEach(p=>{
      list.insertAdjacentHTML("beforeend",
        `<div class="preset-card">
           <video class="preset-preview" src="${p.preview}" muted loop></video>
           <div class="preset-body">
             <div class="preset-title">${p.title}</div>
             <div class="preset-desc">${p.desc}</div>
             <div class="preset-btns">
               <a class="btn-easy" href="${p.easy}" target="_blank">Preset 5MB</a>
               <a class="btn-xml"  href="${p.xml}"  target="_blank">XML + Sound</a>
             </div>
           </div>
         </div>`);
    });
    // preview autoplay on hover
    document.querySelectorAll(".preset-preview").forEach(v=>{
      v.onmouseenter=()=>v.play();
      v.onmouseleave=()=>{v.pause();v.currentTime=0;};
    });
    presetRendered=true;
  }
  // search preset
  document.getElementById("presetSearch").oninput=e=>{
    const q=e.target.value.toLowerCase();
    document.querySelectorAll(".preset-card").forEach(card=>{
      const t=card.querySelector(".preset-title").textContent.toLowerCase();
      const d=card.querySelector(".preset-desc").textContent.toLowerCase();
      card.style.display= t.includes(q)||d.includes(q) ? "" : "none";
    });
  };

  /* ===== TOAST ===== */
  function toast(msg,err=false){
    const box=document.getElementById("toastContainer"),
          div=document.createElement("div");
    div.className="toast"; if(err)div.style.borderLeftColor="red";
    div.textContent=msg; box.appendChild(div);
    setTimeout(()=>{div.style.opacity=0;setTimeout(()=>div.remove(),500)},2500);
  }

  /* start on welcome */
  show("welcome");
});