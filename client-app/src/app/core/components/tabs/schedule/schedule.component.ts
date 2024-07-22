import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Functionalities } from 'src/app/shared/responses/functionalities';
import { ScheduleService } from 'src/app/shared/services/schedule.service';
import { JWTService } from 'src/app/shared/services/jwt.service';

export interface TableInformation {
  day: string;
  startsAt: string;
  endsAt: string;
}
export interface WeeklyProgramme {
  day: number;
  startsAt: string;
  endsAt: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})

export class ScheduleComponent implements OnInit {
  panelOpenState = false;
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  displayedColumns: string[] = ['day', 'startsAt', 'endsAt', 'action'];
  dataSource!: any;
  row: TableInformation[] = [];
  doctorsSchedule!: any;
  weeklyProgramme!: FormGroup;
  hideTabLabel!:boolean;
  tabsList!: Array<Functionalities>;
  icons!:string[];
  goodToKnowWidth!:number;
  addDayButtonWidth!:number;
  @ViewChild(MatTable) table!: MatTable<TableInformation>;
  constructor(private screenSize: BreakpointObserver, private scheduleService: ScheduleService, private form: FormBuilder, private jwtService: JWTService) { }

  ngOnInit(): void {
    this.icons = ['schedule','task','circle_notifications'];
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
    this.weeklyProgramme = this.form.group({
      day: ['', [Validators.required]],
      startsAt: ['', [Validators.required]],
      endsAt: ['', [Validators.required]]
    });
    let token = this.jwtService.getJWT();
    this.scheduleService.getDoctorsSchedule(token).subscribe(result => {
      if (result != null) {
        this.doctorsSchedule = result.weeklyProgramme;
        this.doctorsSchedule.forEach((element: any) => {
          this.row.push({
            day: element.day,
            startsAt: element.startsAt,
            endsAt: element.endsAt,
          });
        });
        this.dataSource = new MatTableDataSource(this.row);
      }
    });
  }

  addData(day: number, startsAt: string, endsAt: string) {
    this.row.push({ day: this.days[day], startsAt: startsAt, endsAt: endsAt });
    this.table.renderRows();
  }

  removeRow(element: TableInformation) {
    console.log(element);
    console.log(this.row);
    this.row = this.row.filter(item => (item.day !== element.day) || (item.startsAt !== element.startsAt) || (item.endsAt !== element.endsAt));
    console.log(this.row);
    this.dataSource.data = this.row;
    let { weeklyProgramme, token } = this.setData();
    this.scheduleService.updateDoctorsWorkingSchedule(weeklyProgramme, token, this.weeklyProgramme);
  }

  onSubmit(form: FormGroup) {
    this.addData(form.value.day, form.value.startsAt, form.value.endsAt);
    let { weeklyProgramme, token } = this.setData();
    this.scheduleService.updateDoctorsWorkingSchedule(weeklyProgramme, token, form);
  }

  setData() {
    let token = this.jwtService.getJWT();
    let weeklyProgramme: WeeklyProgramme[] = [];
    this.row.forEach((element: any) => {
      weeklyProgramme.push({
        day: element.day,
        startsAt: element.startsAt,
        endsAt: element.endsAt
      })
    });
    return { weeklyProgramme, token };
  }

  resize() {
    this.goodToKnowWidth = 70;
    this.screenSize.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Small]).subscribe(result => {
      if (result.matches) {
        this.hideTabLabel = true;
        this.addDayButtonWidth = 50;
      }else{
        this.hideTabLabel = false;
        this.addDayButtonWidth = 20;
      }
    });
  }
}

