const { test, expect } = require('@playwright/test');
const longName = 'Aliment cu denumire foarte lunga si ingrediente detaliate pentru verificarea afisarii responsive';
async function mock(page, signedIn = true) {
  const calls = [];
  await page.route('https://fonts.googleapis.com/**', r => r.fulfill({contentType:'text/css',body:''}));
  await page.route(/\/src\/auth\.jsx(?:\?.*)?$/, r => r.fulfill({ contentType:'application/javascript', body:`const user=${signedIn ? "{uid:'test-user',email:'utilizator.cu.adresa.lunga@example.test',getIdToken:async()=>'test'}" : 'null'};export const auth={currentUser:user};export const useAuth=()=>({user,admin:true,loading:false});export const AuthProvider=({children})=>children;` }));
  await page.route('**/api/v1/**', r => {
    const u = new URL(r.request().url()), path = u.pathname.replace('/api/v1', '');calls.push(path);
    const food={id:7,name:longName,user_id:'test-user',is_public:true,calories:200,nutrients:{protein:12},source:'manual',catalog_data:{}};
    let data=[];
    if(path==='/foods/7') data=food;
    else if(path==='/nutrients') data=[{key:'protein',label:'Proteine',unit:'g'}];
    else if(path==='/sports') data=[{id:1,name:'Sala',is_system:false}];
    else if(path==='/sports/1/exercises') data=[{id:1,name:'Genuflexiuni',tracking_type:'strength'}];
    else if(path==='/activity-types') data=[{key:'strength',label:'Sala',category:'strength',duration_minutes:60}];
    else if(path==='/workouts') data=[{id:1,day:'2026-09-30',title:'Sesiune cu titlu lung pentru mobil',sport:'Sala',completed:false,exercises:[{name:'Genuflexiuni cu haltera',sets:3,reps:12,weight_kg:50,notes:'Executie controlata'}]}];
    else if(path==='/recipes') data=[{id:1,name:'Reteta cu ingrediente',servings:2,cooked_total_grams:400,basis_grams:400,raw_total_grams:500,total_calories:600,calories_per_serving:300,notes:'',ingredients:[]}];
    else if(path==='/diary') data=[{id:1,entry_type:'food',food_id:7,meal:'Mic dejun',day:'2026-09-30',grams:150,snapshot:food}];
    else if(path==='/foods/search') data={items:[food],page:1,has_more:false};
    else if(path==='/profile') data={today:'2026-09-30',profile:{sex:'male',birth_date:'1996-01-01',height_cm:176,activity_level:'light',goal:'maintain',auto_calories:true},weights:[{id:1,day:'2026-09-29',weight_kg:83}],weight_change_kg:0,active_goal:null,recommendation:{available:false,reason:'Completeaza datele',warnings:[],options:[]}};
    else if(path==='/profile/summary') data={sessions:1,logged_days:1,entries:1,average_calories:300,average_difference:0,days_with_target:1,sports:[{name:'Sala',sessions:1}]};
    else if(path==='/energy') data={available:false,reason:'Completeaza activitatea'};
    else if(path==='/nutrition-report') data={days:[{day:'2026-09-29',entries:1,calories:300,nutrients:{protein:20},target:2000,difference:-1700}]};
    else if(path==='/training-progress/catalog') data=[{name:'Sala',exercises:[{key:'1',name:'Genuflexiuni'}]}];
    else if(path==='/articles' || path==='/articles/test') {const article={id:1,slug:'test',title:'Articol despre antrenamente',summary:'Un rezumat de articol pentru verificarea interfetei',content:'Continutul articolului.',created_at:'2026-09-30',images:[]};data=path==='/articles'?[article]:article;}
    return r.fulfill({json:data});
  });
  return calls;
}
async function noOverflow(page) {
  const size=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
  expect(size.scroll,`Overflow la ${page.url()}`).toBeLessThanOrEqual(size.width+1);
}
for(const width of [320,390,640,768,1024,1280,1536]) {
 test(`all routes at ${width}px`, async({page})=>{
  await page.setViewportSize({width,height:900});await mock(page);
  const errors=[];page.on('pageerror',e=>{ errors.push(e.message); console.log('PAGE ERROR',page.url(),e.message); });
  for(const path of ['/','/articles','/articles/test','/admin','/profile','/workouts/sessions','/workouts/catalog','/workouts/sports/new','/workouts/sessions/new','/workouts/reports','/nutrition/journal','/nutrition/recipes','/nutrition/foods/new','/nutrition/foods/7/edit','/nutrition/reports']){
   await page.goto(path);await expect(page.locator('main h1')).toBeVisible();
   await expect(page.locator('main')).not.toBeEmpty();await page.waitForLoadState('networkidle');await noOverflow(page);
   if(path==='/workouts/sessions') {
    const session=page.locator('details').filter({has:page.locator('summary', {hasText:'Sesiune cu titlu lung pentru mobil'})});
    await expect(session).not.toHaveAttribute('open','');
    await expect(session.locator('summary')).toContainText('Sala');
    await expect(session.locator('summary time')).toHaveText('2026-09-30');
    await expect(session.getByRole('button',{name:'Editeaza',exact:true})).toBeHidden();
    await session.locator('summary').click();
    await expect(session.getByText('Genuflexiuni cu haltera',{exact:true})).toBeVisible();
    await expect(session.getByRole('button',{name:'Editeaza',exact:true})).toBeVisible();
    await noOverflow(page);
    await expect(session.locator('dl time')).toHaveCSS('white-space','nowrap');
    await expect(session.locator('dl').getByText('Planificat',{exact:true})).toHaveCSS('white-space','nowrap');
    if(width>=1024) {
     const titleColumn=await session.locator('dl > div').nth(1).boundingBox();
     const exerciseColumn=await session.locator('dl > div').nth(3).boundingBox();
     expect(exerciseColumn.width).toBeGreaterThanOrEqual(titleColumn.width*1.3);
    }
    if([390,1280].includes(width)) await page.screenshot({path:`../review/${width}-sessions-expanded.png`,fullPage:true});
    await session.locator('summary').click();
    await expect(session.getByRole('button',{name:'Editeaza',exact:true})).toBeHidden();
   }
   if([390,1280].includes(width) && ['/', '/profile','/nutrition/journal','/workouts/sessions'].includes(path)) await page.screenshot({path:`../review/${width}-${path.replaceAll('/','_')||'home'}.png`,fullPage:true});
   if(path==='/profile') {for(const name of ['Energia și activitatea zilnică','Greutate și progres','Date personale și obiectiv']) {await page.getByRole('button',{name,exact:true}).click();await noOverflow(page);}}
   if(path==='/nutrition/journal') {await page.getByRole('button',{name:'Catalog alimente',exact:true}).click();await page.getByLabel('Nume, marca sau cod de bare').fill('aliment');await page.getByRole('button',{name:'Cauta aliment',exact:true}).click();await expect(page.getByRole('button',{name:'Detalii',exact:true})).toBeVisible();await noOverflow(page);}
  }
  expect(errors).toEqual([]);
 });
}
test('mobile menu, escape, route close, active route and login form',async({page})=>{
 await page.setViewportSize({width:390,height:844});await mock(page,false);await page.goto('/login');
 await expect(page.getByLabel('Email',{exact:true})).toBeVisible();await noOverflow(page);
 const toggle=page.getByRole('button',{name:'Meniu',exact:true});await toggle.click();
 await expect(page.getByRole('button',{name:'Inchide meniul',exact:true})).toHaveAttribute('aria-expanded','true');
 await page.getByRole('button',{name:'Antrenamente',exact:true}).click();
 await expect(page.getByRole('link',{name:'Sesiuni Planuri si istoric'})).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Antrenamente',exact:true})).toBeFocused();
 await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Meniu',exact:true})).toBeFocused();
 await page.getByRole('button',{name:'Meniu',exact:true}).click();await page.locator('#main-navigation').getByRole('link',{name:'Articole',exact:true}).click();
 await expect(page).toHaveURL(/\/articles$/);await expect(page.getByRole('button',{name:'Meniu',exact:true})).toHaveAttribute('aria-expanded','false');
});
test('profile tab switch preserves draft without requesting data again',async({page})=>{
 const calls=await mock(page);await page.goto('/profile');await page.getByRole('button',{name:'Editeaza profilul',exact:true}).click();await page.getByLabel('Obiectiv',{exact:true}).selectOption('lose');
 const count=calls.length;await page.getByRole('button',{name:'Greutate și progres',exact:true}).click();await page.getByRole('button',{name:'Date personale și obiectiv',exact:true}).click();
 await expect(page.getByLabel('Obiectiv',{exact:true})).toHaveValue('lose');expect(calls.length).toBe(count);
});
