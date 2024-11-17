import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListsPage } from './lists.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ListsPageRoutingModule } from './lists-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ListsPageRoutingModule,
  ],
  declarations: [ListsPage],
})
export class ListsPageModule {}
