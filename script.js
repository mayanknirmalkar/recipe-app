/*Whenever we type anything on search bar this fuction is executed */
const search = async (search) => {

    const letter = search.value;
    
    let searchResults = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${letter}`);

    searchResults = await searchResults.json()

    organizeResult(searchResults.meals)
}

/*This fuction renders the result getting from above Search funtion */
const organizeResult = (searchResults) => {

    let organized = ""

    searchResults.forEach((meal) => {
        if( fav.includes(parseInt(meal.idMeal)) ){

            organized += `<div id="card" class="card mb-3" style="width: 20rem;">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title ">${meal.strMeal}</h5>
                <div class="d-flex justify-content-between mt-5">
                    <button type="button" class="btn btn-success" onclick="singleMeal(${meal.idMeal})">Recipe</button>
                    <button id=main${meal.idMeal} style="background:red" class="btn btn-outline-light active" onclick="addRemoveFavInMain(${meal.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                </div>
            </div>
        </div>`
            
        }else{

            organized += `<div id="card" class="card mb-3" style="width: 20rem;">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title ">${meal.strMeal}</h5>
                <div class="d-flex justify-content-between mt-5">
                    <button type="button" class="btn btn-success" onclick="singleMeal(${meal.idMeal})">Recipe</button>
                    <button id=main${meal.idMeal} class="btn btn-outline-light active" onclick="addRemoveFavInMain(${meal.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                </div>
            </div>
        </div>`

        }
    })

    document.getElementById("main-container").innerHTML = organized
    
}

/*This function fetches each meal by idMeal and renders only that meal details */
const singleMeal = async (id) => {

    let singleResult = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    singleResult = await singleResult.json();

    let organized = singleResult.meals

    organized = `<div class="container py-3">
                    <div class="card p-lg-5 p-md-2">
                        <div class="row ">
                            <div class="col-md-4  align-self-center">
                                <img src="${organized[0].strMealThumb}" class="w-100">
                            </div>
                            <div class="col-md-8 px-3 align-self-center">
                                <div class="card-block px-3">
                                    <div id="heading" class="text-center">

                                    </div>
                                    <h2 class="card-title" id="heading2">${organized[0].strMeal}</h2>
                                    <p id="category">Category : ${organized[0].strCategory}</p>
                                    <p d="area">Area : ${organized[0].strArea}</p>


                                    <h5>Instruction :</h5>
                                    <p class="card-text" id="recipe-intro">
                                        ${organized[0].strInstructions}</p>
                                    <a href="${organized[0].strYoutube}"  target="_blank" class="btn btn-success">Video</a>

                                    
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    `;

    document.getElementById("main-container").innerHTML = organized

 }
//the array for storing favorite meals
 let fav = JSON.parse(sessionStorage.getItem("fav")) || []

/*This function handles add and removal from fav array when add/remove click on index.html */
 const addRemoveFavInMain = (id) => {

    if( fav.includes(id) ){
        document.getElementById(`main${id}`).style.background = "white";
        fav = fav.filter((recipeId) => parseInt(recipeId) != parseInt(id))
       sessionStorage.setItem("fav", JSON.stringify(fav))
        return;
    }
    
    document.getElementById(`main${id}`).style.background = "red"
    fav.push(id);
    sessionStorage.setItem("fav", JSON.stringify(fav))
    console.log(fav)
 }

/*This function handles add and removal from fav array when add/remove click on fav.html */
 const addRemoveFavInFav = (id) => {

    if( fav.includes(id) ){
        document.getElementById(`fav${id}`).style.background = "white";
        fav = fav.filter((recipeId) => parseInt(recipeId) != parseInt(id))
        sessionStorage.setItem("fav", JSON.stringify(fav))
        const loadEvent = new Event('load')
        window.dispatchEvent(loadEvent)
        return;
    }
    
    document.getElementById(`fav${id}`).style.background = "red"
    fav.push(id);
    sessionStorage.setItem("fav", JSON.stringify(fav))
    console.log(fav)
 }


/* Function renders the list of favorite meals on load of fav.html */
 const getFav = async () => {

    let organized = "";

    const favList =  JSON.parse(sessionStorage.getItem("fav")) || fav
    console.log(favList)

    if( favList.length === 0) {
        organized = `
        <div class="page-wrap d-flex flex-row align-items-center">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-12 text-center">
        
                        <div class="mb-4 lead heading2 white" style="color:white;">
                            No meal added in your favourites list.
                        </div>
                    </div>
                </div>
            </div>
        </div>`

        document.getElementById("fav-container").innerHTML = organized

        return;
    }

    for( const id of favList ) {

        let singleResult = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        singleResult = await singleResult.json();
        singleResult = singleResult.meals
        
        organized += `
        <div id="card" class="card mb-3 m-2" style="width: 20rem;">
            <img src="${singleResult[0].strMealThumb}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${singleResult[0].strMeal}</h5>
                <div class="d-flex justify-content-between mt-5">
                    <button type="button" class="btn btn-warning" onclick="showFavMealDetails(${singleResult[0].idMeal})">Recipe</button>
                    <button id=fav${singleResult[0].idMeal} style="background:red;" class="btn btn-outline-light active" onclick="addRemoveFavInFav(${singleResult[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                </div>
            </div>
        </div>
        `
        
    }

    document.getElementById("fav-container").innerHTML = organized
 } 