import {test,expect} from '@playwright/test';
const food = {id:7,name:'Branza test',user_id:'test-user',is_public:true,calories:200,nutrients:{protein:12,carbohydrates:4,fat:15,salt:1},source:'openfoodfacts',barcode:'5941234567890',catalog_data:{nutriscore:'B',ingredients_text:null,nova_group:null}};
async function setup(page, admin=false) {
 const state={calls:[],favorite:false,entries:[],archived:false};
 await page.route(/\/src\/auth\.jsx(?:\?.*)?$/,r=>r.fulfill({contentType:'application/javascript',body:`const user={uid:'test-user',getIdToken:async()=>'test'};export const auth={currentUser:user};export const useAuth=()=>({user,admin:${admin},loading:false});export const AuthProvider=({children})=>children;`}));
 await page.route('**/api/v1/**', async r=>{
  const req=r.request(), u=new URL(req.url()), path=u.pathname.replace('/api/v1',''), method=req.method();
  state.calls.push({path,method,query:u.search,body:req.postDataJSON()});
  const json=value=>r.fulfill({json:value});
  if(path.endsWith('/favorite')){state.favorite=method==='PUT';return r.fulfill({status:204});}
  if(path==='/food-catalog/archive'){state.archived=true;return r.fulfill({status:204});}
  if(['/foods/search','/foods/favorites','/food-catalog/local'].includes(path))return json({items:state.archived || (path==='/foods/favorites'&&!state.favorite)?[]:[{...food,is_favorite:state.favorite}],page:Number(u.searchParams.get('page')||1),has_more:false,source:'local',message:''});
  if(path==='/diary'){
   if(method==='POST'){const entry={...req.postDataJSON(),id:state.entries.length+1,entry_type:'food',snapshot:{...food}};state.entries.push(entry);return r.fulfill({status:201,json:entry});}
   return json(state.entries.filter(e=>e.day===u.searchParams.get('day')));
  }
  return json([]);
 });
 return state;
}
async function search(page, catalog=true){
 await page.goto('/nutrition/journal');
 if(catalog)await page.getByRole('button',{name:'Catalog alimente',exact:true}).click();
 await page.getByLabel(catalog?'Nume, marca sau cod de bare':'Cauta aliment sau reteta').fill('branza');
 await page.getByRole('button',{name:'Cauta aliment',exact:true}).click();
 await expect(page.getByRole('button',{name:'Detalii',exact:true})).toBeVisible();
}
test('quick add inherits diary context and refreshes actual totals',async({page})=>{
 const state=await setup(page);await search(page,false);
 await page.getByLabel('Ziua',{exact:true}).fill('2026-09-29');
 await page.getByLabel('Masa',{exact:true}).fill('Cina');
 await page.locator('article').getByRole('button',{name:'Adauga in jurnal',exact:true}).click();
 const dialog=page.getByRole('dialog');
 await expect(dialog.getByLabel('Data',{exact:true})).toHaveValue('2026-09-29');
 await expect(dialog.getByLabel('Masa',{exact:true})).toHaveValue('Cina');
 await dialog.getByLabel('Grame',{exact:true}).fill('175');
 await dialog.getByRole('button',{name:'Salveaza in jurnal'}).click();
 await expect(dialog).toHaveCount(0);
 await expect(page.getByText('350.0 kcal',{exact:true})).toBeVisible();
 const writes=state.calls.filter(c=>c.path==='/diary'&&c.method==='POST');
 expect(writes).toHaveLength(1);expect(writes[0].body).toEqual({food_id:7,grams:175,meal:'Cina',day:'2026-09-29'});
 await page.locator('tbody').getByRole('button',{name:'Branza test'}).click();
 await expect(page.getByRole('dialog').getByRole('columnheader',{name:/175 g/i})).toBeVisible();
 await expect(page.getByRole('dialog').getByText('350 kcal',{exact:true})).toBeVisible();
});
test('catalog can add to a chosen day without leaving search',async({page})=>{
 const state=await setup(page);await search(page);
 await page.getByRole('button',{name:'Adauga in jurnal',exact:true}).click();
 const dialog=page.getByRole('dialog');await dialog.getByLabel('Data',{exact:true}).fill('2026-09-28');await dialog.getByLabel('Masa',{exact:true}).fill('Pranz');
 await dialog.getByRole('button',{name:'Salveaza in jurnal'}).click();
 await expect(page.getByText('Aliment adaugat: 2026-09-28, Pranz.')).toBeVisible();
 expect(state.entries[0].meal).toBe('Pranz');await expect(page.getByRole('heading',{name:'Catalog alimente'})).toBeVisible();
});
test('favorite persists after reload and detail uses missing markers',async({page})=>{
 await setup(page);await search(page);
 await page.getByRole('button',{name:'Detalii',exact:true}).click();const dialog=page.getByRole('dialog');
 await expect(dialog.getByText('Nu este disponibilă',{exact:true}).first()).toBeVisible();
 await expect(dialog.getByRole('link',{name:/Vezi produsul/})).toHaveAttribute('href','https://world.openfoodfacts.org/product/5941234567890');
 await dialog.getByRole('button',{name:'Adauga la favorite'}).click();await expect(dialog.getByRole('button',{name:'Elimina din favorite'})).toBeVisible();
 await dialog.getByRole('button',{name:'Inchide',exact:true}).click();await page.reload();
 await page.getByRole('button',{name:'Favoritele mele'}).click();await expect(page.getByText('Branza test',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Elimina din favorite'}).click();await expect(page.getByText('Branza test',{exact:true})).toHaveCount(0);
});
test('admin bulk removal does not initiate an external search again',async({page})=>{
 const state=await setup(page,true);await search(page);page.on('dialog',d=>d.accept());
 await page.getByLabel('Selecteaza pentru eliminare: Branza test').check();await page.getByRole('button',{name:'Elimina selectate (1)'}).click();
 await expect(page.getByText('Produsele au fost eliminate din catalogul activ.')).toBeVisible();
 expect(state.calls.filter(c=>c.path==='/foods/search')).toHaveLength(1);
 expect(state.calls.filter(c=>c.path==='/food-catalog/local')).toHaveLength(1);
});
for(const camera of ['denied','unavailable'])test(`camera ${camera} has manual fallback and never starts on load`,async({page})=>{
 const state=await setup(page);
 await page.addInitScript(mode=>{window.cameraCalls=0;Object.defineProperty(navigator,'mediaDevices',{value:mode==='unavailable'?undefined:{getUserMedia:async()=>{window.cameraCalls++;throw new DOMException('denied','NotAllowedError');}},configurable:true});},camera);
 await page.goto('/nutrition/foods/new');expect(await page.evaluate(()=>window.cameraCalls)).toBe(0);
 await page.getByRole('button',{name:'Scaneaza codul',exact:true}).click();
 await expect(page.getByRole('dialog').getByRole('status')).toContainText(camera==='denied'?'refuzat':'nu este disponibila');
 await page.getByRole('button',{name:'Introdu codul manual',exact:true}).click();
 await page.getByLabel('Nume, marca sau cod de bare').fill('5941234567890');await page.getByRole('button',{name:'Cauta aliment',exact:true}).click();
 await expect(page.getByText('Branza test',{exact:true})).toBeVisible();
 expect(state.calls.filter(c=>c.path==='/foods/search')).toHaveLength(1);
});
test('scanned barcode searches once and stops the camera tracks',async({page})=>{
 const state=await setup(page);
 await page.addInitScript(()=>{
  window.cameraCalls=0;window.stopped=0;
  HTMLMediaElement.prototype.play = async function() {};
  const canvas=document.createElement('canvas');canvas.width=320;canvas.height=240;
  Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:async()=>{window.cameraCalls++;const stream=canvas.captureStream(1);stream.getTracks().forEach(t=>{const stop=t.stop.bind(t);t.stop=()=>{window.stopped++;stop();};});return stream;}},configurable:true});
  window.BarcodeDetector=class{static async getSupportedFormats(){return ['ean_13','ean_8','upc_a','upc_e','qr_code'];}async detect(){return [{rawValue:'https://world.openfoodfacts.org/product/5941234567890/test'}];}};
 });
 await page.goto('/nutrition/foods/new');await page.getByRole('button',{name:'Scaneaza codul',exact:true}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.getByLabel('Cod de bare (optional)')).toHaveValue('5941234567890');
 await expect(page.getByText('Branza test',{exact:true})).toBeVisible();
 expect(state.calls.filter(c=>c.path==='/foods/search')).toHaveLength(1);
 expect(await page.evaluate(()=>window.stopped)).toBeGreaterThan(0);
});
test('food search pagination uses the requested page',async({page})=>{
 await setup(page);const pages=[];
 await page.route('**/foods/search?*',r=>{const pageNumber=Number(new URL(r.request().url()).searchParams.get('page'));pages.push(pageNumber);return r.fulfill({json:{items:[{...food,id:pageNumber,name:`Produs pagina ${pageNumber}`}],page:pageNumber,has_more:pageNumber===1,source:'local',message:''}});});
 await page.goto('/nutrition/journal');await page.getByLabel('Cauta aliment sau reteta').fill('branza');await page.getByRole('button',{name:'Cauta aliment',exact:true}).click();await page.getByRole('button',{name:'Urmatoarele 20'}).click();
 await expect(page.getByText('Produs pagina 2',{exact:true})).toBeVisible();expect(pages).toEqual([1,2]);
});
test('mobile details fit viewport and Escape restores focus',async({page},testInfo)=>{
 await page.setViewportSize({width:390,height:844});await setup(page);await search(page);
 const opener=page.getByRole('button',{name:'Detalii',exact:true});await opener.click();
 await expect(page.getByRole('dialog')).toBeVisible();
 expect(await page.getByRole('dialog').evaluate(el=>el.getBoundingClientRect().width<=innerWidth && el.scrollWidth<=el.clientWidth)).toBe(true);
 await page.screenshot({path:testInfo.outputPath('food-details-mobile.png')});
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);await expect(opener).toBeFocused();
});
