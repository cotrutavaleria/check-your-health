import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { JWTService } from 'src/app/shared/services/jwt.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-set-appointment-dialog',
  templateUrl: './set-appointment-dialog.component.html',
  styleUrls: ['./set-appointment-dialog.component.css']
})
export class InfoDialogSetAppointmentComponent {
  dialogHeight!: string;
  dialogWidth!: string;
  marginRight!: number;
  selectedConsultingTypes:Array<any> = [];
  totalAmount = 0;
  constructor(private appointmentService: AppointmentService, private jwtService: JWTService, private userService: UserService, private screenSize: BreakpointObserver, private form: FormBuilder, public dialogRef: MatDialogRef<MatDialog>, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      uuid: string,
      date: string,
      time: string,
      consultingTypesArray: any
    }) {
    this.resize();
  }
  appointmentInformation = this.form.group({
    date: this.data.date,
    time: this.data.time,
    consultingTypes: this.form.array([]),
    explanation: ['', Validators.required],
    isnewPatient: false,

  });

  consultingTypes(): FormArray {
    return this.appointmentInformation.get('consultingTypes') as FormArray;
  }
  newConsultingType(): FormGroup {
    return this.form.group({
      id: 0,
      name: '',
      price: 0,
      specialtyId: 0
    });
  }

  addConsultingType() {
    this.consultingTypes().push(this.newConsultingType());
  }

  removeConsultingType(index: number) {
    this.selectedConsultingTypes = this.selectedConsultingTypes.filter((consultingType: any) => consultingType != this.consultingTypes().at(index).value.name);
    this.totalAmount -= this.consultingTypes().at(index).value.price;
    this.consultingTypes().removeAt(index);
  }

  addToSelectedConsultingTypes(consultingType: any, index: number) {
    this.totalAmount = 0;
    let length!:any;
    length = this.appointmentInformation.value.consultingTypes?.length;
    this.consultingTypes().at(index).value.price = consultingType.price;
    this.consultingTypes().at(index).value.id = consultingType.id;
    this.consultingTypes().at(index).value.name = consultingType.name;
    this.consultingTypes().at(index).value.specialtyId = consultingType.specialtyId;
    console.log(this.consultingTypes().at(index).value);
    this.selectedConsultingTypes.push(consultingType.name);
    if(length < this.selectedConsultingTypes.length){
      this.selectedConsultingTypes = this.selectedConsultingTypes.filter((consultingType:any, consultingTypeIndex:number)=> consultingTypeIndex != index);
    }
    for(let i = 0; i<length; i++){
      this.totalAmount += this.consultingTypes().at(i).value.price;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  resize() {
    this.screenSize.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Small]).subscribe(result => {
      this.dialogHeight = "650";
      this.dialogWidth = "500";
      this.marginRight = 200;
      if (result.matches) {
        this.dialogHeight = "350";
        this.dialogWidth = "300";
        this.marginRight = 100;
      }
    })
  }

  onSubmit(form: FormGroup) {
    let token = this.jwtService.getJWT();
    console.log(form.value.consultingTypes);
    if (form.value.consultingTypes.length == 0) {
      this.userService.openSnackBar("You should include at least one consulting type.");
    } else {
      if (token) {
        let data = {
          date: this.data.date,
          time: this.data.time,
          explanation: form.value.explanation,
          isNew:form.value.isnewPatient,
          consultingTypes:form.value.consultingTypes,
          totalAmount: this.totalAmount
        }
        console.log(data);
        this.appointmentService.createAppointment(token, this.data.uuid, data, form);
        this.closeDialog();
      }else {
        this.userService.openSnackBar("To create an appointment, you should be connected.");
        this.closeDialog();
        setTimeout(() => this.userService.logout(), 50);
      }
    }
  }




}
