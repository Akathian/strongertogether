import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app'
import 'firebase/database'
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  id;
  time;
  title;
  post;
  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.id = +params.get('id');
      this.time = +params.get('time')
      this.title = params.get('title')
      this.getPost()
    });
  }
  getPost() {
    let self = this
    firebase.database().ref(`/blog/${this.id}`).on('value', (postData) => {
      self.post = postData.val()
    })
  }

  sort(event){
    console.log(event.target.options.selectedIndex)
  }
}
