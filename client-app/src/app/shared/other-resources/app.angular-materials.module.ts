import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import { RouterLink, RouterLinkActive } from "@angular/router";
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import { NgOptimizedImage } from '@angular/common';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { TableModule, UtilitiesModule } from '@coreui/angular';
import {MatExpansionModule} from '@angular/material/expansion';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';

@NgModule({
    declarations: [],
    imports: [CommonModule, 
        MatCardModule,
        MatExpansionModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatStepperModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatToolbarModule,
        CdkMenu, 
        CdkMenuItem, 
        CdkMenuTrigger,
        MatGridListModule,
        MatDialogModule,
        MatTabsModule,
        MatListModule,
        MatDividerModule,
        RouterLink, 
        RouterLinkActive,
        MatMenuModule,
        MatTableModule,
        NgOptimizedImage,
        MatSnackBarModule,
        MatPaginatorModule,
        NgxPaginationModule,
        MatAutocompleteModule,
        TableModule, 
        UtilitiesModule,
        NgxMaterialTimepickerModule,
        MatTooltipModule,
        ScrollingModule,
        MatBottomSheetModule
    ],
    exports: [CommonModule, 
        MatCardModule,
        MatExpansionModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatStepperModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatToolbarModule,
        CdkMenu, 
        CdkMenuItem, 
        CdkMenuTrigger,
        MatGridListModule,
        MatDialogModule,
        MatTabsModule,
        MatListModule,
        MatDividerModule,
        RouterLink, 
        RouterLinkActive,
        MatMenuModule,
        MatTableModule,
        NgOptimizedImage,
        MatSnackBarModule,
        MatPaginatorModule,
        NgxPaginationModule,
        MatAutocompleteModule,
        TableModule, 
        UtilitiesModule,
        NgxMaterialTimepickerModule,
        MatTooltipModule,
        ScrollingModule,
    ],
})
export class AngularMaterialsModule { }