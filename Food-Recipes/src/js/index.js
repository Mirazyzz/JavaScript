import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';


/** Global state of the app
 *  - Search object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes
 */

const state = {};

//window.state = state;


const controlSearch = async() => {
    //  1) Get query from view
    const query = searchView.getInput();

    if (query) {
        //  2) New search object and add to state
        state.search = new Search(query);

        //  3) Prepare UI
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try {

            //  4) Search for recipes
            await state.search.getResults();

            //  5) Render result on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something went wrong with the search');
            clearLoader();
        };
    };

    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    };
});

const controlRecipe = async() => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        // Create new recipe object
        state.recipe = new Recipe(id);

        if (state.search) {
            searchView.highlightedSelected(id);
        }

        try {

            // Get recipe data and parseIngredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (error) {
            console.log(error);
            alert('Something error processing recipe!');

        }
    }
};

const controlLike = () => {
    if (!state.likes) {
        state.likes = new Likes();
    };

    const currentId = state.recipe.id;

    //User has not yet liked current recipe
    if (!state.likes.isLiked(currentId)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.img
        );

        // Toggle the like button 
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

        // User has liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentId);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI
        likesView.deleteLike(currentId);
    };

    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

const controlList = () => {
    // Create a list if there is no yet
    if (!state.list) {
        state.list = new List();
    };

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

        // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    };
});

// Restore like recipies on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like button
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

    // Render the excisting likes
    state.likes.likes.forEach(like => likesView.renderLike(like));

    console.log('Should be something');
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love', '.recipe__love *')) {
        controlLike();
    };

});



/** TODO
 * 1) Implement button to delete all shopping list items
 * 2) Implement functionality to manually add items to shopping list
 * 3) Save shopping list data in local storage
 * 4) Improve the ingredient parsing algorithm
 * 5) Come up with an algorithm for calculating the amount of servings
 * 6) Improve error handling
 * 7) Clear up shopping list before adding new item
 */