/* localStorage wrapper and shared utilities */
(function(){
  const KEYS={materials:"rbx_materials",favorites:"rbx_favorites",preferences:"rbx_preferences"};
  const clone=value=>JSON.parse(JSON.stringify(value));
  function read(key,fallback){try{const raw=localStorage.getItem(key);return raw===null?clone(fallback):JSON.parse(raw)}catch(e){return clone(fallback)}}
  function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(e){window.showToast?.("Browser storage is full. Remove a large photo or delete old listings, then try again.","error");return false}}
  function initialize(){if(localStorage.getItem(KEYS.materials)===null)write(KEYS.materials,window.DEMO_MATERIALS);if(localStorage.getItem(KEYS.favorites)===null)write(KEYS.favorites,[])}
  function getMaterials(){const items=read(KEYS.materials,window.DEMO_MATERIALS);return Array.isArray(items)?items:clone(window.DEMO_MATERIALS)}
  function saveMaterials(items){return write(KEYS.materials,items)}
  function getFavorites(){const ids=read(KEYS.favorites,[]);return Array.isArray(ids)?ids:[]}
  function saveFavorites(ids){return write(KEYS.favorites,ids)}
  function reset(){localStorage.removeItem(KEYS.materials);localStorage.removeItem(KEYS.favorites);localStorage.removeItem(KEYS.preferences);initialize()}
  function formatPrice(material){if(material.transactionType==="giveaway")return "Free";if(material.transactionType==="exchange")return "Exchange";return "₦"+Number(material.price||0).toLocaleString("en-NG")}
  function formatType(type){return ({sell:"For sale",exchange:"Exchange",giveaway:"Give away"})[type]||"For sale"}
  function formatLocation(location){if(!location)return "Location not specified";return [location.area,location.state].filter(Boolean).join(", ")||"Location not specified"}
  function safeText(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}
  function imageMarkup(material,extraClass=""){if(material.image)return `<img class="${extraClass}" src="${safeText(material.image)}" alt="${safeText(material.title||"Building material")}" loading="lazy" data-material-image>`;return `<div class="image-placeholder ${extraClass}" aria-label="No photo provided">▤</div>`}
  function makeId(){return "mat-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8)}
  function normalizePhone(value){return String(value||"").replace(/[^\d+]/g,"")}
  function whatsappUrl(value){let digits=String(value||"").replace(/\D/g,"");if(digits.startsWith("0"))digits="234"+digits.slice(1);if(digits.startsWith("234"))return "https://wa.me/"+digits;if(digits.length>=10)return "https://wa.me/"+digits;return ""}
  window.RBX={KEYS,clone,read,write,initialize,getMaterials,saveMaterials,getFavorites,saveFavorites,reset,formatPrice,formatType,formatLocation,safeText,imageMarkup,makeId,normalizePhone,whatsappUrl};
  window.RBX.initialize();
})();
