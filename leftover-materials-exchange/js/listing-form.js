/* Listing creation/edit form and image preview */
(function(){
  const $=id=>document.getElementById(id);
  let selectedImage="";
  const form=$("listing-form"),fileInput=$("material-image");
  function setError(message){const box=$("form-error");box.textContent=message;box.classList.toggle("hidden",!message);if(message)box.scrollIntoView({behavior:"smooth",block:"center"})}
  function selectedType(){return document.querySelector('input[name="transaction"]:checked')?.value||"sell"}
  function updateTransactionFields(){
    const type=selectedType();$("price-field").classList.toggle("hidden",type!=="sell");$("exchange-field").classList.toggle("hidden",type!=="exchange");
    $("material-price").required=type==="sell";$("material-exchange").required=type==="exchange";
  }
  function clearPreview(){selectedImage="";fileInput.value="";$("upload-preview").classList.add("hidden");$("preview-image").removeAttribute("src");$("upload-zone").classList.remove("has-image")}
  function resetForm(){form.reset();$("listing-id").value="";selectedImage="";clearPreview();$("description-count").textContent="0 / 1200";$("submit-label").textContent="Publish listing";$("form-error").classList.add("hidden");document.querySelector('input[name="transaction"][value="sell"]').checked=true;updateTransactionFields()}
  function editListing(id){
    const m=window.RBX.getMaterials().find(x=>x.id===id);if(!m)return;
    resetForm();$("listing-id").value=m.id;$("material-title").value=m.title;$("material-category").value=m.category;$("material-condition").value=m.condition;$("material-quantity").value=m.quantity;$("material-unit").value=m.unit;$("material-description").value=m.description;$("description-count").textContent=`${m.description.length} / 1200`;
    document.querySelector(`input[name="transaction"][value="${m.transactionType}"]`).checked=true;$("material-price").value=m.price||"";$("material-exchange").value=m.exchangePreference||"";$("material-area").value=m.location?.area||"";$("material-state").value=m.location?.state||"";$("material-phone").value=m.contact?.phone||"";$("material-whatsapp").value=m.contact?.whatsapp||"";
    selectedImage=m.image||"";if(selectedImage){$("preview-image").src=selectedImage;$("upload-preview").classList.remove("hidden");$("upload-zone").classList.add("has-image")}
    updateTransactionFields();$("submit-label").textContent="Save changes";window.RBXApp.showView("list");$("material-title").focus();window.showToast("Editing your listing.");
  }
  function validate(){
    const required=[["material-title","Enter a listing title."],["material-category","Choose a material category."],["material-condition","Choose the material condition."],["material-quantity","Enter a valid quantity greater than zero."],["material-unit","Choose the quantity unit."],["material-description","Add a description."],["material-area","Enter the town or area."],["material-state","Enter the state."],["material-phone","Enter a contact phone number."]];
    for(const [id,msg] of required){const el=$(id);if(!el.value.trim()||(el.type==="number"&&Number(el.value)<=0)){el.focus();return msg}}
    if(selectedType()==="sell"&&(!Number.isFinite(Number($("material-price").value))||Number($("material-price").value)<=0)){ $("material-price").focus();return "Enter an asking price greater than zero."}
    if(selectedType()==="exchange"&&!$("material-exchange").value.trim()){$("material-exchange").focus();return "Describe what you would like in exchange."}
    const phone=window.RBX.normalizePhone($("material-phone").value);if(phone.replace(/\D/g,"").length<10){$("material-phone").focus();return "Enter a valid phone number with at least 10 digits."}
    if($("material-whatsapp").value.trim()&&window.RBX.normalizePhone($("material-whatsapp").value).replace(/\D/g,"").length<10){$("material-whatsapp").focus();return "Enter a valid WhatsApp number or leave it blank."}
    return "";
  }
  fileInput.addEventListener("change",()=>{
    const file=fileInput.files?.[0];if(!file)return;
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)){setError("Please choose a JPG, PNG or WebP image.");fileInput.value="";return}
    if(file.size>1.5*1024*1024){setError("That image is too large. Please choose an image smaller than 1.5 MB.");fileInput.value="";return}
    const reader=new FileReader();reader.onload=()=>{selectedImage=String(reader.result||"");$("preview-image").src=selectedImage;$("upload-preview").classList.remove("hidden");$("upload-zone").classList.add("has-image");setError("")};reader.onerror=()=>setError("The image could not be read. Please try another file.");reader.readAsDataURL(file);
  });
  $("remove-image").addEventListener("click",e=>{e.preventDefault();e.stopPropagation();clearPreview()});
  document.querySelectorAll('input[name="transaction"]').forEach(r=>r.addEventListener("change",updateTransactionFields));
  $("material-description").addEventListener("input",()=>{$("description-count").textContent=`${$("material-description").value.length} / 1200`});
  $("cancel-listing").addEventListener("click",()=>{resetForm();window.RBXApp.showView("home")});
  form.addEventListener("submit",e=>{
    e.preventDefault();const error=validate();if(error){setError(error);return}setError("");
    const all=window.RBX.getMaterials(),existingId=$("listing-id").value,existing=all.find(m=>m.id===existingId);
    const type=selectedType(),now=new Date().toISOString();
    const material={id:existingId||window.RBX.makeId(),title:$("material-title").value.trim(),category:$("material-category").value,description:$("material-description").value.trim(),quantity:Number($("material-quantity").value),unit:$("material-unit").value,condition:$("material-condition").value,transactionType:type,price:type==="sell"?Number($("material-price").value):null,exchangePreference:type==="exchange"?$("material-exchange").value.trim():"",location:{area:$("material-area").value.trim(),state:$("material-state").value.trim()},contact:{phone:$("material-phone").value.trim(),whatsapp:$("material-whatsapp").value.trim()||$("material-phone").value.trim()},image:selectedImage,status:existing?.status||"available",createdAt:existing?.createdAt||now,isDemo:false};
    const next=existing?all.map(m=>m.id===existingId?material:m):[material,...all];
    if(!window.RBX.saveMaterials(next))return;
    resetForm();window.RBXApp.refreshAll();window.RBXApp.showView("my-listings");window.showToast(existing?"Your listing has been updated.":"Your material has been listed successfully.");
  });
  window.RBXListingForm={editListing,resetForm};
  updateTransactionFields();
})();
