import { NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/models/Ingredient';
import { ShoppingListService } from 'src/app/services/shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('shoppingForm', { static: true }) shoppingForm: NgForm;
  protected numberGreaterThanZeroExp = "^[1-9]+[0-9]*$";
  private subscription: Subscription;
  protected editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing
      .subscribe(
        (index: number) => {
          this.editedItemIndex = index;
          this.editedItem = this.shoppingListService.getIngredient(index);
          this.editMode = true;
          this.shoppingForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        }
      );
  }
  
  onSubmit(shoppingForm: NgForm) {
    const value = shoppingForm.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode)
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
    else
      this.shoppingListService.addIngredient(newIngredient);
    this.editMode = false;
    shoppingForm.reset();
  }

  onClear() {
    this.editMode = false;
    this.shoppingForm.reset();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
