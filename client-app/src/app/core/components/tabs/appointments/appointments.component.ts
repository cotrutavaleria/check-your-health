import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Functionalities } from 'src/app/shared/responses/functionalities';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InfoDialogPatientPreviewComponent } from '../../../../shared/other-resources/dialogs/patient-preview-dialog/patient-preview-dialog.component';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { JWTService } from 'src/app/shared/services/jwt.service';
import { UserService } from 'src/app/shared/services/user.service';


export interface AppointmentDetails {
  uuid: string;
  name: string;
  consultingTypes: string[];
  date: string;
  time: string;
  reason: string;
  isNew: boolean;
  totalAmount: number;
}

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})

export class AppointmentsComponent implements OnInit {
  tabsList!: Array<Functionalities>;
  hideTabLabel!: boolean;
  activeLink!: string;
  userStatus!: string;
  pageEvent!: PageEvent;
  length = 50;
  pageSize = 5;
  pageIndex = 0;
  token!: string;
  data: any;
  notFound = false;
  appointments: AppointmentDetails[] = [];
  constructor(private dialog: MatDialog, private screenSize: BreakpointObserver, private appointmentService: AppointmentService, private jwtService: JWTService, private userService: UserService) { }

  ngOnInit(): void {
    this.resize();
    this.tabsList = [
      {
        type: 'SCHEDULE',
        link: '/schedule',
        icon: 'schedule',
      },
      {
        type: 'APPOINTMENTS',
        link: '/appointments',
        icon: 'task'
      },
      {
        type: 'NOTIFICATIONS',
        link: '/notifications',
        icon: 'circle_notifications'
      }
    ];
    this.activeLink = this.tabsList[1].link;
    this.token = this.jwtService.getJWT();
    if (this.token != null) {
      this.userService.getUserInformation(this.token).subscribe(result => {
        this.userStatus = result.userType;
        this.getAppointmentsByUserType();
      });
    }

  }

  getAppointmentsByUserType() {
    if (this.userStatus === 'PATIENT') {
      this.getPatientAppointments();
    } else {
      this.getDoctorAppointments();
    }
  }
  resize() {
    this.screenSize.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Small]).subscribe(result => {
      this.hideTabLabel = false;
      if (result.matches) {
        this.hideTabLabel = true;
      }
    });
  }

  changePage(event: PageEvent) {
    this.pageEvent = event;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAppointmentsByUserType();
  }

  getPatientAppointments() {
    this.appointments = [];
    let token = this.jwtService.getJWT();
    if (token != null) {
      this.appointmentService.getPatientAppointments(this.pageIndex, this.pageSize, token).subscribe(
        (result: any) => {
          if (result != null) {
            this.data = result.appointments;
            if (this.data.length == 0) {
              this.notFound = true;
            } else {
              this.notFound = false;
            }
            this.data.forEach((element: any) => {
              let consultations = element.consultingTypes;
              let consultationNames: string[] = [];
              consultations.forEach((elementName: any) => {
                consultationNames.push(elementName.name);
              });
              this.appointments.push({
                uuid: element.doctorUuid,
                name: element.name,
                consultingTypes: consultationNames,
                date: element.date,
                time: element.time,
                isNew: false,
                reason: "",
                totalAmount: element.totalAmount
              });
              console.log(this.data);
            });
            this.length = result.totalElements;
          }
        },
        (error: any) => {
          this.userService.openSnackBar("An error occured. Please, refresh the page");
        });
    } else {
      this.userService.logout();
    }
  }


  getDoctorAppointments() {
    this.appointments = [];
    let token = this.jwtService.getJWT();
    if (token != null) {
      this.appointmentService.getDoctorAppointments(this.pageIndex, this.pageSize, token).subscribe(
        (result: any) => {
          if (result != null) {
            this.data = result.appointments;
            if (this.data.length == 0) {
              this.notFound = true;
            } else {
              this.notFound = false;
            }
            this.data.forEach((element: any) => {
              let consultations = element.consultingTypes;
              console.log(consultations);
              let consultationNames: string[] = [];
              consultations.forEach((elementName: any) => {
                consultationNames.push(elementName.name);
              });
              this.appointments.push({
                uuid: element.patientUuid,
                name: element.name,
                consultingTypes: consultationNames,
                date: element.date,
                time: element.time,
                isNew: element.new,
                reason: element.reason,
                totalAmount: element.totalAmount
              });
            });
            console.log(this.appointments);
            this.length = result.totalElements;
            console.log("result:", result);
            console.log("data:", this.data);
          }
        },
        (error: any) => {
          this.userService.openSnackBar("An error occured. Please, refresh the page");
        });
    } else {
      this.userService.logout();
    }
  }

  getPatientDetails(patientUuid: string) {
    const dialogContent = this.dialog.open(InfoDialogPatientPreviewComponent, {
      data: { patientUuid: patientUuid },
    });
  }
}

