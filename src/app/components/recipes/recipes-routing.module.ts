import { NgModule } from '@angular/core';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipesComponent } from './recipes.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { recipesResolver } from 'src/app/resolvers/recipes.resolver';

const routes: Routes = [
    { 
        path: '', 
        component: RecipesComponent,
        canActivate: [authGuard], 
        children: [
            { path: '', component: RecipeStartComponent },
            { path: 'new', component: RecipeEditComponent },
            { path: ':id', component: RecipeDetailComponent, resolve: [ recipesResolver ] },
            { path: ':id/edit', component: RecipeEditComponent, resolve: [ recipesResolver ] }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule { }
