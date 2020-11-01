import {  Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service'

@Component({
  selector: 'app-acc-nav',
  templateUrl: './acc-nav.component.html',
  styleUrls: ['./acc-nav.component.scss']
})
export class AccNavComponent implements OnInit {
  @Input() user;
  @Input() sections;

  constructor(private userService: UserService) { }

  ngOnInit() {

  }

  signOut() {
   this.userService.signOut() 
  }
}
