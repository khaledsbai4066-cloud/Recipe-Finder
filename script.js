
//DOM ELEMENTS
// DOM Elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const detailsContainer = document.getElementById("details-container");
const detailsContent = document.querySelector(".details-content");
const backBtn = document.getElementById("back-btn");
const youtubeLink = document.getElementById("youtube-link");

const BASE_URL="https://www.themealdb.com/api/json/v1/1/"
const SEARCH_URL=`${BASE_URL}search.php?s=`
const ID_URL=`${BASE_URL}lookup.php?i=`

mealsContainer.addEventListener("click",(e) =>{
    mealsclickhandler(e)
})
detailsContainer.addEventListener("click",(e) =>{
    if(e.target.closest("#back-btn")){
        detailsContainer.classList.add("hidden")
    }
})

searchBtn.addEventListener("click",searchmeal)
searchInput.addEventListener("keypress",(e) =>{
    if(e.key === "Enter") searchmeal()
})

async function searchmeal(){
    const meal=searchInput.value.trim()
    if(meal === ""){
        errorContainer.textContent="You must enter a meal name"
        errorContainer.classList.remove("hidden")
        resultHeading.classList.add("hidden")
        return
    }
    else{
        errorContainer.classList.add("hidden")
        resultHeading.classList.remove("hidden")
        resultHeading.textContent=`searching for "${meal}"...`
    }
    try{

        const response=await fetch(`${SEARCH_URL}${meal}`)
        const data=await response.json()
        
        if(data.meals === null){
            errorContainer.textContent=`NO results found of "${meal}",please try again`
            errorContainer.classList.remove("hidden")
            resultHeading.classList.add("hidden")
        }
        else mealsUI(data.meals)
        
    }
    catch(error){
        errorContainer.textContent=`Something went wrong!,please try again`
        errorContainer.classList.remove("hidden")
        resultHeading.classList.add("hidden")
    }
}
function mealsUI(meals){
    resultHeading.classList.add("hidden")
    mealsContainer.innerHTML=""
    meals.forEach((meal) => {
        mealsContainer.innerHTML+=`<div class="meal" meal-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <div class="meal-category">
                     <p id="categori">${meal.strCategory}</p>
                </div> 
            </div>`
    });
    
}
async function mealsclickhandler(e){
    const mealELEMENT=e.target.closest(".meal")
    const id=mealELEMENT.getAttribute("meal-id")
    try{
        const response=await fetch(`${ID_URL}${id}`)
        const data=await response.json()
        
        if(!data.meals || !data.meals[0]){
            errorContainer.textContent=`${data.meals.strMeal}'informations are not availble at the moment!`
            errorContainer.classList.remove("hidden")
        }
        else{mealsInfUI(data.meals[0])}
    }
    catch(error){
        errorContainer.textContent=`something went wrong!!`
        errorContainer.classList.remove("hidden")
    }
}
function mealsInfUI(meal){
    
    const ingredients=[]
    for(let i=1;i<=20;i++){
        const measure=meal[`strMeasure${i}`]?.trim()
        const ingredient=meal[`strIngredient${i}`]?.trim()
        if(ingredient) ingredients.push({measure,ingredient})
    }
    try{
        detailsContainer.classList.remove("hidden")
        detailsContainer.innerHTML=`<div>
                    <button id="back-btn">GO Back</button>
                </div>
                <div class="details-content">
                    <div class="meal-information">
                        <img src="${meal.strMealThumb}" alt="">
                        <h3>${meal.strMeal}</h3>
                        <p id="categori">${meal.strCategory}</p>
                    </div>
                    <div class="intructions">
                        <h1>Instructions</h1>
                        <p>${meal.strInstructions}</p>
                    </div>
                    <div class="ingredients">
                        <h2>Ingredients</h2>
                        <ul class="ingredients-list">
                            ${ingredients.map((item) =>`<li><i class="fas fa-check"></i>${item.measure? item.measure:""} ${item.ingredient}</li>`).join(" ")}
                        </ul>
                    </div>
                    <div id="youtube-link">
                        ${meal.strYoutube?  `<a href="${meal.strYoutube}" target="_blank"><i class="fab fa-youtube"></i>Watch Youtube</a>`:""}
                    </div>
                </div>`
            detailsContainer.scrollIntoView({behavior:"smooth"})
       
    }
    catch(error){
        errorContainer.textContent="something went wrong,please try again"
        errorContainer.classList.remove("hidden")
    }
}