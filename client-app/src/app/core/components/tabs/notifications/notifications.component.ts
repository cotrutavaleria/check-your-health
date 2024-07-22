import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InfoDialogPatientPreviewComponent } from '../../../../shared/other-resources/dialogs/patient-preview-dialog/patient-preview-dialog.component';
import { Functionalities } from 'src/app/shared/responses/functionalities';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { JWTService } from 'src/app/shared/services/jwt.service';
import { UserService } from 'src/app/shared/services/user.service';

export interface NotificationDetails {
  name: string;
  uuid: string;
  date: string;
  time: string;
  state: string;
  createdAt: any;
  phoneNumber: string;
  isNew: boolean;
  consultingTypes: string[];
  reason: string;
  show: boolean;
  totalAmount: number;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  tabsList!: Array<Functionalities>;
  hideTabLabel!: boolean;
  token!: string;
  userStatus!: string;
  data: any;
  notFound = false;
  notifications: NotificationDetails[] = [];
  flexWrap!: string;
  notificationCardWidth!: number;
  constructor(private dialog: MatDialog, private screenSize: BreakpointObserver, private appointmentService: AppointmentService, private jwtService: JWTService, private userService: UserService) { }

  ngOnInit(): void {
    this.resize();
    this.tabsList = [
      {
        type: 'SCHEDULE',
        link: '/schedule',
        icon: 'schedule'
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
    this.token = this.jwtService.getJWT();
    if (this.token != null) {
      this.userService.getUserInformation(this.token).subscribe(result => {
        this.userStatus = result.userType;
        if (this.userStatus === 'PATIENT') {
          this.getPatientNotifications();
        } else {
          this.getDoctorNotifications();
        }
      });
    }
  }

  resize() {
    this.screenSize.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Small]).subscribe(result => {
      this.hideTabLabel = false;
      this.flexWrap = "nowrap";
      this.notificationCardWidth = 60;
      if (result.matches) {
        this.hideTabLabel = true;
        this.flexWrap = "wrap";
        this.notificationCardWidth = 90;
      }
    });
  }

  getPatientNotifications() {
    this.appointmentService.getPatientNotifications(this.token).subscribe(result => {
      if (result != null) {
        this.data = result.notifications;
        console.log(this.data);
        if (this.data.length == 0) {
          this.notFound = true;
        }
        this.data.forEach((element: any) => {
          this.notifications.push({
            name: element.name,
            uuid: element.doctorUuid,
            date: element.date,
            time: element.time,
            createdAt: '',
            state: element.appointmentState,
            reason: "",
            isNew: false,
            consultingTypes: [],
            phoneNumber: "",
            show: false,
            totalAmount: element.totalAmount
          });
          this.notFound = false;
        });
        console.log(this.notifications);
      }
    },
      (error: any) => {
        this.userService.openSnackBar("An error occured. Please, refresh the page");
      });
  }

  getDoctorNotifications() {
    this.appointmentService.getDoctorNotifications(this.token).subscribe(result => {
      if (result != null) {
        this.data = result.notifications;
        console.log(this.data);
        if (this.data.length == 0) {
          this.notFound = true;
        }
        this.data.forEach((element: any) => {
          let consultations = element.consultingTypes;
          console.log(consultations);
          let consultationNames: string[] = [];
          consultations.forEach((elementName: any) => {
            consultationNames.push(elementName.name);
          });
          console.log(consultationNames);
          this.notifications.push({
            name: element.name,
            uuid: element.patientUuid,
            date: element.date,
            time: element.time,
            state: "",
            createdAt: element.createdAt,
            reason: element.reason,
            isNew: element.patientNew,
            consultingTypes: consultationNames,
            phoneNumber: element.phoneNumber,
            show: false,
            totalAmount: element.totalAmount
          });
          this.notFound = false;
        });
        console.log(this.notifications);
      }
    },
      (error: any) => {
        this.userService.openSnackBar("An error occured. Please, refresh the page");
      });
  }

  acceptPatient(uuid: string, date: string, time: string, createdAt: any) {
    this.appointmentService.acceptPatient(uuid, date, time, createdAt);
  }

  rejectPatient(uuid: string, date: string, time: string, createdAt: any) {
    this.appointmentService.rejectPatient(uuid, date, time, createdAt);
  }

  previewPatient(patientUuid: string) {
    const dialogContent = this.dialog.open(InfoDialogPatientPreviewComponent, {
      data: { patientUuid: patientUuid },
    });
  }
}
