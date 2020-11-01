import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service'
import { MessengerService } from '../../services/messenger.service'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user;
  userLoggedIn = false;
  section;
  sections = [
    { name: 'Profile', id: 'profile' },
    { name: 'Bookings', id: 'bookings' },
    { name: 'Blog Posts', id: 'blog-posts' },
    { name: 'Blog Comments', id: 'blog-comments' },
    { name: 'Blog Likes', id: 'blog-likes' },
    { name: 'Drafts', id: 'drafts' },
    { name: 'Forum Posts', id: 'forum-posts' },
    { name: 'Forum Comments', id: 'forum-comments' },
  ]
  constructor(private userService: UserService, private messenger: MessengerService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    let self = this
    this.userService.renderAccInfo();
    this.messenger.getMessage().subscribe(message => {
      if(message.user) {
        self.userLoggedIn = true
      } else {
        self.userLoggedIn = false
      }
      self.user = message.user
    })
    this.route.paramMap.subscribe(async params => {
      this.section = params.get('section');
      if(this.section && this.validateSection(this.section)) {
        for(let i=0; i< document.getElementsByClassName('accNavElem').length; i ++){
          (<HTMLElement>document.getElementsByClassName('accNavElem')[i]).style.color = 'black'
        }
        document.getElementById(this.section).style.color = '#80a0bd'
      } else {
        this.router.navigate(['/login/profile'], { relativeTo: this.route })
      }
    });
  }

  validateSection(section){
    for (let page of this.sections) {
      if(section === page.id){
        return true
      }
    }
    return false
  }
}
