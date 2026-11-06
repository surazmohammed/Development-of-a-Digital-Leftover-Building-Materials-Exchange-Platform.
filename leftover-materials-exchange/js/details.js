/* Material details view */
(function(){
  const $=id=>document.getElementById(id);
  function render(id){
    const m=window.RBX.getMaterials().find(x=>x.id===id);if(!m){window.showToast("This material listing could not be found.","error");window.RBXApp.showView("marketplace");return}
    const type=m.transactionType,status=m.status||"available",fav=window.RBX.getFavorites().includes(m.id);
    const image=m.image?`<img class="detail-main-image" src="${window.RBX.safeText(m.image)}" alt="${window.RBX.safeText(m.title)}">`:`<div class="detail-image-placeholder">▤</div>`;
    const price=window.RBX.formatPrice(m);
    const phone=window.RBX.normalizePhone(m.contact?.phone||"");
    const wa=window.RBX.whatsappUrl(m.contact?.whatsapp||m.contact?.phone||"");
    const callHref=phone?"tel:"+phone:"#";
    const waMessage=encodeURIComponent(`Hello, I'm interested in your listing "${m.title}" on ReBuild Exchange. Is it still available?`);
    const available=status==="available";
    $("details-content").innerHTML=`<div class="detail-layout"><div class="detail-gallery">${image}</div><div class="detail-info">
      <div class="detail-topline"><span class="detail-category">${window.RBX.safeText(m.category)}</span><button class="favorite-btn ${fav?"is-favorite":""}" data-favorite="${window.RBX.safeText(m.id)}" aria-label="${fav?"Remove from":"Add to"} saved items" aria-pressed="${fav}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></button></div>
      <h1 class="detail-title">${window.RBX.safeText(m.title)}</h1><div class="detail-price">${window.RBX.safeText(price)}${type==="sell"?'<small> total asking price</small>':""}</div>
      <div class="detail-summary"><span>${window.RBX.safeText(m.quantity)} ${window.RBX.safeText(m.unit)}</span><span>${window.RBX.safeText(m.condition)} condition</span><span>${window.RBX.safeText(window.RBX.formatType(type))}</span></div>
      ${status!=="available"?`<div class="notice-box"><span>ⓘ</span><p>This listing is marked ${window.RBX.safeText(status)} and may no longer be available.</p></div>`:""}
      <div class="detail-divider"></div><h3>About this material</h3><p class="detail-description">${window.RBX.safeText(m.description)}</p>
      ${type==="exchange"?`<div class="detail-divider"></div><h3>What the owner is looking for</h3><p class="detail-description">${window.RBX.safeText(m.exchangePreference||"Contact the owner to discuss an exchange.")}</p>`:""}
      <div class="detail-divider"></div><h3>Pickup location</h3><div class="detail-location"><span>⌖</span><div>${window.RBX.safeText(window.RBX.formatLocation(m.location))}<br><small>Confirm exact collection details directly with the owner.</small></div></div>
      <div class="seller-card"><strong>Contact the material owner</strong><p>Ask about availability, measurements, condition and collection.</p></div>
      <div class="detail-actions">${available&&wa?`<a class="btn btn-primary btn-large" href="${window.RBX.safeText(wa)}?text=${waMessage}" target="_blank" rel="noopener noreferrer">Contact on WhatsApp <span>↗</span></a>`:""}${available&&phone?`<a class="btn btn-secondary" href="${window.RBX.safeText(callHref)}">Call seller <span>↗</span></a>`:""}${!available?'<button class="btn btn-secondary" disabled>Currently unavailable</button>':""}</div>
      <p class="detail-disclaimer">Inspect materials before agreeing to a transaction. Discuss payment and transport directly with the owner. This prototype does not verify sellers or process payments.</p>
      ${m.isDemo?'<p class="detail-disclaimer">Demo listing: contact details and availability are illustrative and have not been verified.</p>':""}
      </div></div>`;
    window.RBXApp.showView("details",false);
  }
  $("details-back").addEventListener("click",()=>window.RBXApp.showView("marketplace"));
  window.RBXDetails={render};
})();
