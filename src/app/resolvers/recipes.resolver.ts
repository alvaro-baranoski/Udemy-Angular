import { ResolveFn } from '@angular/router';
import { Recipe } from '../models/Recipe';
import { inject } from '@angular/core';
import { DataStorageService } from '../services/data-storage.service';
import { RecipeService } from '../services/recipe.service';

export const recipesResolver: ResolveFn<Recipe[]> = (route, state) => {
  const recipes = inject(RecipeService).getRecipes();

  if (recipes.length === 0)
    return inject(DataStorageService).fetchRecipes();
  else
    return recipes;

};
