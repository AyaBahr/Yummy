let searchContainer = document.getElementById("searchContainer");
let interior = document.getElementById('meals')
$(document).ready(function load() {
    // loading screen
    $('#loading').fadeOut(500 )
    $('body').css('overflow-y', 'auto')
})
//--------------------------------------------------------------------
//Home page

searchName('');

// side nav //close
function closeNav() {
    let wBox = $('.sidenav .inside').innerWidth();
    $('#open-close').removeClass('fa-x');
    $('#open-close').addClass('fa-bars');
    $('.sidenav').animate({ left: -wBox }, 200)
    for (let i = 0; i < 5; i++) {
        $(".links a").eq(4).animate({ top: 400 }, 50, () => {
            $(".links a").eq(3).animate({ top: 400 }, 50, () => {
                $(".links a").eq(2).animate({ top: 400 }, 50, () => {
                    $(".links a").eq(1).animate({ top: 400 }, 50, () => {
                        $(".links a").eq(1).animate({ top: 400 }, 50, () => { })
                    })
                })
            })
        })
    }
}
//open
function openNav() {
    let wBox = $('.sidenav .inside').innerWidth();
    $('#open-close').removeClass('fa-bars');
    $('#open-close').addClass('fa-x');
    $('.sidenav').animate({ left: 0 }, 200)
    for (let i = 0; i < 5; i++) {
        $(".links a").eq(0).animate({ top: 0 }, 50, () => {
            $(".links a").eq(1).animate({ top: 0 }, 50, () => {
                $(".links a").eq(2).animate({ top: 0 }, 50, () => {
                    $(".links a").eq(3).animate({ top: 0 }, 50, () => {
                        $(".links a").eq(4).animate({ top: 0 }, 50, () => { })
                    })
                })
            })
        })
    }
}
closeNav()
$('#open-close').click( ()=>{
    if ($('.sidenav ').css('left') == '0px') {
        closeNav()
    }
    else {
        openNav()
    }
})
//--------------------------------------------------------------------
//display meals
function displayMeals(m) {
    let singleMeal = ``
    for (let i = 0; i < m.length; i++) {
        singleMeal += `
                 <div class="col-md-3 ">
                    <div onclick="mealDetails(${m[i].idMeal})" class="meal position-relative d-flex text-center align-items-center rounded-3 overflow-hidden">
                        <img class="w-100" src=${m[i].strMealThumb} alt="">
                        <div class="data position-absolute d-flex align-items-center text-black py-5">
                            <h3>${m[i].strMeal}</h3>
                        </div>
                    </div>
                </div>`
            }
    $(interior).html(singleMeal);
}
//search
$('#search').on("click", ()=>{
    closeNav()
    $(interior).html("");
    $(searchContainer).html(`
        <div class="row py-4 ">
            <div class="col-md-6 ">
                <input onkeyup="searchName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input onkeyup="searchLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
            </div>
        </div>`);
})
//Name
async function searchName(meal) {
    closeNav()
    $(interior).html("");
    let final = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
    final = await final.json()
    // console.log(final.meals)
    if (final.meals) {
        displayMeals(final.meals)
    }
    else {
        displayMeals([])
    }
}
//first letter
async function searchLetter(firstLetter) {
    closeNav()
    $(interior).html("");
    firstLetter == "" ? firstLetter = "a" : ""
    let final = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`)
    final = await final.json()
    console.log(final.meals);
    if (final.meals) {
        displayMeals(final.meals)
    }
    else {
        displayMeals([])
    }
}
//--------------------------------------------------------------------
//Meal Details

async function mealDetails(mealID) {
    $(interior).html("");
    $('#loading').fadeIn(200);
    let final = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    final = await final.json();
    displayDetails(final.meals[0])
    // console.log(final.meals);
    $('#loading').fadeOut(500);
}

function displayDetails(meal) {
    searchContainer.innerHTML = "";
    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags.split(",")
    if (!tags) { 
        tags = [] 
    }

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
            <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }

    let cartona = `
        <div class="col-md-4 text-white">
                    <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                        alt="">
                        <h2>${meal.strMeal}</h2>
                </div>
                <div class="col-md-8 text-white">
                    <h2>Instructions</h2>
                    <p>${meal.strInstructions}</p>
                    <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                    <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                    <h3>Recipes :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap">
                        ${ingredients}
                    </ul>
    
                    <h3>Tags :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap">
                        ${tagsStr}
                    </ul>
    
                    <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                    <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
                </div>`

    interior.innerHTML = cartona
}
//--------------------------------------------------------------------

//Categories
$('#Categories').on("click", async function categories() {
    closeNav()
    $(interior).html("");
    $('#loading').fadeIn(200);
    $(searchContainer).html("");
    let final = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    final = await final.json()
    displayCategories(final.categories.slice(0, 20))
    $('#loading').fadeOut(500);

})

function displayCategories(C) {
    let category = "";
    for (let i = 0; i < C.length; i++) {
        category += `
        <div class="col-md-3">
                <div onclick="displayCategoryDetail('${C[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-">
                    <img class="w-100" src="${C[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${C[i].strCategory}</h3>
                        <p>${C[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
        </div> `
    }
    $(interior).html(category)
}

async function displayCategoryDetail(c) {
    $(interior).html("");
    $('#loading').fadeIn(500);

    let final = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${c}`)
    final = await final.json()

    displayMeals(final.meals)
    $('#loading').fadeOut(500);

}

//--------------------------------------------------------------------

//Area 
$('#Area').on("click", async function Area() {
    $('#loading').fadeIn(200);

    closeNav()
    $(interior).html("");
    $(searchContainer).html("");
    let final = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    final = await final.json()
    displayArea(final.meals.slice(0, 20))
    $('#loading').fadeOut(500);

})
function displayArea(A) {
    let Area = "";

    for (let i = 0; i < A.length; i++) {
        Area += `
        <div class="col-md-3 text-white">
                <div onclick="areaDetails('${A[i].strArea}')" class="rounded-2 text-center pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${A[i].strArea}</h3>
                </div>
        </div> 
        `
    }
    $(interior).html(Area);
}
async function areaDetails(area) {
    $('#loading').fadeIn(200);

    $(interior).html("");
    let final = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    final = await final.json()
    displayMeals(final.meals)
    $('#loading').fadeOut(500);

}

//--------------------------------------------------------------------

// Ingredients

$('#Ingredients').on("click", async function Ingredients() {
    $('#loading').fadeIn(500);

    closeNav()
    $(interior).html("");
    $(searchContainer).html("");
    let final = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    final = await final.json()
    displayIngredients(final.meals.slice(0, 20))
    $('#loading').fadeOut(500)
})

function displayIngredients(I) {
    let Ingredients = "";

    for (let i = 0; i < I.length; i++) {
        Ingredients += `
        <div class="col-md-3 text-white">
                <div onclick="ingredientsDetails('${I[i].strIngredient}')" class="rounded-2 text-center pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${I[i].strIngredient}</h3>
                        <p>${I[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
        `
    }
    $(interior).html(Ingredients);
}
async function ingredientsDetails(ingredients) {
    $('#loading').fadeIn(500);
    $(interior).html("");
    let final = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    final = await final.json()
    displayMeals(final.meals)
    $('#loading').fadeOut(500);

}

//--------------------------------------------------------------------

// Contacts
$('#Contact').on("click", function showContacts() {
    closeNav()
    $('#loading').fadeIn(200);
    $(searchContainer).html("");
    $(interior).html(
        `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValid()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValid()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@gmail.com
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValid()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValid()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValid()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValid()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    )
    submitBtn = document.getElementById("submitBtn")

    $("#nameInput").on("focus", () => {
        nameInput = true
    })

    $("#emailInput").on("focus", () => {
        emailInput = true
    })

    $("#phoneInput").on("focus", () => {
        phoneInput = true
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInput = true
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInput = true
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInput = true
    })
    $('#loading').fadeOut(500);

})
nameInput = false
emailInput = false
phoneInput = false
ageInput = false
passwordInput = false
repasswordInput = false

function inputsValid() {
    if (nameInput) {
        if (nameValid()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")
        }
    }
    if (emailInput) {
        if (emailValid()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")
        }
    }
    if (phoneInput) {
        if (phoneValid()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")
        }
    }
    if (ageInput) {
        if (ageValid()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")
        }
    }
    if (passwordInput) {
        if (passwordValid()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")
        }
    }
    if (repasswordInput) {
        if (repasswordValid()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")
        }
    }
    
    if (nameValid() && emailValid() && phoneValid() && ageValid() && passwordValid() && repasswordValid()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled" , "")
    }
}

function nameValid() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValid() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValid() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValid() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValid() {
    return (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValid() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}
