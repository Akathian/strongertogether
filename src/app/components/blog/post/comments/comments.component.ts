import { Component, OnInit, Input } from '@angular/core';
import { DateService } from '../../../../services/date.service'
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() comment
  href
  parsedTime;
  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.href = '#id' + this.comment.time
    this.parsedTime = this.dateService.parser(this.comment.time)
  }

}
