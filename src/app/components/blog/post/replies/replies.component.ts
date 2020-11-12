import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-replies',
  templateUrl: './replies.component.html',
  styleUrls: ['./replies.component.scss']
})
export class RepliesComponent implements OnInit {
  @Input() reply;
  gearData = { id: '', editLink: '', dbLink: '', type: 'reply', editors: [] }

  constructor() { }

  ngOnInit() {
    this.gearData.editors.push(this.reply.uid)
    this.gearData.editors.push(this.reply.parentUid)
    this.gearData.dbLink = 'blog/general/' + this.reply.parentId + '/replies/' + this.reply.id
    this.gearData.id = this.reply.id
  }

}
