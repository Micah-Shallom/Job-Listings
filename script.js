const filterBar = document.querySelector('.main-container-filter');
const filterPills = document.querySelector('.filter-pills');
const clear = document.querySelector('.clearTag');
const overAllContainer = document.querySelector('.main-container-overall');
let filterArr = []


//Extract JSON data and dynamically create profile component
const getJSONDate=()=>{
  return new Promise((resolve,reject)=> {
    fetch('./data.json')
    .then(response => response.json())
    .then(getInfo => setTimeout(()=> {
      resolve(getInfo);
    }))
    .catch(error => reject(error))
  })
}

function filter(item){
  if(filterArr.length>=0){
    filterBar.style.visibility='visible';
  }else{
    filterBar.style.visibility='hidden';
  }
  let filterValue = item.getAttribute('data-value');
  if(filterArr.includes(filterValue)){
    filterArr
    deployFilterPills();
  }else{
    filterArr.push(filterValue);
    deployFilterPills();
  }

}

const deployFilterPills=()=>{
  const Pills = filterArr.map(each => `<div class="pill">
  <span>${each}</span> 
  <span class='clearSingle'>&#10005</span>
</div>`);
    filterPills.innerHTML='';
    Pills.forEach(pill => {
      filterPills.innerHTML+=pill;
    });
}
filterPills.addEventListener('click',e => {
  if(e.target.classList.contains('clearSingle')){
    let pill = e.target.parentElement;
    let pillValue=e.target.previousElementSibling.textContent;
    let pillValueIndex = filterArr.indexOf(pillValue);
    pill.remove();
    filterArr.splice(pillValueIndex,1);
  }
})


async function renderContent(){
  const data = await getJSONDate();
  data.forEach(user => {
    const skillFilter = [user.role,user.level,...user.languages,...user.tools];
    let skillList = '';
    if(skillFilter.length!==0){
      skillFilter.forEach(skill=> {
        skillList+=`<span onclick='filter(this)' data-value='${skill}' class="profile-lower-pill">${skill}</span>`
      })
    }
    
    console.log(filterArr)
    overAllContainer.innerHTML += `
    <div class="profile">
    <img class="profile-logo " src="${user.logo}" alt="">
    <div class="profile-upper">
      <div class="top">
        <span class="company">${user.company}</span>
        ${user.new==true?`<span class="new">NEW!</span>`:''}
        ${user.featured==true?`<span class="featured">FEATURED</span>`:''}
        
      </div>
      <div class="position">${user.position}</div>
      <ul>
        <li class="postedAt">${user.postedAt}</li>
        <li class="contract">${user.contract}</li>
        <li class="location">${user.location}</li>
      </ul>
    </div>
    <hr/>
    <div class="profile-lower">
      ${skillList}
    </div>
  </div>
    `
    
  })
}
clear.addEventListener('click', ()=> {
  filterArr = [];
  deployFilterPills()
})
document.addEventListener('DOMContentLoaded',renderContent)


