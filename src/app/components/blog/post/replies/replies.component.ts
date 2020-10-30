import { Component, Input, OnInit } from '@angular/core';
import { DateService } from '../../../../services/date.service'

@Component({
  selector: 'app-replies',
  templateUrl: './replies.component.html',
  styleUrls: ['./replies.component.scss']
})
export class RepliesComponent implements OnInit {
  @Input() reply;
  parsedTime;
  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.parsedTime = this.dateService.parser(this.reply.time)
  }

}
