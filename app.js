const colors = [
 {code:'D-01',name:'Rosa pétalo',family:'Rosas',hex:'#E9A5B8'},
 {code:'D-02',name:'Rosa chicle',family:'Rosas',hex:'#E86D9B'},
 {code:'D-03',name:'Rosa coral',family:'Rosas',hex:'#D96C78'},
 {code:'D-04',name:'Lavanda',family:'Morados',hex:'#B8A3D8'},
 {code:'D-05',name:'Lila suave',family:'Morados',hex:'#D4C5E9'},
 {code:'D-06',name:'Violeta',family:'Morados',hex:'#8056B4'},
 {code:'D-07',name:'Amarillo pastel',family:'Amarillos',hex:'#F4E69A'},
 {code:'D-08',name:'Amarillo sol',family:'Amarillos',hex:'#F4C52F'},
 {code:'D-09',name:'Naranja',family:'Naranjas',hex:'#EE914B'},
 {code:'D-10',name:'Melocotón',family:'Naranjas',hex:'#F5B58D'},
 {code:'D-11',name:'Verde menta',family:'Verdes',hex:'#A5D7BD'},
 {code:'D-12',name:'Verde bosque',family:'Verdes',hex:'#397D61'},
 {code:'D-13',name:'Azul cielo',family:'Azules',hex:'#91C5E5'},
 {code:'D-14',name:'Azul océano',family:'Azules',hex:'#397EBB'},
 {code:'D-15',name:'Gris cálido',family:'Grises',hex:'#A9A19A'},
 {code:'D-16',name:'Marrón tierra',family:'Marrones',hex:'#95694D'}
];
const families=['Todos','Rosas','Morados','Amarillos','Naranjas','Verdes','Azules','Grises','Marrones'];
let family='Todos', onlyFavorites=false, selected=null;
let favorites=new Set(JSON.parse(localStorage.getItem('ohuhu-favorites')||'[]'));
const $=id=>document.getElementById(id);
const filters=$('filters'), swatches=$('swatches'), search=$('search'), dialog=$('colorDialog');
function renderFilters(){
 filters.innerHTML='';
 families.forEach(f=>{
  const b=document.createElement('button'); b.className='filter'+(family===f?' active':''); b.textContent=f;
  b.addEventListener('click',()=>{family=f;onlyFavorites=false;$('favoritesToggle').setAttribute('aria-pressed','false');renderFilters();render();});
  filters.appendChild(b);
 });
}
function render(){
 const q=search.value.trim().toLocaleLowerCase('es');
 const list=colors.filter(c=>(family==='Todos'||c.family===family)&&(!onlyFavorites||favorites.has(c.code))&&(!q||c.code.toLowerCase().includes(q)||c.name.toLocaleLowerCase('es').includes(q)||c.family.toLocaleLowerCase('es').includes(q)));
 swatches.innerHTML='';
 list.forEach(c=>{
  const b=document.createElement('button');b.className='swatch-card';b.type='button';b.setAttribute('aria-label',`${c.code}, ${c.name}`);
  const color=document.createElement('span');color.className='swatch-color';color.style.backgroundColor=c.hex;
  const code=document.createElement('span');code.className='swatch-code';code.textContent=c.code;
  const name=document.createElement('span');name.className='swatch-name';name.textContent=c.name;
  b.append(color,code,name);b.addEventListener('click',()=>openDetail(c));swatches.appendChild(b);
 });
 $('count').textContent=list.length;$('empty').hidden=list.length!==0;$('clearSearch').hidden=!search.value;
}
function openDetail(c){
 selected=c;$('detailSwatch').style.backgroundColor=c.hex;$('detailName').textContent=c.name;$('detailCode').textContent=c.code;$('detailFamily').textContent=c.family;$('detailHex').textContent=c.hex;
 updateFavoriteButton();dialog.showModal();
}
function updateFavoriteButton(){const yes=favorites.has(selected.code);$('detailFavorite').textContent=yes?'♥ Quitar de favoritos':'♡ Añadir a favoritos';}
function toggleFavorites(){
 onlyFavorites=!onlyFavorites;$('favoritesToggle').setAttribute('aria-pressed',String(onlyFavorites));$('favoritesToggle').innerHTML=onlyFavorites?'♥ <span>Ver todos</span>':'♡ <span>Favoritos</span>';render();
}
search.addEventListener('input',render);
$('clearSearch').addEventListener('click',()=>{search.value='';render();search.focus();});
$('favoritesToggle').addEventListener('click',toggleFavorites);
$('bottomFavorites').addEventListener('click',toggleFavorites);
$('closeDialog').addEventListener('click',()=>dialog.close());
$('detailFavorite').addEventListener('click',()=>{if(favorites.has(selected.code))favorites.delete(selected.code);else favorites.add(selected.code);localStorage.setItem('ohuhu-favorites',JSON.stringify([...favorites]));updateFavoriteButton();render();});
$('copyHex').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(selected.hex);$('copyHex').textContent='Copiado';setTimeout(()=>$('copyHex').textContent='Copiar HEX',1300);}catch(e){$('detailHex').textContent=selected.hex+' (selecciona para copiar)';}});
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
renderFilters();render();
if('serviceWorker' in navigator && location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
