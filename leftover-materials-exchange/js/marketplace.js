/* Marketplace rendering, search, filters and sorting */
(function(){
  const $=id=>document.getElementById(id);
  const money=window.RBX;
  const categoryIcons={"Blocks & Bricks":"▦","Tiles & Flooring":"▧","Roofing":"⌂","Timber & Wood":"▤","Plumbing":"⌁","Doors & Windows":"⊞","Electrical":"⌁","Paint & Finishing":"◒","Other":"▤"};
  function card(material,options={}){
    const isFav=money.getFavorites().includes(material.id);
    const status=material.status||"available";
    const badge=status!=="available"?(status==="sold"?"Sold":"Unavailable"):money.formatType(material.transactionType);
    const badgeClass=status!=="available"?"sold":material.transactionType==="exchange"?"exchange":material.transactionType==="giveaway"?"giveaway":"";
    const location=money.formatLocation(material.location);
    return `<article class="listing-card" data-card-id="${money.safeText(material.id)}">
      <div class="listing-image" data-open-detail="${money.safeText(material.id)}" role="button" tabindex="0" aria-label="View ${money.safeText(material.title)}">
        ${money.imageMarkup(material)}
        <span class="listing-badge ${badgeClass}">${money.safeText(badge)}</span>
        <button class="favorite-btn ${isFav?"is-favorite":""}" data-favorite="${money.safeText(material.id)}" aria-label="${isFav?"Remove from":"Add to"} saved items" aria-pressed="${isFav}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="listing-info">
        <div class="listing-category">${money.safeText(material.category||"Other")}</div>
        <h3 class="listing-title" data-open-detail="${money.safeText(material.id)}" tabindex="0" role="button">${money.safeText(material.title)}</h3>
        <div class="listing-price-row"><div class="listing-price">${money.safeText(money.formatPrice(material))}${material.transactionType==="sell"?'<small> total</small>':""}</div><div class="listing-quantity">${money.safeText(material.quantity)} ${money.safeText(material.unit||"units")}</div></div>
        <div class="listing-meta"><span class="condition-dot"></span><span>${money.safeText(material.condition||"Condition not specified")}</span><span>·</span><span title="${money.safeText(location)}">${money.safeText(location)}</span></div>
        ${options.owner?ownerActions(material):""}
      </div>
    </article>`;
  }
  function ownerActions(m){return `<div class="owner-actions"><button class="small-action" data-edit="${money.safeText(m.id)}">Edit</button><select class="status-select" data-status="${money.safeText(m.id)}" aria-label="Listing status"><option value="available" ${m.status==="available"?"selected":""}>Available</option><option value="sold" ${m.status==="sold"?"selected":""}>Sold</option><option value="unavailable" ${m.status==="unavailable"?"selected":""}>Unavailable</option></select><button class="small-action danger" data-delete="${money.safeText(m.id)}">Delete</button></div>`}
  function availableMaterials(){return money.getMaterials().filter(m=>(m.status||"available")==="available")}
  function renderFeatured(){const target=$("featured-grid");if(!target)return;const items=availableMaterials().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,4);target.innerHTML=items.length?items.map(m=>card(m)).join():"<p>No materials are listed yet. Be the first to share materials.</p>";}
  function readFilters(){return {query:($("market-search")?.value||"").trim().toLowerCase(),category:$("filter-category")?.value||"",type:$("filter-type")?.value||"",condition:$("filter-condition")?.value||"",location:($("filter-location")?.value||"").trim().toLowerCase(),min:$("filter-min-price")?.value,max:$("filter-max-price")?.value,sort:$("sort-order")?.value||"newest"}}
  function getFilteredMaterials(){
    const f=readFilters();let items=availableMaterials().filter(m=>{
      const hay=[m.title,m.description,m.category,m.location?.area,m.location?.state,m.condition,m.transactionType].join(" ").toLowerCase();
      if(f.query&&!hay.includes(f.query))return false;
      if(f.category&&m.category!==f.category)return false;
      if(f.type&&m.transactionType!==f.type)return false;
      if(f.condition&&m.condition!==f.condition)return false;
      if(f.location&&!money.formatLocation(m.location).toLowerCase().includes(f.location))return false;
      if(f.min!==""&&f.min!==undefined&&(m.transactionType!=="sell"||Number(m.price)<Number(f.min)))return false;
      if(f.max!==""&&f.max!==undefined&&(m.transactionType!=="sell"||Number(m.price)>Number(f.max)))return false;
      return true;
    });
    if(f.sort==="price-low")items.sort((a,b)=>(a.transactionType==="sell"?Number(a.price):Infinity)-(b.transactionType==="sell"?Number(b.price):Infinity));
    else if(f.sort==="price-high")items.sort((a,b)=>(b.transactionType==="sell"?Number(b.price):-1)-(a.transactionType==="sell"?Number(a.price):-1));
    else if(f.sort==="title")items.sort((a,b)=>a.title.localeCompare(b.title));
    else items.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    return items;
  }
  function renderMarketplace(){
    const target=$("marketplace-grid");if(!target)return;const items=getFilteredMaterials();
    target.innerHTML=items.map(m=>card(m)).join("");
    $("results-count").textContent=`${items.length} material${items.length===1?"":"s"} found`;
    $("market-empty").classList.toggle("hidden",items.length>0);
    target.classList.toggle("hidden",items.length===0);
  }
  function renderMyListings(){
    const all=money.getMaterials().slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    $("stat-total").textContent=all.length;$("stat-available").textContent=all.filter(m=>(m.status||"available")==="available").length;$("stat-sold").textContent=all.filter(m=>m.status==="sold").length;
    const target=$("my-listings-grid");target.innerHTML=all.map(m=>card(m,{owner:true})).join("");
    $("my-listings-empty").classList.toggle("hidden",all.length>0);target.classList.toggle("hidden",all.length===0);
  }
  function clearFilters(){["market-search","filter-category","filter-type","filter-condition","filter-location","filter-min-price","filter-max-price"].forEach(id=>{const el=$(id);if(el)el.value=""});if($("sort-order"))$("sort-order").value="newest";renderMarketplace()}
  function applyCategory(category){$("filter-category").value=category;$("market-search").value="";window.RBXApp.showView("marketplace");renderMarketplace()}
  document.addEventListener("input",e=>{if(["market-search","filter-location","filter-min-price","filter-max-price"].includes(e.target.id))renderMarketplace()});
  document.addEventListener("change",e=>{if(["filter-category","filter-type","filter-condition","sort-order"].includes(e.target.id))renderMarketplace()});
  $("clear-filters").addEventListener("click",clearFilters);$("empty-clear").addEventListener("click",clearFilters);$("apply-filters").addEventListener("click",()=>{$("filter-panel").classList.remove("open")});
  $("filter-open").addEventListener("click",()=>$("filter-panel").classList.add("open"));$("filter-close").addEventListener("click",()=>$("filter-panel").classList.remove("open"));
  $("hero-search-form").addEventListener("submit",e=>{e.preventDefault();$("market-search").value=$("hero-search").value;$("filter-location").value=$("hero-location").value;window.RBXApp.showView("marketplace");renderMarketplace()});
  document.querySelectorAll("[data-category]").forEach(btn=>btn.addEventListener("click",()=>applyCategory(btn.dataset.category)));
  window.RBXMarketplace={card,renderFeatured,renderMarketplace,renderMyListings,getFilteredMaterials,availableMaterials,clearFilters,applyCategory};
})();
