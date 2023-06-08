import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RecipesComponent } from "./components/recipes/recipes.component";
import { ShoppingListComponent } from "./components/shopping-list/shopping-list.component";
import { RecipeStartComponent } from "./components/recipes/recipe-start/recipe-start.component";
import { RecipeDetailComponent } from "./components/recipes/recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./components/recipes/recipe-edit/recipe-edit.component";

@NgModule({
    imports: [RouterModule.forRoot([
        { path: '', redirectTo: '/recipes', pathMatch: 'full' },
        { path: 'recipes', component: RecipesComponent, children: [
            { path: '', component: RecipeStartComponent },
            { path: 'new', component: RecipeEditComponent },
            { path: ':id', component: RecipeDetailComponent },
            { path: ':id/edit', component: RecipeEditComponent }
        ]},
        { path: 'shopping-list', component: ShoppingListComponent },
    ])],
    exports: [RouterModule] 
})
export class AppRoutingModule { }