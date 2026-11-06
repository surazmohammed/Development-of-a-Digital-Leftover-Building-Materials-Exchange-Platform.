/* Application navigation, delegated interactions and shared UI helpers */
(function(){
  const $=id=>document.getElementById(id);
  const views=["home","marketplace","list","details","favorites","my-listings"];
  let modalAction=null;
  function showToast(message,type="success"){
    const region=$("toast-region"),node=document.createElement("div");node.className="toast"+(type==="error"?" error":"");
    const mark=document.createElement("span");mark.className="toast-mark";mark.textContent=type==="error"?"!":"✓";
    const text=document.createElement("span");text.textContent=message;node.append(mark,text);region.appendChild(node);
    setTimeout(()=>node.remove(),3700);
  }
  function showView(name,scroll=true){
    if(name==="favorites")window.RBXFavorites.render();
    if(name==="marketplace")window.RBXMarketplace.renderMarketplace();
    if(name==="my-listings")window.RBXMarketplace.renderMyListings();
    if(!views.includes(name))name="home";
    views.forEach(v=>{const section=$(`view-${v}`);if(section)section.classList.toggle("active",v===name)});
    document.querySelectorAll("[data-view-link]").forEach(el=>{const active=el.dataset.viewLink===name;el.classList.toggle("active",active);if(el.classList.contains("nav-link"))el.setAttribute("aria-current",active?"page":"false")});
    $("primary-nav").classList.remove("open");$("menu-toggle").setAttribute("aria-expanded","false");$("menu-toggle").setAttribute("aria-label","Open navigation");
    $("filter-panel").classList.remove("open");
    if(scroll)window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
    if(history.replaceState)history.replaceState(null,"","#"+(name==="details"?"details":name));
    window.RBXApp.currentView=name;
  }
  function refreshAll(){window.RBXMarketplace.renderFeatured();window.RBXMarketplace.renderMarketplace();window.RBXMarketplace.renderMyListings();window.RBXFavorites.render();updateCounts()}
  function updateCounts(){const n=window.RBX.getFavorites().length;$("saved-count").textContent=n;$("nav-favorite-count").textContent=n}
  function openConfirm(title,message,confirmText,action){
    $("modal-title").textContent=title;$("modal-message").textContent=message;$("modal-confirm").textContent=confirmText;modalAction=action;$("confirm-modal").classList.remove("hidden");$("modal-confirm").focus();
  }
  function closeConfirm(){$("confirm-modal").classList.add("hidden");modalAction=null}
  $("modal-cancel").addEventListener("click",closeConfirm);$("modal-confirm").addEventListener("click",()=>{const action=modalAction;closeConfirm();if(action)action()});
  $("confirm-modal").addEventListener("click",e=>{if(e.target===$("confirm-modal"))closeConfirm()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeConfirm();$("filter-panel").classList.remove("open");$("primary-nav").classList.remove("open");$("menu-toggle").setAttribute("aria-expanded","false")}});
  document.addEventListener("click",e=>{
    const viewLink=e.target.closest("[data-view-link]");if(viewLink){e.preventDefault();const name=viewLink.dataset.viewLink;if(name==="list"&&window.RBXListingForm.resetForm)window.RBXListingForm.resetForm();showView(name);return}
    const favorite=e.target.closest("[data-favorite]");if(favorite){e.preventDefault();e.stopPropagation();window.RBXFavorites.toggle(favorite.dataset.favorite);return}
    const detail=e.target.closest("[data-open-detail]");if(detail){e.preventDefault();window.RBXDetails.render(detail.dataset.openDetail);return}
    const edit=e.target.closest("[data-edit]");if(edit){window.RBXListingForm.editListing(edit.dataset.edit);return}
    const del=e.target.closest("[data-delete]");if(del){const id=del.dataset.delete;openConfirm("Delete this listing?","This listing will be removed from this browser. This action cannot be undone.","Delete listing",()=>{const next=window.RBX.getMaterials().filter(m=>m.id!==id);window.RBX.saveMaterials(next);window.RBX.saveFavorites(window.RBX.getFavorites().filter(x=>x!==id));refreshAll();showToast("Listing deleted.");});return}
  });
  document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-open-detail][role=button]")){e.preventDefault();window.RBXDetails.render(e.target.dataset.openDetail)}});
  document.addEventListener("change",e=>{const select=e.target.closest("[data-status]");if(!select)return;const id=select.dataset.status;const all=window.RBX.getMaterials();const next=all.map(m=>m.id===id?{...m,status:select.value}:m);if(window.RBX.saveMaterials(next)){refreshAll();showToast("Listing status updated.")}});
  $("menu-toggle").addEventListener("click",()=>{const nav=$("primary-nav"),open=!nav.classList.contains("open");nav.classList.toggle("open",open);$("menu-toggle").setAttribute("aria-expanded",String(open));$("menu-toggle").setAttribute("aria-label",open?"Close navigation":"Open navigation")});
  $("reset-demo").addEventListener("click",()=>openConfirm("Reset demo data?","This restores the original example materials and clears saved favorites and your local listings.","Reset demo",()=>{window.RBX.reset();window.RBXListingForm.resetForm();refreshAll();showView("home");showToast("Demo data has been restored.")}));
  $("current-year").textContent=new Date().getFullYear();
  window.RBXApp={showView,refreshAll,updateCounts,openConfirm,currentView:"home"};
  window.showToast=showToast;
  refreshAll();
  const hash=location.hash.replace("#","");if(["marketplace","list","favorites","my-listings"].includes(hash))showView(hash,false);else showView("home",false);
})();
