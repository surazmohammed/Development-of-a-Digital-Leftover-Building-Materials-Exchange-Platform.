/* Favorites rendering and toggling */
(function(){
  const $=id=>document.getElementById(id);
  function toggle(id){
    let ids=window.RBX.getFavorites();
    const adding=!ids.includes(id);
    ids=adding?[...ids,id]:ids.filter(x=>x!==id);
    if(!window.RBX.saveFavorites(ids))return;
    window.RBXApp.refreshAll();
    if(window.RBXApp.currentView==="favorites")render();
    if(window.RBXApp.currentView==="details")window.RBXDetails.render(id);
    window.showToast(adding?"Added to your saved materials.":"Removed from your saved materials.");
  }
  function render(){
    const ids=window.RBX.getFavorites(),all=window.RBX.getMaterials();
    const items=ids.map(id=>all.find(m=>m.id===id)).filter(Boolean);
    $("favorites-count").textContent=`${items.length} saved material${items.length===1?"":"s"}`;
    $("favorites-grid").innerHTML=items.map(m=>window.RBXMarketplace.card(m)).join("");
    $("favorites-empty").classList.toggle("hidden",items.length>0);
    $("favorites-grid").classList.toggle("hidden",items.length===0);
  }
  window.RBXFavorites={toggle,render};
})();
