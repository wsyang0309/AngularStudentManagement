import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginModalService, Principal, Account } from 'app/core';
import { CourseService } from 'app/shared/service/CourseService';
import { CourseDto } from 'app/shared/model/course-dto.model';
import { CourseWithTNDto } from 'app/shared/model/courseWithTN-dto.model';
import { debug } from 'util';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.css']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    classeNameNeedToReg: string;
    courses: CourseDto[] = [];
    coursesWithTN: CourseWithTNDto[] = [];

    courseName: string;
    courseContent: string;
    courseLocation: string;
    courseTeacher: string;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private courseService: CourseService
    ) {}

    ngOnInit() {
        this.principal.identity().then(account => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.principal.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    getAllCourses() {
        this.courseService.getCourseInfo().subscribe(curDto => {
            if (!curDto) {
                this.courses = [];
            } else {
                this.courses = curDto;
            }
        });
    }

    getAllCoursesWithTN() {
        this.courseService.getCourseInfoWithTN(this.principal.userIdentity.id).subscribe(curDto => {
            if (!curDto) {
                this.coursesWithTN = [];
            } else {
                this.coursesWithTN = curDto;
            }
        });
    }

    registerCourse(courseName) {
        let flag = false;
        for (const course of this.coursesWithTN) {
            if (course.courseName === courseName) {
                alert('你已经选过这门课了！');
                flag = true;
                break;
            }
        }

        if (flag) {
            return;
        }

        this.courseService.registerCourse(courseName).subscribe(res => {
            this.getAllCoursesWithTN();
        });
    }

    unRegisterCourse(courseName) {
        this.courseService.unRegisterCourse(courseName).subscribe(res => {
            console.log('in here');
            this.getAllCoursesWithTN();
        });
    }

    addCourse() {
        this.courseService.findTeacherId().subscribe(res => {
            if (res) {
                console.log(res);
                const teacherId: string = String(res);
                const course: CourseDto = {
                    courseName: this.courseName,
                    courseContent: this.courseContent,
                    courseLocation: this.courseLocation,
                    courseTeacher: teacherId
                };

                console.log(course.courseName);
                console.log(course.courseContent);
                console.log(course.courseLocation);
                console.log(course.courseTeacher);

                this.courseService.addCourse(course).subscribe(res1 => {
                    debugger;
                    this.courseService.registerCourse(course.courseName).subscribe(res2 => {
                        debugger;
                        this.getAllCourses();
                        this.getAllCoursesWithTN();
                    });
                });
            } else {
                console.log('error');
            }
        });
    }

    deleteCourse(courseName) {
        this.courseService.findCourseById('4').subscribe(res => {
            let cDto: CourseWithTNDto[];
            if (res) {
                cDto = res;

                let flag = false;
                for (const course of cDto) {
                    if (course.courseName === courseName) {
                        alert('还有人选这门课，暂时不能删除！');
                        flag = true;
                        break;
                    }
                }

                if (flag) {
                    return;
                } else {
                    this.courseService.delete(courseName).subscribe(res => {
                        this.getAllCourses();
                        this.getAllCoursesWithTN();
                    });
                }
            } else {
                console.log('error occured');
            }
        });
    }

    clearAllCourses() {
        this.courses = [];
    }

    clearAllCousesDTO() {
        this.coursesWithTN = [];
    }
}
