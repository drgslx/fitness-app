const {test,expect} = require('@playwright/test');
const food={id:7,name:'Branza test',user_id:'test-user',calories:200,nutrients:{protein:12,carbohydrates:4,fat:15,salt:1},source:'openfoodfacts',barcode:'5941234567890',catalog_data:{nutriscore:'B',url:'https://world.openfoodfacts.org/product/5941234567890'}};
async function setup(page){
 const calls=[];
 await page.route(/\/src\/auth\.jsx(?:\?.*)?$/,r=>r.fulfill({contentType:'application/javascript',body:`const user={uid:'test-user',getIdToken:async()=>'test'}; export const auth={currentUser:user};export const useAuth=()=>({user,admin:false,loading:false});export const AuthProvider=({children})=>children;`}));
 await page.route('**/api/v1/**',r=>{
  const u=new URL(r.request().url());calls.push(u.pathname+u.search);
  if(u.pathname.endsWith('/foods/search'))return r.fulfill({json:{items:[food],page:1,has_more:false,source:'local',message:''}});
  return r.fulfill({json:[]});
 });
 return calls;
}
for(const width of [390,1366])test(`catalog on-demand at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});const calls=await setup(page);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/nutrition/journal');await page.getByRole('button',{name:'Catalog alimente',exact:true}).click();
 await expect(page.getByRole('button',{name:'Cauta aliment',exact:true})).toBeDisabled();
 expect(calls.some(c=>c.includes('/foods'))).toBe(false);
 await page.getByLabel('Nume, marca sau cod de bare').fill('branza');
 expect(calls.some(c=>c.includes('/foods'))).toBe(false);
 await page.getByRole('button',{name:'Cauta aliment',exact:true}).click();await expect(page.getByText('Branza test', {exact:true})).toBeVisible();
 expect(calls.filter(c=>c.includes('/foods/search'))).toHaveLength(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
 await page.getByRole('button',{name:'Obiective',exact:true}).click();await expect(page).toHaveURL(/\/profile$/);
});
test('recipe reuses selected food and grams without submitting on search',async({page})=>{
 const calls=await setup(page);await page.goto('/nutrition/recipes');
 await page.getByLabel('Nume, marca sau cod de bare').fill('branza');
 await page.getByRole('button',{name:'Cauta aliment',exact:true}).click();
 await page.getByRole('button',{name:'Alege',exact:true}).click();
 await expect(page.locator('tbody tr')).toHaveCount(1);
 await expect(page.locator('tbody input[type=number]')).toHaveValue('100');
 await page.locator('tbody input[type=number]').fill('150');
 await expect(page.getByText('150.0 g',{exact:true})).toBeVisible();
 expect(calls.filter(c=>c.includes('/foods/search'))).toHaveLength(1);
});
test('manual form does not load catalog and publication starts private',async({page})=>{
 const calls=await setup(page);await page.goto('/nutrition/foods/new');
 await expect(page.getByLabel('Publica alimentul in catalogul local')).not.toBeChecked();
 await expect(page.getByLabel('Cod de bare (optional)')).toBeVisible();
 expect(calls.some(c=>c.includes('/foods'))).toBe(false);
});
