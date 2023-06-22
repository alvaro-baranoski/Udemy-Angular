import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule } from "@angular/router";
import { AuthComponent } from "./components/auth/auth.component";

@NgModule({
    imports: [RouterModule.forRoot([
        { path: '', redirectTo: '/recipes', pathMatch: 'full' },
        { path: 'auth', component: AuthComponent },
        { 
            path: 'recipes', 
            loadChildren: () => import('./components/recipes/recipes.module').then(m => m.RecipesModule)
        },
        { 
            path: 'shopping-list', 
            loadChildren: () => import('./components/shopping-list/shopping-list.module').then(m => m.ShoppingListModule)
        }
    ], { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule] 
})
export class AppRoutingModule { }