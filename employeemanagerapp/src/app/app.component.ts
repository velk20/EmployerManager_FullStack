import { Component } from '@angular/core';
import { Employee } from './employee';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeService } from './employee.service';
import { OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public employees!: Employee[];
  public editEmployee!: Employee;
  public deleteEmployee!: Employee;

  constructor(private employeeService: EmployeeService) {}

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  public onOpenModal(employee: any, mode: string): void {
    const container = document.getElementById("main-container");
    const button = document.createElement("button");
    button.type = "button";
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    } if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    } if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }

    // @ts-ignore
    container.appendChild(button);
    button.click();
  }

  onAddEmployee(addForm: NgForm): void {
    // @ts-ignore
    document.getElementById('add-employee-form').click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response:Employee) => {
        console.log(response);
        addForm.resetForm()
        this.getEmployees();
      },(error:HttpErrorResponse)=>{
        alert(error.message);
      }
    );
  }

  onUpdateEmployee(employee: Employee): void {
    // @ts-ignore
    this.employeeService.updateEmployee(employee).subscribe(
      (response:Employee) => {
        console.log(response);
        this.getEmployees();
      },(error:HttpErrorResponse)=>{
        alert(error.message);
      }
    );
  }

  onDeleteEmployee(id?: number):void {
    this.employeeService.deleteEmployee(id).subscribe(
      (response:void) => {
        console.log(response);
        this.getEmployees();
      },
      (error:HttpErrorResponse)=>{
        alert(error.message);}
    )
  }

  public searchEmployees(key: string): void {
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
    }

    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }
}
